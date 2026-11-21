"use client";

import { useState } from "react";
import ToolForm from "@/components/ToolForm";
import { Field } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";
import Toggle from "@/components/ui/Toggle";

const ROTATIONS = [
  { value: "0", label: "NO ROTATION" },
  { value: "90", label: "90° CLOCKWISE" },
  { value: "180", label: "180°" },
  { value: "270", label: "90° COUNTER-CLOCKWISE" },
];
const FLIPS = [
  { value: "none", label: "NO FLIP" },
  { value: "h", label: "MIRROR (LEFT ↔ RIGHT)" },
  { value: "v", label: "UPSIDE DOWN" },
];
const SPEEDS = ["0.5", "0.75", "1", "1.25", "1.5", "2"].map((v) => ({ value: v, label: v === "1" ? "NORMAL SPEED" : `${v}x` }));

export default function QuickEditPage() {
  const [rotate, setRotate] = useState("0");
  const [flip, setFlip] = useState("none");
  const [speed, setSpeed] = useState("1");
  const [mute, setMute] = useState(false);

  return (
    <ToolForm
      title="QUICK EDITS"
      tagline="Fix a sideways video, mirror it, mute it, speed it up"
      color="green"
      shadow="pink"
      endpoint="/edit"
      source={{ kind: "file", accept: "video/*", hint: "ANY VIDEO" }}
      guestHint="GUEST: 5MB MAX // 3 JOBS/DAY — sign up free for 100MB"
      submitLabel="APPLY EDITS"
      workingLabel="EDITING..."
      options={() =>
        rotate === "0" && flip === "none" && speed === "1" && !mute
          ? "Pick at least one edit."
          : { rotate, flip, speed, mute: String(mute) }
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Rotate" labelColor="green">
          <Dropdown value={rotate} onChange={setRotate} options={ROTATIONS} color="green" shadow="pink" />
        </Field>
        <Field label="Flip" labelColor="green">
          <Dropdown value={flip} onChange={setFlip} options={FLIPS} color="green" shadow="pink" />
        </Field>
        <Field label="Speed" labelColor="pink">
          <Dropdown value={speed} onChange={setSpeed} options={SPEEDS} color="pink" shadow="green" />
        </Field>
      </div>
      <Toggle label="Mute" hint="Drop the audio track" on={mute} onChange={setMute} color="green" />
    </ToolForm>
  );
}
