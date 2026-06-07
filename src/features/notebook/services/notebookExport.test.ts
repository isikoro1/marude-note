import { describe, expect, it } from "vitest";
import { appendPage, updatePageContent } from "../hooks/usePageNavigation";
import { createNotebook } from "../repositories/LocalNotebookRepository";
import { createNotebookExportFiles } from "./notebookExport";

describe("createNotebookExportFiles", () => {
  it("creates metadata and page markdown files", () => {
    const notebook = updatePageContent(appendPage(createNotebook("Marude Note"), 2), 2, "second page");
    const files = createNotebookExportFiles(notebook);

    expect(files.map((file) => file.path)).toEqual([
      "marude-note/notebook.json",
      "marude-note/pages/page-0001.md",
      "marude-note/pages/page-0002.md"
    ]);
    expect(files.find((file) => file.path.endsWith("page-0002.md"))?.content).toBe("second page");
  });
});
