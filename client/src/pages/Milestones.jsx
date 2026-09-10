import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import { formatDate } from '../utils/helpers';

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects?limit=50').then((res) => setProjects(res.data.projects || []));
  }, []);

  useEffect(() => {
    const params = projectFilter ? `?project=${projectFilter}` : '';
    api.get(`/milestones${params}`).then((res) => setMilestones(res.data)).finally(() => setLoading(false));
  }, [projectFilter]);

  if (loading) return <LoadingSpinner />;

  const grouped = milestones.reduce((acc, m) => {
    const pid = m.project?._id || 'unknown';
    if (!acc[pid]) acc[pid] = { project: m.project, milestones: [] };
    acc[pid].milestones.push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Milestones</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Visual timeline of project milestones</p></div>
        <select className="input-field max-w-xs text-sm" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      {Object.values(grouped).map(({ project, milestones: ms }) => (
        <div key={project?._id} className="card p-6">
          <Link to={`/projects/${project?._id}`} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-4 block">{project?.name}</Link>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {ms.sort((a, b) => a.order - b.order).map((m, i) => (
              <div key={m._id} className="flex items-center shrink-0">
                <div className="text-center w-28">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white text-sm ${m.status === 'Completed' ? 'bg-green-500' : m.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {m.status === 'Completed' ? '✓' : `${m.progress}%`}
                  </div>
                  <p className="text-xs font-medium mt-2">{m.name}</p>
                  <StatusBadge status={m.status} />
                </div>
                {i < ms.length - 1 && <div className="w-12 h-0.5 bg-slate-300 mx-1" />}
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {ms.map((m) => (
              <div key={m._id} className="flex items-center gap-4 text-sm">
                <span className="w-32 font-medium">{m.name}</span>
                <div className="flex-1"><ProgressBar value={m.progress} showLabel={false} /></div>
                <span className="text-xs text-slate-500 w-24">{formatDate(m.targetDate)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
