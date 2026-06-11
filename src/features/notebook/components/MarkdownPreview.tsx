import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";

type MarkdownPreviewProps = {
  markdown: string;
  onPageLink: (pageNumber: number) => void;
};

const textFromChildren = (children: ReactNode): string => {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }

  return "";
};

export const MarkdownPreview = ({ markdown, onPageLink }: MarkdownPreviewProps) => (
  <div className="markdown-preview" data-testid="markdown-preview">
    <ReactMarkdown
      urlTransform={(url) => (url.startsWith("page:") ? url : url)}
      components={{
        li: ({ children }) => {
          const text = textFromChildren(children);
          const todoMatch = text.match(/^\[( |x|X)\]\s+(.+)$/);

          if (todoMatch) {
            const isChecked = todoMatch[1].toLowerCase() === "x";
            return (
              <li className="markdown-task-list-item">
                <span className={`markdown-checkbox${isChecked ? " checked" : ""}`} aria-hidden="true" />
                <span>{todoMatch[2]}</span>
              </li>
            );
          }

          return <li>{children}</li>;
        },
        a: ({ href, children }) => {
          if (href?.startsWith("page:")) {
            const pageNumber = Number(href.replace("page:", ""));

            return (
              <a
                href={href}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (Number.isInteger(pageNumber)) {
                    onPageLink(pageNumber);
                  }
                }}
              >
                {children}
              </a>
            );
          }

          return (
            <a href={href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
              {children}
            </a>
          );
        }
      }}
    >
      {markdown || "_Blank page_"}
    </ReactMarkdown>
  </div>
);
