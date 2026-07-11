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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.push("/tools");
    } catch (err) {
      setError(apiError(err, "Login failed. Check your email and password."));
      setBusy(false);
    }
  };

  return (
    <PageShell selection="cyan" maxWidth="5xl">
      <div className="max-w-md mx-auto mt-6">
        <div className="border-l-8 border-cyan-400 pl-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#00ffff] uppercase mb-2">
            LOG IN
          </h1>
          <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase">
            {"> ESTABLISH UPLINK_"}
          </p>
        </div>

        <TerminalPanel title="ACCESS TERMINAL" color="cyan" shadow="pink" shadowSize={10}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
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

            <Field label="PASSWORD" labelColor="pink" required requiredColor="cyan">
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
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

            <Button type="submit" color="cyan" shadow="pink" disabled={busy}>
              {busy ? "CONNECTING..." : "LOG IN"}
            </Button>
          </form>
        </TerminalPanel>

        <p className="text-center text-neutral-500 font-bold uppercase tracking-widest text-xs mt-8">
          {"// NO ACCOUNT? "}
          <Link href="/signup" className="text-pink-500 hover:text-pink-400 transition-colors">
            SIGN UP FREE
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
