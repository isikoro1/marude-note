import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { appendPage, updatePageContent } from "../hooks/usePageNavigation";
import { createNotebook } from "../repositories/LocalNotebookRepository";
import { createNotebookExportFiles, importNotebookZip } from "./notebookExport";

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

  it("imports notebook pages from the exported ZIP shape", async () => {
    const sourceNotebook = updatePageContent(appendPage(createNotebook("Marude Note"), 2), 2, "second page");
    const zip = new JSZip();

    for (const file of createNotebookExportFiles(sourceNotebook)) {
      zip.file(file.path, file.content);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const imported = await importNotebookZip(new File([blob], "marude-note.zip", { type: "application/zip" }));

    expect(imported.title).toBe("Marude Note");
    expect(imported.pages.map((page) => page.pageNumber)).toEqual([1, 2]);
    expect(imported.pages[1].markdownContent).toBe("second page");
  });
});
