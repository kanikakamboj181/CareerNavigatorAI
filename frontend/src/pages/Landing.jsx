import { Link } from 'react-router-dom'
import { FiCpu, FiBarChart2, FiMap, FiShield, FiFeather, FiCloud, FiClipboard, FiActivity } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const ROLES = [
  { icon: <FiActivity className="w-6 h-6" />, name: 'Data Scientist',          color: 'bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-100/50' },
  { icon: <FiCpu className="w-6 h-6" />,      name: 'Full-Stack Developer',     color: 'bg-sky-50/70 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300 border border-sky-100/50' },
  { icon: <FiShield className="w-6 h-6" />,   name: 'Cyber Security Analyst',  color: 'bg-rose-50/70 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-100/50' },
  { icon: <FiFeather className="w-6 h-6" />,  name: 'UI/UX Designer',           color: 'bg-amber-50/70 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-100/50' },
  { icon: <FiCloud className="w-6 h-6" />,    name: 'Cloud Engineer',           color: 'bg-emerald-50/70 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-100/50' },
  { icon: <FiClipboard className="w-6 h-6" />, name: 'Product Manager',          color: 'bg-purple-50/70 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border border-purple-100/50' },
]

const FEATURES = [
  { icon: <FiCpu className="w-7 h-7" />,       title: 'ML-Powered Analysis',   desc: 'A Random Forest model trained on real student career data to match you with ideal roles.' },
  { icon: <FiBarChart2 className="w-7 h-7" />, title: 'Smart Career Insights', desc: 'Visualize your strengths with intuitive charts and get a clear path to your next role.' },
  { icon: <FiMap className="w-7 h-7" />,       title: 'Personalised Roadmap',   desc: 'Receive actionable learning suggestions and curated resources for your top recommendation.' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-brand-500/10 via-brand-100/20 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 opacity-95 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 dark:bg-slate-700/40 px-4 py-2 mb-6 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
                <FiCpu className="w-4 h-4 text-accent-500" /> AI-Powered Career Guidance
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight mb-5">
                Build your future with <span className="gradient-text">CareerNavigatorAI</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8">
                Discover the best-fit career path with intelligent skill analysis, personalised recommendations, and industry-ready guidance.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                {user ? (
                  <Link to="/prediction" className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-3xl shadow-xl transition duration-200">
                    Start Prediction
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-3xl shadow-xl transition duration-200">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 px-7 py-3 rounded-3xl transition duration-200">
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative w-full max-w-lg">
              <div className="rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-cyan-100/40 to-slate-100 dark:from-slate-800/80 dark:via-slate-900/70 dark:to-slate-950 p-10 shadow-2xl border border-white/70 dark:border-slate-800/70 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold">Top Recommendation</p>
                    <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Data Scientist</h2>
                  </div>
                  <div className="rounded-3xl bg-white/90 dark:bg-slate-900 p-3 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
                    <FiMap className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  CareerNavigatorAI helps you understand the skills that matter most for your future role and build a roadmap to get there.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Accuracy', '87%+'],
                    ['Roles', '6'],
                    ['Skills', '7'],
                    ['Samples', '2,000+'],
                  ].map(([title, value]) => (
                    <div key={title} className="rounded-3xl bg-white/80 dark:bg-slate-950/80 p-4 border border-slate-200/80 dark:border-slate-800/80 text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              ['2,000+', 'Training Samples'],
              ['6', 'Career Roles'],
              ['7', 'Skill Dimensions'],
              ['87%+', 'Model Accuracy'],
            ].map(([value, label]) => (
              <div key={label} className="glass-card p-6 text-center border border-slate-200/70 dark:border-slate-800/70">
                <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-12">
            {FEATURES.map(feature => (
              <div key={feature.title} className="glass-card p-6 hover:-translate-y-1 transition duration-300 border border-slate-200/70 dark:border-slate-800/70">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-brand-500/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 mt-12 border border-slate-200/70 dark:border-slate-800/70">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-6 text-center">Roles We Predict</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {ROLES.map(role => (
                <div key={role.name} className={`${role.color} rounded-3xl p-5 text-center shadow-sm transition hover:-translate-y-1 duration-300`}>
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-3xl bg-white/85 dark:bg-slate-900/80 mb-3 shadow-sm">
                    {role.icon}
                  </div>
                  <div className="text-xs font-semibold tracking-wide">{role.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
