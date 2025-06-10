import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  // Mock time range and data
  const [range, setRange] = useState('30')
  // Example mock data for line graphs
  const revenueData = [1000, 1200, 900, 1500, 1300]
  const profitData = [200, 300, 150, 400, 350]
  const jobsData = [2, 3, 1, 4, 3]
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']

  // Helper to render a simple line graph
  function LineGraph({ data, color, labels, yLabel }) {
    const max = Math.max(...data, 1)
    const min = Math.min(...data, 0)
    const points = data.map((val, idx) => {
      const x = 40 + idx * ((220) / (data.length - 1 || 1))
      const y = 20 + (120 * (1 - (val - min) / (max - min || 1)))
      return `${x},${y}`
    }).join(' ')
    return (
      <svg width="100%" height="160" viewBox="0 0 280 160" className="w-full h-40">
        {/* Y axis lines and labels */}
        {[0, 0.5, 1].map((p, i) => {
          const y = 20 + 120 * p
          const val = Math.round(max - (max - min) * p)
          return (
            <g key={i}>
              <line x1={40} x2={260} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 2" />
              <text x={0} y={y + 4} fontSize="10" fill="#6b7280">{val}</text>
            </g>
          )
        })}
        {/* Line path */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
        />
        {/* Dots */}
        {data.map((val, idx) => {
          const x = 40 + idx * ((220) / (data.length - 1 || 1))
          const y = 20 + (120 * (1 - (val - min) / (max - min || 1)))
          return (
            <circle key={idx} cx={x} cy={y} r="4" fill={color} />
          )
        })}
        {/* X axis labels */}
        {labels.map((label, idx) => {
          const x = 40 + idx * ((220) / (data.length - 1 || 1))
          return (
            <text key={idx} x={x} y={155} textAnchor="middle" fontSize="10" fill="#6b7280">{label}</text>
          )
        })}
        {/* Y axis label */}
        {yLabel && (
          <text x={10} y={10} fontSize="12" fill="#6b7280">{yLabel}</text>
        )}
      </svg>
    )
  }

  // Summary metrics (mock)
  const totalRevenue = revenueData.reduce((a, b) => a + b, 0)
  const totalProfit = profitData.reduce((a, b) => a + b, 0)
  const totalJobs = jobsData.reduce((a, b) => a + b, 0)

  // Fetch jobs in progress and recently added inventory from database
  // For demonstration, assume you have a supabase table 'Jobs' and 'Inventory'
  const [jobsInProgress, setJobsInProgress] = useState([])
  const [recentInventory, setRecentInventory] = useState([])
  const [loadingInventory, setLoadingInventory] = useState(true)

  useEffect(() => {
    // Fetch jobs in progress (not finished)
    supabase.from('Jobs').select('*').eq('finished', false).order('created_at', { ascending: false })
      .then(({ data }) => setJobsInProgress(data || []))
    // Fetch recently added inventory (last 5 added)
    fetchRecentInventory()
  }, [])

  async function fetchRecentInventory() {
    setLoadingInventory(true)
    const { data, error } = await supabase
      .from('Inventory')
      .select('*')
      .order('added_at', { ascending: false })
      .limit(5)
    if (!error) setRecentInventory(data || [])
    setLoadingInventory(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-0">
      <div className="bg-white shadow-sm mb-8 rounded-b-3xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Remove the page title h1 to avoid duplicate page name */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700 text-lg">Time Range:</label>
            <select
              value={range}
              onChange={e => setRange(e.target.value)}
              className="border border-indigo-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 px-4">
        <div className="bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v4a3 3 0 006 0v-4c0-1.657-1.343-3-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Total Revenue</div>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-green-500 to-green-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v4a3 3 0 006 0v-4c0-1.657-1.343-3-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Total Profit</div>
            <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-gradient-to-tr from-purple-500 to-fuchsia-400 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.03] transition">
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20H4v-2a4 4 0 014-4h1" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">Jobs Completed</div>
            <div className="text-2xl font-bold">{totalJobs}</div>
          </div>
        </div>
      </div>
      {/* Graphs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-indigo-700 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              <polyline points="7 9 12 4 17 9" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
            Revenue Trend
          </h2>
          <LineGraph data={revenueData} color="#3b82f6" labels={labels} yLabel="Revenue" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-green-700 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              <polyline points="7 9 12 4 17 9" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
            Profit Trend
          </h2>
          <LineGraph data={profitData} color="#22c55e" labels={labels} yLabel="Profit" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-fuchsia-700 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              <polyline points="7 9 12 4 17 9" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
            Jobs Completed
          </h2>
          <LineGraph data={jobsData} color="#a21caf" labels={labels} yLabel="Jobs" />
        </div>
      </div>
      {/* Snapshot Tables */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-12 mb-10">
        {/* Jobs In Progress Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-indigo-700 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
            Jobs In Progress
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 font-medium text-gray-700">Name</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Part Used</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Created</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Sale Price</th>
                </tr>
              </thead>
              <tbody>
                {jobsInProgress.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">
                      No jobs in progress.
                    </td>
                  </tr>
                )}
                {jobsInProgress.map(job => (
                  <tr key={job.id} className="border-b last:border-0 hover:bg-indigo-50 transition">
                    <td className="py-2 px-4 font-medium">{job.name}</td>
                    <td className="py-2 px-4">{job.part_used}</td>
                    <td className="py-2 px-4">{job.created_at}</td>
                    <td className="py-2 px-4">${job.sale_price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recently Added Inventory Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-fuchsia-700 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
            Recently Added Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 font-medium text-gray-700">Model</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Part Name</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Quantity</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Cost</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Added</th>
                </tr>
              </thead>
              <tbody>
                {loadingInventory ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400">Loading...</td></tr>
                ) : recentInventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-400">
                      No recent inventory.
                    </td>
                  </tr>
                ) : recentInventory.map(item => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-fuchsia-50 transition">
                    <td className="py-2 px-4 font-medium">{item.model}</td>
                    <td className="py-2 px-4">{item.part_name}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">${item.part_cost?.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="py-2 px-4">{item.added_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}