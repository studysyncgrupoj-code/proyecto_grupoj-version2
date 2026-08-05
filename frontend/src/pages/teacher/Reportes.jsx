import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Clock3,
  Download,
  Filter,
  GraduationCap,
  LineChart,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/teacher/Reportes.css";
const periods = ["7 días", "30 días", "3 meses", "Este año"];

const weeklyActivity = [
  { day: "Lun", value: 68 },
  { day: "Mar", value: 82 },
  { day: "Mié", value: 74 },
  { day: "Jue", value: 91 },
  { day: "Vie", value: 86 },
  { day: "Sáb", value: 58 },
  { day: "Dom", value: 63 },
];

const coursePerformance = [
  { id: 1, name: "React avanzado", students: 42, progress: 88, participation: 94, trend: 12 },
  { id: 2, name: "JavaScript moderno", students: 38, progress: 81, participation: 89, trend: 8 },
  { id: 3, name: "Bases de datos SQL", students: 31, progress: 76, participation: 84, trend: 5 },
  { id: 4, name: "Arquitectura frontend", students: 27, progress: 72, participation: 79, trend: -2 },
];

const students = [
  { id: 1, name: "Ana Martínez", initials: "AM", course: "React avanzado", progress: 96, focusTime: "18h 42m", sessions: 24, status: "Excelente" },
  { id: 2, name: "Luis Hernández", initials: "LH", course: "JavaScript moderno", progress: 89, focusTime: "16h 18m", sessions: 21, status: "Muy bien" },
  { id: 3, name: "Camila Rodríguez", initials: "CR", course: "Bases de datos SQL", progress: 82, focusTime: "14h 05m", sessions: 18, status: "Estable" },
  { id: 4, name: "Mateo Sánchez", initials: "MS", course: "Arquitectura frontend", progress: 74, focusTime: "11h 47m", sessions: 15, status: "En seguimiento" },
  { id: 5, name: "Sofía Herrera", initials: "SH", course: "React avanzado", progress: 91, focusTime: "17h 30m", sessions: 23, status: "Muy bien" },
];

const activityFeed = [
  { id: 1, title: "Nueva participación destacada", description: "Ana completó el 100% del módulo de hooks.", time: "Hace 18 min", icon: TrendingUp },
  { id: 2, title: "Curso actualizado", description: "React avanzado recibió una nueva lección.", time: "Hace 1 h", icon: BookOpen },
  { id: 3, title: "Objetivo semanal alcanzado", description: "El grupo superó 120 horas de estudio acumuladas.", time: "Hace 3 h", icon: Target },
  { id: 4, title: "Nueva sesión programada", description: "Sala de arquitectura frontend para mañana.", time: "Ayer", icon: CalendarDays },
];

function Reportes() {
  const [period, setPeriod] = useState("30 días");
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      `${student.name} ${student.course} ${student.status}`
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const totalStudents = students.length;
  const averageProgress = Math.round(
    students.reduce((sum, student) => sum + student.progress, 0) / students.length,
  );
  const totalSessions = students.reduce((sum, student) => sum + student.sessions, 0);
  const totalHours = 78;

  return (
    <div className="reports-layout">
      <Sidebar />

      <main className="reports-content">
        <header className="reports-header">
          <div>
            <span className="reports-eyebrow">
              <BarChart3 size={15} />
              Inteligencia académica
            </span>

            <h1>Reportes</h1>
            <p>
              Analiza el rendimiento, la participación y el progreso de tus
              estudiantes en un solo lugar.
            </p>
          </div>

          <div className="reports-header-actions">
            <label className="reports-period-select">
              <Filter size={17} />
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                {periods.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <button type="button" className="reports-export-button">
              <Download size={18} />
              Exportar reporte
            </button>
          </div>
        </header>

        <section className="reports-summary-grid">
          <article className="reports-summary-card">
            <div className="reports-summary-icon"><Users size={21} /></div>
            <div>
              <span>Estudiantes activos</span>
              <strong>{totalStudents}</strong>
              <small className="positive"><ArrowUpRight size={14} />12% frente al periodo anterior</small>
            </div>
          </article>

          <article className="reports-summary-card">
            <div className="reports-summary-icon"><TrendingUp size={21} /></div>
            <div>
              <span>Progreso promedio</span>
              <strong>{averageProgress}%</strong>
              <small className="positive"><ArrowUpRight size={14} />6% de crecimiento</small>
            </div>
          </article>

          <article className="reports-summary-card">
            <div className="reports-summary-icon"><Clock3 size={21} /></div>
            <div>
              <span>Horas de estudio</span>
              <strong>{totalHours}h</strong>
              <small className="positive"><ArrowUpRight size={14} />9h adicionales</small>
            </div>
          </article>

          <article className="reports-summary-card">
            <div className="reports-summary-icon"><Activity size={21} /></div>
            <div>
              <span>Sesiones completadas</span>
              <strong>{totalSessions}</strong>
              <small className="negative"><ArrowDownRight size={14} />2% menos esta semana</small>
            </div>
          </article>
        </section>

        <section className="reports-primary-grid">
          <article className="reports-panel reports-activity-chart">
            <div className="reports-panel-header">
              <div>
                <span>ACTIVIDAD SEMANAL</span>
                <h2>Tiempo de estudio</h2>
              </div>

              <div className="reports-panel-highlight">
                <Sparkles size={16} />
                Mejor día: jueves
              </div>
            </div>

            <div className="reports-chart-area">
              <div className="reports-chart-y-axis">
                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
              </div>

              <div className="reports-bars">
                {weeklyActivity.map((item) => (
                  <div className="reports-bar-column" key={item.day}>
                    <div className="reports-bar-track">
                      <span style={{ height: `${item.value}%` }} />
                    </div>
                    <strong>{item.day}</strong>
                    <small>{item.value}%</small>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className="reports-panel reports-overview-card">
            <div className="reports-panel-header">
              <div>
                <span>RESUMEN</span>
                <h2>Rendimiento general</h2>
              </div>
              <LineChart size={22} />
            </div>

            <div className="reports-score-ring">
              <div>
                <strong>87</strong>
                <span>de 100</span>
              </div>
            </div>

            <div className="reports-overview-list">
              <article><span>Participación</span><strong>91%</strong></article>
              <article><span>Retención</span><strong>86%</strong></article>
              <article><span>Entrega de tareas</span><strong>84%</strong></article>
            </div>
          </aside>
        </section>

        <section className="reports-secondary-grid">
          <article className="reports-panel reports-course-performance">
            <div className="reports-panel-header">
              <div>
                <span>CURSOS</span>
                <h2>Rendimiento por curso</h2>
              </div>
              <GraduationCap size={22} />
            </div>

            <div className="reports-course-list">
              {coursePerformance.map((course) => (
                <article key={course.id} className="reports-course-item">
                  <div className="reports-course-copy">
                    <div>
                      <h3>{course.name}</h3>
                      <p>{course.students} estudiantes activos</p>
                    </div>

                    <span className={course.trend >= 0 ? "reports-trend-positive" : "reports-trend-negative"}>
                      {course.trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(course.trend)}%
                    </span>
                  </div>

                  <div className="reports-course-metrics">
                    <div><span>Progreso</span><strong>{course.progress}%</strong></div>
                    <div><span>Participación</span><strong>{course.participation}%</strong></div>
                  </div>

                  <div className="reports-progress-track">
                    <span style={{ width: `${course.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <aside className="reports-panel reports-feed-panel">
            <div className="reports-panel-header">
              <div>
                <span>ACTIVIDAD</span>
                <h2>Movimientos recientes</h2>
              </div>
              <Activity size={22} />
            </div>

            <div className="reports-feed-list">
              {activityFeed.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.id}>
                    <div className="reports-feed-icon"><Icon size={18} /></div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span>{item.time}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="reports-panel reports-students-table-panel">
          <div className="reports-table-header">
            <div>
              <span>ESTUDIANTES</span>
              <h2>Rendimiento individual</h2>
            </div>

            <label className="reports-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Buscar estudiante, curso o estado..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Progreso</th>
                  <th>Tiempo de enfoque</th>
                  <th>Sesiones</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="reports-student-cell">
                        <div>{student.initials}</div>
                        <strong>{student.name}</strong>
                      </div>
                    </td>
                    <td>{student.course}</td>
                    <td>
                      <div className="reports-table-progress">
                        <span>{student.progress}%</span>
                        <div><span style={{ width: `${student.progress}%` }} /></div>
                      </div>
                    </td>
                    <td>{student.focusTime}</td>
                    <td>{student.sessions}</td>
                    <td>
                      <span className={`reports-status reports-status-${student.status
                        .toLowerCase()
                        .replaceAll(" ", "-")
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="reports-empty-state">
              <Search size={26} />
              <h3>No encontramos estudiantes</h3>
              <p>Prueba con otro término de búsqueda.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Reportes;