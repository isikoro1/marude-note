# Architecture

## Overall Structure
The MVP is a Vite, React, and TypeScript frontend application. The app is organized under `src/features/notebook` so domain types, repository adapters, services, hooks, and UI components stay close together.

## Component Structure
- `NotebookApp`: owns notebook loading, save state, mode, and composition.
- `NotebookReader`: renders the paper-like page surface.
- `NotebookEditor`: renders the edit-mode textarea.
- `MarkdownPreview`: renders Markdown and handles external/internal links.
- `PageTapZones`: handles ebook-style left, center, and right interactions.
- `PageControlBar`: renders bottom page controls and slider.

## State Management
React hooks manage MVP state. `useNotebook` loads and saves the notebook. `usePageNavigation` owns page movement and page creation rules. `useReaderControls` owns the bottom control bar visibility.

## Persistence
Persistence is accessed through `NotebookRepository`. The MVP uses `LocalNotebookRepository`, which stores one notebook in localStorage. Components do not directly touch localStorage.

## Download
`notebookExport.ts` builds export file paths and content, then uses JSZip to create `marude-note.zip` in the browser.

## Future Backend API / DB / Auth
The repository interface is the replacement boundary for a future `ApiNotebookRepository`. A production version should add authenticated API endpoints, PostgreSQL persistence, user-scoped notebooks, import/export APIs, and sync conflict handling. localStorage should be migrated into the database once authentication is available.
