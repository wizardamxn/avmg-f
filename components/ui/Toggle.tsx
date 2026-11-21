import { ACCENT, cx, type Accent } from "./theme";

// On/off switch styled like the rest of the kit (no native checkbox).
// A real <button> with aria-pressed, so it's keyboard and screen-reader friendly.
export default function Toggle({
  label,
  hint,
  on,
  onChange,
  disabled,
  color = "cyan",
}: {
  label: string;
  hint?: string;
  on: boolean;
  onChange: (on: boolean) => void;
  disabled?: boolean;
  color?: Accent;
}) {
  const a = ACCENT[color];
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={cx(
        "flex w-full items-center gap-4 border-4 bg-black p-4 text-left transition-colors disabled:opacity-50",
        a.border,
        on && "bg-white/5",
      )}
    >
      <span aria-hidden className={cx("relative h-7 w-12 shrink-0 border-4", a.border)}>
        <span className={cx("absolute top-0.5 h-4 w-4 transition-all", on ? cx("left-5", a.bg) : "left-0.5 bg-neutral-700")} />
      </span>
      <span className="min-w-0">
        <span className={cx("block font-black uppercase tracking-widest text-sm", a.text)}>{label}</span>
        {hint && <span className="mt-1 block text-xs uppercase tracking-wider text-neutral-400">{hint}</span>}
      </span>
    </button>
  );
}
