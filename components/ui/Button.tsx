import Link from "next/link";
import { ACCENT, SHADOW, SHADOW_HOVER, cx, type Accent } from "./theme";

// Literal hover-fill strings for the outline variant (transparent → solid on
// hover). Kept here as full literals so Tailwind's JIT emits them.
const HOVER_FILL: Record<Accent, string> = {
  pink: "hover:bg-pink-500 hover:text-black",
  green: "hover:bg-green-500 hover:text-black",
  cyan: "hover:bg-cyan-400 hover:text-black",
  purple: "hover:bg-purple-500 hover:text-white",
  yellow: "hover:bg-yellow-400 hover:text-black",
  white: "hover:bg-white hover:text-black",
  orange: "hover:bg-orange-500 hover:text-black",
  red: "hover:bg-red-500 hover:text-black",
};

type Common = {
  color?: Accent; // fill / border color
  shadow?: Accent; // clashing offset-shadow color
  variant?: "solid" | "outline";
  size?: "sm" | "lg";
  className?: string;
  children: React.ReactNode;
};

type AsButton = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "color"> & { href: string };

function buildClasses({
  color = "pink",
  shadow = "cyan",
  variant = "solid",
  size = "lg",
}: Common): string {
  const a = ACCENT[color];
  const base =
    "inline-block text-center font-black uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const sizing =
    size === "lg"
      ? "w-full text-xl tracking-[0.3em] py-5 border-4"
      : "text-sm tracking-widest px-4 py-2 border-2";

  // Big buttons press 8px→4px→none; small buttons press 4px→2px.
  const press =
    size === "lg"
      ? cx(
          SHADOW[shadow][8],
          "hover:translate-x-[4px] hover:translate-y-[4px]",
          SHADOW_HOVER[shadow][4],
          "active:translate-x-[8px] active:translate-y-[8px] active:shadow-none",
        )
      : cx(
          SHADOW[shadow][4],
          "hover:translate-x-[2px] hover:translate-y-[2px]",
          SHADOW_HOVER[shadow][2],
        );

  const skin =
    variant === "solid"
      ? cx(a.bg, a.fg, a.border, a.bgHover)
      : cx("bg-black", a.text, a.border, HOVER_FILL[color]);

  return cx(base, sizing, skin, press);
}

export default function Button(props: AsButton | AsLink) {
  const { color, shadow, variant, size, className, children, ...rest } =
    props as Common & Record<string, unknown>;

  const cls = cx(buildClasses({ color, shadow, variant, size } as Common), className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as unknown as {
      href: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    if (href.startsWith("http")) {
      return (
        <a href={href} className={cls} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
