# ADR-0002: Storage Abstraction

## Status
Accepted

## Context
The MVP uses localStorage, but future versions need Backend API, PostgreSQL, authentication, and sync.

## Decision
All persistence goes through `NotebookRepository`. The MVP implementation is `LocalNotebookRepository`.

## Consequences
Components remain independent from localStorage. A future API repository can replace the local adapter with less UI churn.
