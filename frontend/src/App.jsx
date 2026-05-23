import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Prediction from './pages/Prediction'
import Results from './pages/Results'
import History from './pages/History'
import Profile from './pages/Profile'
import Retrain from './pages/Retrain'

// Redirect unauthenticated users to /login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-slate-400">Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

// Redirect already-logged-in users away from auth pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/prediction" replace /> : children
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/prediction" element={<PrivateRoute><Prediction /></PrivateRoute>} />
          <Route path="/results"    element={<PrivateRoute><Results /></PrivateRoute>} />
          <Route path="/history"    element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/retrain"    element={<PrivateRoute><Retrain /></PrivateRoute>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center text-slate-400 text-xs py-5 border-t border-slate-200 dark:border-slate-800">
        CareerNavigatorAI — AI Career Guidance — Powered by Random Forest &amp; React
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
