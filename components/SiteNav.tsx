"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { cx } from "@/components/ui/theme";

export default function SiteNav() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={cx(
          "text-sm font-black uppercase tracking-widest transition-colors hover:text-white",
          active ? "text-white" : "text-neutral-500",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="w-full max-w-7xl mx-auto mb-12 flex items-center justify-between gap-4 border-b-4 border-neutral-800 pb-5">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-black italic tracking-tighter text-white drop-shadow-[3px_3px_0_#ff00ff] uppercase"
        >
          AVMG
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <NavLink href="/tools" label="Tools" />
          <NavLink href="/dashboard" label="Dashboard" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest animate-pulse">
            ...
          </span>
        ) : user ? (
          <>
            <span className="hidden md:inline text-xs font-bold text-green-500 uppercase tracking-widest max-w-[180px] truncate">
              {user.email}
            </span>
            <Button size="sm" variant="outline" color="white" shadow="pink" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" color="cyan" shadow="pink" href="/login">
              Login
            </Button>
            <Button size="sm" variant="solid" color="pink" shadow="green" href="/signup">
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
