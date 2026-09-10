import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabels } from '../utils/helpers';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';

export default function TopBar({ onMenuOpen, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const [unread, setUnread] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    api.get('/notifications').then((res) => {
      setUnread(res.data.filter((n) => !n.isRead).length);
    }).catch(() => {});
  }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) { setResults(null); return; }
    const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
    setResults(data);
    onSearch?.(data);
  };

  return (
    <header className="glass-panel px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`relative flex-1 min-w-0 ${searchOpen ? 'block' : 'hidden sm:block'} max-w-md`}>
          <input
            type="text"
            placeholder="Search..."
            className="input-field pl-10 text-sm py-2"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {results && search.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 card shadow-xl z-40 max-h-64 overflow-y-auto animate-slide-up">
              {results.projects?.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-slate-400 px-2 mb-1">Projects</p>
                  {results.projects.map((p) => (
                    <button key={p._id} onClick={() => { navigate(`/projects/${p._id}`); setResults(null); setSearch(''); setSearchOpen(false); }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">{p.name}</button>
                  ))}
                </div>
              )}
              {results.tasks?.length > 0 && (
                <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 px-2 mb-1">Tasks</p>
                  {results.tasks.map((t) => (
                    <button key={t._id} onClick={() => { navigate('/tasks'); setResults(null); setSearch(''); setSearchOpen(false); }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">{t.name}</button>
                  ))}
                </div>
              )}
              {!results.projects?.length && !results.tasks?.length && (
                <p className="p-4 text-sm text-slate-400 text-center">No results found</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <ThemeToggle className="scale-90 sm:scale-100" />
          <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{unread}</span>
            )}
          </button>
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabels[user?.role]}</p>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary text-xs sm:text-sm py-2 px-3 hidden sm:block">Logout</button>
        </div>
      </div>
    </header>
  );
}
