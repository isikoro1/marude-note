import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalNotebookRepository } from "../repositories/LocalNotebookRepository";
import type { Notebook, SaveState } from "../types";

const DEFAULT_NOTEBOOK_ID = "default";
const DEFAULT_NOTEBOOK_TITLE = "Marude Note";

export const useNotebook = () => {
  const repository = useMemo(() => new LocalNotebookRepository(), []);
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [saveState, setSaveState] = useState<SaveState>("saved");

  useEffect(() => {
    let isActive = true;

    const loadNotebook = async () => {
      const existing = await repository.getNotebook(DEFAULT_NOTEBOOK_ID);
      const loaded = existing ?? (await repository.createNotebook(DEFAULT_NOTEBOOK_TITLE));

      if (!isActive) {
        return;
      }

      setNotebook(loaded);
      setCurrentPageNumber(loaded.lastEditedPageNumber);
    };

    void loadNotebook();

    return () => {
      isActive = false;
    };
  }, [repository]);

  const updateNotebook = useCallback((updater: (notebook: Notebook) => Notebook) => {
    setNotebook((current) => {
      if (!current) {
        return current;
      }

      setSaveState("unsaved");
      return updater(current);
    });
  }, []);

  const replaceNotebook = useCallback((nextNotebook: Notebook) => {
    setNotebook(nextNotebook);
    setCurrentPageNumber(nextNotebook.lastEditedPageNumber);
    setSaveState("unsaved");
  }, []);

  useEffect(() => {
    if (!notebook || saveState !== "unsaved") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveState("saving");
      void repository.saveNotebook(notebook).then(() => {
        setSaveState("saved");
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [notebook, repository, saveState]);

  return {
    notebook,
    currentPageNumber,
    setCurrentPageNumber,
    updateNotebook,
    replaceNotebook,
    saveState
  };
};
