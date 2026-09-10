import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#1e40af', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#64748b'];

export default function Analytics() {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#f1f5f9' : '#0f172a',
  };

  useEffect(() => {
    api.get('/analytics/charts').then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Data-driven insights from live project data</p></div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Projects by Status</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart><Pie data={data.projectsByStatus.filter((d) => d.count > 0)} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
              {data.projectsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip contentStyle={tooltipStyle} /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Department-wise Projects</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.deptProjects}><XAxis dataKey="department" fontSize={10} stroke={axisColor} tick={{ fill: axisColor }} /><YAxis stroke={axisColor} tick={{ fill: axisColor }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Monthly Project Progress</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data.monthlyProgress}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor }} /><YAxis domain={[0, 100]} stroke={axisColor} tick={{ fill: axisColor }} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="avgProgress" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa' }} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.riskDistribution}><XAxis dataKey="severity" stroke={axisColor} tick={{ fill: axisColor }} /><YAxis stroke={axisColor} tick={{ fill: axisColor }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Task Completion</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart><Pie data={data.taskCompletion.filter((d) => d.count > 0)} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
              {data.taskCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip contentStyle={tooltipStyle} /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Project Performance (Health vs Progress)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.performanceData}><XAxis dataKey="name" fontSize={9} stroke={axisColor} tick={{ fill: axisColor }} /><YAxis domain={[0, 100]} stroke={axisColor} tick={{ fill: axisColor }} /><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ color: axisColor }} /><Bar dataKey="health" fill="#1e40af" name="Health" /><Bar dataKey="progress" fill="#22c55e" name="Progress" /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5 h-80">
        <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Budget Utilization by Project (₹ Crores)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data.budgetData.slice(0, 10)}>
            <XAxis dataKey="name" fontSize={9} stroke={axisColor} tick={{ fill: axisColor }} /><YAxis stroke={axisColor} tick={{ fill: axisColor }} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${v.toFixed(1)} Cr`} /><Legend wrapperStyle={{ color: axisColor }} />
            <Bar dataKey="utilized" fill="#f97316" name="Utilized" /><Bar dataKey="remaining" fill="#22c55e" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
