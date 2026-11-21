"use client";

import { useState } from "react";
import ToolForm from "@/components/ToolForm";
import { Field } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";
import Toggle from "@/components/ui/Toggle";

const SPEEDS = ["0.75", "1", "1.25", "1.5", "2"].map((v) => ({ value: v, label: v === "1" ? "NORMAL SPEED" : `${v}x` }));
const FORMATS = [
  { value: "mp3", label: ".MP3" },
  { value: "wav", label: ".WAV (LOSSLESS)" },
];

export default function AudioCleanupPage() {
  const [normalize, setNormalize] = useState(true);
  const [removeSilence, setRemoveSilence] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [format, setFormat] = useState("mp3");

  return (
    <ToolForm
      title="AUDIO CLEANUP"
      tagline="Lectures and podcasts: even volume, no dead air"
      color="purple"
      shadow="green"
      endpoint="/audio-clean"
      source={{ kind: "file", accept: "audio/*,video/*", hint: "ANY AUDIO OR VIDEO" }}
      guestHint="GUEST: 5MB MAX // 3 JOBS/DAY — sign up free for 100MB"
      submitLabel="CLEAN UP AUDIO"
      workingLabel="CLEANING AUDIO..."
      options={() =>
        !normalize && !removeSilence && speed === "1"
          ? "Pick at least one: even out volume, cut silences, or a speed."
          : { normalize: String(normalize), removeSilence: String(removeSilence), speed, format }
      }
    >
      <Toggle label="Even out volume" hint="Quiet and loud parts end up at one level" on={normalize} onChange={setNormalize} color="purple" />
      <Toggle label="Cut silences" hint="Removes pauses longer than 0.7 seconds" on={removeSilence} onChange={setRemoveSilence} color="purple" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Speed" labelColor="green">
          <Dropdown value={speed} onChange={setSpeed} options={SPEEDS} color="green" shadow="purple" />
        </Field>
        <Field label="Output" labelColor="green">
          <Dropdown value={format} onChange={setFormat} options={FORMATS} color="green" shadow="purple" />
        </Field>
      </div>
    </ToolForm>
  );
}
