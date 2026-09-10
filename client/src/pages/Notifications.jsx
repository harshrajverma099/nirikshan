import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const severityIcons = { critical: '🔴', warning: '⚠️', success: '✓', info: 'ℹ️' };
const severityBg = { critical: 'border-l-red-500 bg-red-50', warning: 'border-l-amber-500 bg-amber-50', success: 'border-l-green-500 bg-green-50', info: 'border-l-blue-500 bg-blue-50' };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => api.get('/notifications').then((res) => setNotifications(res.data)).finally(() => setLoading(false));

  useEffect(() => { fetch(); }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetch();
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Alerts generated from application data</p></div>
        <button onClick={markAllRead} className="btn-secondary text-sm">Mark all read</button>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n._id} className={`card p-4 border-l-4 ${severityBg[n.severity]} ${n.isRead ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{severityIcons[n.severity]} {n.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                {n.relatedProject && (
                  <Link to={`/projects/${n.relatedProject._id}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 block">
                    {n.relatedProject.name}
                  </Link>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{formatDate(n.createdAt)}</p>
                {!n.isRead && <button onClick={() => markRead(n._id)} className="text-xs text-primary-600 mt-1">Mark read</button>}
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-center text-slate-400 py-12">No notifications</p>}
      </div>
    </div>
  );
}
