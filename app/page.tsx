"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";

const LOG_LINES = [
  "$ avmg pull https://youtu.be/dQw4w9WgXcQ --mp3",
  "> queued job 7f3a-91c2 ......... OK",
  "> yt-dlp: fetching best audio ... 100%",
  "> ffmpeg: transcode -> mp3 320k . done",
  "> upload: cloud link ready ...... OK",
  "$ avmg notes https://youtu.be/lecture --ai",
  "> subtitles scraped ............. 4,812 words",
  "> gemini: writing study notes ... done",
  "> COMPLETE. grab your files.",
];

const TOOLS = [
  {
    title: "MEDIA CONVERTER",
    blurb: "MP4, MP3, WAV, GIF, JPG. Trim, shrink, watermark.",
    icon: "[///]",
    path: "/converter",
    box: "border-pink-500 text-pink-500 shadow-[8px_8px_0_0_#ff00ff] hover:bg-pink-500",
  },
  {
    title: "VIDEO DOWNLOADER",
    blurb: "Paste a link, pull the video or just the audio.",
    icon: "[\\/]",
    path: "/downloader",
    box: "border-green-500 text-green-500 shadow-[8px_8px_0_0_#39ff14] hover:bg-green-500",
  },
  {
    title: "DOWNLOAD + CONVERT",
    blurb: "Link in, the format you want out. One step.",
    icon: "[><]",
    path: "/forge",
    box: "border-cyan-400 text-cyan-400 shadow-[8px_8px_0_0_#00ffff] hover:bg-cyan-400",
  },
  {
    title: "AI STUDY NOTES",
    blurb: "Any video's subtitles → structured, AI-written notes.",
    icon: "[_X]",
    path: "/notes",
    box: "border-purple-500 text-purple-500 shadow-[8px_8px_0_0_#9333ea] hover:bg-purple-500",
  },
];

const STEPS = [
  {
    n: "01",
    title: "PASTE OR UPLOAD",
    body: "Drop a file or paste a URL. No signup needed to try — guests get a taste on every tool.",
    color: "text-pink-500",
    border: "border-pink-500",
  },
  {
    n: "02",
    title: "THE WORKER COOKS",
    body: "Your job hits the queue. yt-dlp rips, ffmpeg transcodes, Gemini writes. You watch the terminal.",
    color: "text-green-500",
    border: "border-green-500",
  },
  {
    n: "03",
    title: "GRAB YOUR FILE",
    body: "Download the result or copy your notes as markdown. Accounts keep history for 24 hours.",
    color: "text-cyan-400",
    border: "border-cyan-400",
  },
];

const FAQ = [
  {
    q: "Is it really free?",
    a: "Yes. Guests use every tool with small limits (5 MB, 3 jobs/day). A free account bumps you to 100 MB, 20 jobs/day, and unlocks AI Study Notes. No credit card, no paid tier — signing up IS the upgrade.",
  },
  {
    q: "What's the AI Study Notes tool?",
    a: "Paste a video link (or upload an .srt/.vtt/.txt subtitle file) and we turn the transcript into clean, structured markdown notes — TL;DR, key points, sectioned notes with timestamps, and a glossary. Powered by Google Gemini.",
  },
  {
    q: "Do you keep my files?",
    a: "Only briefly. Guest outputs are swept after 1 hour, account outputs after 24 hours. Nothing is kept long-term.",
  },
  {
    q: "Which sites can I download from?",
    a: "Anything yt-dlp supports — YouTube and hundreds of others. Use it responsibly and only for content you have the right to.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= LOG_LINES.length) {
      const reset = setTimeout(() => setVisibleLines(0), 3500);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setVisibleLines((n) => n + 1), 550);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <PageShell selection="pink" maxWidth="7xl">
      {/* ===== HERO ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28 mt-4">
        <div>
          <div className="inline-block border-2 border-yellow-400 text-yellow-400 font-black uppercase tracking-widest text-xs px-3 py-1 mb-6 shadow-[4px_4px_0_0_#ffff00]">
            ● MEDIA TOOLKIT v3.0
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.95] mb-6">
            <span className="drop-shadow-[6px_6px_0_#ff00ff]">DOWNLOAD.</span>
            <br />
            <span className="drop-shadow-[6px_6px_0_#00ffff]">CONVERT.</span>
            <br />
            <span className="drop-shadow-[6px_6px_0_#9333ea]">STUDY.</span>
          </h1>
          <p className="text-white/70 font-bold text-sm md:text-base normal-case tracking-normal max-w-md mb-10 leading-relaxed">
            {"// "}One brutalist toolkit to rip videos, convert any format, and
            turn lectures into AI study notes. No fluff. No dashboards you don&apos;t
            need. Just the tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 max-w-md">
            {user ? (
              <Button color="green" shadow="pink" href="/tools">
                GO TO TOOLS
              </Button>
            ) : (
              <>
                <Button color="pink" shadow="green" href="/signup">
                  START FREE
                </Button>
                <Button color="cyan" shadow="pink" variant="outline" href="/tools">
                  TRY AS GUEST
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Decorative live terminal */}
        <div className="crt-terminal bg-black border-4 border-green-500 p-6 shadow-[12px_12px_0_0_#00ffff] relative overflow-hidden min-h-[360px] flex flex-col">
          <div className="flex justify-between items-center border-b-4 border-green-500/50 pb-4 mb-4 relative z-20">
            <h3 className="text-sm font-black text-green-400 uppercase tracking-widest">
              avmg@worker: ~
            </h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 border border-red-300"></div>
              <div className="w-3 h-3 bg-yellow-500 border border-yellow-300"></div>
              <div className="w-3 h-3 bg-green-500 border border-green-300"></div>
            </div>
          </div>
          <div className="relative z-20 flex flex-col gap-1.5 text-xs md:text-sm font-bold">
            {LOG_LINES.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                className={
                  line.startsWith("$")
                    ? "text-cyan-400"
                    : line.includes("COMPLETE")
                      ? "text-pink-500"
                      : "text-green-500"
                }
              >
                {line}
              </p>
            ))}
            <span className="text-green-500 animate-pulse">_</span>
          </div>
        </div>
      </section>

      {/* ===== TOOLS SHOWCASE ===== */}
      <section className="mb-28">
        <div className="border-l-8 border-cyan-400 pl-4 mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#00ffff] uppercase">
            FOUR TOOLS
          </h2>
          <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase mt-2">
            // EVERYTHING YOU NEED, NOTHING YOU DON&apos;T
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TOOLS.map((tool) => (
            <Link href={tool.path} key={tool.title}>
              <div
                className={`group h-full bg-black border-4 p-7 transition-all duration-200 cursor-pointer flex flex-col ${tool.box} hover:text-black`}
              >
                <div className="flex justify-between items-start mb-5">
                  <span className="text-4xl font-black tracking-tighter group-hover:translate-x-1 transition-transform">
                    {tool.icon}
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 group-hover:text-black">
                    {"->"}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-black">
                  {tool.title}
                </h3>
                <p className="font-bold text-sm opacity-80 group-hover:opacity-100 group-hover:text-black">
                  {tool.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="mb-28">
        <div className="border-l-8 border-pink-500 pl-4 mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#ff00ff] uppercase">
            HOW IT WORKS
          </h2>
          <p className="text-pink-500 font-bold tracking-widest text-sm uppercase mt-2">
            // THREE STEPS, ZERO CEREMONY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className={`crt-terminal bg-black border-4 ${step.border} p-6 relative overflow-hidden`}
            >
              <p className={`text-6xl font-black tracking-tighter mb-4 ${step.color}`}>
                {step.n}
              </p>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3">
                {step.title}
              </h3>
              <p className="text-white/70 font-bold text-sm leading-relaxed normal-case">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TIER COMPARISON ===== */}
      <section className="mb-28">
        <div className="border-l-8 border-green-500 pl-4 mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#39ff14] uppercase">
            PICK YOUR TIER
          </h2>
          <p className="text-green-500 font-bold tracking-widest text-sm uppercase mt-2">
            // SIGNUP IS THE UPGRADE — NO CREDIT CARD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* GUEST */}
          <div className="bg-black border-4 border-white p-8 shadow-[10px_10px_0_0_#ffffff]">
            <p className="text-white font-black uppercase tracking-widest text-2xl mb-1">
              GUEST
            </p>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-6">
              // NO ACCOUNT
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              <TierRow ok>Use every non-AI tool</TierRow>
              <TierRow ok>5 MB max upload</TierRow>
              <TierRow ok>3 jobs per day</TierRow>
              <TierRow no>AI Study Notes locked</TierRow>
              <TierRow no>Files kept 1 hour</TierRow>
            </ul>
            <Button color="white" shadow="cyan" variant="outline" href="/tools">
              TRY WITHOUT SIGNUP
            </Button>
          </div>

          {/* FREE ACCOUNT */}
          <div className="bg-black border-4 border-green-500 p-8 shadow-[10px_10px_0_0_#39ff14] relative">
            <div className="absolute -top-4 left-6 bg-green-500 text-black font-black uppercase tracking-widest text-xs px-3 py-1 border-2 border-green-500">
              RECOMMENDED
            </div>
            <p className="text-green-500 font-black uppercase tracking-widest text-2xl mb-1">
              FREE ACCOUNT
            </p>
            <p className="text-green-500/60 font-bold uppercase tracking-widest text-xs mb-6">
              // FREE FOREVER
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              <TierRow ok>Everything in Guest, plus:</TierRow>
              <TierRow ok>100 MB max upload</TierRow>
              <TierRow ok>20 jobs per day</TierRow>
              <TierRow ok>AI Study Notes — 5 / day</TierRow>
              <TierRow ok>Files kept 24 hours + history</TierRow>
            </ul>
            <Button color="green" shadow="pink" href="/signup">
              CREATE FREE ACCOUNT
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="mb-24">
        <div className="border-l-8 border-purple-500 pl-4 mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#9333ea] uppercase">
            FAQ
          </h2>
          <p className="text-purple-400 font-bold tracking-widest text-sm uppercase mt-2">
            // THE OBVIOUS QUESTIONS
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border-l-4 border-purple-500 bg-purple-500/5 open:bg-purple-500/10 transition-colors"
            >
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between text-white font-black uppercase tracking-wider text-sm md:text-base">
                <span>
                  <span className="text-purple-400 mr-3">{">"}</span>
                  {item.q}
                </span>
                <span className="text-purple-400 group-open:rotate-90 transition-transform">
                  {">>"}
                </span>
              </summary>
              <p className="px-5 pb-5 text-white/70 font-bold text-sm leading-relaxed normal-case">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      {!user && (
        <section className="mb-20 border-4 border-pink-500 bg-black p-10 shadow-[12px_12px_0_0_#ff00ff] text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase drop-shadow-[4px_4px_0_#ff00ff] mb-4">
            READY?
          </h2>
          <p className="text-white/70 font-bold text-sm uppercase tracking-widest mb-8">
            // TWO TOOLS AND A LECTURE AWAY FROM DONE
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-lg mx-auto">
            <Button color="pink" shadow="cyan" href="/signup">
              START FREE
            </Button>
            <Button color="white" shadow="green" variant="outline" href="/tools">
              JUST BROWSE
            </Button>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t-4 border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-neutral-600 font-bold text-xs tracking-widest uppercase">
        <p>AVMG // MEDIA TOOLKIT // USE RESPONSIBLY</p>
        <p>END_OF_LINE.</p>
      </footer>
    </PageShell>
  );
}

function TierRow({ ok, no, children }: { ok?: boolean; no?: boolean; children: React.ReactNode }) {
  const mark = no ? "[x]" : "[+]";
  const color = no ? "text-red-500" : "text-green-500";
  return (
    <li className="flex gap-3 text-white font-bold uppercase tracking-wider text-xs md:text-sm">
      <span className={color}>{mark}</span>
      <span className={no ? "text-white/50 line-through" : ""}>{children}</span>
    </li>
  );
}
