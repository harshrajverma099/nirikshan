import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { formatCurrency, canCreateProjects, healthColors } from '../utils/helpers';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', risk: '', priority: '', department: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', department: '', location: '', totalBudget: '', description: '', priority: 'Medium', startDate: '', expectedCompletionDate: '' });

  const fetchProjects = () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    api.get(`/projects?${params}`).then((res) => setProjects(res.data.projects || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
    api.get('/departments').then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => { fetchProjects(); }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...form,
        totalBudget: parseFloat(form.totalBudget) * 10000000,
        projectManager: user._id,
      });
      setShowModal(false);
      setToast({ message: 'Project created successfully', type: 'success' });
      fetchProjects();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create project', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete project "${name}"?`)) return;
    await api.delete(`/projects/${id}`);
    setToast({ message: 'Project deleted', type: 'success' });
    fetchProjects();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="page-actions">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} projects found</p>
        </div>
        {canCreateProjects(user?.role) && (
          <button onClick={() => setShowModal(true)} className="btn-primary w-full sm:w-auto shrink-0">+ New Project</button>
        )}
      </div>

      <div className="filter-bar">
        <input placeholder="Search..." className="input-field sm:max-w-xs text-sm" value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="input-field text-sm" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          {['Planning', 'Active', 'On Hold', 'Delayed', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input-field text-sm" value={filters.risk} onChange={(e) => setFilters({ ...filters, risk: e.target.value })}>
          <option value="">All Risk</option>
          {['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input-field text-sm" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All Priority</option>
          {['Low', 'Medium', 'High', 'Critical'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input-field sm:max-w-[180px] text-sm" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </div>

      <div className="table-shell">
        <div className="table-scroll">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Project</th>
              <th className="text-left p-3">Department</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Progress</th>
              <th className="text-left p-3">Budget</th>
              <th className="text-left p-3">Health</th>
              <th className="text-left p-3">Risk</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50">
                <td className="p-3 font-mono text-xs">{p.projectId}</td>
                <td className="p-3"><Link to={`/projects/${p._id}`} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{p.name}</Link></td>
                <td className="p-3">{p.department?.name}</td>
                <td className="p-3"><StatusBadge status={p.status} /></td>
                <td className="p-3 w-28"><ProgressBar value={p.progressPercentage} showLabel={false} /></td>
                <td className="p-3">{formatCurrency(p.utilizedBudget)} / {formatCurrency(p.totalBudget)}</td>
                <td className={`p-3 font-bold ${healthColors(p.metrics?.healthScore)}`}>{p.metrics?.healthScore}</td>
                <td className="p-3"><StatusBadge status={p.riskLevel} /></td>
                <td className="p-3">
                  <Link to={`/projects/${p._id}`} className="text-primary-600 dark:text-primary-400 hover:underline mr-2">View</Link>
                  {canCreateProjects(user?.role) && (
                    <button onClick={() => handleDelete(p._id, p.name)} className="text-red-600 hover:underline">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="p-8 text-center text-slate-400">No projects found</p>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-sm font-medium">Project Name</label><input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Department</label>
              <select className="input-field" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                <option value="">Select</option>{departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select></div>
            <div><label className="text-sm font-medium">Location</label><input className="input-field" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Budget (Crores)</label><input type="number" className="input-field" required value={form.totalBudget} onChange={(e) => setForm({ ...form, totalBudget: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Priority</label>
              <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p}>{p}</option>)}
              </select></div>
            <div><label className="text-sm font-medium">Start Date</label><input type="date" className="input-field" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Expected Completion</label><input type="date" className="input-field" required value={form.expectedCompletionDate} onChange={(e) => setForm({ ...form, expectedCompletionDate: e.target.value })} /></div>
            <div className="col-span-2"><label className="text-sm font-medium">Description</label><textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 justify-end"><button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Create Project</button></div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
