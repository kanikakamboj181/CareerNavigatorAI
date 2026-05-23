import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { FiArrowLeft, FiExternalLink, FiClipboard, FiHome, FiRefreshCw, FiShuffle, FiTrendingUp, FiMapPin, FiDollarSign, FiTarget, FiStar, FiMap } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler,
  Tooltip, Legend, CategoryScale, LinearScale, BarElement
)

export default function Results() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const { theme }  = useTheme()
  const result      = state?.result
  const fromHistory  = state?.fromHistory ?? false

  // If someone navigates here directly without a result, send them to prediction page
  useEffect(() => {
    if (!result) navigate('/prediction', { replace: true })
  }, [result, navigate])

  if (!result) return null

  const {
    predicted_role, role_meta, alt_role, alt_score, alt_meta,
    role_scores, inputs,
  } = result

  const sortedRoles = Object.entries(role_scores).sort((a, b) => b[1] - a[1])

  const isDark = theme === 'dark'

  // ── Radar chart configuration ─────────────────────────────────────────────
  const radarData = {
    labels: ['CGPA×10', 'Aptitude', 'Prog×10', 'DS×10', 'Comm×10', 'Speaking×10', 'Creative×10'],
    datasets: [{
      label: 'Your Profile',
      data: [
        inputs.cgpa * 10, inputs.aptitude,
        inputs.programming * 10, inputs.data_structures * 10,
        inputs.communication * 10, inputs.public_speaking * 10,
        inputs.creative_thinking * 10,
      ],
      backgroundColor: isDark ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.15)',
      borderColor:     isDark ? 'rgba(129, 140, 248, 0.9)' : 'rgba(99, 102, 241, 0.9)',
      pointBackgroundColor: isDark ? '#818cf8' : '#6366f1',
      pointRadius: 4,
      borderWidth: 2,
    }],
  }

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { 
          stepSize: 20, 
          font: { size: 9 }, 
          color: isDark ? '#94a3b8' : '#64748b',
          backdropColor: 'transparent'
        },
        pointLabels: { 
          font: { size: 10, weight: '600' }, 
          color: isDark ? '#cbd5e1' : '#475569' 
        },
        grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
        angleLines: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
      },
    },
    plugins: { legend: { display: false } },
  }

  // ── Bar chart configuration ───────────────────────────────────────────────
  const barData = {
    labels: sortedRoles.map(([r]) => r),
    datasets: [{
      label: 'Suitability %',
      data: sortedRoles.map(([, s]) => s),
      backgroundColor: sortedRoles.map(([r]) =>
        r === predicted_role 
          ? (isDark ? '#818cf8' : '#6366f1')
          : (isDark ? '#334155' : '#cbd5e1')
      ),
      borderRadius: 6,
      borderSkipped: false,
    }],
  }

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: { 
        min: 0, max: 100, 
        ticks: { 
          callback: v => v + '%', 
          font: { size: 10 },
          color: isDark ? '#94a3b8' : '#475569'
        }, 
        grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' } 
      },
      y: { 
        ticks: { 
          font: { size: 11 },
          color: isDark ? '#cbd5e1' : '#475569'
        }, 
        grid: { display: false } 
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x.toFixed(1)}% suitability` } },
    },
  }

  return (
    <div className="page-enter">

      {/* Back to History banner — only shown when opened from History */}
      {fromHistory && (
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-5 text-sm font-semibold
            text-slate-600 dark:text-slate-300
            hover:text-brand-600 dark:hover:text-brand-400
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            hover:border-brand-300 dark:hover:border-brand-700
            px-4 py-2 rounded-xl shadow-sm transition duration-200"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to History
        </button>
      )}

      {/* Top banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center mb-8 shadow-xl">
        <p className="text-indigo-200 text-sm font-semibold mb-2 uppercase tracking-wider">AI Recommendation</p>
        <div className="text-6xl mb-3">{role_meta?.icon || <FiTarget className="w-20 h-20 mx-auto" />}</div>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{predicted_role}</h1>
        <p className="text-indigo-100 max-w-lg mx-auto text-sm leading-relaxed">{role_meta?.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Radar chart */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-1">Your Skill Radar</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">All values normalised to 0–100 for visual comparison.</p>
          <div className="flex justify-center">
            <div style={{ maxWidth: 340, width: '100%' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-1">Role Suitability Scores</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">
            Probability % from the Random Forest's predict_proba() output.
          </p>
          <Bar data={barData} options={barOptions} height={220} />
        </div>

      </div>

      {/* Suitability breakdown */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Suitability Breakdown</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRoles.map(([role, score]) => (
            <div key={role}
              className={`border rounded-xl p-4 transition-all duration-300 ${
                role === predicted_role 
                  ? 'ring-2 ring-brand-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800' 
                  : 'border-slate-100 dark:border-slate-800/80'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-semibold flex items-center gap-1 ${role === predicted_role ? 'text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {role === predicted_role && <FiStar className="w-4 h-4 text-amber-400" />} {role}
                </span>
                <span className={`text-sm font-bold ${role === predicted_role ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>{score}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${score}%`, background: role === predicted_role ? '#6366f1' : '#94a3b8' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input summary */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Your Input Profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            ['CGPA', inputs.cgpa],
            ['Aptitude', inputs.aptitude],
            ['Programming', inputs.programming],
            ['Data Struct.', inputs.data_structures],
            ['Communication', inputs.communication],
            ['Public Speaking', inputs.public_speaking],
            ['Creative', inputs.creative_thinking],
          ].map(([label, val]) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center border border-slate-100/10">
              <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400">{val}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning roadmap */}
      {role_meta && (
        <div className="glass-card p-6 mb-6">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">
            <FiMap className="w-5 h-5 inline-block mr-2" /> Learning Roadmap for <span className="text-brand-600 dark:text-brand-400">{predicted_role}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Key Skills to Develop</h3>
              <ul className="space-y-2">
                {role_meta.skills?.map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Curated Resources</h3>
              <ul className="space-y-2">
                {role_meta.resources?.map(r => (
                  <li key={r.label}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline">
                      <FiExternalLink className="w-4 h-4" /> {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Market data row */}
          {(role_meta.salary || role_meta.active_jobs || role_meta.demand_trend) && (
            <div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              {role_meta.salary && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center border border-slate-100/10">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 inline-flex items-center justify-center gap-1">
                    <FiDollarSign className="w-4 h-4" /> Salary Range
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{role_meta.salary}</div>
                </div>
              )}
              {role_meta.active_jobs && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center border border-slate-100/10">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 inline-flex items-center justify-center gap-1">
                    <FiMapPin className="w-4 h-4" /> Active Jobs
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{role_meta.active_jobs}</div>
                </div>
              )}
              {role_meta.demand_trend && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center border border-slate-100/10">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 inline-flex items-center justify-center gap-1">
                    <FiTrendingUp className="w-4 h-4" /> Demand Trend
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{role_meta.demand_trend}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Alternative path */}
      {alt_role && (
        <div className="glass-card p-6 mb-6 border-l-4 border-purple-400 dark:border-purple-500">
          <h2 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
            <FiShuffle className="w-5 h-5" /> Alternative Career Path
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
            Your profile also shows strong alignment with <strong>{alt_role}</strong> ({alt_score}% suitability).
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{alt_meta?.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {fromHistory ? (
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to History
          </button>
        ) : (
          <Link to="/prediction" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-200">
            <FiRefreshCw className="w-4 h-4" /> Try Again
          </Link>
        )}
        <Link to="/history" className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 hover:border-brand-400 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold px-6 py-3 rounded-xl transition duration-200">
          <FiClipboard className="w-4 h-4" /> View History
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 hover:border-brand-400 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold px-6 py-3 rounded-xl transition duration-200">
          <FiHome className="w-4 h-4" /> Home
        </Link>
      </div>

    </div>
  )
}
