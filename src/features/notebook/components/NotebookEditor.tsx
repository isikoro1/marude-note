type NotebookEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const NotebookEditor = ({ value, onChange }: NotebookEditorProps) => (
  <textarea
    className="notebook-editor"
    aria-label="Markdown editor"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    spellCheck={false}
  />
);
