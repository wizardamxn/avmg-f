"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const AppHub = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toISOString());
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  const tools = [
    {
      id: "converter",
      title: "MEDIA_CONVERTER",
      description: "> UPLOAD LOCAL PAYLOADS. TRANSCODE VIDEO TO AUDIO, ANIMATE GIFS, OR CRUSH MEDIA SIZES.",
      icon: "[///]",
      path: "/converter",
      theme: "border-pink-500 text-pink-500 shadow-[8px_8px_0_0_#ff00ff] hover:bg-pink-500 hover:text-black",
      bgHover: "hover:bg-pink-500",
    },
    {
      id: "downloader",
      title: "NET_RIPPER",
      description: "> BYPASS DOMAIN SECURITY. RIP RAW, UNCOMPRESSED VIDEO OR AUDIO FROM TARGET URLS.",
      icon: "[\\/]",
      path: "/downloader",
      theme: "border-green-500 text-green-500 shadow-[8px_8px_0_0_#39ff14] hover:bg-green-500 hover:text-black",
      bgHover: "hover:bg-green-500",
    },
    {
      id: "forge",
      title: "THE_FORGE",
      description: "> SIMULTANEOUS PULL & MUTATE. RIP A STREAM STRAIGHT TO A CLIPPED .MP3 IN ONE MOTION.",
      icon: "[><]",
      path: "/forge",
      theme: "border-cyan-400 text-cyan-400 shadow-[8px_8px_0_0_#00ffff] hover:bg-cyan-400 hover:text-black",
      bgHover: "hover:bg-cyan-400",
    },
    {
      id: "notes",
      title: "GHOST_PROTOCOL",
      description: "> STEALTH SUBTITLE EXTRACTION. SCRAPE VTT DATA FOR AI INGESTION WITHOUT DOWNLOADING MEDIA.",
      icon: "[_X]",
      path: "/notes",
      theme: "border-purple-500 text-purple-500 shadow-[8px_8px_0_0_#9333ea] hover:bg-purple-500 hover:text-black",
      bgHover: "hover:bg-purple-500",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-yellow-400 selection:text-black flex flex-col items-center">
      
      {/* SYSTEM TICKER */}
      <div className="w-full max-w-6xl border-4 border-yellow-400 bg-black text-yellow-400 font-bold p-2 mb-12 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase shadow-[4px_4px_0_0_#ffff00]">
        <div className="flex gap-4">
          <span className="animate-pulse text-red-500">● REC</span>
          <span>SYS.VER: 3.0.0</span>
          <span className="hidden sm:inline">| SECURE_CONNECTION: TRUE</span>
        </div>
        <div>
          <span>{time || "SYNCING_CLOCK..."}</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="max-w-6xl w-full mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b-8 border-white pb-12">
        <div className="border-l-8 border-white pl-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-white drop-shadow-[8px_8px_0_#ff00ff] uppercase mb-2">
            AVMG!
          </h1>
          <p className="text-cyan-400 font-bold tracking-widest text-sm md:text-lg uppercase">
            // A_Virgen_Mui_Groriosa
          </p>
        </div>
        
        {/* TELEMETRY LINK */}
        <Link href="/dashboard" className="group">
          <div className="bg-black border-4 border-white p-4 shadow-[6px_6px_0_0_#ffffff] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0_0_#ffffff] transition-all cursor-pointer">
            <p className="text-white font-black uppercase tracking-widest text-sm group-hover:animate-pulse">
              [ ACCESS_TELEMETRY ]
            </p>
          </div>
        </Link>
      </div>

      {/* TOOLS GRID */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {tools.map((tool) => (
          <Link href={tool.path} key={tool.id}>
            <div className={`group relative h-full bg-black border-4 p-8 transition-all duration-200 cursor-pointer flex flex-col ${tool.theme}`}>
              
              {/* CORNER ACCENTS */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white translate-x-1 translate-y-1"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-5xl font-black tracking-tighter group-hover:translate-x-1 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-xs font-black tracking-widest uppercase border-2 px-2 py-1 opacity-50 group-hover:opacity-100 group-hover:border-black transition-all">
                    MOD_{tool.id.substring(0,3).toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight group-hover:text-black">
                  {tool.title}
                </h2>
                
                <p className="font-bold text-sm leading-relaxed mb-8 flex-grow opacity-80 group-hover:opacity-100 group-hover:text-black">
                  {tool.description}
                </p>
                
                <div className="mt-auto flex items-center text-sm font-black uppercase tracking-widest group-hover:text-black">
                  [ INITIATE_BOOT_SEQ ] 
                  <span className="ml-3 transform group-hover:translate-x-2 transition-transform">
                    &gt;&gt;
                  </span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
      
      {/* FOOTER DECORATION */}
      <div className="max-w-6xl w-full mx-auto mt-20 border-t-4 border-neutral-800 pt-8 flex justify-between items-center text-neutral-600 font-bold text-xs tracking-widest uppercase">
        <p>AVMG // ILLEGAL_TECH // NO_WARRANTY</p>
        <p>END_OF_LINE.</p>
      </div>

    </div>
  );
};

export default AppHub;