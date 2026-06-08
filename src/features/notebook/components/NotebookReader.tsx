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
  onToggleEdit: () => void;
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
  onToggleEdit,
  onPrevious,
  onNext,
  onToggleControls
}: NotebookReaderProps) => (
  <section className="reader-shell" aria-label="Notebook reader">
    <div className={`paper-page paper-${paperColor} paper-${paperPattern}`}>
      <IconButton
        icon={mode === "preview" ? "pencil" : "check"}
        label={mode === "preview" ? "Edit page" : "Preview page"}
        className="floating-pencil"
        onClick={onToggleEdit}
      />
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
