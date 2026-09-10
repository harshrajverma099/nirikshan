import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#1e40af', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#64748b'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/charts').then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Data-driven insights from live project data</p></div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Projects by Status</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart><Pie data={data.projectsByStatus.filter((d) => d.count > 0)} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
              {data.projectsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Department-wise Projects</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.deptProjects}><XAxis dataKey="department" fontSize={10} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Monthly Project Progress</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data.monthlyProgress}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="avgProgress" stroke="#1e40af" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.riskDistribution}><XAxis dataKey="severity" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Task Completion</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart><Pie data={data.taskCompletion.filter((d) => d.count > 0)} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
              {data.taskCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Project Performance (Health vs Progress)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.performanceData}><XAxis dataKey="name" fontSize={9} /><YAxis domain={[0, 100]} /><Tooltip /><Legend /><Bar dataKey="health" fill="#1e40af" name="Health" /><Bar dataKey="progress" fill="#22c55e" name="Progress" /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5 h-80">
        <h3 className="font-semibold mb-4">Budget Utilization by Project (₹ Crores)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data.budgetData.slice(0, 10)}>
            <XAxis dataKey="name" fontSize={9} /><YAxis /><Tooltip formatter={(v) => `₹${v.toFixed(1)} Cr`} /><Legend />
            <Bar dataKey="utilized" fill="#f97316" name="Utilized" /><Bar dataKey="remaining" fill="#22c55e" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
