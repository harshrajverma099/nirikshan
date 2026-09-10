import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'bg-green-600 dark:bg-green-500',
    error: 'bg-red-600 dark:bg-red-500',
    warning: 'bg-amber-600 dark:bg-amber-500',
    info: 'bg-primary-600 dark:bg-primary-500',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
}
