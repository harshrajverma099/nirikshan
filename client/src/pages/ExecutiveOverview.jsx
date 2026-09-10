import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, healthColors } from '../utils/helpers';

export default function ExecutiveOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/executive').then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Immediate answers for project authorities</p>
      </div>

      {/* Action Required Panel */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-l-red-500">
          <p className="text-sm text-slate-500">🔴 Critical</p>
          <p className="text-3xl font-bold text-red-600">{data.actionRequired.critical}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">projects require immediate intervention</p>
        </div>
        <div className="card p-5 border-l-4 border-l-orange-500">
          <p className="text-sm text-slate-500">🟠 Warning</p>
          <p className="text-3xl font-bold text-orange-600">{data.actionRequired.warning}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">projects show delay risk</p>
        </div>
        <div className="card p-5 border-l-4 border-l-green-500">
          <p className="text-sm text-slate-500">🟢 On Track</p>
          <p className="text-3xl font-bold text-green-600">{data.actionRequired.onTrack}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">projects progressing normally</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">1. Active Projects</h3>
          <p className="text-3xl font-bold text-primary-600">{data.activeProjects}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">2. Delayed Projects</h3>
          {data.delayedProjects.length === 0 ? (
            <p className="text-green-600">No delayed projects</p>
          ) : (
            <ul className="space-y-2">
              {data.delayedProjects.map((p) => (
                <li key={p._id}><Link to={`/projects/${p._id}`} className="text-primary-600 dark:text-primary-400 hover:underline">{p.name}</Link> — {p.progress}%</li>
              ))}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">3. High Risk Projects</h3>
          <ul className="space-y-2">
            {data.highRiskProjects.map((p) => (
              <li key={p._id} className="flex items-center gap-2">
                <Link to={`/projects/${p._id}`} className="text-primary-600 dark:text-primary-400 hover:underline">{p.name}</Link>
                <StatusBadge status={p.riskLevel} />
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">4. Budget Utilization by Department</h3>
          <ul className="space-y-2 text-sm">
            {data.budgetByDepartment.map((d) => (
              <li key={d.department} className="flex justify-between">
                <span>{d.department}</span>
                <span>{formatCurrency(d.utilized)} / {formatCurrency(d.total)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">5. Departments with Problems</h3>
          {Object.keys(data.departmentProblems).length === 0 ? (
            <p className="text-green-600">All departments on track</p>
          ) : (
            <ul className="space-y-1">
              {Object.entries(data.departmentProblems).map(([dept, count]) => (
                <li key={dept} className="text-red-600">{dept}: {count} at-risk project(s)</li>
              ))}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">6. Overdue Tasks</h3>
          <p className="text-2xl font-bold text-red-600 mb-2">{data.overdueTasks.length}</p>
          <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
            {data.overdueTasks.slice(0, 5).map((t) => (
              <li key={t._id}>{t.name} — {t.project?.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">7. Recommended Actions</h3>
        <div className="space-y-3">
          {data.criticalProjects.slice(0, 3).map((p) => (
            <div key={p._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <Link to={`/projects/${p._id}`} className="font-medium text-red-800 hover:underline">{p.name}</Link>
                <p className="text-xs text-red-600">Health: {p.metrics?.healthScore} — {p.metrics?.delayPrediction?.prediction}</p>
              </div>
              <Link to={`/projects/${p._id}`} className="btn-primary text-xs">Review →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
