import { useState, useEffect } from 'react';
import { Edit2, Trash2, FolderPlus, CalendarPlus, CheckSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProjectModal from '../../components/admin/ProjectModal';
import EventModal from '../../components/admin/EventModal';
import TaskModal from '../../components/admin/TaskModal';

export interface Project { id: number; name: string; description: string; }
export interface Event { id: number; projectId: number; name: string; date: string; location: string; qrCode?: string; }
export interface Volunteer { id: number; firstName: string; lastName: string; email: string; phone?: string; }
export interface Task { id: number; volunteer_id: number; event_id: number; description: string; status: string; }

export default function CoordinatorDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'events' | 'tasks'>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [projRes, evRes, taskRes, volRes] = await Promise.all([
        fetch('http://localhost:5000/projects', { headers }),
        fetch('http://localhost:5000/events', { headers }),
        fetch('http://localhost:5000/tasks', { headers }),
        fetch('http://localhost:5000/users/volunteers', { headers })
      ]);

      const projData = projRes.ok ? await projRes.json() : { projects: [] };
      const evData = evRes.ok ? await evRes.json() : { events: [] };
      const taskData = taskRes.ok ? await taskRes.json() : { tasks: [] };
      const volData = volRes.ok ? await volRes.json() : { volunteers: [] };

      setProjects(projData.projects || []);
      setEvents(evData.events || []);
      setTasks(taskData.tasks || []);
      setVolunteers(volData.volunteers || []);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Sigur vrei sa stergi acest proiect?')) return;
    try {
      await fetch(`http://localhost:5000/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-gray-900">Panou Coordonator</h1>
        <p className="text-gray-500 mt-1">Gestionează proiecte, evenimente și voluntari.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['projects', 'events', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight text-gray-900">Proiecte Active</h2>
              <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded text-sm">
                <FolderPlus className="w-4 h-4" /> Proiect Nou
              </button>
            </div>
            {projects.length === 0 ? <p className="text-gray-500 italic text-center py-6">Niciun proiect inregistrat.</p> : (
              <ul className="space-y-3">
                {projects.map(p => (
                  <li key={p.id} className="border border-gray-100 p-4 rounded hover:border-gray-300 transition-colors flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setEditingProject(p); setIsProjectModalOpen(true); }} className="text-gray-400 hover:text-black shrink-0"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProject(p.id)} className="text-gray-400 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-medium tracking-tight text-gray-900">Evenimente</h2>
               <button onClick={() => setIsEventModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded text-sm">
                 <CalendarPlus className="w-4 h-4" /> Eveniment Nou
               </button>
            </div>
            {events.length === 0 ? <p className="text-gray-500 italic text-center py-6">Niciun eveniment.</p> : (
              <ul className="space-y-3">
                {events.map(ev => (
                  <li key={ev.id} className="border border-gray-100 p-4 rounded hover:border-gray-300 transition-colors">
                     <h3 className="font-semibold text-lg text-gray-900">{ev.name}</h3>
                     <p className="text-sm text-gray-500 mt-1">Dată: {new Date(ev.date).toLocaleDateString()} | Locație: {ev.location}</p>
                     <p className="text-xs mt-2 bg-gray-100 inline-block px-2 py-1 rounded text-gray-700">Proiect ID: {ev.projectId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-medium tracking-tight text-gray-900">Alocări voluntari</h2>
               <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded text-sm">
                 <CheckSquare className="w-4 h-4" /> Alocă Voluntar
               </button>
            </div>
            {tasks.length === 0 ? <p className="text-gray-500 italic text-center py-6">Nicio alocare.</p> : (
              <ul className="space-y-3">
                {tasks.map(t => {
                   const vol = volunteers.find(v => v.id === t.volunteer_id);
                   const ev = events.find(e => e.id === t.event_id);
                   return (
                    <li key={t.id} className="border border-gray-100 p-4 rounded hover:border-gray-300 transition-colors flex justify-between items-center">
                       <div>
                         <h3 className="font-medium text-gray-900">{t.description}</h3>
                         <p className="text-sm text-gray-500 mt-1">Voluntar: {vol ? `${vol.firstName} ${vol.lastName}` : `ID ${t.volunteer_id}`} | Eveniment: {ev?.name || `ID ${t.event_id}`}</p>
                       </div>
                       <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 uppercase font-medium rounded">{t.status}</span>
                    </li>
                   );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {isProjectModalOpen && <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onRefresh={fetchData} project={editingProject} />}
      {isEventModalOpen && <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onRefresh={fetchData} projects={projects} />}
      {isTaskModalOpen && <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onRefresh={fetchData} events={events} volunteers={volunteers} />}
    </div>
  );
}
