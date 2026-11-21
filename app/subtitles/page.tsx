"use client";

import { useState } from "react";
import ToolForm from "@/components/ToolForm";
import { Field } from "@/components/ui/Field";
import Dropdown from "@/components/ui/Dropdown";

const FORMATS = [
  { value: "srt", label: ".SRT — FOR VIDEO PLAYERS / EDITORS" },
  { value: "vtt", label: ".VTT — FOR THE WEB" },
  { value: "txt", label: ".TXT — CLEAN TRANSCRIPT" },
];

export default function SubtitlesPage() {
  const [format, setFormat] = useState("srt");

  return (
    <ToolForm
      title="SUBTITLES"
      tagline="Get a video's subtitles or transcript without downloading it"
      color="cyan"
      shadow="yellow"
      endpoint="/subtitles"
      source={{ kind: "url" }}
      guestHint="GUEST: 3 JOBS/DAY — sign up free for 20"
      submitLabel="GET SUBTITLES"
      workingLabel="FETCHING SUBTITLES..."
      options={() => ({ format })}
    >
      <Field label="Format" labelColor="cyan">
        <Dropdown value={format} onChange={setFormat} options={FORMATS} color="cyan" shadow="yellow" />
      </Field>
      <p className="text-xs uppercase tracking-wider text-neutral-400">
        {"> English subtitles (or YouTube's auto captions). Only the text is fetched, so it takes seconds even for long videos."}
      </p>
    </ToolForm>
  );
}
