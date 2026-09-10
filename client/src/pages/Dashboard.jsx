import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, healthColors } from '../utils/helpers';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/projects?limit=5'),
    ]).then(([kpiRes, projRes]) => {
      setKpis(kpiRes.data);
      setProjects(projRes.data.projects || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Integrated project monitoring overview</p>
      </div>

      <div className="card p-4 sm:p-6 border-l-4 border-l-primary-500 dark:border-l-primary-400 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-950/20">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Problem</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Government projects can suffer from delays, budget overruns and fragmented monitoring across departments.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Solution — NIRIKSHAN</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">One integrated platform for project progress, budget, tasks, milestones, risks and analytics with actionable insights.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-4">
        <KPICard title="Total Projects" value={kpis.totalProjects} color="blue" />
        <KPICard title="Active" value={kpis.activeProjects} color="green" />
        <KPICard title="Completed" value={kpis.completedProjects} color="purple" />
        <KPICard title="Delayed" value={kpis.delayedProjects} color="red" />
        <KPICard title="Total Budget" value={formatCurrency(kpis.totalBudget)} color="blue" />
        <KPICard title="Budget Utilized" value={formatCurrency(kpis.utilizedBudget)} subtitle={`${kpis.budgetUtilizationPercent}% used`} color="yellow" />
        <KPICard title="High Risk" value={kpis.highRiskProjects} color="red" />
      </div>

      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Project Health — Key Innovation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Prototype Project Health Algorithm (not an official government formula)</p>
          </div>
          <Link to="/executive" className="btn-primary text-sm w-full sm:w-auto text-center shrink-0">Executive Overview →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {projects.slice(0, 3).map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="card-hover p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-sm text-slate-900 dark:text-white">{p.name}</h3>
                <span className={`text-2xl font-bold ${healthColors(p.metrics?.healthScore || p.healthScore)}`}>
                  {p.metrics?.healthScore || p.healthScore}
                </span>
              </div>
              <ProgressBar value={p.progressPercentage} />
              <div className="flex gap-2 mt-3">
                <StatusBadge status={p.status} />
                <StatusBadge status={p.riskLevel} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="table-shell">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all →</Link>
        </div>
        <div className="table-scroll">
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="text-left p-3">Project</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Progress</th>
                <th className="text-left p-3">Health</th>
                <th className="text-left p-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="table-row">
                  <td className="p-3"><Link to={`/projects/${p._id}`} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{p.name}</Link></td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{p.department?.name}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3 w-32"><ProgressBar value={p.progressPercentage} showLabel={false} /></td>
                  <td className={`p-3 font-bold ${healthColors(p.metrics?.healthScore)}`}>{p.metrics?.healthScore || '—'}</td>
                  <td className="p-3"><StatusBadge status={p.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
