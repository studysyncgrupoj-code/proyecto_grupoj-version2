import { useEffect, useMemo, useState } from "react";
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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const USERS_API = `${API_BASE_URL}/api/users`;
const COURSES_API = `${API_BASE_URL}/api/courses`;
const RECORDS_API = `${API_BASE_URL}/api/academic-records`;
const ACTIVITIES_API = `${API_BASE_URL}/api/academic-activities`;
const REPORTS_API = `${API_BASE_URL}/api/academic-reports`;

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getCourseName(course) {
  if (!course) {
    return "Sin curso asignado";
  }

  return (
    course.nombre ||
    course.name ||
    course.titulo ||
    course.title ||
    `Curso ${course.id}`
  );
}

function formatDueDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return value;
  }
}

function normalizeStatus(status) {
  const value = String(status || "Activo").trim();

  return value || "Activo";
}

function GestionAcademica() {
  const storedUser = getStoredUser();
  const teacherId = storedUser?.id;

  const [activeTab, setActiveTab] = useState("resumen");
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [records, setRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingReport, setIsSavingReport] = useState(false);

  const [reportForm, setReportForm] = useState({
    studentId: "",
    courseId: "",
    observation: "",
    sendEmail: true,
  });

  const students = useMemo(() => {
    const studentUsers = users.filter(
      (user) =>
        String(user.rol || "").toUpperCase() === "ESTUDIANTE" &&
        user.activo !== false,
    );

    return studentUsers.map((user) => {
      const record = records.find(
        (item) => Number(item.studentId) === Number(user.id),
      );

      const course = record?.courseId
        ? courses.find(
            (item) => Number(item.id) === Number(record.courseId),
          )
        : null;

      const studentReports = reports.filter(
        (report) => Number(report.studentId) === Number(user.id),
      );

      const name =
        `${user.nombre || ""} ${user.apellido || ""}`.trim() ||
        user.email ||
        "Estudiante";

      return {
        id: user.id,
        name,
        initials: getInitials(name) || "ES",
        email: user.email || "",
        courseId: record?.courseId || null,
        course: getCourseName(course),
        recordId: record?.id || null,
        grade: Number(record?.grade ?? 0),
        attendance: Number(record?.attendance ?? 0),
        status: normalizeStatus(record?.status),
        reports: studentReports.length,
      };
    });
  }, [users, records, courses, reports]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.course.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm, students]);

  const averageGrade = useMemo(() => {
    const withRecords = students.filter(
      (student) => student.recordId !== null,
    );

    if (!withRecords.length) {
      return 0;
    }

    const total = withRecords.reduce(
      (sum, student) => sum + Number(student.grade || 0),
      0,
    );

    return Math.round(total / withRecords.length);
  }, [students]);

  const totalPending = useMemo(
    () =>
      activities.reduce(
        (sum, activity) => sum + Number(activity.pending || 0),
        0,
      ),
    [activities],
  );

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  };

  const loadAcademicData = async () => {
    if (!teacherId) {
      setError("No se encontró el profesor autenticado.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [
        usersResponse,
        coursesResponse,
        recordsResponse,
        activitiesResponse,
        reportsResponse,
      ] = await Promise.all([
        fetch(USERS_API),
        fetch(COURSES_API),
        fetch(`${RECORDS_API}/teacher/${teacherId}`),
        fetch(`${ACTIVITIES_API}/teacher/${teacherId}`),
        fetch(`${REPORTS_API}/teacher/${teacherId}`),
      ]);

      if (!usersResponse.ok) {
        throw new Error(
          `No fue posible cargar usuarios (${usersResponse.status}).`,
        );
      }

      if (!coursesResponse.ok) {
        throw new Error(
          `No fue posible cargar cursos (${coursesResponse.status}).`,
        );
      }

      if (!recordsResponse.ok) {
        throw new Error(
          `No fue posible cargar registros académicos (${recordsResponse.status}).`,
        );
      }

      if (!activitiesResponse.ok) {
        throw new Error(
          `No fue posible cargar actividades (${activitiesResponse.status}).`,
        );
      }

      if (!reportsResponse.ok) {
        throw new Error(
          `No fue posible cargar informes (${reportsResponse.status}).`,
        );
      }

      const [
        usersData,
        coursesData,
        recordsData,
        activitiesData,
        reportsData,
      ] = await Promise.all([
        usersResponse.json(),
        coursesResponse.json(),
        recordsResponse.json(),
        activitiesResponse.json(),
        reportsResponse.json(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setReports(Array.isArray(reportsData) ? reportsData : []);
    } catch (loadError) {
      console.error("Error cargando gestión académica:", loadError);

      setError(
        loadError.message ||
          "No fue posible cargar la gestión académica.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAcademicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  const openReportModal = (student = null) => {
    setReportForm({
      studentId: student?.id ? String(student.id) : "",
      courseId: student?.courseId
        ? String(student.courseId)
        : "",
      observation: "",
      sendEmail: true,
    });

    setError("");
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();

    if (!teacherId) {
      setError("No se encontró el profesor autenticado.");
      return;
    }

    if (!reportForm.studentId) {
      setError("Selecciona un estudiante.");
      return;
    }

    if (!reportForm.observation.trim()) {
      setError("La observación académica es obligatoria.");
      return;
    }

    const payload = {
      teacherId: Number(teacherId),
      studentId: Number(reportForm.studentId),
      courseId: reportForm.courseId
        ? Number(reportForm.courseId)
        : null,
      observation: reportForm.observation.trim(),
      sendEmail: reportForm.sendEmail,
    };

    try {
      setIsSavingReport(true);
      setError("");

      const response = await fetch(REPORTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `No fue posible guardar el informe (${response.status}).`,
        );
      }

      const savedReport = await response.json();

      setReports((currentReports) => [
        savedReport,
        ...currentReports,
      ]);

      setIsReportModalOpen(false);

      showNotification(
        reportForm.sendEmail
          ? "Informe académico guardado y marcado para envío por correo."
          : "Informe académico guardado correctamente.",
      );
    } catch (saveError) {
      console.error("Error guardando informe:", saveError);

      setError(
        saveError.message ||
          "No fue posible guardar el informe.",
      );
    } finally {
      setIsSavingReport(false);
    }
  };

  const handleUpdateAttendance = async (student) => {
    if (!student.recordId) {
      showNotification(
        "Este estudiante todavía no tiene un registro académico.",
      );
      return;
    }

    const value = window.prompt(
      `Nueva asistencia para ${student.name} (0 - 100):`,
      String(student.attendance),
    );

    if (value === null) {
      return;
    }

    const attendance = Number(value);

    if (
      Number.isNaN(attendance) ||
      attendance < 0 ||
      attendance > 100
    ) {
      showNotification(
        "La asistencia debe ser un valor entre 0 y 100.",
      );
      return;
    }

    try {
      const response = await fetch(
        `${RECORDS_API}/${student.recordId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attendance,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `No fue posible actualizar la asistencia (${response.status}).`,
        );
      }

      const updatedRecord = await response.json();

      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === updatedRecord.id
            ? updatedRecord
            : record,
        ),
      );

      showNotification(
        `Asistencia actualizada para ${student.name}.`,
      );
    } catch (updateError) {
      console.error(
        "Error actualizando asistencia:",
        updateError,
      );

      showNotification(
        "No fue posible actualizar la asistencia.",
      );
    }
  };

  const renderSummary = () => (
    <>
      <section className="academic-statistics-grid">
        <article className="academic-stat-card">
          <div>
            <Users size={22} />
          </div>

          <span>Estudiantes</span>

          <strong>
            {isLoading ? "..." : students.length}
          </strong>

          <small>Activos en StudySync</small>
        </article>

        <article className="academic-stat-card">
          <div>
            <BookOpen size={22} />
          </div>

          <span>Cursos</span>

          <strong>
            {isLoading ? "..." : courses.length}
          </strong>

          <small>Registrados actualmente</small>
        </article>

        <article className="academic-stat-card">
          <div>
            <ClipboardCheck size={22} />
          </div>

          <span>Por calificar</span>

          <strong>
            {isLoading ? "..." : totalPending}
          </strong>

          <small>Entregas pendientes</small>
        </article>

        <article className="academic-stat-card">
          <div>
            <TrendingUp size={22} />
          </div>

          <span>Promedio general</span>

          <strong>
            {isLoading ? "..." : `${averageGrade}%`}
          </strong>

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
            {students.length === 0 && !isLoading ? (
              <p>No hay estudiantes registrados.</p>
            ) : (
              students.slice(0, 4).map((student) => (
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
                    className={`academic-status academic-status-${student.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {student.status}
                  </span>

                  <ChevronRight size={18} />
                </button>
              ))
            )}
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
            {activities.length === 0 && !isLoading ? (
              <p>No hay actividades registradas.</p>
            ) : (
              activities.map((activity) => {
                const total = Number(activity.total || 0);
                const pending = Number(activity.pending || 0);
                const completed = Math.max(0, total - pending);

                const progress =
                  total > 0
                    ? Math.round((completed / total) * 100)
                    : 0;

                const course = courses.find(
                  (item) =>
                    Number(item.id) === Number(activity.courseId),
                );

                return (
                  <article
                    className="academic-activity-item"
                    key={activity.id}
                  >
                    <div className="academic-activity-top">
                      <div>
                        <strong>{activity.title}</strong>
                        <span>{getCourseName(course)}</span>
                      </div>

                      <small>
                        {formatDueDate(activity.dueDate)}
                      </small>
                    </div>

                    <div className="academic-progress-meta">
                      <span>
                        {completed} de {total} calificadas
                      </span>

                      <strong>{progress}%</strong>
                    </div>

                    <div className="academic-progress-bar">
                      <span
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </article>
                );
              })
            )}
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
              className={`academic-status academic-status-${student.status
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
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
        Consulta las actividades académicas registradas por el profesor.
      </p>

      <div className="academic-activity-list academic-grades-list">
        {activities.length === 0 ? (
          <p>No hay actividades registradas.</p>
        ) : (
          activities.map((activity) => {
            const course = courses.find(
              (item) =>
                Number(item.id) === Number(activity.courseId),
            );

            return (
              <article
                className="academic-activity-item"
                key={activity.id}
              >
                <div className="academic-activity-top">
                  <div>
                    <strong>{activity.title}</strong>
                    <span>{getCourseName(course)}</span>
                  </div>

                  <small>
                    {Number(activity.pending || 0)} pendientes
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showNotification(
                      `${activity.title}: ${Number(
                        activity.pending || 0,
                      )} entregas pendientes.`,
                    )
                  }
                >
                  Ver actividad
                  <ChevronRight size={16} />
                </button>
              </article>
            );
          })
        )}
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
        {students.map((student) => (
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
                handleUpdateAttendance(student)
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

        {error && !isReportModalOpen && (
          <p
            style={{
              marginBottom: "14px",
            }}
          >
            {error}
          </p>
        )}

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
                activeTab === value
                  ? "academic-tab-active"
                  : ""
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
                Los datos mostrados provienen de los registros
                académicos guardados para este estudiante.
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
                onClick={() => {
                  setIsReportModalOpen(false);
                  setError("");
                }}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleReportSubmit}>
              <label>
                <span>Estudiante</span>

                <select
                  value={reportForm.studentId}
                  onChange={(event) => {
                    const studentId = event.target.value;

                    const student = students.find(
                      (item) =>
                        Number(item.id) === Number(studentId),
                    );

                    setReportForm((current) => ({
                      ...current,
                      studentId,
                      courseId: student?.courseId
                        ? String(student.courseId)
                        : current.courseId,
                    }));
                  }}
                  required
                >
                  <option value="">
                    Selecciona un estudiante
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Curso o asignatura</span>

                <select
                  value={reportForm.courseId}
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      courseId: event.target.value,
                    }))
                  }
                >
                  <option value="">
                    Sin curso específico
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {getCourseName(course)}
                    </option>
                  ))}
                </select>
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
                    "La carga física de evidencias aún requiere su módulo de archivos.",
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

              {error && <p>{error}</p>}

              <footer>
                <button
                  type="button"
                  className="academic-secondary-button"
                  disabled={isSavingReport}
                  onClick={() => {
                    setIsReportModalOpen(false);
                    setError("");
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="academic-primary-button"
                  disabled={isSavingReport}
                >
                  <Check size={17} />

                  {isSavingReport
                    ? "Guardando..."
                    : "Guardar informe"}
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