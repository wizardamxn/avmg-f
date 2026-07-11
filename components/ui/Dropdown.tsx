"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ACCENT, SHADOW, cx, type Accent } from "./theme";

export type Option = { value: string; label: string };

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  color?: Accent;
  shadow?: Accent;
  disabled?: boolean;
};

// Fully themed replacement for <select> — the native control's option list is
// OS-rendered and shatters the neobrutalist look. This keeps everything on
// theme, with keyboard nav (arrows / enter / escape) and click-outside close.
export default function Dropdown({
  value,
  onChange,
  options,
  color = "pink",
  shadow = "cyan",
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  const a = ACCENT[color];
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    setHighlight(Math.max(0, options.findIndex((o) => o.value === value)));
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, options, value]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "Escape":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setHighlight((h) => Math.min(options.length - 1, h + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(options[highlight].value);
        else setOpen(true);
        break;
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={cx(
          "w-full flex items-center justify-between gap-3 bg-black border-4 font-bold p-3 uppercase tracking-wider text-left transition-colors disabled:opacity-50 cursor-pointer focus:outline-none",
          a.text,
          a.border,
        )}
      >
        <span className="truncate">{current?.label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 10 10"
          fill="currentColor"
          className={cx("shrink-0 transition-transform duration-150", open && "rotate-180")}
        >
          <path d="M1 3l4 4 4-4z" />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className={cx(
            "absolute z-30 left-0 right-0 mt-2 bg-black border-4 max-h-64 overflow-y-auto",
            a.border,
            SHADOW[shadow][8],
          )}
        >
          {options.map((o, i) => {
            const active = o.value === value;
            const hl = i === highlight;
            return (
              <li key={o.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(o.value)}
                  onMouseEnter={() => setHighlight(i)}
                  className={cx(
                    "w-full text-left px-3 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border-b-2 border-neutral-900 last:border-b-0",
                    hl ? cx(a.bg, a.fg) : a.text,
                  )}
                >
                  <span className={cx("shrink-0 font-black", active ? "opacity-100" : "opacity-0")}>
                    {">"}
                  </span>
                  <span className="truncate">{o.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
