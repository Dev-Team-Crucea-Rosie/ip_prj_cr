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
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-[var(--crr-border)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--crr-border)] p-4">
          <h2 className="text-lg font-semibold text-[var(--crr-ink)]">Eveniment Nou</h2>
          <button onClick={onClose} className="text-[var(--crr-muted)] transition-colors hover:text-[var(--crr-red)]"><X className="h-5 w-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--crr-ink)]">Proiect</label>
            <select required value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full rounded border border-[var(--crr-border)] px-3 py-2 text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]">
              <option value="" disabled>Selecteaza un proiect</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--crr-ink)]">Nume Eveniment</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded border border-[var(--crr-border)] px-3 py-2 text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--crr-ink)]">Data</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded border border-[var(--crr-border)] px-3 py-2 text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--crr-ink)]">Locație</label>
            <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full rounded border border-[var(--crr-border)] px-3 py-2 text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded bg-[var(--crr-red-softer)] px-4 py-2 text-sm font-medium text-[var(--crr-red-dark)] transition-colors hover:bg-[var(--crr-red-soft)]">Anulează</button>
            <button type="submit" disabled={isLoading} className="flex items-center rounded bg-[var(--crr-red)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--crr-red-dark)] disabled:opacity-50">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
