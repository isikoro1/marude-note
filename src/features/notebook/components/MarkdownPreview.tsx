import ReactMarkdown from "react-markdown";

type MarkdownPreviewProps = {
  markdown: string;
  onPageLink: (pageNumber: number) => void;
};

export const MarkdownPreview = ({ markdown, onPageLink }: MarkdownPreviewProps) => (
  <div className="markdown-preview" data-testid="markdown-preview">
    <ReactMarkdown
      urlTransform={(url) => (url.startsWith("page:") ? url : url)}
      components={{
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
