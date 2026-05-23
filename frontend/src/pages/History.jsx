import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import client from '../api/client'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend)

const ROLE_COLORS = {
  'Data Scientist':         '#6366f1',
  'Full-Stack Developer':   '#0ea5e9',
  'Cyber Security Analyst': '#ef4444',
  'UI/UX Designer':         '#f59e0b',
  'Cloud Engineer':         '#10b981',
  'Product Manager':        '#8b5cf6',
}

export default function History() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null)   // tracks which row is fetching
  const { theme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    client.get('/history')
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load history.'))
      .finally(() => setLoading(false))
  }, [])

  const handleViewResult = async (e, predId) => {
    e.stopPropagation()          // prevent row-click from also firing
    setLoadingId(predId)
    try {
      const res = await client.get(`/history/${predId}`)
      navigate('/results', { state: { result: res.data, fromHistory: true } })
    } catch {
      toast.error('Failed to load prediction details.')
    } finally {
      setLoadingId(null)
    }
  }

  if (loading) return <div className="text-center py-20 text-slate-400 dark:text-slate-500">Loading history…</div>
  if (!data)   return null

  const { predictions, total, role_dist } = data

  const isDark = theme === 'dark'

  const doughnutData = {
    labels: role_dist.map(r => r.role),
    datasets: [{
      data: role_dist.map(r => r.count),
      backgroundColor: role_dist.map(r => ROLE_COLORS[r.role] || '#94a3b8'),
      borderWidth: 2,
      borderColor: isDark ? '#0f172a' : '#ffffff',
    }],
  }

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prediction History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{total} prediction{total !== 1 ? 's' : ''} on record.</p>
        </div>
        <Link to="/prediction"
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition duration-200">
          + New Prediction
        </Link>
      </div>

      {total === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-slate-700 dark:text-white font-semibold mb-2">No predictions yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Head to the prediction page and run your first career prediction.</p>
          <Link to="/prediction" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg transition duration-200">
            Go to Prediction
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Table */}
          <div className="lg:col-span-2 glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {['#', 'Predicted Role', 'CGPA', 'Aptitude', 'Programming', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {predictions.map((p, i) => {
                    const isRowLoading = loadingId === p.id
                    return (
                      <tr
                        key={p.id}
                        onClick={e => !isRowLoading && handleViewResult(e, p.id)}
                        className={`transition duration-150 ${
                          isRowLoading
                            ? 'opacity-60'
                            : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-bold text-brand-600 dark:text-brand-400">{p.predicted_role}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">{p.cgpa}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">{p.aptitude}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">{p.programming}</td>
                        <td className="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs">
                          {new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={e => handleViewResult(e, p.id)}
                            disabled={isRowLoading}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
                              bg-brand-50 dark:bg-brand-950/40
                              text-brand-600 dark:text-brand-400
                              border border-brand-200 dark:border-brand-800
                              hover:bg-brand-100 dark:hover:bg-brand-900/60
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition duration-150 whitespace-nowrap"
                          >
                            {isRowLoading ? (
                              <>
                                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Loading…
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                View Results
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doughnut chart */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Role Distribution</h3>
            {role_dist.length > 0 ? (
              <Doughnut data={doughnutData} options={{
                responsive: true,
                plugins: {
                  legend: { 
                    position: 'bottom', 
                    labels: { 
                      font: { size: 11 }, 
                      padding: 12,
                      color: isDark ? '#cbd5e1' : '#475569'
                    } 
                  },
                },
              }} />
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center mt-8">No data yet.</p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
