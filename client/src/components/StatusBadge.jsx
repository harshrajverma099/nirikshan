const badgeStyles = {
  Planning: 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
  Active: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  Delayed: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  Cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
  'To Do': 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  Blocked: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  Low: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${badgeStyles[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
      {status}
    </span>
  );
}
