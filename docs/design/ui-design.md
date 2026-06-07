# UI Design

## Notebook Display
The first screen is the notebook itself. It shows the app name, notebook title, current page, total pages, save status, mode toggle, page jump, download button, and a paper-like page surface.

## Edit Mode
Edit mode shows a full-page textarea for the current page's Markdown. Tap-zone navigation is disabled so editing interactions do not accidentally turn pages.

## Preview Mode
Preview mode renders Markdown. Links remain clickable, and link clicks stop propagation so they are not interpreted as page taps.

## Ebook-Style Page Operation
The page surface is split into left, center, and right invisible tap zones in preview mode.

## Left / Right Click or Tap
The left zone moves to the previous page unless already on page 1. The right zone moves to the next page and creates it if it does not exist.

## Center Click or Tap
The center zone toggles the bottom page control bar.

## Page Slider
The bottom bar uses a range input with min 1, max total pages, and value current page. It only navigates to existing pages.

## Download Button
The download button exports the notebook as a ZIP with `notebook.json` and one Markdown file per page.
