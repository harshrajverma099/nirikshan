import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { roleLabels } from '../utils/helpers';

export default function Users() {
  const { user } = useAuth();
  if (!['super_admin', 'department_officer'].includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'team_member', department: '' });

  const fetch = () => api.get('/users').then((res) => setUsers(res.data)).finally(() => setLoading(false));

  useEffect(() => {
    fetch();
    api.get('/departments').then((res) => setDepartments(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/auth/register', form);
    setShowModal(false);
    setToast({ message: 'User created', type: 'success' });
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1><p className="text-slate-500 dark:text-slate-400 text-sm">{users.length} users</p></div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">+ Create User</button>
      </div>
      <div className="table-shell">
        <div className="table-scroll">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Department</th><th className="p-3 text-left">Status</th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u._id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50">
              <td className="p-3 font-medium">{u.name} {u.isDemo && <span className="text-xs text-amber-600">DEMO</span>}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3"><span className="badge bg-blue-100 text-blue-800">{roleLabels[u.role]}</span></td>
              <td className="p-3">{u.department?.name || '—'}</td>
              <td className="p-3">{u.isActive ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create User">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input-field" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" className="input-field" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="input-field" placeholder="Password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            <option value="">No Department</option>{departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <button type="submit" className="btn-primary">Create User</button>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
