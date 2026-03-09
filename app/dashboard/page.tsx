"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch telemetry", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Auto-refresh the grid every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format the date to look like a system log
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' | ' + d.toLocaleDateString();
  };

  // Helper to color-code statuses
  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED': return <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded text-[10px] tracking-widest font-bold">COMPLETED</span>;
      case 'PROCESSING': return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[10px] tracking-widest font-bold animate-pulse">PROCESSING</span>;
      case 'FAILED': return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-[10px] tracking-widest font-bold">FAILED</span>;
      default: return <span className="bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-[10px] tracking-widest font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-neutral-700">
      
      {/* TOP NAV */}
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors group mb-6">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Hub
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Telemetry Dashboard</h1>
          <p className="text-neutral-400 text-sm">Real-time ledger of all extraction and mutation protocols.</p>
        </div>
        <button onClick={fetchJobs} className="text-xs bg-neutral-900 border border-white/10 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-colors">
          Refresh Grid
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-950 border-b border-white/5 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Job ID</th>
                  <th className="px-6 py-4">Engine</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-neutral-600">Accessing database logs...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-neutral-600">No telemetry data found. Run a job first.</td></tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-neutral-800/30 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
                        {job.id.split('-')[0]}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-neutral-300">
                        {job.jobType.replace('job-', '').toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs uppercase text-neutral-300">
                        {job.targetFormat || 'RAW'}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {job.status === "COMPLETED" && job.path ? (
                          <a 
                            href={`http://localhost:5000/${job.path}`} 
                            download 
                            className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded hover:bg-neutral-300 transition-colors tracking-widest uppercase"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-neutral-600 text-xs tracking-widest uppercase">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;