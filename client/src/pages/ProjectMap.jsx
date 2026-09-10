import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/helpers';

const riskColors = { Low: '#22c55e', Medium: '#eab308', High: '#f97316', Critical: '#ef4444' };

const createIcon = (risk) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${riskColors[risk] || '#1e40af'};width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export default function ProjectMap() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects/map').then((res) => setProjects(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Map</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Geographic monitoring — Demo locations across India (fictional data)</p>
      </div>
      <div className="table-shell h-[calc(100dvh-280px)] sm:h-[calc(100dvh-240px)] md:h-[calc(100vh-220px)] min-h-[320px]">
        <MapContainer center={[22.5, 79]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {projects.map((p) => (
            <Marker key={p._id} position={[p.coordinates?.lat || 28.6, p.coordinates?.lng || 77.2]} icon={createIcon(p.riskLevel)}>
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">[DEMO] {p.location}</p>
                  <div className="mt-2 space-y-1">
                    <p>Progress: <strong>{p.progressPercentage}%</strong></p>
                    <p>Budget: {formatCurrency(p.utilizedBudget)} / {formatCurrency(p.totalBudget)}</p>
                    <StatusBadge status={p.riskLevel} /> <StatusBadge status={p.status} />
                  </div>
                  <Link to={`/projects/${p._id}`} className="text-primary-600 text-xs hover:underline mt-2 block">View Project →</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
