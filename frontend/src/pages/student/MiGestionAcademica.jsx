import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  Paperclip,
  Search,
  TrendingUp,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/student/MiGestionAcademica.css";

const subjects = [
  {
    id: 1,
    name: "Matemáticas avanzadas",
    professor: "Laura Méndez",
    grade: 92,
    attendance: 96,
    status: "Excelente",
    activities: 8,
  },
  {
    id: 2,
    name: "Física aplicada",
    professor: "Carlos Andrade",
    grade: 84,
    attendance: 91,
    status: "Activo",
    activities: 6,
  },
  {
    id: 3,
    name: "Álgebra lineal",
    professor: "Diana Torres",
    grade: 76,
    attendance: 82,
    status: "Seguimiento",
    activities: 7,
  },
];

const reports = [
  {
    id: 1,
    title: "Informe académico mensual",
    subject: "Matemáticas avanzadas",
    date: "02/08/2026",
    author: "Laura Méndez",
    status: "Disponible",
    observation:
      "Excelente participación y cumplimiento de actividades. Se recomienda mantener el ritmo de estudio.",
    evidence: "evidencia-matematicas.pdf",
  },
  {
    id: 2,
    title: "Seguimiento de asistencia",
    subject: "Álgebra lineal",
    date: "29/07/2026",
    author: "Diana Torres",
    status: "Revisar",
    observation:
      "Se presentan dos ausencias recientes. Debes revisar el contenido pendiente y completar la actividad asignada.",
    evidence: "seguimiento-asistencia.pdf",
  },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Actividad pendiente",
    description:
      "Tienes un taller de Álgebra lineal pendiente para el 8 de agosto.",
  },
  {
    id: 2,
    type: "success",
    title: "Meta académica alcanzada",
    description:
      "Superaste el 90% de promedio en Matemáticas avanzadas.",
  },
];

function MiGestionAcademica() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [notification, setNotification] = useState("");

  const average = useMemo(() => {
    const total = subjects.reduce(
      (accumulator, subject) => accumulator + subject.grade,
      0,
    );

    return Math.round(total / subjects.length);
  }, []);

  const attendanceAverage = useMemo(() => {
    const total = subjects.reduce(
      (accumulator, subject) =>
        accumulator + subject.attendance,
      0,
    );

    return Math.round(total / subjects.length);
  }, []);

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return subjects;
    }

    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(normalizedSearch) ||
        subject.professor.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  };

  const handleDownload = (fileName) => {
    showNotification(
      `La descarga de ${fileName} se conectará al backend.`,
    );
  };

  return (
    <div className="student-academic-layout">
      <Sidebar />

      <main className="student-academic-content">
        <header className="student-academic-header">
          <div>
            <span className="student-academic-eyebrow">
              <GraduationCap size={15} />
              Mi gestión académica
            </span>

            <h1>Progreso académico</h1>

            <p>
              Consulta tus notas, asistencia, informes, alertas y
              evidencias.
            </p>
          </div>
        </header>

        <nav className="student-academic-tabs">
          {[
            ["resumen", "Resumen"],
            ["asignaturas", "Asignaturas"],
            ["informes", "Informes"],
            ["alertas", "Alertas"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={
                activeTab === value
                  ? "student-academic-tab-active"
                  : ""
              }
              onClick={() => setActiveTab(value)}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeTab === "resumen" && (
          <>
            <section className="student-academic-stats">
              <article>
                <div>
                  <TrendingUp size={22} />
                </div>

                <span>Promedio general</span>
                <strong>{average}%</strong>
                <small>Rendimiento acumulado</small>
              </article>

              <article>
                <div>
                  <CalendarDays size={22} />
                </div>

                <span>Asistencia</span>
                <strong>{attendanceAverage}%</strong>
                <small>Promedio de asistencia</small>
              </article>

              <article>
                <div>
                  <BookOpen size={22} />
                </div>

                <span>Asignaturas</span>
                <strong>{subjects.length}</strong>
                <small>Cursos activos</small>
              </article>

              <article>
                <div>
                  <FileText size={22} />
                </div>

                <span>Informes</span>
                <strong>{reports.length}</strong>
                <small>Documentos disponibles</small>
              </article>
            </section>

            <section className="student-academic-dashboard">
              <article className="student-academic-panel">
                <header>
                  <div>
                    <span>Rendimiento</span>
                    <h2>Mis asignaturas</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("asignaturas")}
                  >
                    Ver todas
                    <ChevronRight size={17} />
                  </button>
                </header>

                <div className="student-subject-list">
                  {subjects.map((subject) => (
                    <article key={subject.id}>
                      <div className="student-subject-icon">
                        <BookOpen size={19} />
                      </div>

                      <div>
                        <strong>{subject.name}</strong>
                        <span>{subject.professor}</span>
                      </div>

                      <div className="student-subject-score">
                        <strong>{subject.grade}%</strong>
                        <span>Promedio</span>
                      </div>

                      <span
                        className={`student-subject-status student-subject-${subject.status.toLowerCase()}`}
                      >
                        {subject.status}
                      </span>
                    </article>
                  ))}
                </div>
              </article>

              <article className="student-academic-panel">
                <header>
                  <div>
                    <span>Novedades</span>
                    <h2>Alertas recientes</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("alertas")}
                  >
                    Ver todas
                    <ChevronRight size={17} />
                  </button>
                </header>

                <div className="student-alert-list">
                  {alerts.map((alert) => (
                    <article
                      key={alert.id}
                      className={`student-alert-${alert.type}`}
                    >
                      {alert.type === "warning" ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <CheckCircle2 size={20} />
                      )}

                      <div>
                        <strong>{alert.title}</strong>
                        <p>{alert.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        {activeTab === "asignaturas" && (
          <section className="student-academic-panel">
            <header>
              <div>
                <span>Asignaturas activas</span>
                <h2>Notas y asistencia</h2>
              </div>
            </header>

            <div className="student-academic-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar asignatura o profesor..."
              />
            </div>

            <div className="student-subject-table">
              <div className="student-subject-table-header">
                <span>Asignatura</span>
                <span>Profesor</span>
                <span>Nota</span>
                <span>Asistencia</span>
                <span>Actividades</span>
                <span>Estado</span>
              </div>

              {filteredSubjects.map((subject) => (
                <article
                  className="student-subject-table-row"
                  key={subject.id}
                >
                  <strong>{subject.name}</strong>
                  <span>{subject.professor}</span>
                  <strong>{subject.grade}%</strong>
                  <strong>{subject.attendance}%</strong>
                  <span>{subject.activities}</span>

                  <span
                    className={`student-subject-status student-subject-${subject.status.toLowerCase()}`}
                  >
                    {subject.status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "informes" && (
          <section className="student-academic-panel">
            <header>
              <div>
                <span>Expediente digital</span>
                <h2>Informes académicos</h2>
              </div>

              <small>{reports.length} documentos</small>
            </header>

            <div className="student-report-list">
              {reports.map((report) => (
                <button
                  type="button"
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="student-report-icon">
                    <FileText size={21} />
                  </div>

                  <div>
                    <strong>{report.title}</strong>
                    <span>
                      {report.subject} · {report.author}
                    </span>
                  </div>

                  <span>{report.date}</span>

                  <span
                    className={`student-report-status ${
                      report.status === "Disponible"
                        ? "student-report-available"
                        : "student-report-review"
                    }`}
                  >
                    {report.status}
                  </span>

                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "alertas" && (
          <section className="student-academic-panel">
            <header>
              <div>
                <span>Seguimiento académico</span>
                <h2>Alertas y reconocimientos</h2>
              </div>
            </header>

            <div className="student-alert-list student-alert-list-large">
              {alerts.map((alert) => (
                <article
                  key={alert.id}
                  className={`student-alert-${alert.type}`}
                >
                  {alert.type === "warning" ? (
                    <AlertTriangle size={22} />
                  ) : (
                    <Award size={22} />
                  )}

                  <div>
                    <strong>{alert.title}</strong>
                    <p>{alert.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showNotification(
                        "La alerta fue marcada como revisada.",
                      )
                    }
                  >
                    Marcar como revisada
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedReport && (
        <div className="student-report-backdrop">
          <section className="student-report-modal">
            <header>
              <div>
                <span>Informe académico</span>
                <h2>{selectedReport.title}</h2>
                <p>
                  {selectedReport.subject} · {selectedReport.date}
                </p>
              </div>

              <button
                type="button"
                aria-label="Cerrar informe"
                onClick={() => setSelectedReport(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="student-report-content">
              <article>
                <span>Profesor responsable</span>
                <strong>{selectedReport.author}</strong>
              </article>

              <article>
                <span>Estado</span>
                <strong>{selectedReport.status}</strong>
              </article>

              <div className="student-report-observation">
                <span>Observación académica</span>
                <p>{selectedReport.observation}</p>
              </div>

              <button
                type="button"
                className="student-evidence-button"
                onClick={() =>
                  handleDownload(selectedReport.evidence)
                }
              >
                <Paperclip size={18} />

                <span>
                  <strong>{selectedReport.evidence}</strong>
                  <small>Evidencia adjunta</small>
                </span>

                <Download size={18} />
              </button>
            </div>

            <footer>
              <button
                type="button"
                className="student-secondary-button"
                onClick={() => setSelectedReport(null)}
              >
                Cerrar
              </button>

              <button
                type="button"
                className="student-primary-button"
                onClick={() =>
                  handleDownload(selectedReport.evidence)
                }
              >
                <Download size={17} />
                Descargar informe
              </button>
            </footer>
          </section>
        </div>
      )}

      {notification && (
        <div className="student-academic-notification">
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}
    </div>
  );
}

export default MiGestionAcademica;