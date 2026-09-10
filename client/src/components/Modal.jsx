export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative card shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-slide-up dark:shadow-glow-dark`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
