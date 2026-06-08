import JSZip from "jszip";
import type { Notebook, NotebookPage } from "../types";

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

type NotebookMetadata = Omit<Notebook, "pages">;

const isNotebookMetadata = (value: unknown): value is NotebookMetadata => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const metadata = value as Record<string, unknown>;
  return (
    typeof metadata.id === "string" &&
    typeof metadata.title === "string" &&
    typeof metadata.lastEditedPageNumber === "number" &&
    typeof metadata.createdAt === "string" &&
    typeof metadata.updatedAt === "string"
  );
};

const pageNumberFromPath = (path: string) => {
  const match = path.match(/pages\/page-(\d+)\.md$/);
  return match ? Number(match[1]) : null;
};

export const importNotebookZip = async (file: File): Promise<Notebook> => {
  const zip = await JSZip.loadAsync(file);
  const metadataFile = zip.file("marude-note/notebook.json");

  if (!metadataFile) {
    throw new Error("Missing notebook.json");
  }

  const metadata = JSON.parse(await metadataFile.async("string")) as unknown;
  if (!isNotebookMetadata(metadata)) {
    throw new Error("Invalid notebook metadata");
  }

  const pages: NotebookPage[] = [];
  const pageFiles = Object.values(zip.files).filter((zipFile) => !zipFile.dir && pageNumberFromPath(zipFile.name));

  for (const pageFile of pageFiles) {
    const pageNumber = pageNumberFromPath(pageFile.name);
    if (!pageNumber) {
      continue;
    }

    const now = new Date().toISOString();
    pages.push({
      pageNumber,
      markdownContent: await pageFile.async("string"),
      createdAt: now,
      updatedAt: now
    });
  }

  if (pages.length === 0) {
    throw new Error("No notebook pages found");
  }

  return {
    ...metadata,
    pages: pages.sort((a, b) => a.pageNumber - b.pageNumber)
  };
};
