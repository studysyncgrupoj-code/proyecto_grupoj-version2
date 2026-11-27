import SSLocalized from "../../i18n/Localized.jsx";
import { useEffect, useState } from "react";
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

const friends = [
  { id: 1, name: "Ana", initials: "AN", status: "En sala de React" },
  { id: 2, name: "Luis", initials: "LU", status: "Modo Focus" },
  { id: 3, name: "María", initials: "MA", status: "Estudiando Java" },
];

function DashboardEstudiante() {
  const [statistics, setStatistics] = useState({
    totalHoursStudied: 0,
    completedGoals: 0,
    completedSessions: 0,
    totalMinutesStudied: 0,
    totalPomodoros: 0,
    pendingGoals: 0,
    userId: null,
  });

  const [goals, setGoals] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  let storedUser = {};

  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    console.error("No fue posible leer el usuario almacenado:", error);
  }

  const userId = storedUser.id;

  const firstName = storedUser.name
    ? storedUser.name.trim().split(/\s+/)[0]
    : "Estudiante";

  useEffect(() => {
    if (!userId) {
      setLoadingData(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [statisticsResponse, goalsResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/statistics/${userId}`),
          fetch(`http://localhost:8080/api/goals/user/${userId}`),
        ]);

        if (!statisticsResponse.ok) {
          throw new Error("No fue posible consultar las estadísticas");
        }

        if (!goalsResponse.ok) {
          throw new Error("No fue posible consultar los objetivos");
        }

        const statisticsData = await statisticsResponse.json();
        const goalsData = await goalsResponse.json();

        setStatistics(statisticsData);
        setGoals(Array.isArray(goalsData) ? goalsData : []);
      } catch (error) {
        console.error(
          "Error cargando la información del dashboard:",
          error
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadDashboardData();
  }, [userId]);

  const formatStudyTime = (minutes) => {
    const totalMinutes = Number(minutes) || 0;

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  const pendingGoals = goals.filter(
    (goal) => !goal.completed
  ).length;

  return (
    <div className="student-dashboard-layout">
      <Sidebar />

      <main className="student-dashboard-content">
        <header className="student-dashboard-header">
          <div>
            <span className="student-dashboard-eyebrow">
              <TrendingUp size={15} />
              <SSLocalized text={"Panel del estudiante"} />
            </span>

            <h1>
              <SSLocalized text={"Buenos días,"} /> <span>{firstName}</span>
            </h1>

            <p>
              <SSLocalized text={"Continúa aprendiendo y completa tus objetivos de estudio de hoy."} />
            </p>
          </div>

          <div className="student-dashboard-actions">
            <Link
              to="/calendario"
              className="student-secondary-button"
            >
              <CalendarDays size={18} />
              <SSLocalized text={"Ver calendario"} />
            </Link>

            <Link
              to="/study-rooms"
              className="student-primary-button"
            >
              <Users size={18} />
              <SSLocalized text={"Buscar sala"} />
            </Link>
          </div>
        </header>

        <section className="student-welcome-banner">
          <div className="student-welcome-copy">
            <span className="student-banner-label">
              <Flame size={15} />
              <SSLocalized text={"Racha activa"} />
            </span>

            <h2><SSLocalized text={"¡Llevas 7 días estudiando sin detenerte!"} /></h2>

            <p>
              <SSLocalized text={"Completa una sesión hoy para conservar tu racha semanal."} />
            </p>
          </div>

          <div className="student-streak-number">
            <strong>7</strong>
            <span><SSLocalized text={"días"} /></span>
          </div>
        </section>

        <section className="student-stats-grid">
          <article className="student-stat-card">
            <div className="student-stat-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <span><SSLocalized text={"Tiempo estudiado"} /></span>

              <strong>
                {loadingData
                  ? "..."
                  : formatStudyTime(
                      statistics.totalMinutesStudied
                    )}
              </strong>

              <small>
                {statistics.completedSessions} <SSLocalized text={"sesiones completadas"} />
              </small>
            </div>
          </article>

          <article className="student-stat-card">
            <div className="student-stat-icon">
              <Target size={22} />
            </div>

            <div>
              <span><SSLocalized text={"Objetivos completados"} /></span>

              <strong>
                {loadingData
                  ? "..."
                  : statistics.completedGoals}
              </strong>

              <small>
                {statistics.pendingGoals} <SSLocalized text={"pendientes"} />
              </small>
            </div>
          </article>

          <article className="student-stat-card">
            <div className="student-stat-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <span><SSLocalized text={"Cursos activos"} /></span>
              <strong>3</strong>
              <small><SSLocalized text={"1 lección nueva"} /></small>
            </div>
          </article>

          <article className="student-stat-card">
            <div className="student-stat-icon">
              <Medal size={22} />
            </div>

            <div>
              <span><SSLocalized text={"Pomodoros completados"} /></span>

              <strong>
                {loadingData
                  ? "..."
                  : statistics.totalPomodoros}
              </strong>

              <small><SSLocalized text={"Sesiones de concentración"} /></small>
            </div>
          </article>
        </section>

        <section className="student-dashboard-grid">
          <div className="student-main-column">
            <article className="student-panel student-courses-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    <SSLocalized text={"Tu aprendizaje"} />
                  </span>
                  <h2><SSLocalized text={"Continúa tus cursos"} /></h2>
                </div>

                <Link to="/cursos">
                  <SSLocalized text={"Ver todos"} />
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
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>

                      <div className="student-course-footer">
                        <span>
                          <SSLocalized text={"Próxima lección:"} /> {course.nextLesson}
                        </span>

                        <button type="button">
                          <Play size={15} />
                          <SSLocalized text={"Continuar"} />
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
                    <SSLocalized text={"Organización"} />
                  </span>
                  <h2><SSLocalized text={"Objetivos de estudio"} /></h2>
                </div>

                <span className="student-task-counter">
                  {completedGoals} <SSLocalized text={"de"} /> {goals.length} <SSLocalized text={"completados"} />
                </span>
              </div>

              <div className="student-task-list">
                {loadingData ? (
                  <article className="student-task-item">
                    <div>
                      <strong><SSLocalized text={"Cargando objetivos..."} /></strong>
                    </div>
                  </article>
                ) : goals.length === 0 ? (
                  <article className="student-task-item">
                    <div>
                      <strong><SSLocalized text={"No tienes objetivos registrados"} /></strong>
                      <span>
                        <SSLocalized text={"Crea una meta para comenzar a medir tu progreso."} />
                      </span>
                    </div>
                  </article>
                ) : (
                  goals.map((goal) => (
                    <article
                      className={`student-task-item ${
                        goal.completed ? "completed" : ""
                      }`}
                      key={goal.id}
                    >
                      <div className="student-task-check">
                        {goal.completed && (
                          <CheckCircle2 size={19} />
                        )}
                      </div>

                      <div>
                        <strong>{goal.title}</strong>

                        <span>
                          {goal.currentHours || 0} <SSLocalized text={"de"} />{" "}
                          {goal.targetHours || 0} <SSLocalized text={"horas"} />
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {!loadingData && goals.length > 0 && (
                <small>
                  {pendingGoals} <SSLocalized text={"objetivo"} />
                  {pendingGoals !== 1 ? "s" : ""} <SSLocalized text={"pendiente"} />
                  {pendingGoals !== 1 ? "s" : ""}
                </small>
              )}
            </article>
          </div>

          <aside className="student-side-column">
            <article className="student-panel student-next-room-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    <SSLocalized text={"Próxima sesión"} />
                  </span>
                  <h2><SSLocalized text={"Sala de React"} /></h2>
                </div>

                <div className="student-live-dot" />
              </div>

              <p>
                <SSLocalized text={"Componentes, hooks y trabajo colaborativo con otros estudiantes."} />
              </p>

              <div className="student-room-meta">
                <span>
                  <Clock3 size={16} />
                  <SSLocalized text={"Comienza en 14 minutos"} />
                </span>

                <span>
                  <Users size={16} />
                  <SSLocalized text={"12 participantes"} />
                </span>
              </div>

              <Link to="/room" className="student-room-button">
                <Play size={17} />
                <SSLocalized text={"Entrar a la sala"} />
              </Link>
            </article>

            <article className="student-panel student-friends-panel">
              <div className="student-panel-header">
                <div>
                  <span className="student-section-label">
                    <SSLocalized text={"Comunidad"} />
                  </span>
                  <h2><SSLocalized text={"Amigos conectados"} /></h2>
                </div>

                <span className="student-online-count">
                  {friends.length} <SSLocalized text={"en línea"} />
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