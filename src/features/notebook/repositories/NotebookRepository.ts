import type { Notebook } from "../types";

export interface NotebookRepository {
  getNotebook(id: string): Promise<Notebook | null>;
  saveNotebook(notebook: Notebook): Promise<void>;
  createNotebook(title: string): Promise<Notebook>;
}
