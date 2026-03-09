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

  const [status, setStatus] = useState("IDLE"); // IDLE, UPLOADING, POLLING, COMPLETED, ERROR
  const [jobId, setJobId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleWatermarkChange = (e) => setWatermarkFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to convert.");

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
      const res = await axios.post("http://localhost:5000/convert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJobId(res.data.jobId);
      setStatus("POLLING");
    } catch (error) {
      console.error("Conversion failed:", error);
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
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [status, jobId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
      
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Media Converter</h1>
            <p className="text-neutral-400 text-sm">Upload local video or audio files and transcode them through the FFmpeg engine.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-neutral-900/50 border border-white/5 p-6 md:p-8 rounded-2xl">
            
            {/* FILE INPUTS */}
            <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Source Payload <span className="text-blue-500">*</span></label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:cursor-pointer bg-neutral-950 border border-white/10 rounded-lg p-1.5 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Watermark Overlay (PNG)</label>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleWatermarkChange}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-300 hover:file:bg-neutral-700 file:cursor-pointer bg-neutral-950 border border-white/10 rounded-lg p-1.5 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/5 pb-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Target Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-neutral-950 border border-white/10 text-white p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <option value="mp3">MP3 (Audio)</option>
                  <option value="wav">WAV (Lossless Audio)</option>
                  <option value="mp4">MP4 (Video)</option>
                  <option value="gif">GIF (Animation)</option>
                  <option value="jpg">JPG (Thumbnail Frame)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Compression Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-neutral-950 border border-white/10 text-white p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <option value="best">Studio / HD (Original)</option>
                  <option value="good">Standard / 720p</option>
                  <option value="draft">Draft / 480p</option>
                </select>
              </div>
            </div>

            {/* TIMELINE GRID */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Start Time</label>
                <input
                  type="text"
                  placeholder="00:00:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-neutral-950 border border-white/10 text-white p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 placeholder-neutral-600"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Duration (Secs)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={status === "UPLOADING" || status === "POLLING"}
                  className="bg-neutral-950 border border-white/10 text-white p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 placeholder-neutral-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "UPLOADING" || status === "POLLING"}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {status === "UPLOADING" ? "Transmitting..." : status === "POLLING" ? "Processing Engine Active..." : "Initialize Conversion"}
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
                <p className="text-neutral-500 text-sm">System standing by. Upload a payload to begin.</p>
              )}

              {status === "UPLOADING" && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-blue-400 text-sm font-medium">Transferring to node...</p>
                </div>
              )}

              {status === "POLLING" && (
                <div className="flex flex-col items-center gap-4 w-full px-4 animate-in fade-in duration-300">
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-full origin-left animate-[pulse_1s_ease-in-out_infinite]"></div>
                  </div>
                  <p className="text-blue-400 text-sm font-medium font-mono">
                    Tracking Job ID: <br/><span className="text-xs text-neutral-500">{jobId.slice(0, 12)}...</span>
                  </p>
                </div>
              )}

              {status === "COMPLETED" && (
                <div className="flex flex-col items-center gap-5 animate-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                    <span className="text-green-500 text-xl">✓</span>
                  </div>
                  <p className="text-green-400 text-sm font-semibold tracking-wide">TASK SUCCESSFUL</p>
                  <a
                    href={downloadUrl}
                    download
                    className="w-full bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                  >
                    Download File
                  </a>
                </div>
              )}

              {status === "ERROR" && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
                  <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                    <span className="text-red-500 font-bold">!</span>
                  </div>
                  <p className="text-red-400 text-sm font-medium">Processing sequence failed.</p>
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