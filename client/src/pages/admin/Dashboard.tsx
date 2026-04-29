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
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--crr-red)]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-[var(--crr-ink)]">Panou Coordonator</h1>
        <p className="mt-1 text-[var(--crr-muted)]">Gestionează proiecte, evenimente și voluntari.</p>
      </div>

      <div className="border-b border-[var(--crr-border)]">
        <nav className="-mb-px flex space-x-8">
          {(['projects', 'events', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-[var(--crr-red)] text-[var(--crr-red)]'
                  : 'border-transparent text-[var(--crr-muted)] hover:border-[var(--crr-border)] hover:text-[var(--crr-red-dark)]'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-lg border border-[var(--crr-border)] bg-white p-6 shadow-sm">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight text-[var(--crr-ink)]">Proiecte Active</h2>
              <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} className="flex items-center gap-2 rounded bg-[var(--crr-red)] px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--crr-red-dark)]">
                <FolderPlus className="w-4 h-4" /> Proiect Nou
              </button>
            </div>
            {projects.length === 0 ? <p className="py-6 text-center italic text-[var(--crr-muted)]">Niciun proiect inregistrat.</p> : (
              <ul className="space-y-3">
                {projects.map(p => (
                  <li key={p.id} className="flex items-start justify-between rounded border border-[var(--crr-border)] p-4 transition-colors hover:border-[var(--crr-red)]">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--crr-ink)]">{p.name}</h3>
                      <p className="mt-1 text-sm text-[var(--crr-muted)]">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setEditingProject(p); setIsProjectModalOpen(true); }} className="shrink-0 text-[var(--crr-muted)] transition-colors hover:text-[var(--crr-red)]"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteProject(p.id)} className="shrink-0 text-[var(--crr-muted)] transition-colors hover:text-[var(--crr-red-dark)]"><Trash2 className="h-4 w-4" /></button>
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
               <h2 className="text-xl font-medium tracking-tight text-[var(--crr-ink)]">Evenimente</h2>
               <button onClick={() => setIsEventModalOpen(true)} className="flex items-center gap-2 rounded bg-[var(--crr-red)] px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--crr-red-dark)]">
                 <CalendarPlus className="w-4 h-4" /> Eveniment Nou
               </button>
            </div>
            {events.length === 0 ? <p className="py-6 text-center italic text-[var(--crr-muted)]">Niciun eveniment.</p> : (
              <ul className="space-y-3">
                {events.map(ev => (
                  <li key={ev.id} className="rounded border border-[var(--crr-border)] p-4 transition-colors hover:border-[var(--crr-red)]">
                     <h3 className="text-lg font-semibold text-[var(--crr-ink)]">{ev.name}</h3>
                     <p className="mt-1 text-sm text-[var(--crr-muted)]">Dată: {new Date(ev.date).toLocaleDateString()} | Locație: {ev.location}</p>
                     <p className="mt-2 inline-block rounded bg-[var(--crr-red-softer)] px-2 py-1 text-xs text-[var(--crr-red-dark)]">Proiect ID: {ev.projectId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-medium tracking-tight text-[var(--crr-ink)]">Alocări voluntari</h2>
               <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2 rounded bg-[var(--crr-red)] px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--crr-red-dark)]">
                 <CheckSquare className="w-4 h-4" /> Alocă Voluntar
               </button>
            </div>
            {tasks.length === 0 ? <p className="py-6 text-center italic text-[var(--crr-muted)]">Nicio alocare.</p> : (
              <ul className="space-y-3">
                {tasks.map(t => {
                   const vol = volunteers.find(v => v.id === t.volunteer_id);
                   const ev = events.find(e => e.id === t.event_id);
                   return (
                    <li key={t.id} className="flex items-center justify-between rounded border border-[var(--crr-border)] p-4 transition-colors hover:border-[var(--crr-red)]">
                       <div>
                         <h3 className="font-medium text-[var(--crr-ink)]">{t.description}</h3>
                         <p className="mt-1 text-sm text-[var(--crr-muted)]">Voluntar: {vol ? `${vol.firstName} ${vol.lastName}` : `ID ${t.volunteer_id}`} | Eveniment: {ev?.name || `ID ${t.event_id}`}</p>
                       </div>
                       <span className="rounded bg-[var(--crr-red-softer)] px-2 py-1 text-xs font-medium uppercase text-[var(--crr-red-dark)]">{t.status}</span>
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
