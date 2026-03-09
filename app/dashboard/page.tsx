"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchJobs = async () => {
    try {
      const res = await axios.get("https://avmg-b-production.up.railway.app/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch telemetry", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' | ' + d.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED': return <span className="bg-green-500 text-black border-2 border-green-500 px-3 py-1 text-xs tracking-[0.2em] font-black uppercase">COMPLETED</span>;
      case 'PROCESSING': return <span className="bg-yellow-400 text-black border-2 border-yellow-400 px-3 py-1 text-xs tracking-[0.2em] font-black uppercase animate-pulse">PROCESSING</span>;
      case 'FAILED': return <span className="bg-red-500 text-black border-2 border-red-500 px-3 py-1 text-xs tracking-[0.2em] font-black uppercase">FAILED</span>;
      default: return <span className="bg-neutral-600 text-white border-2 border-neutral-600 px-3 py-1 text-xs tracking-[0.2em] font-black uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-white selection:text-black">
      
      {/* TOP NAV */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link href="/" className="inline-block text-xl font-bold text-white hover:text-black hover:bg-white transition-colors uppercase tracking-widest border-2 border-white px-4 py-2 shadow-[4px_4px_0_0_#555555] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#555555]">
          &lt;&lt; SYS.HUB_RETURN
        </Link>
      </div>

      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="border-l-8 border-white pl-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_#888888] uppercase mb-2">
            TELEMETRY_DASH
          </h1>
          <p className="text-gray-400 font-bold tracking-widest text-sm uppercase">
            // Global Ledger of System Mutations
          </p>
        </div>
        
        <button 
          onClick={fetchJobs} 
          className="bg-white text-black font-black uppercase tracking-[0.2em] px-6 py-4 border-4 border-white shadow-[6px_6px_0_0_#ff00ff] hover:bg-gray-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#ff00ff] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
        >
          [ REFRESH_GRID ]
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="crt-terminal bg-black border-4 border-white p-2 md:p-8 shadow-[12px_12px_0_0_#00ffff] relative overflow-hidden">
          
          <div className="flex justify-between items-center border-b-4 border-white pb-4 mb-6 relative z-20">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">
              SYS.DB_OUTPUT
            </h3>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
              <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
              <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
            </div>
          </div>

          <div className="overflow-x-auto relative z-20">
            <table className="w-full text-left text-sm text-white min-w-[800px]">
              <thead className="bg-white text-black text-xs uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-6 py-4 border-b-4 border-white">JOB_ID</th>
                  <th className="px-6 py-4 border-b-4 border-white">ENGINE</th>
                  <th className="px-6 py-4 border-b-4 border-white">STATUS</th>
                  <th className="px-6 py-4 border-b-4 border-white">TARGET_FMT</th>
                  <th className="px-6 py-4 border-b-4 border-white">TIMESTAMP</th>
                  <th className="px-6 py-4 border-b-4 border-white text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-neutral-900 bg-black">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-white font-bold tracking-widest uppercase animate-pulse">&gt; ACCESSING_DB_RECORDS...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-bold tracking-widest uppercase">&gt; NO_TELEMETRY_FOUND. INITIATE_A_JOB.</td></tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-neutral-900 transition-colors group">
                      <td className="px-6 py-6 font-mono text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                        {job.id.split('-')[0]}
                      </td>
                      <td className="px-6 py-6 text-sm font-black text-cyan-400 tracking-wider">
                        {job.jobType.replace('job-', '').toUpperCase()}
                      </td>
                      <td className="px-6 py-6">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-6 font-mono text-sm font-black text-pink-500 tracking-widest">
                        {job.targetFormat ? `.${job.targetFormat.toUpperCase()}` : 'RAW_DATA'}
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-gray-400 tracking-wider">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-6 text-right">
                        {job.status === "COMPLETED" && job.path ? (
                          <a 
                            href={`https://avmg-b-production.up.railway.app/${job.path}`} 
                            download 
                            className="inline-block bg-white text-black border-4 border-white px-4 py-2 font-black tracking-widest uppercase hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_#00ffff]"
                          >
                            [ GET_DATA ]
                          </a>
                        ) : (
                          <span className="text-gray-600 text-xs font-black tracking-widest uppercase px-4">LOCKED</span>
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