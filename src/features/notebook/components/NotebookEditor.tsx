import { forwardRef } from "react";

type NotebookEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const NotebookEditor = forwardRef<HTMLTextAreaElement, NotebookEditorProps>(({ value, onChange }, ref) => (
  <textarea
    ref={ref}
    className="notebook-editor"
    aria-label="Markdown editor"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    spellCheck={false}
  />
));

NotebookEditor.displayName = "NotebookEditor";
