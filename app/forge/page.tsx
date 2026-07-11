"use client";

import { useEffect, useState } from "react";
import api, { apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useJobPolling } from "@/hooks/useJobPolling";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";
import { GuestHint, UpsellError } from "@/components/ui/ToolBits";

type Phase = "IDLE" | "CONNECTING" | "WORKING" | "DONE" | "ERROR";

const FORMAT_OPTIONS = [
  { value: "mp3", label: ".MP3 (AUDIO)" },
  { value: "wav", label: ".WAV (LOSSLESS AUDIO)" },
  { value: "mp4", label: ".MP4 (VIDEO)" },
  { value: "gif", label: ".GIF (ANIMATION)" },
  { value: "jpg", label: ".JPG (THUMBNAIL IMAGE)" },
];

const QUALITY_OPTIONS = [
  { value: "best", label: "BEST QUALITY" },
  { value: "good", label: "MEDIUM" },
  { value: "draft", label: "LOW (SMALLEST FILE)" },
];

const TheForge = () => {
  const { user } = useAuth();
  const [videoUrl, setVideoUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("best");

  const [phase, setPhase] = useState<Phase>("IDLE");
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
      setErrorMsg(job.error || "Something went wrong. Please try again.");
      setUpsell(false);
      setPhase("ERROR");
    }
  }, [job]);

  const busy = phase === "CONNECTING" || phase === "WORKING";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return alert("Please paste a link first.");

    setPhase("CONNECTING");
    setErrorMsg("");
    setUpsell(false);

    try {
      const res = await api.post("/download-convert", {
        videoUrl,
        targetFormat: format,
        quality,
      });
      setJobId(res.data.jobId);
      setPhase("WORKING");
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      setErrorMsg(apiError(error, "Couldn't start the job."));
      setUpsell(!user && (status === 413 || status === 429));
      setPhase("ERROR");
    }
  };

  return (
    <PageShell selection="cyan" maxWidth="5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-pink-500 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#ff00ff] uppercase mb-2">
              DOWNLOAD + CONVERT
            </h1>
            <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase">
              // THE FORGE — download a link and convert it in one step
            </p>
          </div>

          <GuestHint
            show={!user}
            text="GUEST: 50MB CAP // 3 JOBS/DAY — sign up free to lift the cap"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-pink-500 p-6 md:p-8 shadow-[10px_10px_0_0_#00ffff] relative"
          >
            <div className="flex flex-col gap-6 border-b-4 border-pink-500/50 pb-8">
              <Field label="PASTE A LINK" labelColor="cyan" required requiredColor="pink">
                <Input
                  type="url"
                  placeholder="HTTPS://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={busy}
                  color="cyan"
                  focus="pink"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Output Format" labelColor="yellow">
                <Dropdown
                  value={format}
                  onChange={setFormat}
                  options={FORMAT_OPTIONS}
                  disabled={busy}
                  color="yellow"
                  shadow="pink"
                />
              </Field>

              <Field label="Quality" labelColor="green">
                <Dropdown
                  value={quality}
                  onChange={setQuality}
                  options={QUALITY_OPTIONS}
                  disabled={busy}
                  color="green"
                  shadow="pink"
                />
              </Field>
            </div>

            <Button type="submit" color="cyan" shadow="pink" disabled={busy}>
              {phase === "CONNECTING"
                ? "STARTING..."
                : phase === "WORKING"
                  ? "WORKING..."
                  : "DOWNLOAD + CONVERT"}
            </Button>
          </form>
        </div>

        {/* RIGHT: STATUS */}
        <div className="flex flex-col gap-6">
          <TerminalPanel
            title="STATUS"
            color="purple"
            shadow="cyan"
            dots={["cyan", "pink", "purple"]}
            className="h-full min-h-[400px]"
          >
            <div className="flex-grow flex flex-col items-start justify-center text-left w-full">
              {phase === "IDLE" && (
                <div className="text-purple-400 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> Ready`}</p>
                  <p className="animate-pulse">{`> Waiting for a link..._`}</p>
                </div>
              )}

              {phase === "CONNECTING" && (
                <div className="text-cyan-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> Connecting...`}</p>
                  <p className="mb-4 text-xs">{`> Fetching the video...`}</p>
                  <div className="w-full h-4 border-2 border-cyan-400 p-0.5">
                    <div className="h-full bg-cyan-400 w-1/2 animate-pulse"></div>
                  </div>
                </div>
              )}

              {phase === "WORKING" && (
                <div className="text-pink-500 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> Converting...`}</p>
                  <p className="mb-4 text-xs">{`> Job: ${jobId?.slice(0, 8)}`}</p>
                  <div className="w-full h-8 flex gap-2">
                    <div className="h-full w-full bg-pink-500 animate-[pulse_0.5s_infinite]"></div>
                    <div className="h-full w-full bg-red-500 animate-[pulse_0.7s_infinite]"></div>
                    <div className="h-full w-full bg-orange-500 animate-[pulse_0.9s_infinite]"></div>
                  </div>
                </div>
              )}

              {phase === "DONE" && (
                <div className="text-cyan-400 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#ff00ff]">{`> Done!`}</p>
                  <p className="mb-8 text-white">{`> Your file is ready.`}</p>
                  <Button href={downloadUrl} download color="pink" shadow="cyan">
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

export default TheForge;
