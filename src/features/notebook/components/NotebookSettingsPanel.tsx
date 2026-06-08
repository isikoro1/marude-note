import type { ChangeEvent } from "react";
import type { PaperColor, PaperPattern } from "../types";

type NotebookSettingsPanelProps = {
  paperColor: PaperColor;
  paperPattern: PaperPattern;
  isTocEnabled: boolean;
  onDownload: () => void;
  onUpload: (file: File) => void;
  onPaperColorChange: (paperColor: PaperColor) => void;
  onPaperPatternChange: (paperPattern: PaperPattern) => void;
  onTocEnabledChange: (enabled: boolean) => void;
  onClose: () => void;
};

export const NotebookSettingsPanel = ({
  paperColor,
  paperPattern,
  isTocEnabled,
  onDownload,
  onUpload,
  onPaperColorChange,
  onPaperPatternChange,
  onTocEnabledChange,
  onClose
}: NotebookSettingsPanelProps) => {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      event.target.value = "";
    }
  };

  return (
    <aside className="settings-panel" aria-label="Notebook settings">
      <div className="settings-panel-header">
        <h2>Settings</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="settings-section">
        <button type="button" onClick={onDownload}>
          Download ZIP
        </button>
        <label className="upload-button">
          Upload ZIP
          <input type="file" accept=".zip,application/zip" onChange={handleUpload} />
        </label>
      </div>

      <fieldset className="settings-section">
        <legend>Contents</legend>
        <label>
          <input
            type="checkbox"
            checked={isTocEnabled}
            onChange={(event) => onTocEnabledChange(event.target.checked)}
          />
          Auto table of contents
        </label>
      </fieldset>

      <fieldset className="settings-section">
        <legend>Paper color</legend>
        <label>
          <input
            type="radio"
            name="paperColor"
            checked={paperColor === "warm"}
            onChange={() => onPaperColorChange("warm")}
          />
          Warm
        </label>
        <label>
          <input
            type="radio"
            name="paperColor"
            checked={paperColor === "white"}
            onChange={() => onPaperColorChange("white")}
          />
          White
        </label>
        <label>
          <input
            type="radio"
            name="paperColor"
            checked={paperColor === "blue"}
            onChange={() => onPaperColorChange("blue")}
          />
          Pale blue
        </label>
      </fieldset>

      <fieldset className="settings-section">
        <legend>Paper pattern</legend>
        <label>
          <input
            type="radio"
            name="paperPattern"
            checked={paperPattern === "ruled"}
            onChange={() => onPaperPatternChange("ruled")}
          />
          Ruled
        </label>
        <label>
          <input
            type="radio"
            name="paperPattern"
            checked={paperPattern === "grid"}
            onChange={() => onPaperPatternChange("grid")}
          />
          Grid
        </label>
        <label>
          <input
            type="radio"
            name="paperPattern"
            checked={paperPattern === "plain"}
            onChange={() => onPaperPatternChange("plain")}
          />
          Plain
        </label>
      </fieldset>
    </aside>
  );
};
