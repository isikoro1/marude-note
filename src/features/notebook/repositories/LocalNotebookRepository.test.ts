import { describe, expect, it } from "vitest";
import { createNotebook } from "./LocalNotebookRepository";

describe("createNotebook", () => {
  it("creates a new one-page notebook", () => {
    const notebook = createNotebook("Marude Note");

    expect(notebook.title).toBe("Marude Note");
    expect(notebook.pages).toHaveLength(1);
    expect(notebook.pages[0].pageNumber).toBe(1);
    expect(notebook.lastEditedPageNumber).toBe(1);
  });
});
