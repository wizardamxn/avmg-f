"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

const UniversalDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("best");

  const [status, setStatus] = useState("IDLE");
  const [jobId, setJobId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return alert("ERR: NO TARGET COORDINATES PROVIDED.");

    setStatus("UPLOADING");

    const payload = {
      videoUrl: videoUrl,
      quality: quality,
      webhookUrl: "http://localhost:3000/api/webhook",
    };

    try {
      const res = await axios.post(`${apiUrl}/download`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setJobId(res.data.jobId);
      setStatus("POLLING");
    } catch (error) {
      console.error("Download failed:", error);
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
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-yellow-400 selection:text-black">
      {/* TOP NAV */}
      <div className="max-w-5xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-block text-xl font-bold text-yellow-400 hover:text-black hover:bg-yellow-400 transition-colors uppercase tracking-widest border-2 border-yellow-400 px-4 py-2 shadow-[4px_4px_0_0_#39ff14] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#39ff14]"
        >
          &lt;&lt; SYS.HUB_RETURN
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: THE HARDWARE FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-yellow-400 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#39ff14] uppercase mb-2">
              AVMG_NET_RIPPER
            </h1>
            <p className="text-yellow-400 font-bold tracking-widest text-sm uppercase">
              // Universal Network Extraction Node
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-green-500 p-6 md:p-8 shadow-[10px_10px_0_0_#ffff00] relative"
          >
            {/* NETWORK INPUT */}
            <div className="flex flex-col gap-6 border-b-4 border-green-500/50 pb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-green-400 uppercase tracking-widest">
                  [TARGET_URL_COORDINATES]{" "}
                  <span className="text-yellow-400 animate-pulse">*</span>
                </label>
                <input
                  type="url"
                  placeholder="HTTPS://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-green-500 text-green-400 font-bold p-4 focus:outline-none focus:border-yellow-400 focus:text-yellow-400 transition-colors disabled:opacity-50 placeholder-green-900 rounded-none w-full"
                />
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                  [EXTRACTION_QUALITY]
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-cyan-400 text-cyan-400 font-bold p-3 focus:outline-none focus:border-yellow-400 focus:text-yellow-400 transition-colors disabled:opacity-50 cursor-pointer rounded-none appearance-none"
                >
                  <option value="best">MAXIMUM_FIDELITY</option>
                  <option value="good">STANDARD_BANDWIDTH</option>
                  <option value="draft">COMPRESSED_DATA</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "UPLOADING" || status === "POLLING"}
              className="mt-6 w-full bg-green-500 text-black font-black text-xl tracking-[0.3em] uppercase py-5 border-4 border-green-500 shadow-[8px_8px_0_0_#ffff00] hover:bg-green-400 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#ffff00] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "UPLOADING"
                ? "CONNECTING..."
                : status === "POLLING"
                  ? "RIPPING_DATA..."
                  : "INITIATE_PULL"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: STATUS TERMINAL */}
        <div className="flex flex-col gap-6">
          <div className="crt-terminal bg-black border-4 border-orange-500 p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden shadow-[8px_8px_0_0_#ff00ff]">
            <div className="flex justify-between items-center border-b-4 border-orange-500/50 pb-4 mb-6 relative z-20">
              <h3 className="text-lg font-black text-orange-400 uppercase tracking-widest">
                Term_Out
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-orange-500 border border-orange-300"></div>
                <div className="w-3 h-3 bg-orange-500 border border-orange-300"></div>
                <div className="w-3 h-3 bg-orange-500 border border-orange-300"></div>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-start justify-center text-left relative z-20 w-full">
              {status === "IDLE" && (
                <div className="text-orange-400 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> SYSTEM.READY`}</p>
                  <p className="animate-pulse">{`> AWAITING.URL_TARGET_`}</p>
                </div>
              )}

              {status === "UPLOADING" && (
                <div className="text-yellow-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> INITIATING_HANDSHAKE...`}</p>
                  <p className="mb-4 text-xs">{`> BYPASSING_SECURITY_PROTOCOLS...`}</p>
                  <div className="w-full h-4 border-2 border-yellow-400 p-0.5">
                    <div className="h-full bg-yellow-400 w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              {status === "POLLING" && (
                <div className="text-green-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> FIREWALL_BREACHED.`}</p>
                  <p className="mb-4">{`> EXTRACTING_PAYLOAD: ${jobId.slice(0, 8)}`}</p>
                  <div className="w-full h-6 flex gap-1">
                    <div className="h-full w-4 bg-green-400 animate-[ping_1s_infinite]"></div>
                    <div className="h-full w-4 bg-green-400 animate-[ping_1.2s_infinite]"></div>
                    <div className="h-full w-4 bg-green-400 animate-[ping_1.4s_infinite]"></div>
                  </div>
                </div>
              )}

              {status === "COMPLETED" && (
                <div className="text-cyan-400 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#00ffff]">{`> SECURE_PULL_COMPLETE.`}</p>
                  <p className="mb-8 text-white">{`> DATA HAS BEEN CLONED.`}</p>
                  <a
                    href={downloadUrl}
                    download
                    className="block w-full text-center bg-orange-500 text-black font-black py-4 border-4 border-orange-500 hover:bg-black hover:text-orange-500 transition-colors shadow-[4px_4px_0_0_#ffff00]"
                  >
                    [ DOWNLOAD_RAW_DATA ]
                  </a>
                </div>
              )}

              {status === "ERROR" && (
                <div className="text-red-500 font-black uppercase tracking-widest w-full">
                  <p className="text-2xl mb-2 animate-pulse">{`> FATAL_ERR`}</p>
                  <p className="text-white bg-red-500 p-2 inline-block">{`> CONNECTION_SEVERED.`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalDownloader;
