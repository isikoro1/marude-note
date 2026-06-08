import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { usePageNavigation, updatePageContent } from "../hooks/usePageNavigation";
import { useReaderControls } from "../hooks/useReaderControls";
import { downloadNotebookZip, importNotebookZip } from "../services/notebookExport";
import type { NotebookMode, PaperColor, PaperPattern } from "../types";
import { IconButton } from "./IconButton";
import { MarkdownPreview } from "./MarkdownPreview";
import { NotebookEditor } from "./NotebookEditor";
import { NotebookReader } from "./NotebookReader";
import { NotebookSettingsPanel } from "./NotebookSettingsPanel";
import { PageControlBar } from "./PageControlBar";

export const NotebookApp = () => {
  const { notebook, currentPageNumber, setCurrentPageNumber, updateNotebook, replaceNotebook, saveState } = useNotebook();
  const [mode, setMode] = useState<NotebookMode>("preview");
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isOpeningNotebook, setIsOpeningNotebook] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [paperColor, setPaperColor] = useState<PaperColor>("warm");
  const [paperPattern, setPaperPattern] = useState<PaperPattern>("ruled");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
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
    const editor = editorRef.current;
    const markdown = currentPage.markdownContent;
    const start = editor?.selectionStart ?? markdown.length;
    const end = editor?.selectionEnd ?? markdown.length;
    const selected = markdown.slice(start, end) || fallback;
    const nextMarkdown = `${markdown.slice(0, start)}${before}${selected}${after}${markdown.slice(end)}`;

    undoStackRef.current.push(markdown);
    redoStackRef.current = [];
    setCurrentMarkdown(nextMarkdown);

    window.requestAnimationFrame(() => {
      editor?.focus();
      const cursor = start + before.length + selected.length + after.length;
      editor?.setSelectionRange(cursor, cursor);
    });
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

  const handlePageNumberSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pageNumber = Number(formData.get("pageNumber"));
    navigation.goToPage(pageNumber);
  };

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
      <header className="app-header">
        {mode === "edit" ? (
          <div className="editor-toolbar" aria-label="Editor toolbar">
            <IconButton icon="check" label="Preview page" onClick={() => setMode("preview")} />
            <IconButton icon="gear" label="Open settings" onClick={() => setIsSettingsOpen(true)} />
            <IconButton icon="todo" label="Insert todo item" onClick={() => insertMarkdown("- [ ] ", "", "todo")} />
            <IconButton icon="list" label="Insert list item" onClick={() => insertMarkdown("- ", "", "item")} />
            <IconButton icon="link" label="Insert link" onClick={() => insertMarkdown("[", "](https://)", "link")} />
            <IconButton icon="undo" label="Undo" onClick={undoEdit} />
            <IconButton icon="redo" label="Redo" onClick={redoEdit} />
          </div>
        ) : (
          <div />
        )}
        <div className="header-actions">
          <span className={`save-state save-state-${saveState}`}>
            {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving..." : "Unsaved changes"}
          </span>
        </div>
      </header>

      <div className="toolbar-row">
        <form onSubmit={handlePageNumberSubmit} className="page-jump-form">
          <label htmlFor="pageNumber">Page</label>
          <input id="pageNumber" name="pageNumber" type="number" min={1} max={navigation.totalPages} defaultValue={currentPageNumber} />
          <button type="submit">Go</button>
        </form>
        <span>
          Page {currentPageNumber} / {navigation.totalPages}
        </span>
      </div>

      <NotebookReader
        mode={mode}
        pageNumber={currentPageNumber}
        totalPages={navigation.totalPages}
        paperColor={paperColor}
        paperPattern={paperPattern}
        onEdit={() => setMode("edit")}
        onPrevious={navigation.goToPreviousPage}
        onNext={navigation.goToNextPage}
        onToggleControls={toggleControlBar}
      >
        {mode === "edit" ? (
          <NotebookEditor ref={editorRef} value={currentPage.markdownContent} onChange={handleMarkdownChange} />
        ) : (
          <MarkdownPreview markdown={currentPage.markdownContent} onPageLink={navigation.goToPage} />
        )}
      </NotebookReader>

      {isSettingsOpen ? (
        <NotebookSettingsPanel
          paperColor={paperColor}
          paperPattern={paperPattern}
          onDownload={() => void downloadNotebookZip(notebook)}
          onUpload={(file) => void handleUpload(file)}
          onPaperColorChange={setPaperColor}
          onPaperPatternChange={setPaperPattern}
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
