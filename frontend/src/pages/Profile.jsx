import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiLock, FiUser, FiSave, FiEdit2, FiBarChart2, FiRefreshCcw } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import toast from 'react-hot-toast'
import SliderField from '../components/SliderField'

export default function Profile() {
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()

  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    cgpa: 7.0,
    aptitude: 60,
    programming: 5.0,
    data_structures: 5.0,
    communication: 5.0,
    public_speaking: 5.0,
    creative_thinking: 5.0,
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        username:          user.username          || '',
        email:             user.email             || '',
        cgpa:              user.cgpa              ?? 7.0,
        aptitude:          user.aptitude          ?? 60,
        programming:       user.programming       ?? 5.0,
        data_structures:   user.data_structures   ?? 5.0,
        communication:     user.communication     ?? 5.0,
        public_speaking:   user.public_speaking   ?? 5.0,
        creative_thinking: user.creative_thinking ?? 5.0,
      })
    }
  }, [user])

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [profileLoading,  setProfileLoading]  = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState({ current_password: false, new_password: false, confirm_password: false })
  const [editingProfile, setEditingProfile] = useState(false)

  const setProfileFormFromUser = (userData) => {
    setProfileForm({
      username:          userData.username          || '',
      email:             userData.email             || '',
      cgpa:              userData.cgpa              ?? 7.0,
      aptitude:          userData.aptitude          ?? 60,
      programming:       userData.programming       ?? 5.0,
      data_structures:   userData.data_structures   ?? 5.0,
      communication:     userData.communication     ?? 5.0,
      public_speaking:   userData.public_speaking   ?? 5.0,
      creative_thinking: userData.creative_thinking ?? 5.0,
    })
  }

  const handleProfileSlider = (id, val) => setProfileForm(p => ({ ...p, [id]: val }))
  const handleProfileText   = e => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handlePasswordText  = e => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const enableProfileEditing = () => {
    setEditingProfile(true)
  }

  const saveProfile = async () => {
    setProfileLoading(true)
    try {
      const res = await client.put('/profile', profileForm)
      toast.success(res.data.message)
      await refreshUser()
      setEditingProfile(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Profile update failed.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    await saveProfile()
  }

  const submitPassword = async e => {
    e.preventDefault()
    setPasswordError('')

    const current = passwordForm.current_password.trim()
    const newPassword = passwordForm.new_password.trim()
    const confirmPassword = passwordForm.confirm_password.trim()

    if (!current || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    setPasswordLoading(true)
    try {
      const res = await client.put('/profile', passwordForm, { skipAuthRedirect: true })
      toast.success(res.data.message)
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
      setPasswordError('')
      logout()
      navigate('/login')
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Password update failed.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const inputCls = `w-full border border-slate-300 dark:border-slate-700
    bg-white dark:bg-slate-950
    text-slate-900 dark:text-white
    placeholder-slate-400 dark:placeholder-slate-500
    rounded-xl px-4 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-400
    transition-all duration-200`

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Edit your account details, baseline academic scores, and skill ratings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── LEFT: profile + skills form ── */}
        <div className="md:col-span-2 space-y-6">

          <form onSubmit={handleProfileSubmit} className="glass-card p-6 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest inline-flex items-center gap-2">
                    <FiUser className="w-4 h-4" /> Account Details
                  </h2>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${editingProfile ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {editingProfile ? 'Editing' : 'Locked'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tap the icon to edit your profile fields, then use Save Changes to persist updates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={enableProfileEditing}
                  disabled={profileLoading || editingProfile}
                  title="Edit profile"
                  aria-label="Edit profile"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition ${editingProfile ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-brand-500 bg-white text-brand-600 hover:bg-brand-50'} ${profileLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileText}
                  required
                  disabled={!editingProfile}
                  className={`${inputCls} ${!editingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileText}
                  required
                  disabled={!editingProfile}
                  className={`${inputCls} ${!editingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            {/* Baseline Skills */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1 inline-flex items-center gap-2">
                <FiBarChart2 className="w-4 h-4" /> Baseline Prediction Skills
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
                These values pre-fill your Prediction page sliders by default.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-6">
                <SliderField id="cgpa"             label="CGPA"             min={0}  max={10}  step={0.1} value={profileForm.cgpa}             onChange={handleProfileSlider} disabled={!editingProfile} />
                <SliderField id="aptitude"         label="Aptitude Score"   min={1}  max={100} step={1}   value={profileForm.aptitude}         onChange={handleProfileSlider} disabled={!editingProfile} />
                <SliderField id="programming"      label="Programming"      min={1}  max={10}  step={0.5} value={profileForm.programming}      onChange={handleProfileSlider} disabled={!editingProfile} />
                <SliderField id="data_structures"  label="Data Structures"  min={1}  max={10}  step={0.5} value={profileForm.data_structures}  onChange={handleProfileSlider} disabled={!editingProfile} />
                <SliderField id="communication"    label="Communication"    min={1}  max={10}  step={0.5} value={profileForm.communication}    onChange={handleProfileSlider} disabled={!editingProfile} />
                <SliderField id="public_speaking"  label="Public Speaking"  min={1}  max={10}  step={0.5} value={profileForm.public_speaking}  onChange={handleProfileSlider} disabled={!editingProfile} />
                <SliderField id="creative_thinking" label="Creative Thinking" min={1} max={10} step={0.5} value={profileForm.creative_thinking} onChange={handleProfileSlider} disabled={!editingProfile} />
              </div>
              {editingProfile && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
                  >
                    {profileLoading ? 'Saving…' : <><FiSave className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          </form>

        </div>

        {/* ── RIGHT: avatar card + password ── */}
        <div className="space-y-6">

          {/* Avatar Summary */}
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-500 to-alt-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg mb-3">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{user?.username}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate w-full mb-3">{user?.email}</p>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
              Since {memberSince}
            </span>
          </div>

          {/* Change Password */}
          <form onSubmit={submitPassword} className="glass-card p-6 space-y-4" noValidate>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <FiLock className="w-4 h-4" />
              Change Password
            </h3>

            {[
              ['current_password', 'Current Password',  'current-password'],
              ['new_password',     'New Password',       'new-password'],
              ['confirm_password', 'Confirm Password',   'new-password'],
            ].map(([name, label, ac]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={showPassword[name] ? 'text' : 'password'}
                    name={name}
                    value={passwordForm[name]}
                    onChange={handlePasswordText}
                    autoComplete={ac}
                    required
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => ({ ...p, [name]: !p[name] }))}
                    className="absolute right-3 top-0 bottom-0 my-auto flex h-10 items-center justify-center text-slate-500 dark:text-slate-400"
                    aria-label={showPassword[name] ? 'Hide password' : 'Show password'}
                  >
                    {showPassword[name] ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}

            {passwordError && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full inline-flex items-center justify-center gap-2 border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 disabled:opacity-60 font-bold py-2.5 rounded-xl text-sm transition duration-200"
            >
              {passwordLoading ? <><FiRefreshCcw className="w-4 h-4 animate-spin" /> Updating…</> : <><FiRefreshCcw className="w-4 h-4" /> Update Password</>}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
