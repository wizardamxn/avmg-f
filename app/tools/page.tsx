"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import PageShell from "@/components/ui/PageShell";

type Tool = {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  theme: string;
  account?: boolean;
};

const tools: Tool[] = [
  {
    id: "converter",
    title: "MEDIA CONVERTER",
    description:
      "> Upload a file from your device and turn it into MP3, MP4, GIF, WAV, or an image. You can also trim it, shrink the size, or add a watermark.",
    icon: "[///]",
    path: "/converter",
    theme:
      "border-pink-500 text-pink-500 shadow-[8px_8px_0_0_#ff00ff] hover:bg-pink-500 hover:text-black",
  },
  {
    id: "downloader",
    title: "VIDEO DOWNLOADER",
    description:
      "> Paste a link from YouTube or another site and download the video or audio to your device.",
    icon: "[\\/]",
    path: "/downloader",
    theme:
      "border-green-500 text-green-500 shadow-[8px_8px_0_0_#39ff14] hover:bg-green-500 hover:text-black",
  },
  {
    id: "forge",
    title: "DOWNLOAD + CONVERT",
    description:
      "> Paste a link and get it back in the format you want in one step — for example, a YouTube link straight to an MP3.",
    icon: "[><]",
    path: "/forge",
    theme:
      "border-cyan-400 text-cyan-400 shadow-[8px_8px_0_0_#00ffff] hover:bg-cyan-400 hover:text-black",
  },
  {
    id: "notes",
    title: "AI STUDY NOTES",
    description:
      "> Paste a link or drop a subtitle file and get structured, AI-written study notes — TL;DR, key points, sections, and a glossary.",
    icon: "[_X]",
    path: "/notes",
    theme:
      "border-purple-500 text-purple-500 shadow-[8px_8px_0_0_#9333ea] hover:bg-purple-500 hover:text-black",
    account: true,
  },
];

export default function ToolsHub() {
  const { user } = useAuth();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toISOString());
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <PageShell selection="yellow" maxWidth="6xl">
      {/* SYSTEM TICKER */}
      <div className="w-full border-4 border-yellow-400 bg-black text-yellow-400 font-bold p-2 mb-12 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase shadow-[4px_4px_0_0_#ffff00]">
        <div className="flex gap-4">
          <span className="animate-pulse text-red-500">● REC</span>
          <span>SYS.VER: 3.0.0</span>
          <span className="hidden sm:inline">
            | {user ? `USER: ${user.email}` : "MODE: GUEST"}
          </span>
        </div>
        <div>
          <span>{time || "SYNCING_CLOCK..."}</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="w-full mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b-8 border-white pb-12">
        <div className="border-l-8 border-white pl-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white drop-shadow-[8px_8px_0_#ff00ff] uppercase mb-2">
            THE TOOLS
          </h1>
          <p className="text-cyan-400 font-bold tracking-widest text-sm md:text-lg uppercase">
            // PICK YOUR WEAPON
          </p>
          <p className="text-white/70 font-bold text-xs md:text-sm mt-3 normal-case tracking-normal">
            Download, convert, and turn videos into notes — all in one place.
            {!user && " Signed out: 5 MB / 3 jobs a day."}
          </p>
        </div>

        <Link href="/dashboard" className="group">
          <div className="bg-black border-4 border-white p-4 shadow-[6px_6px_0_0_#ffffff] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0_0_#ffffff] transition-all cursor-pointer">
            <p className="text-white font-black uppercase tracking-widest text-sm group-hover:animate-pulse">
              [ VIEW HISTORY ]
            </p>
          </div>
        </Link>
      </div>

      {/* TOOLS GRID */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {tools.map((tool) => (
          <Link href={tool.path} key={tool.id}>
            <div
              className={`group relative h-full bg-black border-4 p-8 transition-all duration-200 cursor-pointer flex flex-col ${tool.theme}`}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white translate-x-1 translate-y-1"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-5xl font-black tracking-tighter group-hover:translate-x-1 transition-transform">
                    {tool.icon}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-black tracking-widest uppercase border-2 px-2 py-1 opacity-50 group-hover:opacity-100 group-hover:border-black transition-all">
                      MOD_{tool.id.substring(0, 3).toUpperCase()}
                    </span>
                    {tool.account && (
                      <span className="text-[10px] font-black tracking-widest uppercase bg-purple-500 text-white border-2 border-purple-500 px-2 py-0.5 group-hover:bg-black group-hover:text-purple-500 transition-all">
                        {user ? "UNLOCKED" : "ACCOUNT"}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight group-hover:text-black">
                  {tool.title}
                </h2>

                <p className="font-bold text-sm leading-relaxed mb-8 flex-grow opacity-80 group-hover:opacity-100 group-hover:text-black">
                  {tool.description}
                </p>

                <div className="mt-auto flex items-center text-sm font-black uppercase tracking-widest group-hover:text-black">
                  [ OPEN TOOL ]
                  <span className="ml-3 transform group-hover:translate-x-2 transition-transform">
                    &gt;&gt;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full mt-20 border-t-4 border-neutral-800 pt-8 flex justify-between items-center text-neutral-600 font-bold text-xs tracking-widest uppercase">
        <p>AVMG // MEDIA TOOLKIT // USE RESPONSIBLY</p>
        <p>END_OF_LINE.</p>
      </div>
    </PageShell>
  );
}
