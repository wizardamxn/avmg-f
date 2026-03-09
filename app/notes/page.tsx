"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

const AINotesMaker = () => {
  const [videoUrl, setVideoUrl] = useState("");

  const [status, setStatus] = useState("IDLE");
  const [jobId, setJobId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return alert("ERR: MISSING TARGET URL.");

    setStatus("UPLOADING");

    const payload = {
      videoUrl: videoUrl,
      targetFormat: "txt",
      quality: "best",
      webhookUrl: "http://localhost:3000/api/webhook",
    };

    try {
      const res = await axios.post(`${apiUrl}/download-convert`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setJobId(res.data.jobId);
      setStatus("POLLING");
    } catch (error) {
      console.error("Extraction failed:", error);
      setStatus("ERROR");
    }
  };

  useEffect(() => {
    let intervalId;
    if (status === "POLLING" && jobId) {
      intervalId = setInterval(async () => {
        try {
          const res = await axios.get(`${apiUrl}/status/${jobId}`);
          if (res.data.status === "COMPLETED") {
            clearInterval(intervalId);
            setDownloadUrl(
              `${res.data.path}?download=`,
            );
            setStatus("COMPLETED");
          } else if (res.data.status === "FAILED") {
            clearInterval(intervalId);
            setStatus("ERROR");
          }
        } catch (error) {}
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [status, jobId]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-purple-500 selection:text-black">
      {/* TOP NAV */}
      <div className="max-w-5xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-block text-xl font-bold text-purple-400 hover:text-black hover:bg-purple-400 transition-colors uppercase tracking-widest border-2 border-purple-500 px-4 py-2 shadow-[4px_4px_0_0_#00ffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#00ffff]"
        >
          &lt;&lt; SYS.HUB_RETURN
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: THE HARDWARE FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-purple-500 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#9333ea] uppercase mb-2">
              AVMG_GHOST_PROTOCOL
            </h1>
            <p className="text-purple-400 font-bold tracking-widest text-sm uppercase">
              // Silent Subtitle Extraction Node
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-purple-500 p-6 md:p-8 shadow-[10px_10px_0_0_#00ffff] relative"
          >
            {/* NETWORK INPUT */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                  [TARGET_URL_COORDINATES]{" "}
                  <span className="text-purple-500 animate-pulse">*</span>
                </label>
                <input
                  type="url"
                  placeholder="HTTPS://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-cyan-400 text-cyan-400 font-bold p-4 focus:outline-none focus:border-purple-500 focus:text-purple-400 transition-colors disabled:opacity-50 placeholder-cyan-900 rounded-none w-full"
                />
              </div>
            </div>

            <div className="border-l-4 border-green-500 bg-green-500/10 p-4 flex flex-col gap-2">
              <span className="text-green-500 font-black tracking-widest uppercase text-sm">
                &gt; SYS.INFO_OVERRIDE:
              </span>
              <p className="text-xs font-bold text-green-400 uppercase leading-relaxed tracking-wider">
                The extraction engine will bypass media payloads and scrape
                hidden VTT data directly. Timestamps and stutter will be purged.
                Output is raw .TXT formatted for AI ingestion.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "UPLOADING" || status === "POLLING"}
              className="mt-2 w-full bg-purple-600 text-white font-black text-xl tracking-[0.3em] uppercase py-5 border-4 border-purple-600 shadow-[8px_8px_0_0_#00ffff] hover:bg-purple-500 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#00ffff] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "UPLOADING"
                ? "INJECTING_PAYLOAD..."
                : status === "POLLING"
                  ? "SCRAPING_TEXT..."
                  : "EXECUTE_GHOST_RUN"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: STATUS TERMINAL */}
        <div className="flex flex-col gap-6">
          <div className="crt-terminal bg-black border-4 border-cyan-400 p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden shadow-[8px_8px_0_0_#9333ea]">
            <div className="flex justify-between items-center border-b-4 border-cyan-400/50 pb-4 mb-6 relative z-20">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest">
                Term_Out
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-purple-500 border border-purple-300"></div>
                <div className="w-3 h-3 bg-green-500 border border-green-300"></div>
                <div className="w-3 h-3 bg-cyan-400 border border-cyan-200"></div>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-start justify-center text-left relative z-20 w-full">
              {status === "IDLE" && (
                <div className="text-cyan-400 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> GHOST_NODE.READY`}</p>
                  <p className="animate-pulse">{`> AWAITING.URL_`}</p>
                </div>
              )}

              {status === "UPLOADING" && (
                <div className="text-purple-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> INITIATING_STEALTH_LINK...`}</p>
                  <p className="mb-4 text-xs">{`> BYPASSING_MEDIA_DOWNLOAD...`}</p>
                  <div className="w-full h-4 border-2 border-purple-400 p-0.5">
                    <div className="h-full bg-purple-500 w-1/4 animate-pulse"></div>
                  </div>
                </div>
              )}

              {status === "POLLING" && (
                <div className="text-green-500 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> VTT_LOCATED.`}</p>
                  <p className="mb-4 text-xs">{`> SCRAPING_TEXT: ${jobId.slice(0, 8)}`}</p>
                  <div className="w-full h-8 flex gap-2">
                    <div className="h-full w-full bg-green-500 animate-[pulse_0.4s_infinite]"></div>
                    <div className="h-full w-full bg-cyan-400 animate-[pulse_0.6s_infinite]"></div>
                    <div className="h-full w-full bg-purple-500 animate-[pulse_0.8s_infinite]"></div>
                  </div>
                </div>
              )}

              {status === "COMPLETED" && (
                <div className="text-purple-400 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#00ffff]">{`> HEIST_SUCCESS.`}</p>
                  <p className="mb-8 text-white">{`> RAW_TEXT_PURGED_AND_CLEANED.`}</p>
                  <a
                    href={downloadUrl}
                    download
                    className="block w-full text-center bg-cyan-400 text-black font-black py-4 border-4 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-colors shadow-[4px_4px_0_0_#9333ea]"
                  >
                    [ DOWNLOAD_TXT ]
                  </a>
                </div>
              )}

              {status === "ERROR" && (
                <div className="text-red-500 font-black uppercase tracking-widest w-full">
                  <p className="text-2xl mb-2 animate-pulse">{`> HEIST_FAILED`}</p>
                  <p className="text-white bg-red-500 p-2 inline-block">{`> NO_SUBTITLES_DETECTED.`}</p>
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
