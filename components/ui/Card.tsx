import { ACCENT, SHADOW, cx, type Accent } from "./theme";

type CardProps = {
  color?: Accent;
  shadow?: Accent;
  shadowSize?: 4 | 6 | 8 | 10 | 12;
  className?: string;
  children: React.ReactNode;
};

// The bordered hard-shadow box that every panel/tile in AVMG is built from.
export default function Card({
  color = "white",
  shadow = "cyan",
  shadowSize = 8,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cx(
        "bg-black border-4",
        ACCENT[color].border,
        SHADOW[shadow][shadowSize],
        className,
      )}
    >
      {children}
    </div>
  );
}
