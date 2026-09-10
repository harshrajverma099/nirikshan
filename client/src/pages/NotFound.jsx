import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
      <h1 className="text-7xl font-extrabold gradient-text">404</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">Page not found</p>
      <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
    </div>
  );
}
