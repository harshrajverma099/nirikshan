export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-b border-amber-200/60 dark:border-amber-800/40 px-3 sm:px-4 py-1.5 text-center text-[11px] sm:text-xs text-amber-800 dark:text-amber-300 leading-snug">
      <strong>Demo</strong>
      <span className="hidden sm:inline"> Environment — Fictional SIH 2026 prototype data. Not official government data.</span>
      <span className="sm:hidden"> — SIH 2026 prototype data</span>
    </div>
  );
}
