type PageControlBarProps = {
  currentPageNumber: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageChange: (pageNumber: number) => void;
  onClose: () => void;
};

export const PageControlBar = ({
  currentPageNumber,
  totalPages,
  onPrevious,
  onNext,
  onPageChange,
  onClose
}: PageControlBarProps) => (
  <div className="page-control-bar" role="dialog" aria-label="Page controls">
    <div className="page-control-count">
      Page {currentPageNumber} / {totalPages}
    </div>
    <div className="page-control-actions">
      <button type="button" onClick={onPrevious} aria-label="Previous page">
        &lt;
      </button>
      <input
        aria-label="Page slider"
        type="range"
        min={1}
        max={Math.max(totalPages, 1)}
        value={currentPageNumber}
        onChange={(event) => onPageChange(Number(event.target.value))}
      />
      <button type="button" onClick={onNext} aria-label="Next page">
        &gt;
      </button>
      <button type="button" onClick={onClose} aria-label="Close page controls">
        Close
      </button>
    </div>
  </div>
);
