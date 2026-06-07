import type { ReactNode } from "react";
import { PageTapZones } from "./PageTapZones";

type NotebookReaderProps = {
  mode: "edit" | "preview";
  pageNumber: number;
  totalPages: number;
  children: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  onToggleControls: () => void;
};

export const NotebookReader = ({
  mode,
  pageNumber,
  totalPages,
  children,
  onPrevious,
  onNext,
  onToggleControls
}: NotebookReaderProps) => (
  <section className="reader-shell" aria-label="Notebook reader">
    <div className="paper-page">
      <div className="page-meta">
        <span>Page {pageNumber}</span>
        <span>{totalPages} pages</span>
      </div>
      {children}
      <PageTapZones
        disabled={mode === "edit"}
        onPrevious={onPrevious}
        onNext={onNext}
        onToggleControls={onToggleControls}
      />
    </div>
  </section>
);
