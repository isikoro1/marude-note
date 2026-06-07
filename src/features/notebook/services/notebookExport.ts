import JSZip from "jszip";
import type { Notebook } from "../types";

export type NotebookExportFile = {
  path: string;
  content: string;
};

const padPageNumber = (pageNumber: number) => pageNumber.toString().padStart(4, "0");

export const createNotebookExportFiles = (notebook: Notebook): NotebookExportFile[] => {
  const metadata = {
    id: notebook.id,
    title: notebook.title,
    lastEditedPageNumber: notebook.lastEditedPageNumber,
    createdAt: notebook.createdAt,
    updatedAt: notebook.updatedAt
  };

  return [
    {
      path: "marude-note/notebook.json",
      content: `${JSON.stringify(metadata, null, 2)}\n`
    },
    ...notebook.pages.map((page) => ({
      path: `marude-note/pages/page-${padPageNumber(page.pageNumber)}.md`,
      content: page.markdownContent
    }))
  ];
};

export const downloadNotebookZip = async (notebook: Notebook) => {
  const zip = new JSZip();

  for (const file of createNotebookExportFiles(notebook)) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "marude-note.zip";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
