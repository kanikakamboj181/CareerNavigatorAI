import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import toast from 'react-hot-toast'
import { FiBook, FiCode, FiUsers, FiCpu, FiPlay, FiZap } from 'react-icons/fi'
import SliderField from '../components/SliderField'

export default function Prediction() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  // Pre-fill sliders from the user's saved profile
  const [skills, setSkills] = useState({
    cgpa:             user?.cgpa             ?? 7.0,
    aptitude:         user?.aptitude         ?? 60,
    programming:      user?.programming      ?? 5,
    data_structures:  user?.data_structures  ?? 5,
    communication:    user?.communication    ?? 5,
    public_speaking:  user?.public_speaking  ?? 5,
    creative_thinking:user?.creative_thinking?? 5,
  })
  const [loading, setLoading] = useState(false)

  const handleSlider = (id, val) => setSkills(p => ({ ...p, [id]: val }))

  const runPredict = async (mode) => {
    setLoading(true)
    try {
      const payload = mode === 'quick' ? { mode: 'quick' } : { mode: 'custom', ...skills }
      const res = await client.post('/predict', payload)
      // Pass result via location state so Results page can render it
      await refreshUser()
      navigate('/results', { state: { result: res.data } })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiCpu className="w-6 h-6 text-brand-600" /> AI Career Prediction
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Adjust the sliders to reflect your current skills, then run our Random Forest ML model.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main form */}
        <div className="lg:col-span-2 glass-card p-6">

          <div className="mb-6">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
              <FiBook className="w-4 h-4" /> Academic
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <SliderField id="cgpa"     label="CGPA"           description="Cumulative GPA (0.0 – 10.0)" min={0}  max={10}  step={0.1} value={skills.cgpa}     onChange={handleSlider} />
              <SliderField id="aptitude" label="Aptitude Score" description="Logical reasoning test (1 – 100)" min={1} max={100} step={1}   value={skills.aptitude} onChange={handleSlider} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
              <FiCode className="w-4 h-4" /> Technical Skills
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <SliderField id="programming"     label="Programming Skill"    description="Writing & debugging code (1–10)"       min={1} max={10} step={0.5} value={skills.programming}     onChange={handleSlider} />
              <SliderField id="data_structures" label="Data Structures"      description="Arrays, trees, algorithms (1–10)"      min={1} max={10} step={0.5} value={skills.data_structures} onChange={handleSlider} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
              <FiUsers className="w-4 h-4" /> Soft Skills
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <SliderField id="communication"     label="Communication"      description="Conveying ideas clearly (1–10)"        min={1} max={10} step={0.5} value={skills.communication}     onChange={handleSlider} />
              <SliderField id="public_speaking"   label="Public Speaking"    description="Presenting to groups (1–10)"           min={1} max={10} step={0.5} value={skills.public_speaking}   onChange={handleSlider} />
              <SliderField id="creative_thinking" label="Creative Thinking"  description="Generating novel ideas (1–10)"         min={1} max={10} step={0.5} value={skills.creative_thinking} onChange={handleSlider} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runPredict('custom')} disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200"
            >
              {loading ? '⏳ Running ML Model…' : <><FiPlay className="w-5 h-5" /> Run Prediction</>}
            </button>
            <button
              onClick={() => runPredict('quick')} disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-800/20 disabled:opacity-60 font-bold py-3 rounded-xl transition duration-200"
            >
              <FiZap className="w-5 h-5" /> Quick Predict
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">How It Works</h3>
            <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {[
                'Drag sliders to reflect your current skill levels honestly.',
                'Your scores are scaled and passed to a trained Random Forest model.',
                'The model returns a recommended role with suitability percentages.',
                'Review your Radar Chart and personalised learning roadmap.',
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">{i+1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5">
            <p className="text-indigo-800 dark:text-indigo-300 text-sm">
              <strong>💡 Tip:</strong> Rate yourself honestly — the model works best when
              scores reflect where you are today, not where you aspire to be.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
