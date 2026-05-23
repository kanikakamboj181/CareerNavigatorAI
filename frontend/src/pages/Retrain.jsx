/**
 * Retrain.jsx
 * Triggers the ML pipeline + training on the backend and polls for status.
 * Shows a live progress indicator and the final accuracy once done.
 */
import { useState, useEffect, useRef } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'

const STATUS_META = {
  idle:    { color: 'text-slate-500',   bg: 'bg-slate-100',   label: 'Idle' },
  running: { color: 'text-amber-600',   bg: 'bg-amber-50',    label: 'Running…' },
  success: { color: 'text-emerald-600', bg: 'bg-emerald-50',  label: 'Complete' },
  error:   { color: 'text-red-600',     bg: 'bg-red-50',      label: 'Failed' },
}

export default function Retrain() {
  const [state, setState]     = useState({ status: 'idle', message: '', accuracy: null, started_at: null, finished_at: null })
  const [loading, setLoading] = useState(false)
  const pollRef               = useRef(null)

  // Poll /api/retrain/status every 2 s while running
  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await client.get('/retrain/status')
        setState(res.data)
        if (res.data.status !== 'running') {
          clearInterval(pollRef.current)
          if (res.data.status === 'success') toast.success('Model retrained successfully!')
          if (res.data.status === 'error')   toast.error('Retraining failed. Check logs.')
        }
      } catch {
        clearInterval(pollRef.current)
      }
    }, 2000)
  }

  // Fetch current status on mount (in case a retrain is already running)
  useEffect(() => {
    client.get('/retrain/status').then(res => {
      setState(res.data)
      if (res.data.status === 'running') startPolling()
    }).catch(() => {})
    return () => clearInterval(pollRef.current)
  }, [])

  const handleRetrain = async () => {
    setLoading(true)
    try {
      await client.post('/retrain')
      setState(s => ({ ...s, status: 'running', message: 'Starting pipeline and training…' }))
      startPolling()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start retraining.')
    } finally {
      setLoading(false)
    }
  }

  const meta = STATUS_META[state.status] || STATUS_META.idle
  const isRunning = state.status === 'running'

  return (
    <div className="page-enter max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Retrain Model</h1>
      <p className="text-slate-500 text-sm mb-8">
        Regenerates the synthetic dataset, re-runs the preprocessing pipeline,
        trains a fresh Random Forest classifier, and hot-reloads it into the
        running Flask server — no restart needed.
      </p>

      {/* Status card */}
      <div className={`${meta.bg} rounded-2xl p-6 mb-6 border border-slate-100`}>
        <div className="flex items-center gap-3 mb-3">
          {isRunning && (
            <svg className="animate-spin h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          )}
          <span className={`font-bold text-lg ${meta.color}`}>{meta.label}</span>
        </div>

        {state.message && (
          <p className="text-sm text-slate-600 mb-3">{state.message}</p>
        )}

        {state.accuracy !== null && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-slate-500 text-sm">Model accuracy:</span>
            <span className="text-2xl font-extrabold text-emerald-600">{state.accuracy}%</span>
          </div>
        )}

        {(state.started_at || state.finished_at) && (
          <div className="mt-3 text-xs text-slate-400 space-y-0.5">
            {state.started_at  && <div>Started:  {new Date(state.started_at).toLocaleTimeString()}</div>}
            {state.finished_at && <div>Finished: {new Date(state.finished_at).toLocaleTimeString()}</div>}
          </div>
        )}
      </div>

      {/* Steps explanation */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-bold text-slate-800 mb-4">What happens during retraining</h2>
        <ol className="space-y-3">
          {[
            ['1', 'data_pipeline.py', 'Generates 498 synthetic student records with realistic skill distributions, applies StandardScaler, and saves train/test splits.'],
            ['2', 'train_model.py',   'Trains Random Forest (300 trees) and Decision Tree classifiers, prints confusion matrix + classification report, saves the best model.'],
            ['3', 'Hot reload',       'The Flask model service reloads the new .pkl files in-memory — predictions immediately use the retrained model.'],
          ].map(([n, title, desc]) => (
            <li key={n} className="flex gap-3">
              <span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">{n}</span>
              <div>
                <span className="font-semibold text-slate-700 text-sm">{title}</span>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={handleRetrain}
        disabled={loading || isRunning}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl shadow transition"
      >
        {isRunning ? '⏳ Retraining in progress…' : '🔁 Start Retraining'}
      </button>
    </div>
  )
}
