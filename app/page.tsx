"use client";
import Link from "next/link";

const AppHub = () => {
  const tools = [
    {
      id: "converter",
      title: "Media Converter",
      description: "Upload local files. Transcode video to audio, create GIFs, or compress media sizes.",
      icon: "💽",
      path: "/converter",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "downloader",
      title: "Universal Downloader",
      description: "Paste any link (YouTube, IG, TikTok). Rip the highest quality raw video or audio.",
      icon: "📥",
      path: "/downloader",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "forge",
      title: "The Forge",
      description: "Download and mutate simultaneously. Rip a YouTube URL straight to a clipped MP3.",
      icon: "⚒️",
      path: "/forge",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "notes",
      title: "AI Notes Maker",
      description: "Extract hidden transcripts from videos and generate AI study notes instantly.",
      icon: "🧠",
      path: "/notes",
      color: "from-purple-500 to-violet-500",
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-24 font-sans">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Media<span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600">Forge</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl">
          A suite of distributed neural extraction tools. Select a module to initiate processing.
        </p>
      </div>

      {/* TOOLS GRID */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link href={tool.path} key={tool.id}>
            <div className="group relative h-full bg-neutral-900/50 border border-white/5 rounded-2xl p-8 hover:bg-neutral-900 transition-all duration-300 overflow-hidden cursor-pointer">
              
              {/* Background Glow Effect on Hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-2xl`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-4xl mb-6 bg-white/5 w-16 h-16 flex items-center justify-center rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3 text-neutral-100 group-hover:text-white transition-colors">
                  {tool.title}
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 flex-grow">
                  {tool.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-semibold text-neutral-400 group-hover:text-white transition-colors">
                  Launch Module 
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppHub;