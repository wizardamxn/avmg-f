import { ACCENT, cx, type Accent } from "./theme";

// Literal focus-border/text pairs (Tailwind must see these as static strings).
const FOCUS: Record<Accent, string> = {
  pink: "focus:border-pink-500 focus:text-pink-500",
  green: "focus:border-green-500 focus:text-green-500",
  cyan: "focus:border-cyan-400 focus:text-cyan-400",
  purple: "focus:border-purple-500 focus:text-purple-400",
  yellow: "focus:border-yellow-400 focus:text-yellow-400",
  white: "focus:border-white focus:text-white",
  orange: "focus:border-orange-500 focus:text-orange-400",
  red: "focus:border-red-500 focus:text-red-500",
};

export function Label({
  color = "cyan",
  children,
  className,
}: {
  color?: Accent;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "text-sm font-black uppercase tracking-widest",
        ACCENT[color].text,
        className,
      )}
    >
      {children}
    </span>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  color?: Accent;
  focus?: Accent;
};

export function Input({ color = "cyan", focus = "pink", className, ...rest }: InputProps) {
  const a = ACCENT[color];
  return (
    <input
      className={cx(
        "bg-black border-4 font-bold p-4 focus:outline-none transition-colors disabled:opacity-50 rounded-none w-full",
        a.text,
        a.border,
        a.placeholder,
        FOCUS[focus],
        className,
      )}
      {...rest}
    />
  );
}

// A labelled field wrapper — label above control, consistent gap.
export function Field({
  label,
  labelColor = "cyan",
  required,
  requiredColor = "pink",
  children,
}: {
  label: string;
  labelColor?: Accent;
  required?: boolean;
  requiredColor?: Accent;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1">
        <Label color={labelColor}>{label}</Label>
        {required && (
          <span className={cx("animate-pulse", ACCENT[requiredColor].text)}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}
