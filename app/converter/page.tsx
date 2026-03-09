"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

const MediaConverter = () => {
  const [file, setFile] = useState(null);
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("best");

  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  const [status, setStatus] = useState("IDLE");
  const [jobId, setJobId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleWatermarkChange = (e) => setWatermarkFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("ERR: NO PAYLOAD DETECTED.");

    setStatus("UPLOADING");

    const formData = new FormData();
    formData.append("videoFile", file);
    if (watermarkFile) formData.append("watermarkFile", watermarkFile);
    formData.append("targetFormat", format);
    formData.append("quality", quality);
    formData.append("webhookUrl", "http://localhost:3000/api/webhook");
    if (startTime) formData.append("startTime", startTime);
    if (duration) formData.append("duration", duration);

    try {
      const res = await axios.post(`${apiUrl}/convert`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJobId(res.data.jobId);
      setStatus("POLLING");
    } catch (error) {
      console.error("Transmission failed:", error);
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
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-pink-500 selection:text-black">
      {/* TOP NAV */}
      <div className="max-w-5xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-block text-xl font-bold text-cyan-400 hover:text-black hover:bg-cyan-400 transition-colors uppercase tracking-widest border-2 border-cyan-400 px-4 py-2 shadow-[4px_4px_0_0_#ff00ff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#ff00ff]"
        >
          &lt;&lt; SYS.HUB_RETURN
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: THE HARDWARE FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-pink-500 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#00ffff] uppercase mb-2">
              AVMG_Media_Converter
            </h1>
            <p className="text-pink-400 font-bold tracking-widest text-sm uppercase">
              // Local Transcode Engine v3.0
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-cyan-400 p-6 md:p-8 shadow-[10px_10px_0_0_#ff00ff] relative"
          >
            {/* FILE INPUTS */}
            <div className="flex flex-col gap-6 border-b-4 border-cyan-400/50 pb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                  [INPUT_PAYLOAD]{" "}
                  <span className="text-pink-500 animate-pulse">*</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-4 file:border-0 file:border-r-4 file:border-cyan-400 file:text-sm file:font-black file:uppercase file:bg-cyan-400 file:text-black hover:file:bg-cyan-300 file:cursor-pointer border-2 border-cyan-400 bg-black focus:outline-none focus:border-pink-500 disabled:opacity-50 transition-colors cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-yellow-400 uppercase tracking-widest">
                  [WATERMARK_OVERLAY_PNG]
                </label>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleWatermarkChange}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-4 file:border-0 file:border-r-4 file:border-yellow-400 file:text-sm file:font-black file:uppercase file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 file:cursor-pointer border-2 border-yellow-400 bg-black focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
                />
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-4 border-cyan-400/50 pb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-pink-500 uppercase tracking-widest">
                  Target_Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-pink-500 text-pink-400 font-bold p-3 focus:outline-none focus:border-cyan-400 focus:text-cyan-400 transition-colors disabled:opacity-50 cursor-pointer rounded-none appearance-none"
                >
                  <option value="mp3">.MP3 (AUDIO)</option>
                  <option value="wav">.WAV (LOSSLESS)</option>
                  <option value="mp4">.MP4 (VIDEO)</option>
                  <option value="gif">.GIF (ANIMATION)</option>
                  <option value="jpg">.JPG (FRAME)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-green-400 uppercase tracking-widest">
                  Compression
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-green-500 text-green-400 font-bold p-3 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50 cursor-pointer rounded-none appearance-none"
                >
                  <option value="best">MAX_HD</option>
                  <option value="good">MID_720P</option>
                  <option value="draft">LOW_480P</option>
                </select>
              </div>
            </div>

            {/* TIMELINE GRID */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-purple-400 uppercase tracking-widest">
                  Start_Time
                </label>
                <input
                  type="text"
                  placeholder="00:00:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-purple-500 text-purple-400 font-bold p-3 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50 placeholder-purple-800 rounded-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-purple-400 uppercase tracking-widest">
                  Duration (S)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-black border-4 border-purple-500 text-purple-400 font-bold p-3 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50 placeholder-purple-800 rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "UPLOADING" || status === "POLLING"}
              className="mt-6 w-full bg-pink-500 text-black font-black text-xl tracking-[0.3em] uppercase py-5 border-4 border-pink-500 shadow-[8px_8px_0_0_#39ff14] hover:bg-pink-400 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#39ff14] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "UPLOADING"
                ? "TRANSMITTING..."
                : status === "POLLING"
                  ? "ENGINE_ACTIVE..."
                  : "EXECUTE_JOB"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: STATUS TERMINAL */}
        <div className="flex flex-col gap-6">
          <div className="crt-terminal bg-black border-4 border-green-500 p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden shadow-[8px_8px_0_0_#00ffff]">
            <div className="flex justify-between items-center border-b-4 border-green-500/50 pb-4 mb-6 relative z-20">
              <h3 className="text-lg font-black text-green-400 uppercase tracking-widest">
                Term_Out
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 border border-red-300"></div>
                <div className="w-3 h-3 bg-yellow-500 border border-yellow-300"></div>
                <div className="w-3 h-3 bg-green-500 border border-green-300"></div>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-start justify-center text-left relative z-20 w-full">
              {status === "IDLE" && (
                <div className="text-green-500 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> SYSTEM.READY`}</p>
                  <p className="animate-pulse">{`> AWAITING.PAYLOAD_`}</p>
                </div>
              )}

              {status === "UPLOADING" && (
                <div className="text-cyan-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> INITIALIZING_TRANSFER...`}</p>
                  <div className="w-full h-4 border-2 border-cyan-400 p-0.5">
                    <div className="h-full bg-cyan-400 w-1/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              {status === "POLLING" && (
                <div className="text-yellow-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> ENGINE_LOCKED.`}</p>
                  <p className="mb-4">{`> TRACKING_JOB: ${jobId.slice(0, 8)}`}</p>
                  <div className="w-full h-6 flex gap-1">
                    <div className="h-full w-4 bg-yellow-400 animate-[ping_1s_infinite]"></div>
                    <div className="h-full w-4 bg-yellow-400 animate-[ping_1.2s_infinite]"></div>
                    <div className="h-full w-4 bg-yellow-400 animate-[ping_1.4s_infinite]"></div>
                  </div>
                </div>
              )}

              {status === "COMPLETED" && (
                <div className="text-pink-500 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#00ffff]">{`> JOB_SUCCESS.`}</p>
                  <p className="mb-8 text-white">{`> PAYLOAD SECURED.`}</p>
                  <a
                    href={downloadUrl}
                    download
                    className="block w-full text-center bg-cyan-400 text-black font-black py-4 border-4 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-colors shadow-[4px_4px_0_0_#ff00ff]"
                  >
                    [ DOWNLOAD_FILE ]
                  </a>
                </div>
              )}

              {status === "ERROR" && (
                <div className="text-red-500 font-black uppercase tracking-widest w-full">
                  <p className="text-2xl mb-2 animate-pulse">{`> FATAL_ERR`}</p>
                  <p className="text-white bg-red-500 p-2 inline-block">{`> CORE_MELTDOWN.`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaConverter;
