"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

const AINotesMaker = () => {
  const [videoUrl, setVideoUrl] = useState("");
  
  const [status, setStatus] = useState("IDLE"); // IDLE, UPLOADING, POLLING, COMPLETED, ERROR
  const [jobId, setJobId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return alert("Please provide a valid network URL.");

    setStatus("UPLOADING");
    
    // 📦 Hardcoded payload for the Ghost Protocol
    const payload = {
      videoUrl: videoUrl,
      targetFormat: "txt", // 👈 This triggers the Bypass Lane in your worker!
      quality: "best",
      webhookUrl: "http://localhost:3000/api/webhook"
    };

    try {
      // 🛣️ Hitting the Combo Route
      const res = await axios.post("http://localhost:5000/download-convert", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setJobId(res.data.jobId);
      setStatus("POLLING");
    } catch (error) {
      console.error("Extraction failed:", error);
      setStatus("ERROR");
    }
  };

  // 📡 THE POLLING RADAR
  useEffect(() => {
    let intervalId;
    if (status === "POLLING" && jobId) {
      intervalId = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:5000/status/${jobId}`);
          if (res.data.status === "COMPLETED") {
            clearInterval(intervalId);
            setDownloadUrl(`http://localhost:5000/${res.data.path}`);
            setStatus("COMPLETED");
          } else if (res.data.status === "FAILED") {
            clearInterval(intervalId);
            setStatus("ERROR");
          }
        } catch (error) {}
      }, 2000); // 👈 Sped up to 2 seconds because text extraction is blazing fast
    }
    return () => clearInterval(intervalId);
  }, [status, jobId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
      
      {/* TOP NAV */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors group">
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Hub
        </Link>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: THE FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">AI Notes Maker</h1>
            <p className="text-neutral-400 text-sm">Deploy the Ghost Protocol. Extract raw video transcripts without downloading the media payload.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-neutral-900/50 border border-white/5 p-6 md:p-8 rounded-2xl">
            
            {/* NETWORK INPUT */}
            <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Source URL Designation <span className="text-purple-500">*</span></label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-neutral-950 border border-white/10 text-white p-4 rounded-lg text-sm focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50 placeholder-neutral-600 w-full font-mono"
                />
              </div>
            </div>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 flex gap-4 items-start">
              <span className="text-purple-400 text-xl">💡</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                <strong className="text-purple-400">Pro-Tip:</strong> The extraction engine will automatically clean the VTT file, remove timestamps, and fix the auto-caption stutter. You will receive a clean `.txt` file ready to be pasted into ChatGPT or Gemini.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "UPLOADING" || status === "POLLING"}
              className="mt-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              {status === "UPLOADING" ? "Connecting..." : status === "POLLING" ? "Extracting Subtitles..." : "Initiate Ghost Extract"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: STATUS TERMINAL */}
        <div className="flex flex-col gap-6">
          <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl h-full min-h-[300px] flex flex-col relative overflow-hidden">
            
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-6 pb-4 border-b border-white/5">
              Terminal Output
            </h3>

            <div className="flex-grow flex flex-col items-center justify-center text-center">
              {status === "IDLE" && (
                <p className="text-neutral-500 text-sm">Awaiting target parameters.</p>
              )}

              {status === "UPLOADING" && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  <p className="text-purple-400 text-sm font-medium">Injecting payload...</p>
                </div>
              )}

              {status === "POLLING" && (
                <div className="flex flex-col items-center gap-4 w-full px-4 animate-in fade-in duration-300">
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-full origin-left animate-[pulse_1s_ease-in-out_infinite]"></div>
                  </div>
                  <p className="text-purple-400 text-sm font-medium font-mono">
                    Scraping Text: <br/><span className="text-xs text-neutral-500">{jobId.slice(0, 12)}...</span>
                  </p>
                </div>
              )}

              {status === "COMPLETED" && (
                <div className="flex flex-col items-center gap-5 animate-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                    <span className="text-green-500 text-xl">✓</span>
                  </div>
                  <p className="text-green-400 text-sm font-semibold tracking-wide">TEXT EXTRACTED</p>
                  <a
                    href={downloadUrl}
                    download
                    className="w-full bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                  >
                    Download Transcript
                  </a>
                </div>
              )}

              {status === "ERROR" && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
                  <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                    <span className="text-red-500 font-bold">!</span>
                  </div>
                  <p className="text-red-400 text-sm font-medium">No subtitles found or extraction failed.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AINotesMaker;