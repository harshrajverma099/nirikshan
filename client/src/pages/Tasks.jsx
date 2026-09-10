import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { formatDate, canManageProjects } from '../utils/helpers';

const columns = ['To Do', 'In Progress', 'Completed', 'Blocked', 'Overdue'];

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', project: '' });
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', project: '', assignedTo: '', priority: 'Medium', startDate: '', dueDate: '' });

  const fetchTasks = () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    api.get(`/tasks?${params}`).then((res) => setTasks(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
    api.get('/projects?limit=50').then((res) => setProjects(res.data.projects || []));
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchTasks(); }, [filters]);

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setShowModal(false);
    setToast({ message: 'Task created', type: 'success' });
    fetchTasks();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1><p className="text-slate-500 dark:text-slate-400 text-sm">{tasks.length} tasks</p></div>
        <div className="flex gap-2">
          <button onClick={() => setView('table')} className={`btn-secondary text-sm ${view === 'table' ? 'ring-2 ring-primary-500' : ''}`}>Table</button>
          <button onClick={() => setView('kanban')} className={`btn-secondary text-sm ${view === 'kanban' ? 'ring-2 ring-primary-500' : ''}`}>Kanban</button>
          {canManageProjects(user?.role) && <button onClick={() => setShowModal(true)} className="btn-primary text-sm">+ New Task</button>}
        </div>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <input placeholder="Search tasks..." className="input-field max-w-xs text-sm" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="input-field max-w-[150px] text-sm" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>{columns.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input-field max-w-[150px] text-sm" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All Priority</option>{['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {view === 'table' ? (
        <div className="table-shell">
          <div className="table-scroll">
          <table className="w-full text-sm">
            <thead className="table-head"><tr><th className="p-3 text-left">Task</th><th className="p-3 text-left">Project</th><th className="p-3 text-left">Assigned</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Priority</th><th className="p-3 text-left">Due</th><th className="p-3 text-left">Progress</th><th className="p-3 text-left">Actions</th></tr></thead>
            <tbody>{tasks.map((t) => (
              <tr key={t._id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50">
                <td className="p-3 font-medium">{t.name}</td><td className="p-3">{t.project?.name}</td><td className="p-3">{t.assignedTo?.name}</td>
                <td className="p-3"><StatusBadge status={t.status} /></td><td className="p-3"><StatusBadge status={t.priority} /></td>
                <td className="p-3">{formatDate(t.dueDate)}</td><td className="p-3 w-24"><ProgressBar value={t.progress} showLabel={false} /></td>
                <td className="p-3">
                  <select className="text-xs border rounded px-1 py-0.5" value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
                    {columns.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 overflow-x-auto">
          {columns.map((col) => (
            <div key={col} className="card p-3 min-w-[200px]">
              <h3 className="font-medium text-sm mb-3 flex justify-between">{col}<span className="text-slate-400">{tasks.filter((t) => t.status === col).length}</span></h3>
              <div className="space-y-2">
                {tasks.filter((t) => t.status === col).map((t) => (
                  <div key={t._id} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-sm border border-slate-100 dark:border-slate-700/50">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.project?.name}</p>
                    <StatusBadge status={t.priority} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input-field" placeholder="Task name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input-field" required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
            <option value="">Select Project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <select className="input-field" required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            <option value="">Assign To</option>{users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="input-field" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <input type="date" className="input-field" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">Create Task</button>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
