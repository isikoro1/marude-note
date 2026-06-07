# ADR-0003: Page-Based Notebook

## Status
Accepted

## Context
Marude Note should feel closer to a physical notebook or ebook than a long scrolling document.

## Decision
Store notebooks as ordered numbered pages with Markdown content per page.

## Consequences
Page navigation, internal `page:N` links, export paths, and restore behavior can all use page numbers as the central model.
