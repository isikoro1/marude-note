type EditorSelection = {
  start: number;
  end: number;
};

type NotebookEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange: (selection: EditorSelection) => void;
};

export const NotebookEditor = ({ value, onChange, onSelectionChange }: NotebookEditorProps) => {
  const updateSelection = (textarea: HTMLTextAreaElement) => {
    onSelectionChange({
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    });
  };

  return (
    <textarea
      className="notebook-editor"
      aria-label="Markdown editor"
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        updateSelection(event.currentTarget);
      }}
      onClick={(event) => updateSelection(event.currentTarget)}
      onFocus={(event) => updateSelection(event.currentTarget)}
      onKeyUp={(event) => updateSelection(event.currentTarget)}
      onSelect={(event) => updateSelection(event.currentTarget)}
      spellCheck={false}
    />
  );
};
