export default function ProgressBar({ value, color = 'bg-gradient-to-r from-primary-500 to-accent-500', showLabel = true }) {
  const v = Math.min(Math.max(value || 0, 0), 100);
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5">
        {showLabel && <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>}
        {showLabel && <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v}%</span>}
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div className={`${color} h-2 rounded-full transition-all duration-500 ease-out`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
