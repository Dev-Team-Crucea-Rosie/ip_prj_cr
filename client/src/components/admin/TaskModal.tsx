import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Event, Volunteer } from '../../pages/admin/Dashboard';

interface Props { isOpen: boolean; onClose: () => void; onRefresh: () => void; events: Event[]; volunteers: Volunteer[]; }

export default function TaskModal({ isOpen, onClose, onRefresh, events, volunteers }: Props) {
  const { token } = useAuth();
  const [eventId, setEventId] = useState(events[0]?.id || '');
  const [volunteerId, setVolunteerId] = useState(volunteers[0]?.id || '');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ eventId: Number(eventId), volunteerId: Number(volunteerId), description })
      });
      if (res.ok) { onRefresh(); onClose(); }
      else alert('Eroare');
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Alocare voluntar (Task nou)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eveniment</label>
            <select required value={eventId} onChange={e => setEventId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black">
              <option value="" disabled>Selectează eveniment...</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voluntar</label>
            <select required value={volunteerId} onChange={e => setVolunteerId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black">
              <option value="" disabled>Selectează voluntar...</option>
              {volunteers.map(v => <option key={v.id} value={v.id}>{v.firstName} {v.lastName} ({v.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descriere Task</label>
            <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-black" placeholder="ex: Ocupare pozitie intrare..."></textarea>
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
