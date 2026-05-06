import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  qr_code: string | null;
}

interface Attendance {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  scan_date: string;
  scan_time: string;
}

export default function QRGeneration() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Eroare la încărcarea evenimentelor");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:5000/events/${eventId}/generate-qr`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Eroare la generarea codului QR");
      }
      const data = await response.json();

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId ? { ...ev, qr_code: data.event.qr_code } : ev,
        ),
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectEvent = async (eventId: string) => {
    setSelectedEventId(eventId);
    setAttendanceLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/events/${eventId}/attendance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) throw new Error("Eroare la încărcarea prezenței");
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (err: any) {
      console.error(err);
      setAttendance([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  if (loading) return <div className="p-4">Se incarca...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold text-[var(--crr-ink)] mb-6">
          Evenimente - Generare QR
        </h2>
        {error && <p className="text-[var(--crr-red)] mb-4">{error}</p>}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${selectedEventId === event.id ? "border-[var(--crr-red)] bg-[var(--crr-red-softer)]" : "border-[var(--crr-border)] bg-white hover:border-[var(--crr-red-soft)]"}`}
              onClick={() => handleSelectEvent(event.id)}
            >
              <h3 className="text-lg font-semibold text-[var(--crr-ink)]">
                {event.name}
              </h3>
              <p className="text-sm text-[var(--crr-muted)]">
                Data: {new Date(event.date).toLocaleDateString()} | Locație:{" "}
                {event.location}
              </p>

              {!event.qr_code ? (
                <button
                  onClick={(e) => handleGenerateQR(event.id, e)}
                  className="mt-3 px-4 py-2 bg-[var(--crr-red)] text-white text-sm font-medium rounded-lg hover:bg-[var(--crr-red-dark)] transition-colors"
                >
                  Generează QR Prezență
                </button>
              ) : (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Cod QR Generat
                </p>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-[var(--crr-muted)]">Nu există evenimente.</p>
          )}
        </div>
      </div>

      {selectedEventId && (
        <div className="w-full md:w-1/2 bg-white rounded-xl border border-[var(--crr-border)] p-6 shrink-0 h-fit">
          {(() => {
            const selectedEvent = events.find((e) => e.id === selectedEventId);
            if (!selectedEvent) return null;

            return (
              <>
                <h3 className="text-xl font-bold text-[var(--crr-ink)] mb-4">
                  {selectedEvent.name}
                </h3>

                {selectedEvent.qr_code ? (
                  <div className="flex flex-col items-center mb-8 bg-[var(--crr-gray)] p-6 rounded-lg">
                    <QRCodeSVG value={selectedEvent.qr_code} size={200} />
                    <p className="mt-4 text-sm text-[var(--crr-muted)] text-center">
                      Scanează acest cod de pe un cont de Voluntar pentru a fi
                      marcat ca prezent.
                    </p>
                  </div>
                ) : (
                  <div className="mb-8 p-6 text-center border border-dashed border-[var(--crr-border)] rounded-lg">
                    <p className="text-[var(--crr-muted)]">
                      Generează un cod QR pentru acest eveniment pentru a
                      permite scanarea.
                    </p>
                  </div>
                )}

                <h4 className="text-lg font-semibold text-[var(--crr-ink)] mb-3">
                  Lista Prezență
                </h4>
                {attendanceLoading ? (
                  <p className="text-sm text-[var(--crr-muted)]">
                    Se încarcă lista de prezență...
                  </p>
                ) : attendance.length > 0 ? (
                  <ul className="space-y-2">
                    {attendance.map((a) => (
                      <li
                        key={`${a.id}-${a.scan_time}`}
                        className="p-3 bg-[var(--crr-gray)] rounded-lg flex justify-between items-center text-sm"
                      >
                        <span className="font-medium text-[var(--crr-ink)]">
                          {a.first_name} {a.last_name}
                        </span>
                        <span className="text-[var(--crr-muted)]">
                          {new Date(a.scan_date).toLocaleDateString()}{" "}
                          {a.scan_time}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--crr-muted)]">
                    Niciun voluntar prezent momentan.
                  </p>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
