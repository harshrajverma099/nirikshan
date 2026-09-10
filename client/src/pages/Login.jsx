import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const demoAccounts = [
  { role: 'Super Admin', email: 'admin@nirikshan.demo' },
  { role: 'Department Officer', email: 'officer@nirikshan.demo' },
  { role: 'Project Manager', email: 'manager@nirikshan.demo' },
  { role: 'Team Member', email: 'member@nirikshan.demo' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent" />
        <div className="relative max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-2xl font-bold mb-8 shadow-glow-dark">N</div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">NIRIKSHAN</h1>
          <p className="text-white/70 text-lg mb-6 leading-relaxed">Intelligent Project Monitoring & Risk Management Platform</p>
          <p className="text-white/40 text-sm">SIH 2026 — SIH26103 — Web-Based Integrated Project Monitoring</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle className="scale-90 sm:scale-100" />
        </div>
        <div className="w-full max-w-md animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Sign In</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Access the project monitoring dashboard</p>

          {error && <div className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 p-4 rounded-xl mb-4 text-sm border border-red-200 dark:border-red-800">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Forgot password?
            </button>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 card p-5 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-3">DEMO ACCOUNTS — Password: Demo@123</p>
            <div className="space-y-2">
              {demoAccounts.map((a) => (
                <button key={a.email} onClick={() => fillDemo(a.email)}
                  className="w-full text-left text-sm px-4 py-2.5 card hover:border-primary-400 dark:hover:border-primary-600 transition-all">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{a.role}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">{a.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-slate-500">
            <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Forgot Password</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400 mb-4">Demo environment: use demo accounts with password <strong>Demo@123</strong>.</p>
            <button onClick={() => setShowForgot(false)} className="btn-primary w-full">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
