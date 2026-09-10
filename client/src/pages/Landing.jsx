import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <nav className="glass-panel sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold shadow-glow shrink-0">N</div>
          <span className="font-bold text-lg sm:text-xl gradient-text truncate">NIRIKSHAN</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle className="scale-90 sm:scale-100" />
          <Link to="/login" className="btn-secondary hidden sm:inline-flex text-sm py-2">Login</Link>
          <Link to="/login" className="btn-primary text-sm py-2 px-3 sm:px-4 sm:py-2.5">Demo</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),transparent_55%)]" />
        <div className="inline-block animate-slide-up bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs px-4 py-1.5 rounded-full mb-8 border border-amber-200 dark:border-amber-800">
          SIH 2026 Prototype — SIH26103 — Demo Environment
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 animate-slide-up [animation-delay:80ms]">
          <span className="gradient-text">NIRIKSHAN</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-2 font-medium animate-slide-up [animation-delay:120ms] px-2">Intelligent Project Monitoring & Risk Management</p>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-slide-up [animation-delay:160ms] px-2">
          One platform to monitor progress, identify risks and make data-driven project decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0 animate-slide-up [animation-delay:200ms]">
          <Link to="/login" className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg shadow-glow">Explore Demo</Link>
          <Link to="/login" className="btn-secondary px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg">Login</Link>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/50 py-12 sm:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6 sm:gap-12">
          <div className="card p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Problem</h2>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400 leading-relaxed">
              Government projects often suffer from delays, budget overruns, and fragmented monitoring across departments.
              Critical information is scattered — making timely intervention impossible.
            </p>
          </div>
          <div className="card p-5 sm:p-8 border-l-4 border-l-primary-500">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Solution</h2>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400 leading-relaxed">
              NIRIKSHAN provides one integrated platform for progress, budget, tasks, milestones, risk assessment, and analytics.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-white">Key Features</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: 'Project Health Score', desc: 'Prototype algorithm combining progress, timeline, budget, and risk factors.' },
            { title: 'Delay Risk Prediction', desc: 'Transparent rule-based system explaining why projects may be delayed.' },
            { title: 'Budget Monitoring', desc: 'Real-time budget utilization with overrun warnings.' },
            { title: 'Risk Register', desc: 'Probability × Impact matrix with mitigation tracking.' },
            { title: 'Executive Dashboard', desc: 'Action-required panels for immediate intervention.' },
            { title: 'Geographic Monitoring', desc: 'Map-based project visualization across India.' },
          ].map((f, i) => (
            <div key={f.title} className="card-hover p-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-10">
            {['Create Projects', 'Assign Tasks', 'Monitor Progress', 'Take Action'].map((step, i) => (
              <div key={step} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-3xl font-bold text-primary-400 mb-2">{i + 1}</div>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        NIRIKSHAN — Smart India Hackathon 2026 Prototype | All data is fictional demo data
      </footer>
    </div>
  );
}
