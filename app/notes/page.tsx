"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api, { apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useJobPolling } from "@/hooks/useJobPolling";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import FileDrop from "@/components/ui/FileDrop";
import { UpsellError } from "@/components/ui/ToolBits";
import MarkdownNotes from "@/components/MarkdownNotes";

type Phase = "IDLE" | "WORKING" | "DONE" | "ERROR";
type Mode = "url" | "file";

const MAX_SUB_BYTES = 2 * 1024 * 1024;

export default function NotesPage() {
  const { user, usage, loading } = useAuth();

  const [mode, setMode] = useState<Mode>("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [phase, setPhase] = useState<Phase>("IDLE");
  const [jobId, setJobId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const job = useJobPolling(phase === "WORKING" ? jobId : null);

  useEffect(() => {
    if (!job) return;
    if (job.status === "COMPLETED") {
      setNotes(job.notesMarkdown || "");
      setPhase("DONE");
    } else if (job.status === "FAILED") {
      setErrorMsg(job.error || "Couldn't generate notes for this video.");
      setPhase("ERROR");
    }
  }, [job]);

  const busy = phase === "WORKING";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setNotes("");

    if (mode === "url" && !videoUrl) return alert("Please paste a link first.");
    if (mode === "file" && !file) return alert("Please choose a subtitle file.");
    if (mode === "file" && file && file.size > MAX_SUB_BYTES) {
      setErrorMsg("Subtitle file must be under 2 MB.");
      setPhase("ERROR");
      return;
    }

    setPhase("WORKING");

    try {
      let res;
      if (mode === "url") {
        res = await api.post("/notes", { videoUrl });
      } else {
        const fd = new FormData();
        fd.append("subtitleFile", file as File);
        res = await api.post("/notes", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setJobId(res.data.jobId);
    } catch (error) {
      setErrorMsg(apiError(error, "Couldn't start the notes job."));
      setPhase("ERROR");
    }
  };

  const copyNotes = async () => {
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Auth gate --------------------------------------------------------
  if (loading) {
    return (
      <PageShell selection="purple" maxWidth="5xl">
        <p className="text-purple-400 font-black uppercase tracking-widest animate-pulse">
          {"> checking uplink..._"}
        </p>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell selection="purple" maxWidth="5xl">
        <div className="max-w-xl mx-auto mt-6">
          <div className="border-l-8 border-purple-500 pl-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#9333ea] uppercase mb-2">
              AI STUDY NOTES
            </h1>
            <p className="text-purple-400 font-bold tracking-widest text-sm uppercase">
              // ACCOUNT REQUIRED
            </p>
          </div>

          <div className="crt-terminal bg-black border-4 border-purple-500 p-8 shadow-[10px_10px_0_0_#00ffff] relative overflow-hidden">
            <div className="relative z-20 flex flex-col items-start gap-6">
              <p className="text-6xl">🔒</p>
              <div>
                <p className="text-white font-black uppercase tracking-widest text-xl mb-3">
                  {"> This tool needs a free account."}
                </p>
                <p className="text-white/60 font-bold text-sm normal-case tracking-normal leading-relaxed">
                  AI Study Notes runs your transcript through Gemini to build
                  clean, structured notes. It&apos;s free — creating an account
                  just unlocks it (5 notes a day), along with 100 MB uploads and
                  20 jobs a day.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button color="purple" shadow="cyan" href="/signup">
                  CREATE FREE ACCOUNT
                </Button>
                <Button color="cyan" shadow="purple" variant="outline" href="/login">
                  LOG IN
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-neutral-500 font-bold uppercase tracking-widest text-xs mt-8">
            {"// JUST NEED THE RAW SUBTITLES? "}
            <Link href="/forge" className="text-cyan-400 hover:text-cyan-300">
              USE THE FORGE
            </Link>
          </p>
        </div>
      </PageShell>
    );
  }

  // --- Authenticated tool ----------------------------------------------
  const notesLeft =
    usage && typeof usage.notesLimit === "number"
      ? Math.max(0, usage.notesLimit - usage.notesUsed)
      : null;

  return (
    <PageShell selection="purple" maxWidth="6xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="border-l-8 border-purple-500 pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#9333ea] uppercase mb-2">
              AI STUDY NOTES
            </h1>
            <p className="text-purple-400 font-bold tracking-widest text-sm uppercase">
              // GEMINI TURNS TRANSCRIPTS INTO NOTES
            </p>
          </div>
          {notesLeft !== null && (
            <div className="border-4 border-purple-500 bg-purple-500/10 px-4 py-3 shadow-[4px_4px_0_0_#9333ea]">
              <p className="text-purple-400 font-black uppercase tracking-widest text-xs">
                {`NOTES LEFT TODAY: ${notesLeft} / ${usage!.notesLimit}`}
              </p>
            </div>
          )}
        </div>

        {/* INPUT CARD */}
        <div className="bg-black border-4 border-purple-500 p-6 md:p-8 shadow-[10px_10px_0_0_#00ffff]">
          {/* MODE TABS */}
          <div className="flex gap-0 mb-8 border-4 border-purple-500/40 w-full md:w-fit">
            {(["url", "file"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                disabled={busy}
                className={`flex-1 md:flex-none px-6 py-3 font-black uppercase tracking-widest text-sm transition-colors disabled:opacity-50 ${
                  mode === m
                    ? "bg-purple-600 text-white"
                    : "bg-black text-purple-400 hover:bg-purple-500/10"
                }`}
              >
                {m === "url" ? "FROM LINK" : "FROM FILE"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {mode === "url" ? (
              <Field label="PASTE A VIDEO LINK" labelColor="cyan" required requiredColor="purple">
                <Input
                  type="url"
                  placeholder="HTTPS://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={busy}
                  color="cyan"
                  focus="purple"
                />
              </Field>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1">
                  <span className="text-sm font-black uppercase tracking-widest text-cyan-400">
                    UPLOAD SUBTITLES — .SRT / .VTT / .TXT
                  </span>
                  <span className="text-purple-500 animate-pulse">*</span>
                </label>
                <FileDrop
                  file={file}
                  onFile={setFile}
                  accept=".srt,.vtt,.txt"
                  disabled={busy}
                  color="purple"
                  shadow="cyan"
                  hint="MAX 2 MB"
                />
              </div>
            )}

            <div className="border-l-4 border-purple-500 bg-purple-500/10 p-4">
              <p className="text-xs font-bold text-purple-300 uppercase leading-relaxed tracking-wider">
                We pull the transcript, then Gemini writes a title, TL;DR, key
                points, sectioned notes (with timestamps when available), and a
                glossary. Output is markdown you can copy or download.
              </p>
            </div>

            <Button type="submit" color="purple" shadow="cyan" disabled={busy || notesLeft === 0}>
              {busy ? "WRITING NOTES..." : notesLeft === 0 ? "DAILY LIMIT REACHED" : "GENERATE NOTES"}
            </Button>
          </form>
        </div>

        {/* OUTPUT */}
        <TerminalPanel
          title="NOTES.MD"
          color="cyan"
          shadow="purple"
          shadowSize={8}
          dots={["purple", "green", "cyan"]}
        >
          {phase === "IDLE" && (
            <div className="text-cyan-400 font-bold uppercase tracking-widest py-8">
              <p className="mb-2">{`> Ready`}</p>
              <p className="animate-pulse">{`> Waiting for a video or file..._`}</p>
            </div>
          )}

          {phase === "WORKING" && (
            <div className="text-purple-400 font-bold uppercase tracking-widest w-full py-8">
              <p className="mb-2">{`> Reading the transcript...`}</p>
              <p className="mb-4 text-xs">{`> Gemini is writing your notes: ${jobId?.slice(0, 8)}`}</p>
              <div className="w-full h-8 flex gap-2">
                <div className="h-full w-full bg-purple-500 animate-[pulse_0.5s_infinite]"></div>
                <div className="h-full w-full bg-cyan-400 animate-[pulse_0.7s_infinite]"></div>
                <div className="h-full w-full bg-green-500 animate-[pulse_0.9s_infinite]"></div>
              </div>
            </div>
          )}

          {phase === "ERROR" && (
            <div className="py-8">
              <UpsellError message={errorMsg} />
            </div>
          )}

          {phase === "DONE" && (
            <div className="w-full">
              <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b-4 border-cyan-400/30">
                <button
                  type="button"
                  onClick={copyNotes}
                  className="bg-green-500 text-black font-black uppercase tracking-widest text-xs px-4 py-2 border-2 border-green-500 shadow-[4px_4px_0_0_#00ffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#00ffff] transition-all"
                >
                  {copied ? "COPIED!" : "[ COPY MARKDOWN ]"}
                </button>
                <button
                  type="button"
                  onClick={downloadNotes}
                  className="bg-cyan-400 text-black font-black uppercase tracking-widest text-xs px-4 py-2 border-2 border-cyan-400 shadow-[4px_4px_0_0_#9333ea] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#9333ea] transition-all"
                >
                  [ DOWNLOAD .MD ]
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <MarkdownNotes markdown={notes} />
              </div>
            </div>
          )}
        </TerminalPanel>
      </div>
    </PageShell>
  );
}
