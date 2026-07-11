import { ACCENT, SHADOW, cx, type Accent } from "./theme";

type TerminalPanelProps = {
  title?: string;
  color?: Accent;
  shadow?: Accent;
  shadowSize?: 4 | 6 | 8 | 10 | 12;
  dots?: [Accent, Accent, Accent];
  className?: string;
  children: React.ReactNode;
};

// The CRT status panel: scanline overlay + traffic-light dots header.
export default function TerminalPanel({
  title = "STATUS",
  color = "green",
  shadow = "cyan",
  shadowSize = 8,
  dots,
  className,
  children,
}: TerminalPanelProps) {
  const trio: [Accent, Accent, Accent] = dots ?? [color, color, color];

  return (
    <div
      className={cx(
        "crt-terminal bg-black border-4 p-6 flex flex-col relative overflow-hidden",
        ACCENT[color].border,
        SHADOW[shadow][shadowSize],
        className,
      )}
    >
      <div
        className={cx(
          "flex justify-between items-center border-b-4 pb-4 mb-6 relative z-20",
          ACCENT[color].borderHalf,
        )}
      >
        <h3
          className={cx(
            "text-lg font-black uppercase tracking-widest",
            ACCENT[color].text,
          )}
        >
          {title}
        </h3>
        <div className="flex gap-2">
          {trio.map((d, i) => (
            <div key={i} className={cx("w-3 h-3 border", ACCENT[d].bg, ACCENT[d].border)} />
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col relative z-20 w-full">{children}</div>
    </div>
  );
}
