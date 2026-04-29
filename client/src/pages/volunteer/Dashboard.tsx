import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Task {
  id: number;
  description: string;
  status: string;
  event_name: string;
  event_date: string;
  event_location: string;
  project_id: number;
  project_name: string;
}

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth(); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/tasks/my-tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Eroare rețea');
        
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Eroare la încărcarea task-urilor', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  return (
    <div className="pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Privire Generală</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestionarea activității tale curente.</p>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-black text-white rounded-xl p-5 flex items-center justify-between shadow-md active:scale-95 transition-transform"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-lg font-semibold">Prezență Eveniment</span>
            <span className="text-sm text-gray-300 opacity-90 mt-1">Scanează codul QR la sosire</span>
          </div>
          <div className="bg-white/10 p-3 rounded-full">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-black mb-1">12</div>
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Ore acumulate</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-black mb-1">{tasks.length}</div>
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Misiuni Alocate</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black flex items-center gap-2">Misiuni Alocate</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 bg-white border border-gray-200 rounded-xl">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">Nicio misiune</h3>
            <p className="text-gray-500 text-sm mt-1">Nu ai nicio misiune alocată momentan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white border text-left border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                <div className="mb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-[1.05rem] leading-tight">{task.event_name}</h3>
                    <span className="bg-gray-100 text-black text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-wider whitespace-nowrap ml-2">{task.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">{task.project_name}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 grid gap-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{new Date(task.event_date).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{task.event_location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
