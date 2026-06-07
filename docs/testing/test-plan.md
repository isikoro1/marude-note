# Test Plan

## Unit Tests
- New notebook creation.
- Page append behavior.
- Previous page guard on page 1.
- Next page auto-creation.
- Existing page navigation.
- Rejection of nonexistent slider targets.
- `lastEditedPageNumber` updates.
- ZIP export file generation.

## Component Tests
- Page number display.
- Right tap-zone advances to the next page.
- Left tap-zone goes to the previous page.
- Center tap-zone shows page controls.
- Slider navigates pages.
- Edit mode disables tap-zone navigation.
- Textarea focus disables ArrowLeft and ArrowRight navigation.
- Markdown edits persist through repository save.
- External links render in preview mode.
- `page:3` internal link navigates to page 3.
- Download button renders.

## Manual Checks
- Start the app and verify the notebook opens.
- Edit Markdown and wait for the save status to return to Saved.
- Switch to preview and turn pages with right/left tap zones.
- Toggle the bottom controls with the center zone.
- Export the notebook ZIP.
