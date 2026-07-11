import SiteNav from "@/components/SiteNav";
import { cx, type Accent } from "./theme";

const SELECTION: Record<Accent, string> = {
  pink: "selection:bg-pink-500 selection:text-black",
  green: "selection:bg-green-500 selection:text-black",
  cyan: "selection:bg-cyan-400 selection:text-black",
  purple: "selection:bg-purple-500 selection:text-black",
  yellow: "selection:bg-yellow-400 selection:text-black",
  white: "selection:bg-white selection:text-black",
  orange: "selection:bg-orange-500 selection:text-black",
  red: "selection:bg-red-500 selection:text-black",
};

type PageShellProps = {
  selection?: Accent;
  nav?: boolean;
  maxWidth?: "5xl" | "6xl" | "7xl";
  className?: string;
  children: React.ReactNode;
};

// Standard page frame: black bg, grid comes from globals.css, mono font,
// selection accent, optional top nav, centered max-width container.
export default function PageShell({
  selection = "white",
  nav = true,
  maxWidth = "6xl",
  className,
  children,
}: PageShellProps) {
  const width = { "5xl": "max-w-5xl", "6xl": "max-w-6xl", "7xl": "max-w-7xl" }[maxWidth];
  return (
    <div
      className={cx(
        "min-h-screen bg-black text-white p-6 md:p-12 font-mono",
        SELECTION[selection],
        className,
      )}
    >
      {nav && <SiteNav />}
      <div className={cx(width, "mx-auto")}>{children}</div>
    </div>
  );
}
