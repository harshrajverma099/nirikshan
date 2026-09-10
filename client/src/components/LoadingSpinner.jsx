export default function LoadingSpinner({ fullScreen }) {
  const cls = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-12';
  return (
    <div className={cls}>
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-slate-700 border-t-primary-600 dark:border-t-primary-400" />
      </div>
    </div>
  );
}
