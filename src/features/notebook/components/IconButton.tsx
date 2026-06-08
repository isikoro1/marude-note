import type { ButtonHTMLAttributes } from "react";

type IconName = "check" | "gear" | "link" | "list" | "pencil" | "redo" | "todo" | "undo";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
};

const icons: Record<IconName, string> = {
  check: "M5 12l4 4L19 6",
  gear: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-5v3m0 11v3M4.2 6.2l2.1 2.1m11.4 7.4 2.1 2.1M2.5 12h3m13 0h3M4.2 17.8l2.1-2.1m11.4-7.4 2.1-2.1",
  link: "M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  pencil: "M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Zm12-14 2 2",
  redo: "M21 7v6h-6M20 13a7 7 0 1 1-2-5",
  todo: "M5 5h14v14H5zM8 12l2 2 5-5",
  undo: "M3 7v6h6M4 13a7 7 0 1 0 2-5"
};

export const IconButton = ({ icon, label, className, ...buttonProps }: IconButtonProps) => (
  <button type="button" aria-label={label} title={label} className={`icon-button ${className ?? ""}`} {...buttonProps}>
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={icons[icon]} />
    </svg>
  </button>
);
