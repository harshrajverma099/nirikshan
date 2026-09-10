import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { formatCurrency, formatDate, healthColors, canManageProjects } from '../utils/helpers';

const tabs = ['Overview', 'Timeline', 'Tasks', 'Milestones', 'Budget', 'Team', 'Documents', 'Updates', 'Risks', 'Analytics'];

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [updateForm, setUpdateForm] = useState({ update: '', progressChange: 0, status: 'On Track' });
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchProject = () => {
    api.get(`/projects/${id}`).then((res) => setData(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

  const postUpdate = async (e) => {
    e.preventDefault();
    await api.post('/project-updates', { ...updateForm, project: id });
    setShowUpdateModal(false);
    setToast({ message: 'Update published', type: 'success' });
    fetchProject();
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-center py-12">Project not found</div>;

  const { project, tasks, milestones, risks, updates, documents, budget, metrics } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/projects" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">← Back to Projects</Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{project.name}</h1>
          <p className="text-sm text-slate-500">{project.projectId} · {project.location} · {project.department?.name}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={project.status} />
          <StatusBadge status={project.riskLevel} />
          {canManageProjects(user?.role) && (
            <button onClick={() => setShowUpdateModal(true)} className="btn-primary text-sm">Post Update</button>
          )}
        </div>
      </div>

      {/* Health Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="card p-4 text-center">
          <p className="text-xs text-slate-500">Project Health</p>
          <p className={`text-3xl font-bold ${healthColors(metrics.healthScore)}`}>{metrics.healthScore}/100</p>
          <p className="text-xs text-slate-400">{metrics.healthLabel}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-slate-500">Progress</p>
          <p className="text-3xl font-bold text-primary-600">{project.progressPercentage}%</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-slate-500">Budget</p>
          <p className="text-lg font-bold">{formatCurrency(project.utilizedBudget)}</p>
          <p className="text-xs text-slate-400">/ {formatCurrency(project.totalBudget)}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-slate-500">Days Remaining</p>
          <p className="text-3xl font-bold">{metrics.daysRemaining}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-slate-500">Risk</p>
          <div className="mt-2"><StatusBadge status={project.riskLevel} /></div>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-slate-500">Tasks Done</p>
          <p className="text-3xl font-bold">{metrics.completedTasks}/{metrics.totalTasks}</p>
        </div>
      </div>

      {/* Delay Prediction */}
      <div className="card p-5 border-l-4 border-l-orange-500">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Delay Risk Prediction</h3>
        <div className="flex items-center gap-4 mb-3">
          <span className={`badge ${metrics.delayPrediction.prediction.includes('HIGH') ? 'bg-red-100 text-red-800' : metrics.delayPrediction.prediction.includes('MEDIUM') ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
            {metrics.delayPrediction.prediction}
          </span>
          {metrics.delayPrediction.estimatedDelayDays > 0 && (
            <span className="text-sm text-slate-600 dark:text-slate-400">Estimated delay: <strong>{metrics.delayPrediction.estimatedDelayDays} days</strong></span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-2">Reasons:</p>
        <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
          {metrics.delayPrediction.reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      {metrics.budgetWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          ⚠ WARNING: {metrics.budgetWarning}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold">Project Details</h3>
            <p className="text-sm"><span className="text-slate-500">Description:</span> {project.description}</p>
            <p className="text-sm"><span className="text-slate-500">Manager:</span> {project.projectManager?.name}</p>
            <p className="text-sm"><span className="text-slate-500">Start:</span> {formatDate(project.startDate)}</p>
            <p className="text-sm"><span className="text-slate-500">Expected Completion:</span> {formatDate(project.expectedCompletionDate)}</p>
            <p className="text-sm"><span className="text-slate-500">Priority:</span> <StatusBadge status={project.priority} /></p>
            <ProgressBar value={project.progressPercentage} />
          </div>
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Prototype Project Health Algorithm</h3>
            <p className="text-xs text-slate-500 mb-3">Not an official government formula</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Expected Progress</span><span>{metrics.expectedProgress}%</span></div>
              <div className="flex justify-between"><span>Task Completion</span><span>{metrics.taskCompletionRate}%</span></div>
              <div className="flex justify-between"><span>Milestone Completion</span><span>{metrics.milestoneCompletionRate}%</span></div>
              <div className="flex justify-between"><span>Budget Utilization</span><span>{metrics.budgetUtilization}%</span></div>
              <div className="flex justify-between"><span>Overdue Tasks</span><span className="text-red-600">{metrics.overdueTasks}</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Timeline' && (
        <div className="card p-6">
          <div className="relative">
            {milestones.map((m, i) => (
              <div key={m._id} className="flex gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${m.status === 'Completed' ? 'bg-green-500' : m.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {m.status === 'Completed' ? '✓' : i + 1}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between"><h4 className="font-medium">{m.name}</h4><StatusBadge status={m.status} /></div>
                  <p className="text-xs text-slate-500">Target: {formatDate(m.targetDate)}</p>
                  <ProgressBar value={m.progress} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Tasks' && (
        <div className="table-shell">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">Task</th><th className="p-3 text-left">Assigned</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Priority</th><th className="p-3 text-left">Due</th><th className="p-3 text-left">Progress</th></tr></thead>
            <tbody>{tasks.map((t) => (
              <tr key={t._id} className="border-t"><td className="p-3">{t.name}</td><td className="p-3">{t.assignedTo?.name}</td><td className="p-3"><StatusBadge status={t.status} /></td><td className="p-3"><StatusBadge status={t.priority} /></td><td className="p-3">{formatDate(t.dueDate)}</td><td className="p-3 w-24"><ProgressBar value={t.progress} showLabel={false} /></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {activeTab === 'Milestones' && (
        <div className="grid md:grid-cols-2 gap-4">
          {milestones.map((m) => (
            <div key={m._id} className="card p-4">
              <div className="flex justify-between mb-2"><h4 className="font-medium">{m.name}</h4><StatusBadge status={m.status} /></div>
              <ProgressBar value={m.progress} />
              <p className="text-xs text-slate-500 mt-2">Target: {formatDate(m.targetDate)}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Budget' && budget && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5 space-y-3">
            <div className="flex justify-between"><span>Approved</span><span className="font-bold">{formatCurrency(budget.approvedBudget)}</span></div>
            <div className="flex justify-between"><span>Utilized</span><span className="font-bold text-orange-600">{formatCurrency(budget.utilizedBudget)}</span></div>
            <div className="flex justify-between"><span>Remaining</span><span className="font-bold text-green-600">{formatCurrency(budget.remainingBudget)}</span></div>
            <ProgressBar value={budget.utilizationPercentage} color="bg-orange-500" />
          </div>
          <div className="card p-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Budget', approved: budget.approvedBudget / 1e7, utilized: budget.utilizedBudget / 1e7, remaining: budget.remainingBudget / 1e7 }]}>
                <XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v) => `₹${v.toFixed(1)} Cr`} />
                <Bar dataKey="approved" fill="#94a3b8" name="Approved" /><Bar dataKey="utilized" fill="#f97316" name="Utilized" /><Bar dataKey="remaining" fill="#22c55e" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'Team' && (
        <div className="card p-5">
          <h4 className="font-medium mb-3">Project Manager</h4>
          <p className="text-sm mb-4">{project.projectManager?.name} — {project.projectManager?.email}</p>
          <h4 className="font-medium mb-3">Team Members</h4>
          {project.teamMembers?.map((m) => <p key={m._id} className="text-sm">{m.name} — {m.email}</p>)}
        </div>
      )}

      {activeTab === 'Documents' && (
        <div className="table-shell">
          {documents.length === 0 ? <p className="p-6 text-slate-400 text-center">No documents uploaded</p> : (
            <table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Uploaded By</th><th className="p-3 text-left">Date</th></tr></thead>
            <tbody>{documents.map((d) => <tr key={d._id} className="border-t"><td className="p-3">{d.name}</td><td className="p-3">{d.category}</td><td className="p-3">{d.uploadedBy?.name}</td><td className="p-3">{formatDate(d.createdAt)}</td></tr>)}</tbody></table>
          )}
        </div>
      )}

      {activeTab === 'Updates' && (
        <div className="space-y-4">
          {updates.map((u) => (
            <div key={u._id} className="card p-4">
              <div className="flex justify-between mb-2"><span className="font-medium">{u.author?.name}</span><span className="text-xs text-slate-500">{formatDate(u.createdAt)}</span></div>
              <p className="text-sm">{u.update}</p>
              <div className="flex gap-2 mt-2"><StatusBadge status={u.status} /><span className="text-xs text-green-600">+{u.progressChange}% progress</span></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Risks' && (
        <div className="space-y-4">
          {risks.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex justify-between"><h4 className="font-medium">{r.title}</h4><StatusBadge status={r.severity} /></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{r.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span>Score: {r.riskScore} (P:{r.probability} × I:{r.impact})</span>
                <span>Status: {r.status}</span>
              </div>
              <p className="text-xs mt-2"><strong>Mitigation:</strong> {r.mitigationPlan}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="card p-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { metric: 'Progress', value: project.progressPercentage },
              { metric: 'Expected', value: metrics.expectedProgress },
              { metric: 'Tasks', value: metrics.taskCompletionRate },
              { metric: 'Milestones', value: metrics.milestoneCompletionRate },
              { metric: 'Budget', value: metrics.budgetUtilization },
              { metric: 'Health', value: metrics.healthScore },
            ]}>
              <XAxis dataKey="metric" /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Post Project Update">
        <form onSubmit={postUpdate} className="space-y-4">
          <textarea className="input-field" rows={4} required placeholder="Update description..." value={updateForm.update} onChange={(e) => setUpdateForm({ ...updateForm, update: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm">Progress Change (%)</label><input type="number" className="input-field" value={updateForm.progressChange} onChange={(e) => setUpdateForm({ ...updateForm, progressChange: +e.target.value })} /></div>
            <div><label className="text-sm">Status</label><select className="input-field" value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}>{['On Track', 'At Risk', 'Delayed', 'Completed'].map((s) => <option key={s}>{s}</option>)}</select></div>
          </div>
          <button type="submit" className="btn-primary">Publish Update</button>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
