import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Focus,
  Plus,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/shared/Calendario.css";
const days = [
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3, events: 1 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7, events: 2 },
  { day: 8 },
  { day: 9 },
  { day: 10, events: 1 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14, current: true, events: 2 },
  { day: 15 },
  { day: 16 },
  { day: 17 },
  { day: 18, events: 1 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24, events: 1 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 31 },
  { day: 1, muted: true },
  { day: 2, muted: true },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Sala de React",
    type: "Sala de estudio",
    time: "09:00 - 10:30",
    participants: 12,
    icon: Video,
  },
  {
    id: 2,
    title: "Práctica de SQL",
    type: "Curso",
    time: "11:00 - 12:00",
    participants: 24,
    icon: CalendarDays,
  },
  {
    id: 3,
    title: "Sesión Pomodoro",
    type: "Focus",
    time: "15:00 - 15:25",
    participants: 1,
    icon: Focus,
  },
];

function Calendario() {
  return (
    <div className="calendar-layout">
      <Sidebar />

      <main className="calendar-content">
        <header className="calendar-header">
          <div>
            <span className="calendar-eyebrow">
              <CalendarDays size={15} />
              Agenda académica
            </span>

            <h1>Calendario</h1>

            <p>
              Organiza tus clases, salas de estudio, tareas y sesiones Focus.
            </p>
          </div>

          <button type="button" className="calendar-create-button">
            <Plus size={18} />
            Crear evento
          </button>
        </header>

        <section className="calendar-stats-grid">
          <article className="calendar-stat-card">
            <span>Eventos este mes</span>
            <strong>18</strong>
            <small>5 pendientes esta semana</small>
          </article>

          <article className="calendar-stat-card">
            <span>Sesiones Focus</span>
            <strong>12</strong>
            <small>6 horas acumuladas</small>
          </article>

          <article className="calendar-stat-card">
            <span>Salas programadas</span>
            <strong>7</strong>
            <small>2 comienzan hoy</small>
          </article>
        </section>

        <section className="calendar-main-grid">
          <article className="calendar-panel calendar-month-panel">
            <div className="calendar-panel-header">
              <div>
                <span className="calendar-section-label">Vista mensual</span>
                <h2>Julio 2026</h2>
              </div>

              <div className="calendar-navigation">
                <button type="button" aria-label="Mes anterior">
                  <ChevronLeft size={18} />
                </button>

                <button type="button" className="calendar-today-button">
                  Hoy
                </button>

                <button type="button" aria-label="Mes siguiente">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="calendar-weekdays">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                (weekday) => (
                  <span key={weekday}>{weekday}</span>
                ),
              )}
            </div>

            <div className="calendar-days-grid">
              {days.map((date, index) => (
                <button
                  type="button"
                  className={[
                    "calendar-day",
                    date.muted ? "muted" : "",
                    date.current ? "current" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={`${date.day}-${index}`}
                >
                  <span>{date.day}</span>

                  {date.events && (
                    <small>
                      {date.events} evento{date.events > 1 ? "s" : ""}
                    </small>
                  )}
                </button>
              ))}
            </div>
          </article>

          <aside className="calendar-side-column">
            <article className="calendar-panel calendar-agenda-panel">
              <div className="calendar-panel-header">
                <div>
                  <span className="calendar-section-label">Próximamente</span>
                  <h2>Agenda de hoy</h2>
                </div>

                <span className="calendar-date-label">14 de julio</span>
              </div>

              <div className="calendar-events-list">
                {upcomingEvents.map((event) => {
                  const EventIcon = event.icon;

                  return (
                    <article className="calendar-event-item" key={event.id}>
                      <div className="calendar-event-icon">
                        <EventIcon size={19} />
                      </div>

                      <div className="calendar-event-info">
                        <strong>{event.title}</strong>
                        <span>{event.type}</span>

                        <div className="calendar-event-meta">
                          <small>
                            <Clock3 size={14} />
                            {event.time}
                          </small>

                          <small>
                            <Users size={14} />
                            {event.participants}
                          </small>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </article>

            <article className="calendar-panel calendar-focus-panel">
              <span className="calendar-section-label">Focus de hoy</span>

              <h2>2 de 4 sesiones completadas</h2>

              <div className="calendar-progress-track">
                <span />
              </div>

              <p>
                Completa dos sesiones más para alcanzar tu objetivo diario.
              </p>

              <button type="button">
                <Focus size={17} />
                Iniciar Pomodoro
              </button>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Calendario;