import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { usePageNavigation, updatePageContent } from "../hooks/usePageNavigation";
import { useReaderControls } from "../hooks/useReaderControls";
import { downloadNotebookZip } from "../services/notebookExport";
import type { NotebookMode } from "../types";
import { MarkdownPreview } from "./MarkdownPreview";
import { NotebookEditor } from "./NotebookEditor";
import { NotebookReader } from "./NotebookReader";
import { PageControlBar } from "./PageControlBar";

export const NotebookApp = () => {
  const { notebook, currentPageNumber, setCurrentPageNumber, updateNotebook, saveState } = useNotebook();
  const [mode, setMode] = useState<NotebookMode>("edit");
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isOpeningNotebook, setIsOpeningNotebook] = useState(false);
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
    updateNotebook((current) => updatePageContent(current, currentPageNumber, markdownContent));
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
        <div className="header-actions">
          <span className={`save-state save-state-${saveState}`}>
            {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving..." : "Unsaved changes"}
          </span>
          <div className="mode-toggle" aria-label="View mode">
            <button type="button" className={mode === "edit" ? "active" : ""} onClick={() => setMode("edit")}>
              Edit
            </button>
            <button
              type="button"
              className={mode === "preview" ? "active" : ""}
              onClick={() => setMode("preview")}
            >
              Preview
            </button>
          </div>
          <button type="button" onClick={() => void downloadNotebookZip(notebook)}>
            Download
          </button>
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
        onPrevious={navigation.goToPreviousPage}
        onNext={navigation.goToNextPage}
        onToggleControls={toggleControlBar}
      >
        {mode === "edit" ? (
          <NotebookEditor value={currentPage.markdownContent} onChange={handleMarkdownChange} />
        ) : (
          <MarkdownPreview markdown={currentPage.markdownContent} onPageLink={navigation.goToPage} />
        )}
      </NotebookReader>

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
