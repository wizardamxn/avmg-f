"use client";

import { useEffect, useState } from "react";
import api, { apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useJobPolling } from "@/hooks/useJobPolling";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Field, Input, Label } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";
import FileDrop from "@/components/ui/FileDrop";
import { GuestHint, UpsellError } from "@/components/ui/ToolBits";

type Phase = "IDLE" | "UPLOADING" | "WORKING" | "DONE" | "ERROR";

const FORMAT_OPTIONS = [
  { value: "mp3", label: ".MP3 (AUDIO)" },
  { value: "wav", label: ".WAV (LOSSLESS)" },
  { value: "mp4", label: ".MP4 (VIDEO)" },
  { value: "gif", label: ".GIF (ANIMATION)" },
  { value: "jpg", label: ".JPG (FRAME)" },
];

const QUALITY_OPTIONS = [
  { value: "best", label: "BEST QUALITY" },
  { value: "good", label: "MEDIUM (720P)" },
  { value: "draft", label: "LOW (480P, SMALLEST)" },
];

const MediaConverter = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("best");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  const [phase, setPhase] = useState<Phase>("IDLE");
  const [uploadPct, setUploadPct] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [upsell, setUpsell] = useState(false);

  const job = useJobPolling(phase === "WORKING" ? jobId : null);

  useEffect(() => {
    if (!job) return;
    if (job.status === "COMPLETED") {
      setDownloadUrl(`${job.path}?download=`);
      setPhase("DONE");
    } else if (job.status === "FAILED") {
      setErrorMsg(job.error || "Conversion failed. Please try again.");
      setUpsell(false);
      setPhase("ERROR");
    }
  }, [job]);

  const busy = phase === "UPLOADING" || phase === "WORKING";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please choose a file first.");

    setPhase("UPLOADING");
    setUploadPct(0);
    setErrorMsg("");
    setUpsell(false);

    const formData = new FormData();
    formData.append("videoFile", file);
    if (watermarkFile) formData.append("watermarkFile", watermarkFile);
    formData.append("targetFormat", format);
    formData.append("quality", quality);
    if (startTime) formData.append("startTime", startTime);
    if (duration) formData.append("duration", duration);

    try {
      const res = await api.post("/convert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setUploadPct(Math.round((e.loaded / e.total) * 100));
        },
      });
      setJobId(res.data.jobId);
      setPhase("WORKING");
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      setErrorMsg(apiError(error, "Upload failed. Please try again."));
      setUpsell(!user && (status === 413 || status === 429));
      setPhase("ERROR");
    }
  };

  return (
    <PageShell selection="pink" maxWidth="5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-pink-500 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#00ffff] uppercase mb-2">
              MEDIA CONVERTER
            </h1>
            <p className="text-pink-500 font-bold tracking-widest text-sm uppercase">
              // Convert a file on your device into another format
            </p>
          </div>

          <GuestHint
            show={!user}
            text="GUEST: 5MB MAX // 3 JOBS/DAY — sign up free for 100MB"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-cyan-400 p-6 md:p-8 shadow-[10px_10px_0_0_#ff00ff] relative"
          >
            {/* FILE INPUTS */}
            <div className="flex flex-col gap-6 border-b-4 border-cyan-400/50 pb-8">
              <div className="flex flex-col gap-2">
                <Label color="cyan">
                  [ CHOOSE A FILE ]{" "}
                  <span className="text-pink-500 animate-pulse">*</span>
                </Label>
                <FileDrop
                  file={file}
                  onFile={setFile}
                  disabled={busy}
                  color="cyan"
                  shadow="pink"
                  hint="ANY AUDIO OR VIDEO"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label color="yellow">WATERMARK — PNG, OPTIONAL</Label>
                <FileDrop
                  file={watermarkFile}
                  onFile={setWatermarkFile}
                  accept="image/png"
                  disabled={busy}
                  color="yellow"
                  shadow="green"
                  hint="PNG ONLY"
                />
              </div>
            </div>

            {/* SETTINGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-4 border-cyan-400/50 pb-8">
              <Field label="Output Format" labelColor="pink">
                <Dropdown
                  value={format}
                  onChange={setFormat}
                  options={FORMAT_OPTIONS}
                  disabled={busy}
                  color="pink"
                  shadow="cyan"
                />
              </Field>

              <Field label="Quality" labelColor="green">
                <Dropdown
                  value={quality}
                  onChange={setQuality}
                  options={QUALITY_OPTIONS}
                  disabled={busy}
                  color="green"
                  shadow="cyan"
                />
              </Field>
            </div>

            {/* TIMELINE */}
            <div className="grid grid-cols-2 gap-8">
              <Field label="Start Time — Optional" labelColor="purple">
                <Input
                  type="text"
                  placeholder="00:00:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={busy}
                  color="purple"
                  focus="cyan"
                />
              </Field>
              <Field label="Length (sec) — Optional" labelColor="purple">
                <Input
                  type="number"
                  placeholder="e.g. 15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={busy}
                  color="purple"
                  focus="cyan"
                />
              </Field>
            </div>

            <Button type="submit" color="pink" shadow="green" disabled={busy}>
              {phase === "UPLOADING"
                ? `UPLOADING ${uploadPct}%`
                : phase === "WORKING"
                  ? "CONVERTING..."
                  : "CONVERT FILE"}
            </Button>
          </form>
        </div>

        {/* RIGHT: STATUS */}
        <div className="flex flex-col gap-6">
          <TerminalPanel
            title="STATUS"
            color="green"
            shadow="cyan"
            dots={["red", "yellow", "green"]}
            className="h-full min-h-[400px]"
          >
            <div className="flex-grow flex flex-col items-start justify-center text-left w-full">
              {phase === "IDLE" && (
                <div className="text-green-500 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> Ready`}</p>
                  <p className="animate-pulse">{`> Waiting for a file..._`}</p>
                </div>
              )}

              {phase === "UPLOADING" && (
                <div className="text-cyan-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> Uploading your file... ${uploadPct}%`}</p>
                  <div className="w-full h-4 border-2 border-cyan-400 p-0.5">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-200"
                      style={{ width: `${uploadPct}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {phase === "WORKING" && (
                <div className="text-yellow-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> Converting your file...`}</p>
                  <p className="mb-4">{`> Job: ${jobId?.slice(0, 8)}`}</p>
                  <div className="w-full h-6 flex gap-1">
                    <div className="h-full w-4 bg-yellow-400 animate-[ping_1s_infinite]"></div>
                    <div className="h-full w-4 bg-yellow-400 animate-[ping_1.2s_infinite]"></div>
                    <div className="h-full w-4 bg-yellow-400 animate-[ping_1.4s_infinite]"></div>
                  </div>
                </div>
              )}

              {phase === "DONE" && (
                <div className="text-pink-500 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#00ffff]">{`> Done!`}</p>
                  <p className="mb-8 text-white">{`> Your file is ready.`}</p>
                  <Button href={downloadUrl} download color="cyan" shadow="pink">
                    [ DOWNLOAD ]
                  </Button>
                </div>
              )}

              {phase === "ERROR" && <UpsellError message={errorMsg} upsell={upsell} />}
            </div>
          </TerminalPanel>
        </div>
      </div>
    </PageShell>
  );
};

export default MediaConverter;
