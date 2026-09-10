import { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate, healthColors } from '../utils/helpers';

export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api.get('/projects?limit=50').then((res) => {
      setProjects(res.data.projects || []);
      if (res.data.projects?.length) setSelected(res.data.projects[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  const generateReport = async () => {
    if (!selected) return;
    setGenerating(true);
    const { data } = await api.get(`/projects/${selected}/report`);
    setReport(data);
    setGenerating(false);
  };

  const downloadReport = () => {
    if (!report) return;
    const content = `
NIRIKSHAN — PROJECT STATUS REPORT
Generated: ${new Date(report.generatedAt).toLocaleString('en-IN')}
[DEMO DATA — Not official government report]

PROJECT: ${report.project.name} (${report.project.projectId})
Department: ${report.project.department?.name}
Location: ${report.project.location}
Status: ${report.project.status} | Priority: ${report.project.priority}
Manager: ${report.project.projectManager?.name}

PROGRESS: ${report.project.progressPercentage}%
Health Score: ${report.metrics.healthScore}/100 (${report.metrics.healthLabel})
Expected Progress: ${report.metrics.expectedProgress}%
Days Remaining: ${report.metrics.daysRemaining}

BUDGET:
  Total: ${formatCurrency(report.project.totalBudget)}
  Utilized: ${formatCurrency(report.project.utilizedBudget)} (${report.metrics.budgetUtilization}%)
  Remaining: ${formatCurrency(report.project.totalBudget - report.project.utilizedBudget)}

DELAY PREDICTION: ${report.metrics.delayPrediction.prediction}
Estimated Delay: ${report.metrics.delayPrediction.estimatedDelayDays} days
Reasons: ${report.metrics.delayPrediction.reasons.join('; ')}

TASKS (${report.tasks.length}):
${report.tasks.map((t) => `  - ${t.name} [${t.status}] ${t.progress}%`).join('\n')}

MILESTONES (${report.milestones.length}):
${report.milestones.map((m) => `  - ${m.name} [${m.status}] ${m.progress}%`).join('\n')}

RISKS (${report.risks.length}):
${report.risks.map((r) => `  - ${r.title} [${r.severity}] Score: ${r.riskScore}`).join('\n')}

RECENT UPDATES:
${report.updates.map((u) => `  [${formatDate(u.createdAt)}] ${u.update}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.project.projectId}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Generate project status reports for review</p></div>

      <div className="card p-5 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Select Project</label>
          <select className="input-field mt-1" value={selected} onChange={(e) => { setSelected(e.target.value); setReport(null); }}>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <button onClick={generateReport} disabled={generating} className="btn-primary">{generating ? 'Generating...' : 'Generate Report'}</button>
        {report && <button onClick={downloadReport} className="btn-secondary">Download Report</button>}
      </div>

      {report && (
        <div className="card p-6 space-y-6" id="report-content">
          <div className="border-b pb-4">
            <p className="text-xs text-amber-600 font-medium">DEMO REPORT — Fictional data for SIH 2026 prototype</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{report.project.name}</h2>
            <p className="text-sm text-slate-500">{report.project.projectId} · {report.project.department?.name} · {formatDate(report.generatedAt)}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400">Progress</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{report.project.progressPercentage}%</p></div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400">Health</p><p className={`text-2xl font-bold ${healthColors(report.metrics.healthScore)}`}>{report.metrics.healthScore}</p></div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400">Budget Used</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{report.metrics.budgetUtilization}%</p></div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400">Delay Risk</p><p className="text-sm font-bold mt-2 text-slate-900 dark:text-white">{report.metrics.delayPrediction.prediction}</p></div>
          </div>

          <div><h3 className="font-semibold mb-2">Project Details</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <p><span className="text-slate-500">Status:</span> <StatusBadge status={report.project.status} /></p>
              <p><span className="text-slate-500">Risk:</span> <StatusBadge status={report.project.riskLevel} /></p>
              <p><span className="text-slate-500">Budget:</span> {formatCurrency(report.project.utilizedBudget)} / {formatCurrency(report.project.totalBudget)}</p>
              <p><span className="text-slate-500">Manager:</span> {report.project.projectManager?.name}</p>
            </div>
          </div>

          <div><h3 className="font-semibold mb-2">Tasks ({report.tasks.length})</h3>
            <div className="text-sm space-y-1 max-h-40 overflow-y-auto">{report.tasks.map((t) => <p key={t._id}>{t.name} — <StatusBadge status={t.status} /> {t.progress}%</p>)}</div>
          </div>

          <div><h3 className="font-semibold mb-2">Risks ({report.risks.length})</h3>
            <div className="text-sm space-y-1">{report.risks.map((r) => <p key={r._id}>{r.title} — <StatusBadge status={r.severity} /></p>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
