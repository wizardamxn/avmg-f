"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiError } from "@/lib/api";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

const PERKS = [
  "100 MB uploads (guests get 5 MB)",
  "20 jobs / day (guests get 3)",
  "AI STUDY NOTES unlocked — 5 / day",
  "Files kept 24h instead of 1h",
  "No credit card. Ever.",
];

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      await signup(email, password, name || undefined);
      router.push("/tools");
    } catch (err) {
      setError(apiError(err, "Signup failed. That email may already be taken."));
      setBusy(false);
    }
  };

  return (
    <PageShell selection="pink" maxWidth="6xl">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* LEFT: the pitch */}
        <div className="flex flex-col justify-center">
          <div className="border-l-8 border-pink-500 pl-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#ff00ff] uppercase mb-2">
              CREATE ACCOUNT
            </h1>
            <p className="text-green-500 font-bold tracking-widest text-sm uppercase">
              {"// FREE FOREVER — SIGNUP IS THE UPGRADE"}
            </p>
          </div>

          <div className="border-4 border-green-500 bg-green-500/5 p-6 shadow-[8px_8px_0_0_#39ff14]">
            <p className="text-green-500 font-black uppercase tracking-widest text-sm mb-4">
              {"> WHAT YOU UNLOCK:"}
            </p>
            <ul className="flex flex-col gap-3">
              {PERKS.map((perk) => (
                <li
                  key={perk}
                  className="text-white font-bold uppercase tracking-wider text-xs md:text-sm flex gap-3"
                >
                  <span className="text-green-500">{"[+]"}</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: the form */}
        <div className="flex flex-col justify-center">
          <TerminalPanel title="NEW UPLINK" color="pink" shadow="cyan" shadowSize={10}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              <Field label="NAME — OPTIONAL" labelColor="yellow">
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="handle"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                  color="yellow"
                  focus="pink"
                />
              </Field>

              <Field label="EMAIL" labelColor="cyan" required>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  required
                  color="cyan"
                  focus="pink"
                />
              </Field>

              <Field label="PASSWORD — 8+ CHARS" labelColor="pink" required requiredColor="cyan">
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  required
                  minLength={8}
                  color="pink"
                  focus="cyan"
                />
              </Field>

              {error && (
                <p className="text-red-500 font-bold uppercase tracking-wider text-xs border-l-4 border-red-500 bg-red-500/10 p-3">
                  {"> "}
                  {error}
                </p>
              )}

              <Button type="submit" color="pink" shadow="green" disabled={busy}>
                {busy ? "CREATING..." : "CREATE ACCOUNT"}
              </Button>
            </form>
          </TerminalPanel>

          <p className="text-center text-neutral-500 font-bold uppercase tracking-widest text-xs mt-8">
            {"// ALREADY IN? "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
