# Data Model

## Notebook
`Notebook` represents one logical notebook.

```ts
export type Notebook = {
  id: string;
  title: string;
  pages: NotebookPage[];
  lastEditedPageNumber: number;
  createdAt: string;
  updatedAt: string;
};
```

## NotebookPage
`NotebookPage` represents one numbered Markdown page.

```ts
export type NotebookPage = {
  pageNumber: number;
  markdownContent: string;
  createdAt: string;
  updatedAt: string;
};
```

## lastEditedPageNumber
Tracks the page to reopen when the notebook loads. It is updated when Markdown content changes and when a new page is created through next-page navigation.

## pageNumber
The stable 1-based page identifier. Page 1 is the first page.

## markdownContent
The raw Markdown body for a page.

## updatedAt
ISO timestamp updated when notebook or page content changes.
