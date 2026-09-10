export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  const cr = amount / 10000000;
  if (cr >= 1) return `₹${cr.toFixed(1)} Cr`;
  const lakhs = amount / 100000;
  if (lakhs >= 1) return `₹${lakhs.toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const roleLabels = {
  super_admin: 'Super Admin',
  department_officer: 'Department Officer',
  project_manager: 'Project Manager',
  team_member: 'Team Member',
};

export const statusColors = {
  Planning: 'bg-slate-100 text-slate-700',
  Active: 'bg-blue-100 text-blue-800',
  'On Hold': 'bg-yellow-100 text-yellow-800',
  Delayed: 'bg-red-100 text-red-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
  'To Do': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-800',
  Blocked: 'bg-orange-100 text-orange-800',
  Overdue: 'bg-red-100 text-red-800',
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800',
};

export const healthColors = (score) => {
  if (score >= 90) return 'text-green-600 dark:text-green-400';
  if (score >= 75) return 'text-blue-600 dark:text-blue-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const canManageProjects = (role) =>
  ['super_admin', 'department_officer', 'project_manager'].includes(role);

export const canCreateProjects = (role) =>
  ['super_admin', 'department_officer'].includes(role);
