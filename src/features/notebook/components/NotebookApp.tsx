import { useEffect, useMemo, useRef, useState } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { usePageNavigation, updatePageContent } from "../hooks/usePageNavigation";
import { useReaderControls } from "../hooks/useReaderControls";
import { downloadNotebookZip, importNotebookZip } from "../services/notebookExport";
import type { NotebookMode, NotebookPage, PaperColor, PaperPattern } from "../types";
import { IconButton } from "./IconButton";
import { MarkdownPreview } from "./MarkdownPreview";
import { NotebookEditor } from "./NotebookEditor";
import { NotebookReader } from "./NotebookReader";
import { NotebookSettingsPanel } from "./NotebookSettingsPanel";
import { PageControlBar } from "./PageControlBar";

const escapeMarkdownLabel = (text: string) => text.replace(/[[\]]/g, "");

const createTableOfContentsMarkdown = (notebookPages: NotebookPage[]) => {
  const items = notebookPages.flatMap((page) => {
    const matches = [...page.markdownContent.matchAll(/^(#{1,3})\s+(.+)$/gm)];
    return matches.map((match) => ({
      level: match[1].length,
      pageNumber: page.pageNumber,
      text: match[2].trim()
    }));
  });

  if (items.length === 0) {
    return "";
  }

  return [
    "## Table of contents",
    "",
    ...items.map((item) => {
      const indent = "  ".repeat(Math.max(0, item.level - 1));
      return `${indent}- [${escapeMarkdownLabel(item.text)}](page:${item.pageNumber})`;
    }),
    ""
  ].join("\n");
};

export const NotebookApp = () => {
  const { notebook, currentPageNumber, setCurrentPageNumber, updateNotebook, replaceNotebook, saveState } = useNotebook();
  const [mode, setMode] = useState<NotebookMode>("preview");
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isOpeningNotebook, setIsOpeningNotebook] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTocEnabled, setIsTocEnabled] = useState(false);
  const [paperColor, setPaperColor] = useState<PaperColor>("warm");
  const [paperPattern, setPaperPattern] = useState<PaperPattern>("ruled");
  const [editorSelection, setEditorSelection] = useState({ start: 0, end: 0 });
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const { isControlBarVisible, hideControlBar, toggleControlBar } = useReaderControls();
  const navigation = usePageNavigation({
    notebook,
    currentPageNumber,
    setCurrentPageNumber,
    updateNotebook
  });

  const currentPage = useMemo(
    () => notebook?.pages.find((page) => page.pageNumber === currentPageNumber) ?? null,
    [currentPageNumber, notebook]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const activeElement = document.activeElement;
      if (
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "INPUT"
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        navigation.goToPreviousPage();
      }

      if (event.key === "ArrowRight") {
        navigation.goToNextPage();
      }

      if (event.key === "Escape") {
        hideControlBar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hideControlBar, navigation]);

  if (!notebook || !currentPage) {
    return <main className="app-shell">Loading Marude Note...</main>;
  }

  const openNotebook = () => {
    setIsOpeningNotebook(true);
  };

  const finishOpeningNotebook = () => {
    if (isOpeningNotebook) {
      setIsNotebookOpen(true);
    }
  };

  const handleMarkdownChange = (markdownContent: string) => {
    undoStackRef.current.push(currentPage.markdownContent);
    redoStackRef.current = [];
    updateNotebook((current) => updatePageContent(current, currentPageNumber, markdownContent));
  };

  const setCurrentMarkdown = (markdownContent: string) => {
    updateNotebook((current) => updatePageContent(current, currentPageNumber, markdownContent));
  };

  const insertMarkdown = (before: string, after = "", fallback = "") => {
    const markdown = currentPage.markdownContent;
    const start = Math.min(editorSelection.start, markdown.length);
    const end = Math.min(editorSelection.end, markdown.length);
    const selected = markdown.slice(start, end) || fallback;
    const nextMarkdown = `${markdown.slice(0, start)}${before}${selected}${after}${markdown.slice(end)}`;

    undoStackRef.current.push(markdown);
    redoStackRef.current = [];
    setCurrentMarkdown(nextMarkdown);
    const cursor = start + before.length + selected.length + after.length;
    setEditorSelection({ start: cursor, end: cursor });
  };

  const undoEdit = () => {
    const previous = undoStackRef.current.pop();
    if (previous === undefined) {
      return;
    }

    redoStackRef.current.push(currentPage.markdownContent);
    setCurrentMarkdown(previous);
  };

  const redoEdit = () => {
    const next = redoStackRef.current.pop();
    if (next === undefined) {
      return;
    }

    undoStackRef.current.push(currentPage.markdownContent);
    setCurrentMarkdown(next);
  };

  const handleUpload = async (file: File) => {
    const importedNotebook = await importNotebookZip(file);
    replaceNotebook(importedNotebook);
    setIsSettingsOpen(false);
    setMode("preview");
  };

  const previewMarkdown =
    isTocEnabled && currentPageNumber === 1
      ? `${createTableOfContentsMarkdown(notebook.pages)}\n${currentPage.markdownContent}`.trim()
      : currentPage.markdownContent;

  if (!isNotebookOpen) {
    return (
      <main className="cover-shell">
        <button
          type="button"
          className={`notebook-cover${isOpeningNotebook ? " notebook-cover-opening" : ""}`}
          onAnimationEnd={finishOpeningNotebook}
          onClick={openNotebook}
          data-testid="notebook-cover"
        >
          <span className="cover-label">Notebook</span>
          <h1>{notebook.title}</h1>
          <span className="cover-hint">Open</span>
        </button>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <span className={`save-state save-state-${saveState}`}>
        {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving..." : "Unsaved changes"}
      </span>

      <header className="app-header">
        {mode === "edit" ? (
          <div className="editor-toolbar" aria-label="Editor toolbar">
            <IconButton icon="gear" label="Open settings" onClick={() => setIsSettingsOpen(true)} />
            <button type="button" className="heading-button" aria-label="Insert large heading" onClick={() => insertMarkdown("# ", "\n", "Heading")}>
              H1
            </button>
            <button type="button" className="heading-button" aria-label="Insert medium heading" onClick={() => insertMarkdown("## ", "\n", "Heading")}>
              H2
            </button>
            <button type="button" className="heading-button" aria-label="Insert small heading" onClick={() => insertMarkdown("### ", "\n", "Heading")}>
              H3
            </button>
            <IconButton icon="todo" label="Insert todo item" onClick={() => insertMarkdown("- [ ] ", "", "todo")} />
            <IconButton icon="list" label="Insert list item" onClick={() => insertMarkdown("- ", "", "item")} />
            <IconButton icon="link" label="Insert link" onClick={() => insertMarkdown("[", "](https://)", "link")} />
            <IconButton icon="undo" label="Undo" onClick={undoEdit} />
            <IconButton icon="redo" label="Redo" onClick={redoEdit} />
          </div>
        ) : (
          <div />
        )}
      </header>

      <NotebookReader
        mode={mode}
        pageNumber={currentPageNumber}
        totalPages={navigation.totalPages}
        paperColor={paperColor}
        paperPattern={paperPattern}
        onToggleEdit={() => setMode((currentMode) => (currentMode === "preview" ? "edit" : "preview"))}
        onPrevious={navigation.goToPreviousPage}
        onNext={navigation.goToNextPage}
        onToggleControls={toggleControlBar}
      >
        {mode === "edit" ? (
          <NotebookEditor
            value={currentPage.markdownContent}
            onChange={handleMarkdownChange}
            onSelectionChange={setEditorSelection}
          />
        ) : (
          <MarkdownPreview markdown={previewMarkdown} onPageLink={navigation.goToPage} />
        )}
      </NotebookReader>

      {isSettingsOpen ? (
        <NotebookSettingsPanel
          paperColor={paperColor}
          paperPattern={paperPattern}
          isTocEnabled={isTocEnabled}
          onDownload={() => void downloadNotebookZip(notebook)}
          onUpload={(file) => void handleUpload(file)}
          onPaperColorChange={setPaperColor}
          onPaperPatternChange={setPaperPattern}
          onTocEnabledChange={setIsTocEnabled}
          onClose={() => setIsSettingsOpen(false)}
        />
      ) : null}

      {isControlBarVisible ? (
        <PageControlBar
          currentPageNumber={currentPageNumber}
          totalPages={navigation.totalPages}
          onPrevious={navigation.goToPreviousPage}
          onNext={navigation.goToNextPage}
          onPageChange={navigation.goToPage}
          onClose={hideControlBar}
        />
      ) : null}
    </main>
  );
};
