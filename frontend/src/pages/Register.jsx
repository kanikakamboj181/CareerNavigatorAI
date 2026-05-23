import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiUserPlus, FiBarChart2 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import toast from 'react-hot-toast'
import SliderField from '../components/SliderField'

const DEFAULT_SKILLS = {
  cgpa: 7.0, aptitude: 60, programming: 5, data_structures: 5,
  communication: 5, public_speaking: 5, creative_thinking: 5,
}

export default function Register() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '', ...DEFAULT_SKILLS })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false })

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSlider = (id, val) => setForm(p => ({ ...p, [id]: val }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post('/auth/register', form)
      login(res.data.token, res.data.user)
      toast.success('Account created! Welcome aboard.')
      navigate('/prediction')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500 transition-all duration-200"

  return (
    <div className="flex justify-center py-4 page-enter">
      <div className="w-full max-w-2xl glass-card p-8">
        <div className="text-center mb-7">
          <div className="text-5xl mb-3 text-brand-600 mx-auto w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
            <FiUserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Set up your profile and baseline skills</p>
        </div>

        <form onSubmit={submit} noValidate>
          {/* Account fields */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              ['username', 'Username', 'text', 'e.g. alex_dev', 'username'],
              ['email', 'Email', 'email', 'you@example.com', 'email'],
              ['password', 'Password', 'password', 'At least 6 characters', 'new-password'],
              ['confirm', 'Confirm Password', 'password', 'Repeat password', 'new-password'],
            ].map(([name, label, type, ph, ac]) => (
              <div key={name} className={name !== 'username' && name !== 'email' ? '' : ''}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                <div className={name === 'password' || name === 'confirm' ? 'relative' : ''}>
                  <input name={name} type={name === 'password' || name === 'confirm' ? (showPassword[name] ? 'text' : 'password') : type} value={form[name]} onChange={handle}
                    placeholder={ph} required autoComplete={ac} className={name === 'password' || name === 'confirm' ? `${inputCls} pr-12` : inputCls} />
                  {(name === 'password' || name === 'confirm') && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => ({ ...p, [name]: !p[name] }))}
                      className="absolute right-3 top-0 bottom-0 my-auto flex h-10 items-center justify-center text-slate-500 dark:text-slate-400 focus:outline-none"
                      aria-label={showPassword[name] ? 'Hide password' : 'Show password'}
                    >
                      {showPassword[name] ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Skill sliders */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mb-6">
            <h3 className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4" /> Your Baseline Skills
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
              These become your default profile for Quick Predict. You can update them anytime.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <SliderField id="cgpa"             label="CGPA"                  description="0.0 – 10.0"  min={0}   max={10}  step={0.1} value={form.cgpa}             onChange={handleSlider} />
              <SliderField id="aptitude"         label="Aptitude Score"        description="1 – 100"     min={1}   max={100} step={1}   value={form.aptitude}         onChange={handleSlider} />
              <SliderField id="programming"      label="Programming Skill"     description="1 – 10"      min={1}   max={10}  step={0.5} value={form.programming}      onChange={handleSlider} />
              <SliderField id="data_structures"  label="Data Structures"       description="1 – 10"      min={1}   max={10}  step={0.5} value={form.data_structures}  onChange={handleSlider} />
              <SliderField id="communication"    label="Communication"         description="1 – 10"      min={1}   max={10}  step={0.5} value={form.communication}    onChange={handleSlider} />
              <SliderField id="public_speaking"  label="Public Speaking"       description="1 – 10"      min={1}   max={10}  step={0.5} value={form.public_speaking}  onChange={handleSlider} />
              <SliderField id="creative_thinking" label="Creative Thinking"    description="1 – 10"      min={1}   max={10}  step={0.5} value={form.creative_thinking} onChange={handleSlider} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary disabled:opacity-60 py-3 font-semibold text-white">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
