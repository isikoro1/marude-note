# Iteration 1

## Goal
Create documentation and the frontend foundation.

## Implemented
- Added requirements, architecture, data model, UI design, testing plan, and ADRs.
- Added Vite React TypeScript project files.
- Added notebook domain types.

## Tests
Not run yet.

## Notes
The workspace was empty and not initialized as a Git repository.

## Next
Implement persistence, navigation, preview, export, and tests.

# Iteration 2

## Goal
Implement notebook creation, page editing, and local persistence.

## Implemented
- Added `LocalNotebookRepository`.
- Added `useNotebook`.
- Added edit mode with Markdown textarea.
- Added debounced save state display.

## Tests
- Added notebook creation test.
- Added component coverage for editing and saved content.

## Notes
Persistence is only reachable through the repository interface.

## Next
Add page movement.

# Iteration 3

## Goal
Implement page navigation and page creation.

## Implemented
- Added previous, next, and direct page navigation.
- Added automatic next-page creation.
- Added page number jump.
- Updated `lastEditedPageNumber` on content edits and page creation.

## Tests
- Added unit tests for page append and content update.

## Notes
Slider and page-number jump only navigate to existing pages.

## Next
Add ebook-style tap zones.

# Iteration 4

## Goal
Add ebook-style reading interaction.

## Implemented
- Added `PageTapZones`.
- Enabled left, center, and right click areas in preview mode.
- Disabled tap zones in edit mode.
- Added bottom `PageControlBar`.

## Tests
- Covered left/right/center interactions and edit-mode tap disabling.

## Notes
Tap-zone buttons are invisible and excluded from normal tab flow.

## Next
Add faster navigation and keyboard controls.

# Iteration 5

## Goal
Add fast page movement.

## Implemented
- Added range slider navigation.
- Added current page and total pages display.
- Added ArrowLeft, ArrowRight, and Escape keyboard handlers.
- Disabled keyboard page movement while textarea or input controls are focused.

## Tests
- Covered slider navigation and textarea focus guard.

## Notes
Keyboard handling also checks `document.activeElement` because global key events may not carry the focused field as `event.target`.

## Next
Add Markdown rendering and page links.

# Iteration 6

## Goal
Add Markdown preview.

## Implemented
- Added `react-markdown` rendering.
- Added external links.
- Added internal `page:N` links.
- Stopped link click propagation so links take priority over page tap zones.

## Tests
- Covered external link rendering and internal page link navigation.

## Notes
Internal links navigate only to existing pages in the MVP.

## Next
Add ZIP export.

# Iteration 7

## Goal
Add notebook download.

## Implemented
- Added ZIP export service using JSZip.
- Added `notebook.json` metadata export.
- Added per-page Markdown files under `pages/page-0001.md`.
- Added Download button.

## Tests
- Covered export file path and content generation.

## Notes
The service exposes pure export-file generation separately from browser download behavior.

## Next
Run full test/build verification and clean up.

# Iteration 8

## Goal
Verify and clean up the MVP.

## Implemented
- Added unit and component tests.
- Added `.gitignore`.
- Ran test and production build.

## Tests
- `npm test`: 14 tests passed.
- `npm run build`: passed.

## Notes
Browser plugin verification could not be completed because the local node_repl kernel exited with a sandbox error and background Vite processes did not remain reachable in this environment.

## Next
Perform browser smoke testing in a normal local session and then expand import/backend planning.

# Iteration 9

## Goal
Improve the opening experience and simplify the workspace surface.

## Implemented
- Added a notebook cover entry screen with an opening animation.
- Removed the notebook title from the editing workspace.
- Replaced the vertical paper ruling with horizontal notebook lines.

## Tests
- `npm test`: 15 tests passed.
- `npm run build`: passed.

## Notes
Browser plugin verification still fails in this environment because the local node_repl kernel exits with a Windows sandbox setup error.

## Next
Smoke test the deployed GitHub Pages build on mobile.

# Iteration 10

## Goal
Make the workspace more minimal and move editing/configuration behind lightweight controls.

## Implemented
- Switched the default workspace mode to preview.
- Added a floating pencil button that enters edit mode.
- Added an edit toolbar with preview, settings, todo, list, link, undo, and redo actions.
- Moved download into a settings panel.
- Added ZIP upload/import through the export service.
- Added paper color and ruled/grid/plain paper pattern controls.

## Tests
- `npm test`: 17 tests passed.
- `npm run build`: passed.
- Pages base build with `VITE_BASE_PATH=/marude-note/`: passed.

## Notes
Undo/redo is scoped to the current editing session and page content changes.

## Next
Visually tune the floating pencil and settings panel on mobile after Pages deployment.

# Iteration 11

## Goal
Reduce clutter above the notebook on mobile.

## Implemented
- Removed the top page jump form.
- Removed the top `Page N / M` display.
- Kept page context inside the notebook paper only.
- Moved save state into a small fixed badge at the upper-left edge.
- Reduced workspace top spacing so the notebook starts closer to the top of the viewport.

## Tests
- `npm test`: 17 tests passed.
- `npm run build`: passed.
- Pages base build with `VITE_BASE_PATH=/marude-note/`: passed.

## Notes
Page movement is still available through left/right page taps and the bottom control bar shown from the center tap zone.

## Next
Check mobile spacing on the deployed GitHub Pages build.

# Iteration 12

## Goal
Move action icons to the lower edge and align paper ruling with content.

## Implemented
- Moved the floating pencil control to the lower-right edge.
- Moved the edit toolbar to the bottom center.
- Scoped ruled/grid backgrounds to the notebook body area instead of the whole sheet.
- Matched editor and preview line height to the 32px paper ruling interval.

## Tests
- `npm test`: 17 tests passed.
- `npm run build`: passed.
- Pages base build with `VITE_BASE_PATH=/marude-note/`: passed.

## Notes
Markdown headings still occupy normal Markdown block space, but body text and textarea lines now align to the ruling interval.

## Next
Verify the lower controls do not conflict with phone browser bottom bars on the deployed page.

# Iteration 13

## Goal
Make edit mode feel like a single toggle and add heading-based navigation support.

## Implemented
- Changed the lower-right pencil into an edit/preview toggle.
- The toggle shows a pencil in preview mode and a check mark in edit mode.
- Added large, medium, and small heading buttons to the edit toolbar.
- Added an auto table-of-contents setting.
- When enabled, the first page preview prepends a generated table of contents from page headings.

## Tests
- `npm test`: 19 tests passed.
- `npm run build`: passed.
- Pages base build with `VITE_BASE_PATH=/marude-note/`: passed.

## Notes
The generated table of contents is display-only and does not mutate stored Markdown content.

## Next
Tune the generated table of contents label language and visual spacing after mobile review.

# Iteration 14

## Goal
Keep generated table-of-contents links clickable and lift lower controls upward.

## Implemented
- Raised the lower-right edit toggle higher above the phone browser edge.
- Raised the bottom edit toolbar higher above the phone browser edge.
- Put Markdown links above the transparent page-tap zones so table-of-contents links receive clicks first.

## Tests
- `npm test`: 19 tests passed.
- `npm run build`: passed.
- Pages base build with `VITE_BASE_PATH=/marude-note/`: passed.

## Notes
Transparent page zones remain active for blank paper areas, while actual Markdown links now take precedence.

## Next
Confirm table-of-contents link tapping on the deployed mobile page.

# Iteration 15

## Goal
Move the edit toggle away from text input and add Obsidian-like line previews while editing.

## Implemented
- Moved the lower-right pencil/check toggle to the right-middle of the viewport.
- Replaced the single textarea editor with a line-based Markdown editor.
- Kept only the active line as raw Markdown input.
- Rendered unfocused lines as Markdown preview while still in edit mode.
- Added edit-mode preview rendering for todo lines and simple bullet list lines.

## Tests
- `npm test`: 20 tests passed.
- `npm run build`: passed.
- Pages base build with `VITE_BASE_PATH=/marude-note/`: passed.

## Notes
The line-based editor is intentionally lightweight. It covers the requested Obsidian-like behavior for normal lines, headings, todo lines, and bullet lines without introducing a full rich-text editor dependency.

## Next
Check touch editing behavior on the deployed mobile page and tune active-line focus behavior if needed.
