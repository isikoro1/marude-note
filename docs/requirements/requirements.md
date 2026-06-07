# Requirements

## Purpose
Marude Note is a Markdown notebook web app that treats notes as numbered pages. The MVP focuses on a physical notebook and ebook-like reading feel: users can write one page at a time and turn pages by tapping left or right areas.

## MVP Scope
- Single notebook named Marude Note.
- Multiple numbered pages starting at page 1.
- Edit mode with a Markdown textarea.
- Preview mode with Markdown rendering and clickable links.
- Ebook-style left, center, and right tap zones in preview mode.
- Bottom page control bar with current page, total pages, slider, previous, next, and close controls.
- Page number jump input.
- localStorage persistence through a repository abstraction.
- ZIP export containing notebook metadata and Markdown page files.

## Non-MVP Scope
- Backend API.
- PostgreSQL or any server-side database.
- Authentication and authorization.
- Multi-user notebook management.
- Multi-device sync.
- Image, handwriting, and advanced rich text editing.
- Import workflow.

## Functional Requirements
- Open the last edited page when the notebook loads.
- Update `lastEditedPageNumber` when a page is edited.
- Prevent previous-page navigation on page 1.
- Create the next page when advancing past the current last page.
- Refuse slider/page-jump navigation to pages that do not exist.
- Disable tap-zone page navigation in edit mode.
- Disable keyboard page navigation while textarea or input controls are focused.
- Treat `page:N` Markdown links as internal page navigation when the target page exists.
- Preserve external Markdown links as normal clickable links.

## Non-Functional Requirements
- Use explicit TypeScript types.
- Keep persistence behind `NotebookRepository`.
- Keep ZIP export logic in a service.
- Keep page navigation logic in hooks.
- Keep UI simple, stable, and usable on desktop and mobile.

## Constraints
- MVP is frontend-only.
- localStorage is an MVP-only persistence mechanism and should be replaceable by an API repository later.
- Do not expose edit APIs without authentication in a future backend release.
