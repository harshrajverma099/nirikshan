export default function KPICard({ title, value, subtitle, icon, color = 'blue' }) {
  const colors = {
    blue: 'from-blue-500/10 to-blue-600/5 text-blue-600 dark:text-blue-400',
    green: 'from-green-500/10 to-green-600/5 text-green-600 dark:text-green-400',
    red: 'from-red-500/10 to-red-600/5 text-red-600 dark:text-red-400',
    yellow: 'from-amber-500/10 to-amber-600/5 text-amber-600 dark:text-amber-400',
    purple: 'from-purple-500/10 to-purple-600/5 text-purple-600 dark:text-purple-400',
  };
  return (
    <div className="card-hover p-3 sm:p-5 group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1 tracking-tight truncate">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
