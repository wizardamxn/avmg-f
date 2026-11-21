"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type Job = {
  id: string;
  status: JobStatus;
  jobType?: string;
  path?: string | null;
  fileName?: string | null;
  targetFormat?: string | null;
  size?: number | null;
  error?: string | null;
  createdAt?: string;
  expiresAt?: string | null;
};

// Polls GET /status/:jobId until the job reaches a terminal state, unmounts,
// or a 10-minute safety ceiling is hit. Replaces the setInterval effect that
// was copy-pasted into every tool page.
export function useJobPolling(jobId: string | null, intervalMs = 2500) {
  const [job, setJob] = useState<Job | null>(null);
  // Tracks which jobId `job` actually belongs to, so a freshly-started job
  // doesn't briefly show the previous job's stale data. State, not a ref —
  // reading a ref during render isn't safe, reading state is.
  const [jobJobId, setJobJobId] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!jobId) return;

    startedAt.current = Date.now();
    let active = true;

    const tick = async () => {
      try {
        const res = await api.get(`/status/${jobId}`);
        if (!active) return;
        setJobJobId(jobId);
        setJob(res.data);
        if (res.data.status === "COMPLETED" || res.data.status === "FAILED") {
          clearInterval(id);
        }
      } catch {
        // Transient error (server busy, blip) — keep polling.
      }
      if (Date.now() - startedAt.current > 10 * 60 * 1000) clearInterval(id);
    };

    const id = setInterval(tick, intervalMs);
    tick();

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [jobId, intervalMs]);

  return jobId && jobJobId === jobId ? job : null;
}
