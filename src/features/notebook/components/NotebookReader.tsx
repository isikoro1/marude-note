import type { ReactNode } from "react";
import type { PaperColor, PaperPattern } from "../types";
import { IconButton } from "./IconButton";
import { PageTapZones } from "./PageTapZones";

type NotebookReaderProps = {
  mode: "edit" | "preview";
  pageNumber: number;
  totalPages: number;
  paperColor: PaperColor;
  paperPattern: PaperPattern;
  children: ReactNode;
  onEdit: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleControls: () => void;
};

export const NotebookReader = ({
  mode,
  pageNumber,
  totalPages,
  paperColor,
  paperPattern,
  children,
  onEdit,
  onPrevious,
  onNext,
  onToggleControls
}: NotebookReaderProps) => (
  <section className="reader-shell" aria-label="Notebook reader">
    <div className={`paper-page paper-${paperColor} paper-${paperPattern}`}>
      {mode === "preview" ? (
        <IconButton icon="pencil" label="Edit page" className="floating-pencil" onClick={onEdit} />
      ) : null}
      <div className="page-meta">
        <span>Page {pageNumber}</span>
        <span>{totalPages} pages</span>
      </div>
      <div className="paper-body">{children}</div>
      <PageTapZones
        disabled={mode === "edit"}
        onPrevious={onPrevious}
        onNext={onNext}
        onToggleControls={onToggleControls}
      />
    </div>
  </section>
);
