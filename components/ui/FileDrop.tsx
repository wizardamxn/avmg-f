"use client";

import { useRef, useState } from "react";
import { ACCENT, SHADOW, cx, type Accent } from "./theme";

type FileDropProps = {
  file: File | null;
  onFile: (file: File | null) => void;
  accept?: string;
  color?: Accent;
  shadow?: Accent;
  hint?: string;
  disabled?: boolean;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// Themed drag-and-drop file zone. Click to browse or drop a file; drag-over
// inverts to a solid fill so the drop target is unmistakable.
export default function FileDrop({
  file,
  onFile,
  accept,
  color = "cyan",
  shadow = "pink",
  hint,
  disabled,
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const a = ACCENT[color];

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (disabled) return;
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={cx(
          "w-full border-4 p-6 flex flex-col items-center justify-center gap-2 text-center transition-all disabled:opacity-50 cursor-pointer",
          a.border,
          SHADOW[shadow][4],
          drag ? cx(a.bg, a.fg) : cx("bg-black", a.text),
        )}
      >
        <span className="text-3xl font-black leading-none">{file ? "[✓]" : "[ + ]"}</span>
        <span className="font-black uppercase tracking-widest text-sm break-all px-2">
          {file ? file.name : "DROP FILE OR CLICK"}
        </span>
        <span
          className={cx(
            "text-[11px] font-bold uppercase tracking-wider",
            drag ? "opacity-80" : "opacity-50",
          )}
        >
          {file ? formatSize(file.size) : hint || " "}
        </span>
      </button>
      {file && !disabled && (
        <button
          type="button"
          onClick={() => onFile(null)}
          className="mt-2 text-[11px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
        >
          {"[ X ] REMOVE"}
        </button>
      )}
    </div>
  );
}
