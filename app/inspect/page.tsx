"use client";

import { useState } from "react";
import api, { apiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import PageShell from "@/components/ui/PageShell";
import TerminalPanel from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/Field";
import FileDrop from "@/components/ui/FileDrop";
import { GuestHint, UpsellError } from "@/components/ui/ToolBits";

type Info = {
  name: string;
  container: string;
  durationSec: number;
  sizeBytes: number | null;
  bitrateKbps: number | null;
  video: { codec: string; width: number; height: number; fps: number | null } | null;
  audio: { codec: string; sampleRate: number | null; channels: number | null } | null;
};

const clock = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return (h ? `${h}:${String(m).padStart(2, "0")}` : String(m)) + ":" + String(sec).padStart(2, "0");
};

/** Instant: the API runs ffprobe and deletes the upload straight away (no queue, no quota). */
export default function InspectPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Choose a file first.");
    setBusy(true);
    setError("");
    setInfo(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/inspect", form, { headers: { "Content-Type": "multipart/form-data" } });
      setInfo(res.data);
    } catch (err) {
      setError(apiError(err, "Couldn't read that file."));
    } finally {
      setBusy(false);
    }
  };

  const rows: [string, string][] = info
    ? [
        ["FILE", info.name],
        ["CONTAINER", info.container],
        ["LENGTH", clock(info.durationSec)],
        ["SIZE", info.sizeBytes ? `${(info.sizeBytes / 1048576).toFixed(2)} MB` : "—"],
        ["BITRATE", info.bitrateKbps ? `${info.bitrateKbps} kbps` : "—"],
        ["VIDEO", info.video ? `${info.video.codec.toUpperCase()} · ${info.video.width}×${info.video.height}${info.video.fps ? ` · ${info.video.fps} fps` : ""}` : "none"],
        ["AUDIO", info.audio ? `${info.audio.codec.toUpperCase()}${info.audio.sampleRate ? ` · ${info.audio.sampleRate / 1000} kHz` : ""}${info.audio.channels ? ` · ${info.audio.channels === 1 ? "mono" : info.audio.channels === 2 ? "stereo" : `${info.audio.channels} ch`}` : ""}` : "none"],
      ]
    : [];

  return (
    <PageShell selection="white" maxWidth="5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-l-8 border-white pl-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#ff00ff] uppercase mb-2">MEDIA INSPECTOR</h1>
            <p className="text-white font-bold tracking-widest text-sm uppercase">{"// Codec, resolution, length and bitrate, instantly"}</p>
          </div>
          <GuestHint show={!user} text="GUEST: 5MB MAX — doesn't use your daily jobs" />
          <form onSubmit={submit} className="flex flex-col gap-8 bg-black border-4 border-white p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <Label color="white">[ CHOOSE A FILE ]</Label>
              <FileDrop file={file} onFile={setFile} disabled={busy} color="white" shadow="pink" hint="ANY AUDIO, VIDEO OR IMAGE" />
            </div>
            <Button type="submit" color="white" shadow="pink" disabled={busy}>
              {busy ? "READING..." : "INSPECT FILE"}
            </Button>
          </form>
        </div>

        <TerminalPanel title="REPORT" color="green" shadow="cyan" dots={["red", "yellow", "green"]} className="h-full min-h-[400px]">
          <div className="flex-grow flex flex-col justify-center w-full">
            {!info && !error && <p className="text-green-500 font-bold uppercase tracking-widest animate-pulse">{"> Waiting for a file..._"}</p>}
            {error && <UpsellError message={error} />}
            {info && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                {rows.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-black tracking-widest text-cyan-400">{k}</dt>
                    <dd className="text-white break-all">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </TerminalPanel>
      </div>
    </PageShell>
  );
}
