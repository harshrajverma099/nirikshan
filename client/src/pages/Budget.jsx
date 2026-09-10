import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#1e40af', '#f97316', '#22c55e'];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/budget').then((res) => setBudgets(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalApproved = budgets.reduce((s, b) => s + b.approvedBudget, 0);
  const totalUtilized = budgets.reduce((s, b) => s + b.utilizedBudget, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budget Monitoring</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Track budget allocation and utilization across projects</p></div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-5 text-center"><p className="text-sm text-slate-500">Total Approved</p><p className="text-2xl font-bold">{formatCurrency(totalApproved)}</p></div>
        <div className="card p-5 text-center"><p className="text-sm text-slate-500">Total Utilized</p><p className="text-2xl font-bold text-orange-600">{formatCurrency(totalUtilized)}</p></div>
        <div className="card p-5 text-center"><p className="text-sm text-slate-500">Remaining</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalApproved - totalUtilized)}</p></div>
        <div className="card p-5 text-center"><p className="text-sm text-slate-500">Utilization</p><p className="text-2xl font-bold">{totalApproved ? Math.round((totalUtilized / totalApproved) * 100) : 0}%</p></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Budget by Project</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={budgets.slice(0, 8).map((b) => ({ name: b.project?.name?.substring(0, 12), utilized: b.utilizedBudget / 1e7, remaining: b.remainingBudget / 1e7 }))}>
              <XAxis dataKey="name" fontSize={10} /><YAxis /><Tooltip formatter={(v) => `₹${v.toFixed(1)} Cr`} />
              <Bar dataKey="utilized" fill="#f97316" stackId="a" /><Bar dataKey="remaining" fill="#22c55e" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-72">
          <h3 className="font-semibold mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={[{ name: 'Utilized', value: totalUtilized }, { name: 'Remaining', value: totalApproved - totalUtilized }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                <Cell fill="#f97316" /><Cell fill="#22c55e" />
              </Pie><Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-shell">
        <div className="table-scroll">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-3 text-left">Project</th><th className="p-3 text-left">Approved</th><th className="p-3 text-left">Utilized</th><th className="p-3 text-left">Remaining</th><th className="p-3 text-left">Utilization</th><th className="p-3 text-left">Warning</th></tr></thead>
          <tbody>{budgets.map((b) => {
            const warn = b.utilizationPercentage > (b.project?.progressPercentage || 0) + 10;
            return (
              <tr key={b._id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50">
                <td className="p-3"><Link to={`/projects/${b.project?._id}`} className="text-primary-600 dark:text-primary-400 hover:underline">{b.project?.name}</Link></td>
                <td className="p-3">{formatCurrency(b.approvedBudget)}</td>
                <td className="p-3">{formatCurrency(b.utilizedBudget)}</td>
                <td className="p-3">{formatCurrency(b.remainingBudget)}</td>
                <td className="p-3 w-32"><ProgressBar value={b.utilizationPercentage} color={warn ? 'bg-red-500' : 'bg-primary-600'} /></td>
                <td className="p-3">{warn ? <span className="text-red-600 text-xs">⚠ Over budget vs progress</span> : '—'}</td>
              </tr>
            );
          })}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
