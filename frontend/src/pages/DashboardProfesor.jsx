import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import { Badge, Button, Card } from "../components/ui";
import "./Dashboard.css";

const stats = [
  {
    title: "Estudiantes activos",
    value: "320",
    detail: "+18 esta semana",
    icon: Users,
  },
  {
    title: "Salas activas",
    value: "6",
    detail: "3 en vivo ahora",
    icon: Video,
  },
  {
    title: "Cursos publicados",
    value: "12",
    detail: "+2 este mes",
    icon: BookOpen,
  },
  {
    title: "Progreso promedio",
    value: "84%",
    detail: "+6% este mes",
    icon: TrendingUp,
  },
];

const classes = [
  {
    title: "Matemáticas avanzadas",
    time: "09:00 - 10:30",
    students: "28 estudiantes",
    status: "En vivo",
    statusVariant: "success",
  },
  {
    title: "Programación en Java",
    time: "11:00 - 12:30",
    students: "34 estudiantes",
    status: "Programada",
    statusVariant: "blue",
  },
  {
    title: "Bases de datos",
    time: "15:00 - 17:00",
    students: "22 estudiantes",
    status: "Pendiente",
    statusVariant: "warning",
  },
];

const activity = [
  {
    title: "María entregó la actividad de Álgebra",
    time: "Hace 5 minutos",
  },
  {
    title: "Carlos completó cuatro ciclos Pomodoro",
    time: "Hace 12 minutos",
  },
  {
    title: "Se creó una nueva sala para Física",
    time: "Hace 25 minutos",
  },
  {
    title: "Ana alcanzó el 90% del curso de Java",
    time: "Hace 40 minutos",
  },
];

function DashboardProfesor() {
  return (
    <div className="teacher-dashboard-layout">
      <Sidebar />

      <main className="teacher-dashboard-content">
        <header className="dashboard-topbar">
          <div className="dashboard-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Buscar cursos, estudiantes o salas..."
            />
          </div>

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              <span className="notification-dot" />
            </button>

            <div className="dashboard-profile">
              <div className="dashboard-profile-avatar">RV</div>

              <div>
                <strong>Richard Villaparedes</strong>
                <span>Profesor</span>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <Badge variant="blue">
              <Sparkles size={14} />
              Panel del profesor
            </Badge>

            <h1>Buenos días, Richard</h1>

            <p>
              Administra tus clases, estudiantes y actividades desde un solo
              lugar.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <Button variant="secondary">
              <CalendarDays size={18} />
              Ver calendario
            </Button>

            <Button>
              <Video size={18} />
              Crear sala
            </Button>
          </div>
        </section>

        <section className="dashboard-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                hover
                className="dashboard-stat-card"
              >
                <div className="dashboard-stat-icon">
                  <Icon size={22} />
                </div>

                <div className="dashboard-stat-content">
                  <span>{stat.title}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.detail}</small>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="dashboard-main-grid">
          <Card className="dashboard-agenda-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-panel-eyebrow">
                  Agenda
                </span>

                <h2>Próximas clases</h2>
              </div>

              <button
                type="button"
                className="dashboard-panel-link"
              >
                Ver todas
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="dashboard-class-list">
              {classes.map((item) => (
                <article
                  className="dashboard-class-item"
                  key={item.title}
                >
                  <div className="dashboard-class-icon">
                    <BookOpen size={20} />
                  </div>

                  <div className="dashboard-class-info">
                    <strong>{item.title}</strong>

                    <span>
                      <Clock3 size={15} />
                      {item.time}
                    </span>
                  </div>

                  <div className="dashboard-class-meta">
                    <small>{item.students}</small>

                    <Badge variant={item.statusVariant}>
                      {item.status}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card className="dashboard-activity-panel">
            <div className="dashboard-panel-header">
              <div>
                <span className="dashboard-panel-eyebrow">
                  Seguimiento
                </span>

                <h2>Actividad reciente</h2>
              </div>

              <button
                type="button"
                className="dashboard-panel-link"
              >
                Ver todo
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="dashboard-activity-list">
              {activity.map((item) => (
                <article
                  className="dashboard-activity-item"
                  key={item.title}
                >
                  <div className="dashboard-activity-dot" />

                  <div>
                    <p>{item.title}</p>
                    <span>{item.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default DashboardProfesor;