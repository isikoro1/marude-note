import { describe, expect, it } from "vitest";
import { createNotebook } from "../repositories/LocalNotebookRepository";
import { appendPage, updatePageContent } from "./usePageNavigation";

describe("appendPage", () => {
  it("adds a page and updates lastEditedPageNumber", () => {
    const notebook = createNotebook("Marude Note");
    const updated = appendPage(notebook, 2);

    expect(updated.pages).toHaveLength(2);
    expect(updated.pages[1].pageNumber).toBe(2);
    expect(updated.lastEditedPageNumber).toBe(2);
  });

  it("does not duplicate an existing page", () => {
    const notebook = createNotebook("Marude Note");
    const updated = appendPage(notebook, 1);

    expect(updated.pages).toHaveLength(1);
  });
});

describe("updatePageContent", () => {
  it("updates markdown and lastEditedPageNumber", () => {
    const notebook = appendPage(createNotebook("Marude Note"), 2);
    const updated = updatePageContent(notebook, 2, "hello");

    expect(updated.pages.find((page) => page.pageNumber === 2)?.markdownContent).toBe("hello");
    expect(updated.lastEditedPageNumber).toBe(2);
  });
});
