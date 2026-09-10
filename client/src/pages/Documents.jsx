import { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { formatDate } from '../utils/helpers';

const categories = ['Project Proposal', 'Budget', 'Tender', 'Report', 'Approval', 'Progress Report', 'Other'];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ project: '', name: '', category: 'Other', file: null });

  const fetch = () => api.get('/documents').then((res) => setDocuments(res.data)).finally(() => setLoading(false));

  useEffect(() => {
    fetch();
    api.get('/projects?limit=50').then((res) => setProjects(res.data.projects || []));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('project', form.project);
    fd.append('name', form.name || form.file.name);
    fd.append('category', form.category);
    fd.append('file', form.file);
    await api.post('/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setShowModal(false);
    setToast({ message: 'Document uploaded', type: 'success' });
    fetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    await api.delete(`/documents/${id}`);
    setToast({ message: 'Document deleted', type: 'success' });
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Project document management</p></div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">+ Upload Document</button>
      </div>
      <div className="table-shell">
        <div className="table-scroll">
        <table className="w-full text-sm">
          <thead className="table-head"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Project</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Uploaded By</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Actions</th></tr></thead>
          <tbody>{documents.map((d) => (
            <tr key={d._id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50">
              <td className="p-3 font-medium">{d.name}</td>
              <td className="p-3">{d.project?.name}</td>
              <td className="p-3"><span className="badge bg-slate-100 text-slate-700">{d.category}</span></td>
              <td className="p-3">{d.uploadedBy?.name}</td>
              <td className="p-3">{formatDate(d.createdAt)}</td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await api.get(`/documents/${d._id}/download`, { responseType: 'blob' });
                    const url = URL.createObjectURL(res.data);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = d.originalName;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-primary-600 dark:text-primary-400 hover:underline mr-2"
                >
                  Download
                </button>
                <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        </div>
        {documents.length === 0 && <p className="p-8 text-center text-slate-400">No documents uploaded yet</p>}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <select className="input-field" required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
            <option value="">Select Project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input className="input-field" placeholder="Document name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="file" required className="input-field" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
          <button type="submit" className="btn-primary">Upload</button>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
