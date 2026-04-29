import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../pages/admin/Dashboard';

interface Props { isOpen: boolean; onClose: () => void; onRefresh: () => void; project?: Project | null; }

export default function ProjectModal({ isOpen, onClose, onRefresh, project }: Props) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) { setName(project.name); setDescription(project.description); }
    else { setName(''); setDescription(''); }
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isEdit = !!project;
      const url = `http://localhost:5000/projects${isEdit ? `/${project.id}` : ''}`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) { onRefresh(); onClose(); }
      else alert('Eroare');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-[var(--crr-border)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--crr-border)] p-4">
          <h2 className="text-lg font-semibold text-[var(--crr-ink)]">{project ? 'Editează Proiect' : 'Proiect Nou'}</h2>
          <button onClick={onClose} className="text-[var(--crr-muted)] transition-colors hover:text-[var(--crr-red)]"><X className="h-5 w-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--crr-ink)]">Nume Proiect</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded border border-[var(--crr-border)] px-3 py-2 text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--crr-ink)]">Descriere</label>
            <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border border-[var(--crr-border)] px-3 py-2 text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"></textarea>
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
