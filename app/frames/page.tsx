"use client";

import { useState } from "react";
import ToolForm from "@/components/ToolForm";
import { Field, Input } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";

const MODES = [
  { value: "single", label: "ONE STILL AT A TIME" },
  { value: "sheet", label: "CONTACT SHEET (GRID)" },
];
const GRIDS = ["2x2", "3x3", "4x4", "5x5", "6x6", "4x3", "6x4"].map((g) => ({ value: g, label: g.replace("x", " × ") + " FRAMES" }));
const FORMATS = [
  { value: "jpg", label: ".JPG" },
  { value: "png", label: ".PNG (LOSSLESS)" },
];

export default function FramesPage() {
  const [mode, setMode] = useState("single");
  const [at, setAt] = useState("0:05");
  const [grid, setGrid] = useState("4x4");
  const [format, setFormat] = useState("jpg");

  return (
    <ToolForm
      title="FRAME GRABS"
      tagline="Pull stills or a contact sheet from a video"
      color="yellow"
      shadow="pink"
      endpoint="/frames"
      source={{ kind: "file", accept: "video/*", hint: "ANY VIDEO" }}
      guestHint="GUEST: 5MB MAX // 3 JOBS/DAY — sign up free for 100MB"
      submitLabel="GRAB FRAMES"
      workingLabel="GRABBING FRAMES..."
      options={(): Record<string, string> | string => {
        if (mode === "sheet") {
          const [cols, rows] = grid.split("x");
          return { mode, cols, rows, format };
        }
        return /^\d+(:\d{1,2}){0,2}(\.\d+)?$/.test(at.trim()) ? { mode, at: at.trim(), format } : "Timestamp must look like 83, 1:23 or 0:01:23.";
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="What to grab" labelColor="yellow">
          <Dropdown value={mode} onChange={setMode} options={MODES} color="yellow" shadow="pink" />
        </Field>
        <Field label="Format" labelColor="yellow">
          <Dropdown value={format} onChange={setFormat} options={FORMATS} color="yellow" shadow="pink" />
        </Field>
      </div>
      {mode === "single" ? (
        <Field label="Timestamp" labelColor="pink">
          <Input type="text" placeholder="1:23" value={at} onChange={(e) => setAt(e.target.value)} color="pink" focus="yellow" />
        </Field>
      ) : (
        <Field label="Grid size" labelColor="pink">
          <Dropdown value={grid} onChange={setGrid} options={GRIDS} color="pink" shadow="yellow" />
        </Field>
      )}
    </ToolForm>
  );
}
