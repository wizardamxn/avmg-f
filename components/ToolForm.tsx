"use client";

import { useState } from "react";
import api, { apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useJobPolling } from "@/hooks/useJobPolling";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import FileDrop from "@/components/ui/FileDrop";
import { GuestHint, UpsellError } from "@/components/ui/ToolBits";
import { ACCENT, DROP, cx, type Accent } from "@/components/ui/theme";

type Phase = "IDLE" | "UPLOADING" | "WORKING" | "DONE" | "ERROR";

type Props = {
  title: string;
  tagline: string;
  color: Accent;
  shadow: Accent;
  /** POST endpoint under /api, e.g. "/compress" */
  endpoint: string;
  /** Upload a file (sent as "file") or paste a link (sent as "videoUrl"). */
  source: { kind: "file"; accept?: string; hint: string } | { kind: "url" };
  guestHint: string;
  /** The tool's options as form fields; a string means "invalid, show this message". */
  options: () => Record<string, string> | string;
  submitLabel: string;
  workingLabel: string;
  /** The tool's option inputs. */
  children?: React.ReactNode;
};

/**
 * One screen for every queue-backed tool: pick a file or paste a link, set the
 * tool's options, submit, then poll the job and offer the download. Each tool
 * page only supplies its options; upload, polling and errors live here.
 */
export default function ToolForm({ title, tagline, color, shadow, endpoint, source, guestHint, options, submitLabel, workingLabel, children }: Props) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [uploadPct, setUploadPct] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [upsell, setUpsell] = useState(false);

  const job = useJobPolling(phase === "WORKING" ? jobId : null);
  const displayPhase: Phase = job?.status === "COMPLETED" ? "DONE" : job?.status === "FAILED" ? "ERROR" : phase;
  const downloadUrl = job?.status === "COMPLETED" ? `${job.path}?download=` : "";
  const displayError = job?.status === "FAILED" ? job.error || "That didn't work. Please try again." : errorMsg;
  const busy = displayPhase === "UPLOADING" || displayPhase === "WORKING";

  const fail = (message: string) => {
    setErrorMsg(message);
    setUpsell(false);
    setPhase("ERROR");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (source.kind === "file" && !file) return fail("Choose a file first.");
    if (source.kind === "url" && !/^https?:\/\//i.test(videoUrl.trim())) return fail("Paste a video link first.");
    const opts = options();
    if (typeof opts === "string") return fail(opts);

    setPhase("UPLOADING");
    setUploadPct(0);
    setErrorMsg("");
    setUpsell(false);
    try {
      let res;
      if (source.kind === "file") {
        const form = new FormData();
        form.append("file", file as File);
        Object.entries(opts).forEach(([k, v]) => form.append(k, v));
        res = await api.post(endpoint, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (ev) => ev.total && setUploadPct(Math.round((ev.loaded / ev.total) * 100)),
        });
      } else {
        res = await api.post(endpoint, { videoUrl: videoUrl.trim(), ...opts });
      }
      setJobId(res.data.jobId);
      setPhase("WORKING");
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      setErrorMsg(apiError(error, "Upload failed. Please try again."));
      setUpsell(!user && (status === 413 || status === 429));
      setPhase("ERROR");
    }
  };

  const a = ACCENT[color];
  return (
    <PageShell selection={color} maxWidth="5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className={cx("border-l-8 pl-4", a.border)}>
            <h1 className={cx("text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-2", DROP[shadow][4])}>{title}</h1>
            <p className={cx("font-bold tracking-widest text-sm uppercase", a.text)}>{"// " + tagline}</p>
          </div>

          <GuestHint show={!user} text={guestHint} />

          <form onSubmit={submit} className={cx("flex flex-col gap-8 bg-black border-4 p-6 md:p-8", a.border)}>
            <div className="flex flex-col gap-2">
              {source.kind === "file" ? (
                <>
                  <Label color={color}>[ CHOOSE A FILE ]</Label>
                  <FileDrop file={file} onFile={setFile} accept={source.accept} disabled={busy} color={color} shadow={shadow} hint={source.hint} />
                </>
              ) : (
                <>
                  <Label color={color}>[ PASTE A VIDEO LINK ]</Label>
                  <Input type="url" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} disabled={busy} color={color} focus={shadow} />
                </>
              )}
            </div>

            {children && <div className={cx("flex flex-col gap-6 border-t-4 pt-8", a.borderHalf)}>{children}</div>}

            <Button type="submit" color={color} shadow={shadow} disabled={busy}>
              {displayPhase === "UPLOADING" ? `UPLOADING ${uploadPct}%` : displayPhase === "WORKING" ? workingLabel : submitLabel}
            </Button>
          </form>
        </div>

        <TerminalPanel title="STATUS" color="green" shadow="cyan" dots={["red", "yellow", "green"]} className="h-full min-h-[400px]">
          <div className="flex-grow flex flex-col items-start justify-center text-left w-full">
            {displayPhase === "IDLE" && (
              <div className="text-green-500 font-bold uppercase tracking-widest">
                <p className="mb-2">{"> Ready"}</p>
                <p className="animate-pulse">{source.kind === "file" ? "> Waiting for a file..._" : "> Waiting for a link..._"}</p>
              </div>
            )}
            {displayPhase === "UPLOADING" && (
              <div className="text-cyan-400 font-bold uppercase tracking-widest w-full">
                <p className="mb-4">{`> Sending... ${uploadPct}%`}</p>
                <div className="w-full h-4 border-2 border-cyan-400 p-0.5">
                  <div className="h-full bg-cyan-400 transition-all duration-200" style={{ width: `${uploadPct}%` }} />
                </div>
              </div>
            )}
            {displayPhase === "WORKING" && (
              <div className="text-yellow-400 font-bold uppercase tracking-widest w-full">
                <p className="mb-2">{"> " + workingLabel}</p>
                <p className="mb-4">{`> Job: ${jobId?.slice(0, 8)}`}</p>
                <div className="w-full h-6 flex gap-1">
                  <div className="h-full w-4 bg-yellow-400 animate-[ping_1s_infinite]" />
                  <div className="h-full w-4 bg-yellow-400 animate-[ping_1.2s_infinite]" />
                  <div className="h-full w-4 bg-yellow-400 animate-[ping_1.4s_infinite]" />
                </div>
              </div>
            )}
            {displayPhase === "DONE" && (
              <div className="text-pink-500 font-black uppercase tracking-widest w-full">
                <p className="mb-2 text-2xl drop-shadow-[2px_2px_0_#00ffff]">{"> Done!"}</p>
                <p className="mb-8 text-white">
                  {"> Your file is ready"}
                  {job?.size ? ` (${(job.size / 1048576).toFixed(1)} MB)` : ""}.
                </p>
                <Button href={downloadUrl} download color="cyan" shadow="pink">
                  [ DOWNLOAD ]
                </Button>
              </div>
            )}
            {displayPhase === "ERROR" && <UpsellError message={displayError} upsell={upsell} />}
          </div>
        </TerminalPanel>
      </div>
    </PageShell>
  );
}
