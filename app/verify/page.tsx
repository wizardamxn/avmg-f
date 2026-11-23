"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import api, { apiError } from "@/lib/api";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

const RESEND_SECONDS = 60;

// useSearchParams needs a Suspense boundary so the rest of the page can prerender.
export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}

function VerifyForm() {
  const { verifyEmail } = useAuth();
  const router = useRouter();

  const email = useSearchParams().get("email") ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState(email ? "" : "Missing email. Sign up or log in again.");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS); // a code was just sent

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await verifyEmail(email, code);
      router.push("/tools");
    } catch (err) {
      setError(apiError(err, "That code didn't work. Try again."));
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    try {
      await api.post("/auth/resend-code", { email });
      setNotice("New code sent. Check your inbox.");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(apiError(err, "Couldn't send a new code."));
    }
  };

  return (
    <PageShell selection="green" maxWidth="5xl">
      <div className="max-w-md mx-auto mt-6">
        <div className="border-l-8 border-green-500 pl-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#39ff14] uppercase mb-2">
            VERIFY EMAIL
          </h1>
          <p className="text-green-500 font-bold tracking-widest text-sm uppercase break-all">
            {"> CODE SENT TO "}
            {email || "YOUR INBOX"}
          </p>
        </div>

        <TerminalPanel title="ONE-TIME CODE" color="green" shadow="pink" shadowSize={10}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <Field label="6-DIGIT CODE" labelColor="green" required>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={busy}
                required
                color="green"
                focus="pink"
                className="text-3xl tracking-[0.5em] text-center"
              />
            </Field>

            {error && (
              <p
                role="alert"
                className="text-red-500 font-bold uppercase tracking-wider text-xs border-l-4 border-red-500 bg-red-500/10 p-3"
              >
                {"> "}
                {error}
              </p>
            )}
            {notice && (
              <p
                aria-live="polite"
                className="text-green-500 font-bold uppercase tracking-wider text-xs border-l-4 border-green-500 bg-green-500/10 p-3"
              >
                {"> "}
                {notice}
              </p>
            )}

            <Button type="submit" color="green" shadow="pink" disabled={busy || code.length !== 6 || !email}>
              {busy ? "VERIFYING..." : "VERIFY"}
            </Button>
          </form>
        </TerminalPanel>

        <p className="text-center text-neutral-500 font-bold uppercase tracking-widest text-xs mt-8">
          {"// NO CODE? "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || !email}
            className="uppercase font-bold tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-neutral-600 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `RESEND IN ${cooldown}S` : "SEND A NEW ONE"}
          </button>
          {" // "}
          <Link href="/signup" className="text-pink-500 hover:text-pink-400 transition-colors">
            WRONG EMAIL?
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
