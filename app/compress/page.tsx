"use client";

import { useState } from "react";
import ToolForm from "@/components/ToolForm";
import { Field, Input } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";

const PRESETS = [
  { value: "8", label: "8 MB — DISCORD" },
  { value: "16", label: "16 MB — WHATSAPP" },
  { value: "25", label: "25 MB — EMAIL" },
  { value: "50", label: "50 MB" },
  { value: "custom", label: "CUSTOM SIZE" },
];

export default function CompressPage() {
  const [preset, setPreset] = useState("8");
  const [custom, setCustom] = useState("");

  return (
    <ToolForm
      title="COMPRESS TO SIZE"
      tagline="Shrink a video to fit an upload limit"
      color="orange"
      shadow="cyan"
      endpoint="/compress"
      source={{ kind: "file", accept: "video/*", hint: "ANY VIDEO" }}
      guestHint="GUEST: 5MB MAX // 3 JOBS/DAY — sign up free for 100MB"
      submitLabel="COMPRESS"
      workingLabel="COMPRESSING..."
      options={() => {
        const mb = preset === "custom" ? custom : preset;
        const n = Number(mb);
        if (!Number.isFinite(n) || n < 1 || n > 500) return "Target size must be between 1 and 500 MB.";
        return { targetMB: String(n) };
      }}
    >
      <Field label="Target Size" labelColor="orange">
        <Dropdown value={preset} onChange={setPreset} options={PRESETS} color="orange" shadow="cyan" />
      </Field>
      {preset === "custom" && (
        <Field label="Size in MB" labelColor="orange">
          <Input type="number" min={1} max={500} placeholder="e.g. 10" value={custom} onChange={(e) => setCustom(e.target.value)} color="orange" focus="cyan" />
        </Field>
      )}
      <p className="text-xs uppercase tracking-wider text-neutral-400">
        {"> The result lands just under the size you pick. Long videos at tiny sizes get scaled down so they stay watchable."}
      </p>
    </ToolForm>
  );
}
