export type NotebookPage = {
  pageNumber: number;
  markdownContent: string;
  createdAt: string;
  updatedAt: string;
};

export type Notebook = {
  id: string;
  title: string;
  pages: NotebookPage[];
  lastEditedPageNumber: number;
  createdAt: string;
  updatedAt: string;
};

export type NotebookMode = "edit" | "preview";

export type PaperColor = "warm" | "white" | "blue";

export type PaperPattern = "ruled" | "grid" | "plain";

export type SaveState = "saved" | "unsaved" | "saving";
