import { useMemo } from "react";
import { createNotebookPage } from "../repositories/LocalNotebookRepository";
import type { Notebook } from "../types";

type UsePageNavigationParams = {
  notebook: Notebook | null;
  currentPageNumber: number;
  setCurrentPageNumber: (pageNumber: number) => void;
  updateNotebook: (updater: (notebook: Notebook) => Notebook) => void;
};

export const appendPage = (notebook: Notebook, pageNumber: number): Notebook => {
  if (notebook.pages.some((page) => page.pageNumber === pageNumber)) {
    return notebook;
  }

  const now = new Date().toISOString();

  return {
    ...notebook,
    pages: [...notebook.pages, createNotebookPage(pageNumber)].sort((a, b) => a.pageNumber - b.pageNumber),
    lastEditedPageNumber: pageNumber,
    updatedAt: now
  };
};

export const updatePageContent = (notebook: Notebook, pageNumber: number, markdownContent: string): Notebook => {
  const now = new Date().toISOString();

  return {
    ...notebook,
    pages: notebook.pages.map((page) =>
      page.pageNumber === pageNumber ? { ...page, markdownContent, updatedAt: now } : page
    ),
    lastEditedPageNumber: pageNumber,
    updatedAt: now
  };
};

export const usePageNavigation = ({
  notebook,
  currentPageNumber,
  setCurrentPageNumber,
  updateNotebook
}: UsePageNavigationParams) => {
  const totalPages = notebook?.pages.length ?? 0;
  const pageNumbers = useMemo(() => new Set(notebook?.pages.map((page) => page.pageNumber) ?? []), [notebook]);

  const goToPage = (pageNumber: number) => {
    if (pageNumbers.has(pageNumber)) {
      setCurrentPageNumber(pageNumber);
    }
  };

  const createPageIfNeeded = (pageNumber: number) => {
    if (!notebook || pageNumbers.has(pageNumber)) {
      return;
    }

    updateNotebook((current) => appendPage(current, pageNumber));
  };

  const goToPreviousPage = () => {
    if (currentPageNumber <= 1) {
      return;
    }

    goToPage(currentPageNumber - 1);
  };

  const goToNextPage = () => {
    const nextPageNumber = currentPageNumber + 1;
    if (!pageNumbers.has(nextPageNumber)) {
      createPageIfNeeded(nextPageNumber);
    }
    setCurrentPageNumber(nextPageNumber);
  };

  return {
    currentPageNumber,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    createPageIfNeeded
  };
};
