import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotebookApp } from "./NotebookApp";

const renderApp = async () => {
  const result = render(<NotebookApp />);
  const cover = await screen.findByTestId("notebook-cover");
  await userEvent.click(cover);
  fireEvent.animationEnd(cover);
  await screen.findByTestId("markdown-preview");
  return result;
};

const switchToEdit = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Edit page" }));
  await screen.findByLabelText("Markdown editor");
};

const switchToPreview = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Preview page" }));
};

const getTapZone = (container: HTMLElement, zone: "left" | "center" | "right") => {
  const element = container.querySelector(`.tap-zone-${zone}`);
  if (!(element instanceof HTMLButtonElement)) {
    throw new Error(`Missing ${zone} tap zone`);
  }
  return element;
};

describe("NotebookApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts from a notebook cover before entering the workspace", async () => {
    render(<NotebookApp />);

    const cover = await screen.findByTestId("notebook-cover");
    expect(screen.getByRole("heading", { name: "Marude Note" })).toBeInTheDocument();

    await userEvent.click(cover);
    fireEvent.animationEnd(cover);

    expect(await screen.findByTestId("markdown-preview")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Marude Note" })).not.toBeInTheDocument();
  });

  it("shows the current page number and floating edit button", async () => {
    await renderApp();

    expect(screen.getByText("Page 1")).toBeInTheDocument();
    expect(screen.getByText("1 pages")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit page" })).toBeInTheDocument();
  });

  it("moves to the next page from the right tap zone", async () => {
    const { container } = await renderApp();

    fireEvent.click(getTapZone(container, "right"));

    expect(await screen.findByText("Page 2")).toBeInTheDocument();
    expect(screen.getByText("2 pages")).toBeInTheDocument();
  });

  it("moves to the previous page from the left tap zone", async () => {
    const { container } = await renderApp();

    fireEvent.click(getTapZone(container, "right"));
    fireEvent.click(getTapZone(container, "left"));

    expect(await screen.findByText("Page 1")).toBeInTheDocument();
    expect(screen.getByText("2 pages")).toBeInTheDocument();
  });

  it("shows page controls from the center tap zone and navigates with the slider", async () => {
    const { container } = await renderApp();

    fireEvent.click(getTapZone(container, "right"));
    fireEvent.click(getTapZone(container, "center"));

    const dialog = await screen.findByRole("dialog", { name: "Page controls" });
    fireEvent.change(within(dialog).getByLabelText("Page slider"), { target: { value: "1" } });

    await waitFor(() => expect(screen.getAllByText("Page 1 / 2").length).toBeGreaterThan(0));
  });

  it("does not navigate by tap zone in edit mode", async () => {
    const { container } = await renderApp();
    await switchToEdit();

    expect(container.querySelector(".tap-zone-right")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1")).toBeInTheDocument();
  });

  it("does not navigate with arrow keys when textarea is focused", async () => {
    await renderApp();
    await switchToEdit();

    const editor = screen.getByLabelText("Markdown editor");
    editor.focus();
    fireEvent.keyDown(window, { key: "ArrowRight" });

    expect(screen.getByText("Page 1")).toBeInTheDocument();
  });

  it("saves markdown edits", async () => {
    await renderApp();
    await switchToEdit();

    await userEvent.clear(screen.getByLabelText("Markdown editor"));
    await userEvent.type(screen.getByLabelText("Markdown editor"), "Saved content");

    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument(), { timeout: 1000 });
    expect(window.localStorage.getItem("marude-note:notebook:default")).toContain("Saved content");
  });

  it("renders external links in preview mode", async () => {
    await renderApp();
    await switchToEdit();

    fireEvent.change(screen.getByLabelText("Markdown editor"), {
      target: { value: "[Google](https://www.google.com)" }
    });
    await switchToPreview();

    expect(screen.getByRole("link", { name: "Google" })).toHaveAttribute("href", "https://www.google.com");
  });

  it("navigates with an internal page link", async () => {
    const { container } = await renderApp();

    fireEvent.click(getTapZone(container, "right"));
    fireEvent.click(getTapZone(container, "right"));
    await switchToEdit();
    fireEvent.change(screen.getByLabelText("Markdown editor"), {
      target: { value: "[Page 1](page:1)" }
    });
    await switchToPreview();
    await userEvent.click(screen.getByRole("link", { name: "Page 1" }));

    expect(await screen.findByText("Page 1")).toBeInTheDocument();
    expect(screen.getByText("3 pages")).toBeInTheDocument();
  });

  it("opens settings from edit mode and changes the paper pattern", async () => {
    const { container } = await renderApp();
    await switchToEdit();

    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    await userEvent.click(screen.getByLabelText("Grid"));

    expect(screen.getByRole("complementary", { name: "Notebook settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download ZIP" })).toBeInTheDocument();
    expect(container.querySelector(".paper-grid")).toBeInTheDocument();
  });

  it("inserts headings from the edit toolbar", async () => {
    await renderApp();
    await switchToEdit();

    await userEvent.clear(screen.getByLabelText("Markdown editor"));
    await userEvent.click(screen.getByRole("button", { name: "Insert large heading" }));
    await userEvent.click(screen.getByRole("button", { name: "Insert medium heading" }));
    await userEvent.click(screen.getByRole("button", { name: "Insert small heading" }));

    expect(screen.getByLabelText("Markdown editor")).toHaveValue("# Heading\n## Heading\n### Heading\n");
  });

  it("shows an automatic table of contents on the first page when enabled", async () => {
    await renderApp();
    await switchToEdit();

    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    await userEvent.click(screen.getByLabelText("Auto table of contents"));
    await switchToPreview();

    expect(screen.getByText("Table of contents")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Welcome to Marude Note" })).toHaveAttribute("href", "page:1");
  });
});
