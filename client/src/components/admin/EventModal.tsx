import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../pages/admin/Dashboard';

interface Props { isOpen: boolean; onClose: () => void; onRefresh: () => void; projects: Project[]; }

export default function EventModal({ isOpen, onClose, onRefresh, projects }: Props) {
  const { token } = useAuth();
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ projectId: Number(projectId), name, date, location })
      });
      if (res.ok) { onRefresh(); onClose(); }
      else alert('Eroare');
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Eveniment Nou</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proiect</label>
            <select required value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-black text-sm">
              <option value="" disabled>Selecteaza un proiect</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume Eveniment</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Locație</label>
            <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">Anulează</button>
            <button type="submit" disabled={isLoading} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
