import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { roleLabels } from '../utils/helpers';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Account and application preferences</p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">Theme</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Currently using {isDark ? 'dark' : 'light'} mode</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
          >
            <div className="w-full h-8 bg-white rounded-lg border border-slate-200 mb-2" />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Light</p>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
          >
            <div className="w-full h-8 bg-slate-900 rounded-lg border border-slate-700 mb-2" />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark</p>
          </button>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Profile</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-500 dark:text-slate-400">Name</p><p className="font-medium text-slate-800 dark:text-slate-200">{user?.name}</p></div>
          <div><p className="text-slate-500 dark:text-slate-400">Email</p><p className="font-medium text-slate-800 dark:text-slate-200">{user?.email}</p></div>
          <div><p className="text-slate-500 dark:text-slate-400">Role</p><p className="font-medium text-slate-800 dark:text-slate-200">{roleLabels[user?.role]}</p></div>
          <div><p className="text-slate-500 dark:text-slate-400">Department</p><p className="font-medium text-slate-800 dark:text-slate-200">{user?.department?.name || '—'}</p></div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">About NIRIKSHAN</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400 leading-relaxed">
          NIRIKSHAN is a prototype Intelligent Project Monitoring & Risk Management Platform built for
          Smart India Hackathon 2026 (SIH26103). This is a demonstration environment with fictional data.
        </p>
      </div>
    </div>
  );
}
