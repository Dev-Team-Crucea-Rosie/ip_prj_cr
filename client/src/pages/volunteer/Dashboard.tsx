import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Calendar, MapPin, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Task {
  id: number;
  description: string;
  status: string;
  event_name: string;
  event_date: string;
  event_location: string;
  project_id: number;
  project_name: string;
  is_present?: boolean;
}

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/tasks/my-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Eroare rețea");

        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Eroare la încărcarea task-urilor", error);
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
          <h2 className="text-2xl font-bold tracking-tight text-[var(--crr-ink)]">
            Privire Generală
          </h2>
          <p className="mt-1 text-sm text-[var(--crr-muted)]">
            Gestionarea activității tale curente.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={() => navigate("/scan")}
          className="flex w-full items-center justify-between rounded-xl bg-[var(--crr-red)] p-5 text-white shadow-md transition-all active:scale-95 hover:bg-[var(--crr-red-dark)]"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-lg font-semibold">Prezență Eveniment</span>
            <span className="mt-1 text-sm text-white/85">
              Scanează codul QR la sosire
            </span>
          </div>
          <div className="rounded-full bg-white/15 p-3">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--crr-border)] bg-white p-4 text-center shadow-sm">
          <div className="mb-1 text-3xl font-bold text-[var(--crr-red)]">
            12
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-[var(--crr-muted)]">
            Ore acumulate
          </div>
        </div>
        <div className="rounded-xl border border-[var(--crr-border)] bg-white p-4 text-center shadow-sm">
          <div className="mb-1 text-3xl font-bold text-[var(--crr-red)]">
            {tasks.length}
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-[var(--crr-muted)]">
            Misiuni Alocate
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--crr-ink)]">
            Misiuni Alocate
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 w-full rounded-xl bg-[var(--crr-border)]"></div>
            <div className="h-32 w-full rounded-xl bg-[var(--crr-border)]"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-[var(--crr-border)] bg-white py-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[var(--crr-red)]" />
            <h3 className="font-medium text-[var(--crr-ink)]">Nicio misiune</h3>
            <p className="mt-1 text-sm text-[var(--crr-muted)]">
              Nu ai nicio misiune alocată momentan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="relative overflow-hidden rounded-xl border border-[var(--crr-border)] bg-white p-4 text-left shadow-sm"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-[var(--crr-red)]"></div>
                <div className="mb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[1.05rem] font-bold leading-tight text-[var(--crr-ink)]">
                      {task.event_name}
                    </h3>
                    <span
                      className={`ml-2 whitespace-nowrap rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        task.is_present
                          ? "bg-green-100 text-green-700"
                          : "bg-[var(--crr-red-softer)] text-[var(--crr-red-dark)]"
                      }`}
                    >
                      {task.is_present ? "PREZENT" : task.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--crr-ink)]">
                    {task.project_name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--crr-muted)]">
                    {task.description}
                  </p>
                </div>

                <div className="mt-4 grid gap-2 border-t border-[var(--crr-border)] pt-3">
                  <div className="flex items-center text-sm text-[var(--crr-muted)]">
                    <Calendar className="mr-2 h-4 w-4 text-[var(--crr-red)]" />
                    <span>
                      {new Date(task.event_date).toLocaleDateString("ro-RO")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-[var(--crr-muted)]">
                    <MapPin className="mr-2 h-4 w-4 text-[var(--crr-red)]" />
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
