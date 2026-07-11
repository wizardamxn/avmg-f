"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Job } from "@/hooks/useJobPolling";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MarkdownNotes from "@/components/MarkdownNotes";

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return (
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
    " | " +
    d.toLocaleDateString()
  );
};

const formatBytes = (bytes?: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Job | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch {
      // 401/network — user is likely signed out; leave the list empty.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [user, fetchJobs]);

  // --- Signed-out gate --------------------------------------------------
  if (!authLoading && !user) {
    return (
      <PageShell selection="white" maxWidth="5xl">
        <div className="max-w-lg mx-auto mt-6">
          <div className="border-l-8 border-white pl-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#888888] uppercase mb-2">
              HISTORY
            </h1>
            <p className="text-gray-400 font-bold tracking-widest text-sm uppercase">
              // SIGN IN TO SEE YOUR JOBS
            </p>
          </div>
          <div className="bg-black border-4 border-white p-8 shadow-[10px_10px_0_0_#00ffff]">
            <p className="text-white font-black uppercase tracking-widest text-lg mb-4">
              {"> Job history is tied to your account."}
            </p>
            <p className="text-white/60 font-bold text-sm normal-case tracking-normal leading-relaxed mb-8">
              Create a free account (or log in) to keep a running history of your
              downloads, conversions, and AI notes for 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button color="pink" shadow="green" href="/signup">
                CREATE FREE ACCOUNT
              </Button>
              <Button color="cyan" shadow="pink" variant="outline" href="/login">
                LOG IN
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell selection="white" maxWidth="7xl">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="border-l-8 border-white pl-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#888888] uppercase mb-2">
            HISTORY
          </h1>
          <p className="text-gray-400 font-bold tracking-widest text-sm uppercase">
            // Every download, conversion, and note you&apos;ve run
          </p>
        </div>

        <button
          onClick={fetchJobs}
          className="bg-white text-black font-black uppercase tracking-[0.2em] px-6 py-4 border-4 border-white shadow-[6px_6px_0_0_#ff00ff] hover:bg-gray-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#ff00ff] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
        >
          [ REFRESH ]
        </button>
      </div>

      <div className="crt-terminal bg-black border-4 border-white p-2 md:p-8 shadow-[12px_12px_0_0_#00ffff] relative overflow-hidden">
        <div className="flex justify-between items-center border-b-4 border-white pb-4 mb-6 relative z-20">
          <h3 className="text-lg font-black text-white uppercase tracking-widest">RECENT JOBS</h3>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
            <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
            <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
          </div>
        </div>

        <div className="overflow-x-auto relative z-20">
          <table className="w-full text-left text-sm text-white min-w-[860px]">
            <thead className="bg-white text-black text-xs uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-6 py-4 border-b-4 border-white">JOB ID</th>
                <th className="px-6 py-4 border-b-4 border-white">TOOL</th>
                <th className="px-6 py-4 border-b-4 border-white">STATUS</th>
                <th className="px-6 py-4 border-b-4 border-white">FORMAT</th>
                <th className="px-6 py-4 border-b-4 border-white">SIZE</th>
                <th className="px-6 py-4 border-b-4 border-white">TIME</th>
                <th className="px-6 py-4 border-b-4 border-white text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-neutral-900 bg-black">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white font-bold tracking-widest uppercase animate-pulse">
                    &gt; Loading...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-bold tracking-widest uppercase">
                    &gt; No jobs yet. Run a tool to get started.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const isNotes = job.jobType === "job-ai-notes";
                  return (
                    <tr key={job.id} className="hover:bg-neutral-900 transition-colors group">
                      <td className="px-6 py-6 font-mono text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                        {job.id.split("-")[0]}
                      </td>
                      <td className="px-6 py-6 text-sm font-black text-cyan-400 tracking-wider">
                        {(job.jobType || "job").replace("job-", "").toUpperCase()}
                      </td>
                      <td className="px-6 py-6">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-6 font-mono text-sm font-black text-pink-500 tracking-widest">
                        {job.targetFormat ? `.${job.targetFormat.toUpperCase()}` : "VIDEO"}
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-gray-400 tracking-wider">
                        {formatBytes(job.size)}
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-gray-400 tracking-wider">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-6 text-right">
                        {job.status === "COMPLETED" && isNotes && job.notesMarkdown ? (
                          <button
                            onClick={() => setViewing(job)}
                            className="inline-block bg-purple-600 text-white border-4 border-purple-600 px-4 py-2 font-black tracking-widest uppercase hover:bg-black hover:text-purple-400 transition-colors shadow-[4px_4px_0_0_#00ffff]"
                          >
                            [ VIEW ]
                          </button>
                        ) : job.status === "COMPLETED" && job.path ? (
                          <a
                            href={`${job.path}?download=`}
                            download
                            className="inline-block bg-white text-black border-4 border-white px-4 py-2 font-black tracking-widest uppercase hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_#00ffff]"
                          >
                            [ DOWNLOAD ]
                          </a>
                        ) : job.status === "COMPLETED" ? (
                          <span className="text-orange-500 text-xs font-black tracking-widest uppercase px-4">
                            LINK EXPIRED
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs font-black tracking-widest uppercase px-4">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTES MODAL */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-start md:items-center justify-center p-4 md:p-10 overflow-y-auto"
          onClick={() => setViewing(null)}
        >
          <div
            className="w-full max-w-3xl bg-black border-4 border-purple-500 shadow-[12px_12px_0_0_#00ffff] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b-4 border-purple-500/50 p-5 sticky top-0 bg-black">
              <h3 className="text-lg font-black text-purple-400 uppercase tracking-widest">
                STUDY NOTES // {viewing.id.split("-")[0]}
              </h3>
              <button
                onClick={() => setViewing(null)}
                className="text-white font-black text-xl px-3 hover:text-red-500 transition-colors"
                aria-label="Close"
              >
                [X]
              </button>
            </div>
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
              <MarkdownNotes markdown={viewing.notesMarkdown || ""} />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
