import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post('/auth/login', form)
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.username}!`)
      navigate('/prediction')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[75vh] page-enter px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md glass-card p-8 shadow-2xl border border-slate-200/70 dark:border-slate-800/70">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 h-16 w-16 rounded-3xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white flex items-center justify-center shadow-xl">
            <FiLogIn className="w-7 h-7" />
          </div>
          <p className="text-sm uppercase tracking-[0.24em] text-accent-500 mb-3">CareerNavigatorAI</p>
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Log in and continue your personalized career journey.</p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username or Email</label>
            <input
              name="identifier"
              value={form.identifier}
              onChange={handle}
              placeholder="username or email"
              required
              autoComplete="username"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 btn-primary py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
