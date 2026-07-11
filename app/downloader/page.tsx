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

const QUALITY_OPTIONS = [
  { value: "best", label: "BEST QUALITY" },
  { value: "good", label: "MEDIUM" },
  { value: "draft", label: "LOW (SMALLEST FILE)" },
];

const UniversalDownloader = () => {
  const { user } = useAuth();
  const [videoUrl, setVideoUrl] = useState("");
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
      setErrorMsg(job.error || "Couldn't download this link.");
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
      const res = await api.post("/download", { videoUrl, quality });
      setJobId(res.data.jobId);
      setPhase("WORKING");
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      setErrorMsg(apiError(error, "Couldn't start the download."));
      setUpsell(!user && (status === 413 || status === 429));
      setPhase("ERROR");
    }
  };

  return (
    <PageShell selection="yellow" maxWidth="5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-yellow-400 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#39ff14] uppercase mb-2">
              VIDEO DOWNLOADER
            </h1>
            <p className="text-yellow-400 font-bold tracking-widest text-sm uppercase">
              // NET_RIPPER — download video or audio from a link
            </p>
          </div>

          <GuestHint
            show={!user}
            text="GUEST: 50MB CAP // 3 JOBS/DAY — sign up free to lift the cap"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-black border-4 border-green-500 p-6 md:p-8 shadow-[10px_10px_0_0_#ffff00] relative"
          >
            <div className="flex flex-col gap-6 border-b-4 border-green-500/50 pb-8">
              <Field label="PASTE A LINK" labelColor="green" required requiredColor="yellow">
                <Input
                  type="url"
                  placeholder="HTTPS://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={busy}
                  color="green"
                  focus="yellow"
                />
              </Field>
            </div>

            <Field label="Quality" labelColor="cyan">
              <Dropdown
                value={quality}
                onChange={setQuality}
                options={QUALITY_OPTIONS}
                disabled={busy}
                color="cyan"
                shadow="yellow"
              />
            </Field>

            <Button type="submit" color="green" shadow="yellow" disabled={busy}>
              {phase === "CONNECTING"
                ? "CONNECTING..."
                : phase === "WORKING"
                  ? "DOWNLOADING..."
                  : "DOWNLOAD"}
            </Button>
          </form>
        </div>

        {/* RIGHT: STATUS */}
        <div className="flex flex-col gap-6">
          <TerminalPanel
            title="STATUS"
            color="orange"
            shadow="pink"
            dots={["orange", "orange", "orange"]}
            className="h-full min-h-[400px]"
          >
            <div className="flex-grow flex flex-col items-start justify-center text-left w-full">
              {phase === "IDLE" && (
                <div className="text-orange-400 font-bold uppercase tracking-widest">
                  <p className="mb-2">{`> Ready`}</p>
                  <p className="animate-pulse">{`> Waiting for a link..._`}</p>
                </div>
              )}

              {phase === "CONNECTING" && (
                <div className="text-yellow-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-4">{`> Connecting...`}</p>
                  <p className="mb-4 text-xs">{`> Fetching the video...`}</p>
                  <div className="w-full h-4 border-2 border-yellow-400 p-0.5">
                    <div className="h-full bg-yellow-400 w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              {phase === "WORKING" && (
                <div className="text-green-400 font-bold uppercase tracking-widest w-full">
                  <p className="mb-2">{`> Connected.`}</p>
                  <p className="mb-4">{`> Downloading: ${jobId?.slice(0, 8)}`}</p>
                  <div className="w-full h-6 flex gap-1">
                    <div className="h-full w-4 bg-green-400 animate-[ping_1s_infinite]"></div>
                    <div className="h-full w-4 bg-green-400 animate-[ping_1.2s_infinite]"></div>
                    <div className="h-full w-4 bg-green-400 animate-[ping_1.4s_infinite]"></div>
                  </div>
                </div>
              )}

              {phase === "DONE" && (
                <div className="text-cyan-400 font-black uppercase tracking-widest w-full">
                  <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#00ffff]">{`> Done!`}</p>
                  <p className="mb-8 text-white">{`> Your file is ready.`}</p>
                  <Button href={downloadUrl} download color="orange" shadow="yellow">
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

export default UniversalDownloader;
