import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiZap, FiClipboard, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setDropdownOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully.')
    navigate('/')
  }

  const navLink = (to, icon, label) => (
    <Link
      to={to}
      className={`text-sm px-4 py-2 rounded-2xl transition-all duration-200 font-semibold inline-flex items-center gap-2
        ${pathname === to
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/10'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
    >
      {icon}
      {label}
    </Link>
  )

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U'

  return (
    <nav className="backdrop-blur-xl bg-white/80 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-alt-500 p-2 shadow-lg shadow-brand-500/10 transition-transform duration-300 hover:-translate-y-0.5">
              <Logo className="w-9 h-9" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">CareerNavigatorAI</span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">AI career guidance & growth</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-2">
              {navLink('/prediction', <FiZap className="w-4 h-4" />, 'Prediction')}
              {navLink('/history', <FiClipboard className="w-4 h-4" />, 'History')}
            </div>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:ring-2 hover:ring-brand-400 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-alt-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                  {initial}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl py-3 text-slate-800 dark:text-slate-200 animate-slide-up origin-top-right transition-all">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-extrabold text-base flex items-center justify-center">
                      {initial}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm text-slate-950 dark:text-white truncate">{user.username}</div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    </div>
                  </div>

                  <div className="px-3 space-y-1">
                    <Link
                      to="/profile"
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-2xl transition ${pathname === '/profile'
                        ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                      <FiUser className="w-4 h-4" /> Profile
                    </Link>
                  </div>

                  <div className="px-3 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-2xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-2xl transition duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-2xl shadow-lg transition duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
