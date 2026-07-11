import type { JobStatus } from "@/hooks/useJobPolling";

const STYLES: Record<string, string> = {
  COMPLETED: "bg-green-500 text-black border-green-500",
  PROCESSING: "bg-yellow-400 text-black border-yellow-400 animate-pulse",
  PENDING: "bg-cyan-400 text-black border-cyan-400",
  FAILED: "bg-red-500 text-black border-red-500",
};

export default function StatusBadge({ status }: { status: JobStatus | string }) {
  const style = STYLES[status] ?? "bg-neutral-600 text-white border-neutral-600";
  return (
    <span
      className={`inline-block border-2 px-3 py-1 text-xs tracking-[0.2em] font-black uppercase ${style}`}
    >
      {status}
    </span>
  );
}
