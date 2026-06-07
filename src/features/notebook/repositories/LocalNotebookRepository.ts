import type { Notebook } from "../types";
import type { NotebookRepository } from "./NotebookRepository";

const STORAGE_PREFIX = "marude-note:notebook:";

const nowIso = () => new Date().toISOString();

export const createNotebookPage = (pageNumber: number, markdownContent = "") => {
  const now = nowIso();

  return {
    pageNumber,
    markdownContent,
    createdAt: now,
    updatedAt: now
  };
};

export const createNotebook = (title: string): Notebook => {
  const now = nowIso();

  return {
    id: "default",
    title,
    pages: [
      createNotebookPage(
        1,
        "# Welcome to Marude Note\n\nUse this page like a physical notebook. Switch to preview, then tap the right side to turn the page."
      )
    ],
    lastEditedPageNumber: 1,
    createdAt: now,
    updatedAt: now
  };
};

export class LocalNotebookRepository implements NotebookRepository {
  async getNotebook(id: string): Promise<Notebook | null> {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as Notebook;
  }

  async saveNotebook(notebook: Notebook): Promise<void> {
    window.localStorage.setItem(`${STORAGE_PREFIX}${notebook.id}`, JSON.stringify(notebook));
  }

  async createNotebook(title: string): Promise<Notebook> {
    const notebook = createNotebook(title);
    await this.saveNotebook(notebook);
    return notebook;
  }
}
