import { useState, useEffect } from "react";
import { supabase } from '../lib/supabaseClient'

export default function Projects() {
  // Jobs state from database
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ part_used: "", job_length: "", sale_price: "" });
  const [filter, setFilter] = useState("all"); // all | finished | inprogress

  // Fetch jobs from Supabase
  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase.from('Jobs').select('*').order('created_at', { ascending: false });
    if (!error) setJobs(data || []);
    setLoading(false);
  }

  // Add job handler
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!form.part_used || !form.job_length || !form.sale_price) return;
    setLoading(true);
    const { data, error } = await supabase.from('Jobs').insert([
      {
        part_used: form.part_used,
        job_length: Number(form.job_length),
        sale_price: Number(form.sale_price),
        finished: false,
        // Remove created_at, let Supabase default handle it
      },
    ]);
    setLoading(false);
    if (!error) {
      setForm({ part_used: '', job_length: '', sale_price: '' });
      fetchJobs();
    } else {
      alert('Failed to add job: ' + error.message);
    }
  };

  // Delete job handler
  const handleDelete = async (id) => {
    setLoading(true);
    await supabase.from('Jobs').delete().eq('id', id);
    setLoading(false);
    fetchJobs();
  };

  // Toggle finished handler
  const handleToggleFinished = async (id, finished) => {
    setLoading(true);
    await supabase.from('Jobs').update({ finished: !finished }).eq('id', id);
    setLoading(false);
    fetchJobs();
  };

  // Filtered jobs for display
  const filteredJobs = jobs.filter(job => {
    if (filter === "all") return true;
    if (filter === "finished") return job.finished;
    if (filter === "inprogress") return !job.finished;
    return true;
  });

  // Summary metrics
  const totalJobs = jobs.length;
  const finishedJobs = jobs.filter(j => j.finished).length;
  const inProgressJobs = jobs.filter(j => !j.finished).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-0">
      <div className="bg-white shadow-sm mb-8 rounded-b-3xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* No page title h1 */}
        </div>
      </div>
      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 px-4">
        <div className="bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Total Jobs</div>
            <div className="text-2xl font-bold">{totalJobs}</div>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-green-500 to-green-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Finished</div>
            <div className="text-2xl font-bold">{finishedJobs}</div>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-yellow-500 to-yellow-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">In Progress</div>
            <div className="text-2xl font-bold">{inProgressJobs}</div>
          </div>
        </div>
      </div>
      {/* Job Tracker Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 px-2 md:px-6 hover:shadow-xl transition mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
            Job Tracker
          </h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                filter === "all"
                  ? "bg-indigo-600 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                filter === "finished"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("finished")}
            >
              Finished
            </button>
            <button
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                filter === "inprogress"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("inprogress")}
            >
              In Progress
            </button>
          </div>
        </div>
        <form onSubmit={handleAddJob} className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Part Used"
            className="border border-indigo-200 rounded px-3 py-2 flex-1 min-w-[120px] focus:ring-2 focus:ring-indigo-400 transition"
            value={form.part_used}
            onChange={(e) => setForm({ ...form, part_used: e.target.value })}
          />
          <input
            type="number"
            placeholder="Job Length (days)"
            className="border border-indigo-200 rounded px-3 py-2 flex-1 min-w-[120px] focus:ring-2 focus:ring-indigo-400 transition"
            value={form.job_length}
            onChange={(e) => setForm({ ...form, job_length: e.target.value })}
          />
          <input
            type="number"
            placeholder="Sale Price"
            className="border border-indigo-200 rounded px-3 py-2 flex-1 min-w-[120px] focus:ring-2 focus:ring-indigo-400 transition"
            value={form.sale_price}
            onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
          />
          <button
            type="submit"
            className="bg-gray-200 text-black px-5 py-2 rounded hover:bg-gray-300 transition font-semibold"
          >
            Add Job
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 font-medium text-gray-700">Created</th>
                <th className="py-2 px-4 font-medium text-gray-700">Part Used</th>
                <th className="py-2 px-4 font-medium text-gray-700">Job Length</th>
                <th className="py-2 px-4 font-medium text-gray-700">Sale Price</th>
                <th className="py-2 px-4 font-medium text-gray-700">Status</th>
                <th className="py-2 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-4 text-center text-gray-400">Loading...</td></tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-400">
                    No jobs found.
                  </td>
                </tr>
              ) : filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className={`border-b last:border-0 ${job.finished ? "bg-green-50" : ""} hover:bg-indigo-50 transition`}
                >
                  <td className="py-2 px-4">{job.created_at}</td>
                  <td className="py-2 px-4">{job.part_used}</td>
                  <td className="py-2 px-4">{job.job_length} days</td>
                  <td className="py-2 px-4">${job.sale_price?.toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        job.finished
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {job.finished ? "Finished" : "In Progress"}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleToggleFinished(job.id, job.finished)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        job.finished
                          ? "bg-gray-200 text-black hover:bg-gray-300"
                          : "bg-green-600 text-black hover:bg-green-700"
                      }`}
                    >
                      {job.finished ? "Undo" : "Mark Finished"}
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-black hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}