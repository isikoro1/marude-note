import { useState } from "react";
import ReactMarkdown from "react-markdown";

type EditorSelection = {
  start: number;
  end: number;
};

type NotebookEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange: (selection: EditorSelection) => void;
};

const lineOffsetAt = (lines: string[], lineIndex: number) =>
  lines.slice(0, lineIndex).reduce((offset, line) => offset + line.length + 1, 0);

const isBlankLine = (line: string) => line.trim().length === 0;

const renderPreviewLine = (line: string) => {
  const todoMatch = line.match(/^-\s+\[( |x|X)\]\s+(.+)$/);
  if (todoMatch) {
    return (
      <span className="notebook-editor-todo">
        <span className={`notebook-editor-checkbox${todoMatch[1].toLowerCase() === "x" ? " checked" : ""}`} />
        <span>{todoMatch[2]}</span>
      </span>
    );
  }

  const listMatch = line.match(/^-\s+(.+)$/);
  if (listMatch) {
    return (
      <span className="notebook-editor-list-item">
        <span aria-hidden="true">•</span>
        <span>{listMatch[1]}</span>
      </span>
    );
  }

  return <ReactMarkdown>{line}</ReactMarkdown>;
};

export const NotebookEditor = ({ value, onChange, onSelectionChange }: NotebookEditorProps) => {
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(0);
  const lines = value.split("\n");

  const updateLine = (lineIndex: number, nextLineValue: string) => {
    const nextLines = [...lines];
    nextLines.splice(lineIndex, 1, ...nextLineValue.split("\n"));
    onChange(nextLines.join("\n"));
  };

  const updateSelection = (lineIndex: number, textarea: HTMLTextAreaElement) => {
    const offset = lineOffsetAt(lines, lineIndex);
    onSelectionChange({
      start: offset + textarea.selectionStart,
      end: offset + textarea.selectionEnd
    });
  };

  return (
    <div className="notebook-editor">
      {lines.map((line, lineIndex) => {
        const key = `${lineIndex}-${lines.length}`;
        const isActive = activeLineIndex === lineIndex;

        if (isActive) {
          return (
            <textarea
              key={key}
              className="notebook-editor-line notebook-editor-line-active"
              aria-label="Markdown editor"
              value={line}
              rows={1}
              onBlur={() => setActiveLineIndex(null)}
              onChange={(event) => updateLine(lineIndex, event.target.value)}
              onClick={(event) => updateSelection(lineIndex, event.currentTarget)}
              onFocus={(event) => updateSelection(lineIndex, event.currentTarget)}
              onKeyUp={(event) => updateSelection(lineIndex, event.currentTarget)}
              onSelect={(event) => updateSelection(lineIndex, event.currentTarget)}
              spellCheck={false}
            />
          );
        }

        return (
          <button
            key={key}
            type="button"
            className={`notebook-editor-line notebook-editor-line-preview${isBlankLine(line) ? " notebook-editor-line-blank" : ""}`}
            onClick={() => setActiveLineIndex(lineIndex)}
          >
            {isBlankLine(line) ? <span>&nbsp;</span> : renderPreviewLine(line)}
          </button>
        );
      })}
    </div>
  );
};
