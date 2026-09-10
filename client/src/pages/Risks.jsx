import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { canManageProjects } from '../utils/helpers';

export default function Risks() {
  const { user } = useAuth();
  const [risks, setRisks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', project: '', probability: 3, impact: 3, mitigationPlan: '', status: 'Open' });

  useEffect(() => {
    Promise.all([api.get('/risks'), api.get('/projects?limit=50')]).then(([r, p]) => {
      setRisks(r.data);
      setProjects(p.data.projects || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/risks', { ...form, probability: +form.probability, impact: +form.impact });
    setShowModal(false);
    setToast({ message: 'Risk added', type: 'success' });
    const { data } = await api.get('/risks');
    setRisks(data);
  };

  if (loading) return <LoadingSpinner />;

  const matrix = [];
  for (let p = 5; p >= 1; p--) {
    for (let i = 1; i <= 5; i++) {
      const count = risks.filter((r) => r.probability === i && r.impact === p).length;
      matrix.push({ probability: i, impact: p, count, score: i * p });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Risk Register</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Probability × Impact risk matrix</p></div>
        {canManageProjects(user?.role) && <button onClick={() => setShowModal(true)} className="btn-primary text-sm">+ Add Risk</button>}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Risk Matrix</h3>
        <div className="overflow-x-auto">
          <table className="text-xs mx-auto">
            <thead><tr><th className="p-2"></th>{[1, 2, 3, 4, 5].map((i) => <th key={i} className="p-2 w-16">Impact {i}</th>)}</tr></thead>
            <tbody>{[5, 4, 3, 2, 1].map((p) => (
              <tr key={p}>
                <td className="p-2 font-medium">Prob {p}</td>
                {[1, 2, 3, 4, 5].map((i) => {
                  const score = p * i;
                  const count = risks.filter((r) => r.probability === p && r.impact === i).length;
                  const bg = score >= 20 ? 'bg-red-500 text-white' : score >= 12 ? 'bg-orange-400 text-white' : score >= 6 ? 'bg-yellow-300' : 'bg-green-200';
                  return <td key={i} className={`p-2 text-center ${bg} rounded m-0.5`}>{count || '·'}</td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        {risks.map((r) => (
          <div key={r._id} className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-slate-400">{r.riskId}</span>
                  <StatusBadge status={r.severity} />
                  <span className="text-xs text-slate-500">{r.status}</span>
                </div>
                <h3 className="font-semibold">{r.title}</h3>
                <Link to={`/projects/${r.project?._id}`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">{r.project?.name}</Link>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{r.riskScore}</p>
                <p className="text-xs text-slate-500">P:{r.probability} × I:{r.impact}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{r.description}</p>
            <p className="text-xs mt-2"><strong>Mitigation:</strong> {r.mitigationPlan}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Risk">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input-field" placeholder="Risk title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input-field" required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
            <option value="">Select Project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm">Probability (1-5)</label><input type="number" min="1" max="5" className="input-field" value={form.probability} onChange={(e) => setForm({ ...form, probability: e.target.value })} /></div>
            <div><label className="text-sm">Impact (1-5)</label><input type="number" min="1" max="5" className="input-field" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} /></div>
          </div>
          <textarea className="input-field" placeholder="Mitigation plan" value={form.mitigationPlan} onChange={(e) => setForm({ ...form, mitigationPlan: e.target.value })} />
          <button type="submit" className="btn-primary">Add Risk</button>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
