"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

const TheForge = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("best");

  const [status, setStatus] = useState("IDLE");
  const [jobId, setJobId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return alert("ERR: MISSING NETWORK COORDINATES.");

    setStatus("UPLOADING");

    const payload = {
      videoUrl: videoUrl,
      targetFormat: format,
      quality: quality,
      webhookUrl: "http://localhost:3000/api/webhook",
    };

    try {
      const res = await axios.post(`${apiUrl}/download-convert`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setJobId(res.data.jobId);
      setStatus("POLLING");
    } catch (error) {
      console.error("Forge failed:", error);
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
            setDownloadUrl(`${res.data.path}?download=`);
            setStatus("COMPLETED");
          } else if (res.data.status === "FAILED") {
            clearInterval(intervalId);
            setStatus("ERROR");
          }
        } catch (error) {}
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [status, jobId]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-cyan-400 selection:text-black">
      {/* TOP NAV */}
      <div className="max-w-5xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-block text-xl font-bold text-pink-500 hover:text-black hover:bg-pink-500 transition-colors uppercase tracking-widest border-2 border-pink-500 px-4 py-2 shadow-[4px_4px_0_0_#00ffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#00ffff]"
        >
          &lt;&lt; SYS.HUB_RETURN
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: THE HARDWARE FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-pink-500 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#ff00ff] uppercase mb-2">
              THE_FORGE
            </h1>
            <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase">
              // Heavy Payload Mutation Engine
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-pink-500 p-6 md:p-8 shadow-[10px_10px_0_0_#00ffff] relative"
          >
            {/* NETWORK INPUT */}
            <div className="flex flex-col gap-6 border-b-4 border-pink-500/50 pb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                  [NETWORK_URL_DESIGNATION]{" "}
                  <span className="text-pink-500 animate-pulse">*</span>
                </label>
                <input
                  type="url"
                  placeholder="HTTPS://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-cyan-400 text-cyan-400 font-bold p-4 focus:outline-none focus:border-pink-500 focus:text-pink-500 transition-colors disabled:opacity-50 placeholder-cyan-900 rounded-none w-full"
                />
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-yellow-400 uppercase tracking-widest">
                  [MUTATION_VECTOR]
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-yellow-400 text-yellow-400 font-bold p-3 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 cursor-pointer rounded-none appearance-none"
                >
                  <option value="mp3">.MP3 (AUDIO_EXTRACT)</option>
                  <option value="wav">.WAV (LOSSLESS_AUDIO)</option>
                  <option value="mp4">.MP4 (VIDEO_CONTAINER)</option>
                  <option value="gif">.GIF (ANIMATION_LOOP)</option>
                  <option value="jpg">.JPG (THUMBNAIL_SNAP)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-green-400 uppercase tracking-widest">
                  [EXTRACTION_QUALITY]
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-green-500 text-green-400 font-bold p-3 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 cursor-pointer rounded-none appearance-none"
                >
                  <option value="best">MAXIMUM_OVERDRIVE</option>
                  <option value="good">STANDARD_OPTIMIZED</option>
                  <option value="draft">COMPRESSED_DRAFT</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "UPLOADING" || status === "POLLING"}
              className="mt-6 w-full bg-cyan-400 text-black font-black text-xl tracking-[0.3em] uppercase py-5 border-4 border-cyan-400 shadow-[8px_8px_0_0_#ff00ff] hover:bg-cyan-300 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#ff00ff] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "UPLOADING"
                ? "TRANSMITTING..."
                : status === "POLLING"
                  ? "FORGE_IS_BURNING..."
                  : "IGNITE_PROTOCOL"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: STATUS TERMINAL */}
        <div className="flex flex-col gap-6">
          <div className="crt-terminal bg-black border-4 border-purple-500 p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden shadow-[8px_8px_0_0_#00ffff]">
            <div className="flex justify-between items-center border-b-4 border-purple-500/50 pb-4 mb-6 relative z-20">
              <h3 className="text-lg font-black text-purple-400 uppercase tracking-widest">
                Term_Out
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-cyan-400 border border-cyan-200"></div>
                <div className="w-3 h-3 bg-pink-500 border border-pink-300"></div>
                <div className="w-3 h-3 bg-purple-500 border border-purple-300"></div>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-start justify-center text-left relative z-20 w-full">
              {status === "IDLE" && (
                <div className="text-purple-400 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> FORGE_IDLE`}</p>
                  <p className="animate-pulse">{`> AWAITING.COORDINATES_`}</p>
                </div>
              )}

              {status === "UPLOADING" && (
                <div className="text-cyan-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> LOCKING_ON_TARGET...`}</p>
                  <p className="mb-4 text-xs">{`> ESTABLISHING_COM_LINK...`}</p>
                  <div className="w-full h-4 border-2 border-cyan-400 p-0.5">
                    <div className="h-full bg-cyan-400 w-1/2 animate-pulse"></div>
                  </div>
                </div>
              )}

              {status === "POLLING" && (
                <div className="text-pink-500 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> FORGE_IGNITED.`}</p>
                  <p className="mb-4 text-xs">{`> MUTATING_PAYLOAD: ${jobId.slice(0, 8)}`}</p>
                  <div className="w-full h-8 flex gap-2">
                    <div className="h-full w-full bg-pink-500 animate-[pulse_0.5s_infinite]"></div>
                    <div className="h-full w-full bg-red-500 animate-[pulse_0.7s_infinite]"></div>
                    <div className="h-full w-full bg-orange-500 animate-[pulse_0.9s_infinite]"></div>
                  </div>
                </div>
              )}

              {status === "COMPLETED" && (
                <div className="text-cyan-400 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#ff00ff]">{`> MUTATION_SUCCESS.`}</p>
                  <p className="mb-8 text-white">{`> PAYLOAD_READY_FOR_EXTRACT.`}</p>
                  <a
                    href={downloadUrl}
                    download
                    className="block w-full text-center bg-pink-500 text-black font-black py-4 border-4 border-pink-500 hover:bg-black hover:text-pink-500 transition-colors shadow-[4px_4px_0_0_#00ffff]"
                  >
                    [ EXTRACT_MUTATION ]
                  </a>
                </div>
              )}

              {status === "ERROR" && (
                <div className="text-red-500 font-black uppercase tracking-widest w-full">
                  <p className="text-2xl mb-2 animate-pulse">{`> FORGE_COLLAPSE`}</p>
                  <p className="text-white bg-red-500 p-2 inline-block">{`> MUTATION_FAILED.`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheForge;
