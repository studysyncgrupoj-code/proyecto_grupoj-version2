import { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Mail,
  Paperclip,
  Plus,
  Search,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/teacher/GestionAcademica.css";

const initialStudents = [
  {
    id: 1,
    name: "Ana Martínez",
    initials: "AM",
    course: "Matemáticas avanzadas",
    grade: 92,
    attendance: 96,
    status: "Destacado",
    reports: 2,
    email: "ana.martinez@studysync.com",
  },
  {
    id: 2,
    name: "Carlos Ramírez",
    initials: "CR",
    course: "Cálculo diferencial",
    grade: 78,
    attendance: 88,
    status: "Seguimiento",
    reports: 1,
    email: "carlos.ramirez@studysync.com",
  },
  {
    id: 3,
    name: "María González",
    initials: "MG",
    course: "Física aplicada",
    grade: 86,
    attendance: 94,
    status: "Activo",
    reports: 0,
    email: "maria.gonzalez@studysync.com",
  },
  {
    id: 4,
    name: "Luis Herrera",
    initials: "LH",
    course: "Álgebra lineal",
    grade: 64,
    attendance: 72,
    status: "Alerta",
    reports: 3,
    email: "luis.herrera@studysync.com",
  },
];

const initialActivities = [
  {
    id: 1,
    title: "Taller de derivadas",
    course: "Cálculo diferencial",
    pending: 8,
    total: 24,
    dueDate: "08 ago.",
  },
  {
    id: 2,
    title: "Quiz de álgebra",
    course: "Álgebra lineal",
    pending: 4,
    total: 18,
    dueDate: "10 ago.",
  },
  {
    id: 3,
    title: "Informe de laboratorio",
    course: "Física aplicada",
    pending: 12,
    total: 20,
    dueDate: "12 ago.",
  },
];

function GestionAcademica() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [reportForm, setReportForm] = useState({
    student: "",
    subject: "",
    observation: "",
    sendEmail: true,
  });

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return initialStudents;
    }

    return initialStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.course.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  };

  const openReportModal = (student = null) => {
    setReportForm({
      student: student?.name ?? "",
      subject: student?.course ?? "",
      observation: "",
      sendEmail: true,
    });

    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (event) => {
    event.preventDefault();

    showNotification(
      reportForm.sendEmail
        ? "Informe guardado y preparado para envío por correo."
        : "Informe académico guardado correctamente.",
    );

    setIsReportModalOpen(false);
  };

  const renderSummary = () => (
    <>
      <section className="academic-statistics-grid">
        <article className="academic-stat-card">
          <div>
            <Users size={22} />
          </div>
          <span>Estudiantes</span>
          <strong>320</strong>
          <small>Activos en tus cursos</small>
        </article>

        <article className="academic-stat-card">
          <div>
            <BookOpen size={22} />
          </div>
          <span>Cursos</span>
          <strong>12</strong>
          <small>Publicados actualmente</small>
        </article>

        <article className="academic-stat-card">
          <div>
            <ClipboardCheck size={22} />
          </div>
          <span>Por calificar</span>
          <strong>24</strong>
          <small>Entregas pendientes</small>
        </article>

        <article className="academic-stat-card">
          <div>
            <TrendingUp size={22} />
          </div>
          <span>Promedio general</span>
          <strong>84%</strong>
          <small>Rendimiento académico</small>
        </article>
      </section>

      <section className="academic-dashboard-grid">
        <article className="academic-panel academic-students-panel">
          <div className="academic-panel-heading">
            <div>
              <span>Seguimiento</span>
              <h2>Estudiantes destacados y alertas</h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("estudiantes")}
            >
              Ver todos
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="academic-student-list">
            {initialStudents.slice(0, 4).map((student) => (
              <button
                type="button"
                className="academic-student-row"
                key={student.id}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="academic-student-avatar">
                  {student.initials}
                </div>

                <div className="academic-student-main">
                  <strong>{student.name}</strong>
                  <span>{student.course}</span>
                </div>

                <div className="academic-student-score">
                  <strong>{student.grade}%</strong>
                  <span>Promedio</span>
                </div>

                <span
                  className={`academic-status academic-status-${student.status.toLowerCase()}`}
                >
                  {student.status}
                </span>

                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </article>

        <article className="academic-panel academic-activities-panel">
          <div className="academic-panel-heading">
            <div>
              <span>Evaluaciones</span>
              <h2>Actividades pendientes</h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("notas")}
            >
              Gestionar
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="academic-activity-list">
            {initialActivities.map((activity) => {
              const completed = activity.total - activity.pending;
              const progress = Math.round(
                (completed / activity.total) * 100,
              );

              return (
                <article
                  className="academic-activity-item"
                  key={activity.id}
                >
                  <div className="academic-activity-top">
                    <div>
                      <strong>{activity.title}</strong>
                      <span>{activity.course}</span>
                    </div>

                    <small>{activity.dueDate}</small>
                  </div>

                  <div className="academic-progress-meta">
                    <span>
                      {completed} de {activity.total} calificadas
                    </span>
                    <strong>{progress}%</strong>
                  </div>

                  <div className="academic-progress-bar">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </section>

      <section className="academic-modules-grid">
        <button
          type="button"
          className="academic-module-card"
          onClick={() => setActiveTab("notas")}
        >
          <div>
            <ClipboardCheck size={23} />
          </div>

          <h2>Notas y evaluaciones</h2>

          <p>
            Registra calificaciones, observaciones y resultados por
            curso.
          </p>

          <span>
            Gestionar notas
            <ChevronRight size={17} />
          </span>
        </button>

        <button
          type="button"
          className="academic-module-card"
          onClick={() => setActiveTab("asistencia")}
        >
          <div>
            <Users size={23} />
          </div>

          <h2>Asistencia</h2>

          <p>
            Controla asistencia, retrasos, ausencias y novedades.
          </p>

          <span>
            Ver asistencia
            <ChevronRight size={17} />
          </span>
        </button>

        <button
          type="button"
          className="academic-module-card"
          onClick={() => openReportModal()}
        >
          <div>
            <FileText size={23} />
          </div>

          <h2>Informes académicos</h2>

          <p>
            Genera reportes, adjunta evidencias y prepara envíos por
            correo.
          </p>

          <span>
            Crear informe
            <ChevronRight size={17} />
          </span>
        </button>
      </section>
    </>
  );

  const renderStudents = () => (
    <section className="academic-panel academic-directory-panel">
      <div className="academic-panel-heading">
        <div>
          <span>Directorio académico</span>
          <h2>Estudiantes asignados</h2>
        </div>

        <small>{filteredStudents.length} resultados</small>
      </div>

      <div className="academic-search">
        <Search size={18} />

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar estudiante, curso o correo..."
        />
      </div>

      <div className="academic-students-table">
        <div className="academic-table-header">
          <span>Estudiante</span>
          <span>Curso</span>
          <span>Promedio</span>
          <span>Asistencia</span>
          <span>Estado</span>
          <span />
        </div>

        {filteredStudents.map((student) => (
          <button
            type="button"
            className="academic-table-row"
            key={student.id}
            onClick={() => setSelectedStudent(student)}
          >
            <div className="academic-table-student">
              <div className="academic-student-avatar">
                {student.initials}
              </div>

              <div>
                <strong>{student.name}</strong>
                <span>{student.email}</span>
              </div>
            </div>

            <span>{student.course}</span>
            <strong>{student.grade}%</strong>
            <strong>{student.attendance}%</strong>

            <span
              className={`academic-status academic-status-${student.status.toLowerCase()}`}
            >
              {student.status}
            </span>

            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </section>
  );

  const renderGrades = () => (
    <section className="academic-panel academic-placeholder-panel">
      <div className="academic-placeholder-icon">
        <ClipboardCheck size={30} />
      </div>

      <h2>Notas y evaluaciones</h2>

      <p>
        Selecciona una actividad para registrar calificaciones y
        observaciones.
      </p>

      <div className="academic-activity-list academic-grades-list">
        {initialActivities.map((activity) => (
          <article
            className="academic-activity-item"
            key={activity.id}
          >
            <div className="academic-activity-top">
              <div>
                <strong>{activity.title}</strong>
                <span>{activity.course}</span>
              </div>

              <small>{activity.pending} pendientes</small>
            </div>

            <button
              type="button"
              onClick={() =>
                showNotification(
                  `Se abrió la actividad: ${activity.title}`,
                )
              }
            >
              Calificar entregas
              <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );

  const renderAttendance = () => (
    <section className="academic-panel academic-placeholder-panel">
      <div className="academic-placeholder-icon">
        <Users size={30} />
      </div>

      <h2>Control de asistencia</h2>

      <p>
        Consulta la asistencia general y registra novedades por
        estudiante.
      </p>

      <div className="academic-attendance-grid">
        {initialStudents.map((student) => (
          <article key={student.id}>
            <div className="academic-student-avatar">
              {student.initials}
            </div>

            <div>
              <strong>{student.name}</strong>
              <span>{student.course}</span>
            </div>

            <strong>{student.attendance}%</strong>

            <button
              type="button"
              onClick={() =>
                showNotification(
                  `Asistencia actualizada para ${student.name}.`,
                )
              }
            >
              Registrar
            </button>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="academic-page-layout">
      <Sidebar />

      <main className="academic-page-content">
        <header className="academic-page-header">
          <div>
            <span className="academic-page-eyebrow">
              <GraduationCap size={15} />
              Gestión académica
            </span>

            <h1>Centro académico</h1>

            <p>
              Administra notas, asistencia, evidencias e informes de
              tus estudiantes.
            </p>
          </div>

          <button
            type="button"
            className="academic-create-report"
            onClick={() => openReportModal()}
          >
            <Plus size={18} />
            Crear informe
          </button>
        </header>

        <nav className="academic-tabs">
          {[
            ["resumen", "Resumen"],
            ["estudiantes", "Estudiantes"],
            ["notas", "Notas"],
            ["asistencia", "Asistencia"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={
                activeTab === value ? "academic-tab-active" : ""
              }
              onClick={() => setActiveTab(value)}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeTab === "resumen" && renderSummary()}
        {activeTab === "estudiantes" && renderStudents()}
        {activeTab === "notas" && renderGrades()}
        {activeTab === "asistencia" && renderAttendance()}
      </main>

      {selectedStudent && (
        <div className="academic-modal-backdrop">
          <section className="academic-student-modal">
            <header>
              <div className="academic-student-avatar academic-student-avatar-large">
                {selectedStudent.initials}
              </div>

              <div>
                <span>Expediente académico</span>
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.course}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="academic-student-details">
              <article>
                <span>Promedio</span>
                <strong>{selectedStudent.grade}%</strong>
              </article>

              <article>
                <span>Asistencia</span>
                <strong>{selectedStudent.attendance}%</strong>
              </article>

              <article>
                <span>Informes</span>
                <strong>{selectedStudent.reports}</strong>
              </article>

              <article>
                <span>Estado</span>
                <strong>{selectedStudent.status}</strong>
              </article>
            </div>

            <div className="academic-alert-box">
              <AlertCircle size={18} />

              <p>
                Aquí aparecerán observaciones, alertas académicas y
                campos reportados del estudiante.
              </p>
            </div>

            <footer>
              <button
                type="button"
                className="academic-secondary-button"
                onClick={() => setSelectedStudent(null)}
              >
                Cerrar
              </button>

              <button
                type="button"
                className="academic-primary-button"
                onClick={() => {
                  const student = selectedStudent;
                  setSelectedStudent(null);
                  openReportModal(student);
                }}
              >
                <FileText size={17} />
                Crear informe
              </button>
            </footer>
          </section>
        </div>
      )}

      {isReportModalOpen && (
        <div className="academic-modal-backdrop">
          <section className="academic-report-modal">
            <header>
              <div>
                <span>Nuevo documento</span>
                <h2>Informe académico</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleReportSubmit}>
              <label>
                <span>Estudiante</span>
                <input
                  type="text"
                  value={reportForm.student}
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      student: event.target.value,
                    }))
                  }
                  placeholder="Nombre del estudiante"
                  required
                />
              </label>

              <label>
                <span>Curso o asignatura</span>
                <input
                  type="text"
                  value={reportForm.subject}
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="Asignatura relacionada"
                  required
                />
              </label>

              <label>
                <span>Observación académica</span>
                <textarea
                  value={reportForm.observation}
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      observation: event.target.value,
                    }))
                  }
                  placeholder="Describe el desempeño, novedades y recomendaciones..."
                  required
                />
              </label>

              <button
                type="button"
                className="academic-attachment-button"
                onClick={() =>
                  showNotification(
                    "La carga de evidencias quedará conectada al backend.",
                  )
                }
              >
                <Paperclip size={17} />
                Adjuntar evidencia
                <Upload size={16} />
              </button>

              <label className="academic-email-option">
                <input
                  type="checkbox"
                  checked={reportForm.sendEmail}
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      sendEmail: event.target.checked,
                    }))
                  }
                />

                <span>
                  <Mail size={17} />
                  Preparar este informe para envío por correo
                </span>
              </label>

              <footer>
                <button
                  type="button"
                  className="academic-secondary-button"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="academic-primary-button"
                >
                  <Check size={17} />
                  Guardar informe
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {notification && (
        <div className="academic-notification">
          <Check size={18} />
          {notification}
        </div>
      )}
    </div>
  );
}

export default GestionAcademica;