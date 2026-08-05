import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Medal,
  Play,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/student/DashboardEstudiante.css";
const courses = [
  {
    id: 1,
    name: "JavaScript moderno",
    teacher: "Profesor Camilo",
    progress: 78,
    nextLesson: "Funciones asíncronas",
  },
  {
    id: 2,
    name: "Bases de datos",
    teacher: "Profesor Richard",
    progress: 62,
    nextLesson: "Consultas avanzadas",
  },
  {
    id: 3,
    name: "React",
    teacher: "Profesora Andrea",
    progress: 45,
    nextLesson: "Manejo de estado",
  },
];

const tasks = [
  {
    id: 1,
    title: "Resolver ejercicios de JavaScript",
    subject: "JavaScript moderno",
    completed: true,
  },
  {
    id: 2,
    title: "Revisar consultas SQL",
    subject: "Bases de datos",
    completed: true,
  },
  {
    id: 3,
    title: "Completar práctica de componentes",
    subject: "React",
    completed: false,
  },
];

const friends = [
  { id: 1, name: "Ana", initials: "AN", status: "En sala de React" },
  { id: 2, name: "Luis", initials: "LU", status: "Modo Focus" },
  { id: 3, name: "María", initials: "MA", status: "Estudiando Java" },
];

function DashboardEstudiante() {
  return (
    <div className="student-dashboard-layout">
      <Sidebar />

      <main className="student-dashboard-content">
        <header className="student-dashboard-header">
          <div>
            <span className="student-dashboard-eyebrow">
              <TrendingUp size={15} />
              Panel del estudiante
            </span>

            <h1>
              Buenos días, <span>Richard</span>
            </h1>

            <p>
              Continúa aprendiendo y completa tus objetivos de estudio de hoy.
            </p>
          </div>

          <div className="student-dashboard-actions">
            <Link
              to="/calendario"
              className="student-secondary-button"
            >
              <CalendarDays size={18} />
              Ver calendario
            </Link>

            <Link
              to="/study-rooms"
              className="student-primary-button"
            >
              <Users size={18} />
              Buscar sala
            </Link>
          </div>
        </header>

        <section className="student-welcome-banner">
          <div className="student-welcome-copy">
            <span className="student-banner-label">
              <Flame size={15} />
              Racha activa
            </span>

            <h2>¡Llevas 7 días estudiando sin detenerte!</h2>

            <p>
              Completa una sesión hoy para conservar tu racha semanal.
            </p>
          </div>

          <div className="student-streak-number">
            <strong>7</strong>
            <span>días</span>
          </div>
        </section>

        <section className="student-stats-grid">
          <article className="student-stat-card">
            <div className="student-stat-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <span>Tiempo estudiado</span>
              <strong>18h 40m</strong>
              <small>+2h esta semana</small>
            </div>
          </article>

          <article className="student-stat-card">
            <div className="student-stat-icon">
              <Target size={22} />
            </div>

            <div>
              <span>Objetivos completados</span>
              <strong>14</strong>
              <small>2 pendientes hoy</small>
            </div>
          </article>

          <article className="student-stat-card">
            <div className="student-stat-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <span>Cursos activos</span>
              <strong>3</strong>
              <small>1 lección nueva</small>
            </div>
          </article>

          <article className="student-stat-card">
            <div className="student-stat-icon">
              <Medal size={22} />
            </div>

            <div>
              <span>Logros obtenidos</span>
              <strong>8</strong>
              <small>Próximo al nivel 9</small>
            </div>
          </article>
        </section>

        <section className="student-dashboard-grid">
          <div className="student-main-column">
            <article className="student-panel student-courses-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    Tu aprendizaje
                  </span>
                  <h2>Continúa tus cursos</h2>
                </div>

                <Link to="/cursos">
                  Ver todos
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="student-course-list">
                {courses.map((course) => (
                  <article
                    className="student-course-item"
                    key={course.id}
                  >
                    <div className="student-course-icon">
                      <BookOpen size={21} />
                    </div>

                    <div className="student-course-info">
                      <div className="student-course-heading">
                        <div>
                          <h3>{course.name}</h3>
                          <p>{course.teacher}</p>
                        </div>

                        <strong>{course.progress}%</strong>
                      </div>

                      <div className="student-progress-track">
                        <span
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>

                      <div className="student-course-footer">
                        <span>
                          Próxima lección: {course.nextLesson}
                        </span>

                        <button type="button">
                          <Play size={15} />
                          Continuar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="student-panel student-tasks-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    Organización
                  </span>
                  <h2>Objetivos de hoy</h2>
                </div>

                <span className="student-task-counter">
                  2 de 3 completados
                </span>
              </div>

              <div className="student-task-list">
                {tasks.map((task) => (
                  <article
                    className={`student-task-item ${
                      task.completed ? "completed" : ""
                    }`}
                    key={task.id}
                  >
                    <div className="student-task-check">
                      {task.completed && <CheckCircle2 size={19} />}
                    </div>

                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.subject}</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <aside className="student-side-column">
            <article className="student-panel student-next-room-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    Próxima sesión
                  </span>
                  <h2>Sala de React</h2>
                </div>

                <div className="student-live-dot" />
              </div>

              <p>
                Componentes, hooks y trabajo colaborativo con otros
                estudiantes.
              </p>

              <div className="student-room-meta">
                <span>
                  <Clock3 size={16} />
                  Comienza en 14 minutos
                </span>

                <span>
                  <Users size={16} />
                  12 participantes
                </span>
              </div>

              <Link to="/room" className="student-room-button">
                <Play size={17} />
                Entrar a la sala
              </Link>
            </article>

            <article className="student-panel student-friends-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    Comunidad
                  </span>
                  <h2>Amigos conectados</h2>
                </div>

                <span className="student-online-count">
                  {friends.length} en línea
                </span>
              </div>

              <div className="student-friends-list">
                {friends.map((friend) => (
                  <article
                    className="student-friend-item"
                    key={friend.id}
                  >
                    <div className="student-friend-avatar">
                      {friend.initials}
                      <span />
                    </div>

                    <div>
                      <strong>{friend.name}</strong>
                      <small>{friend.status}</small>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default DashboardEstudiante;