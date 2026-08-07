import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/GestionAcademicaAdmin.css";

const students = [
  {
    id: 1,
    name: "Ana Martínez",
    course: "Matemáticas avanzadas",
    professor: "Laura Méndez",
    average: 92,
    attendance: 96,
    status: "Excelente",
    reports: 2,
  },
  {
    id: 2,
    name: "Carlos Ramírez",
    course: "Cálculo diferencial",
    professor: "Julián Vargas",
    average: 78,
    attendance: 88,
    status: "Seguimiento",
    reports: 1,
  },
  {
    id: 3,
    name: "María González",
    course: "Física aplicada",
    professor: "Carlos Andrade",
    average: 86,
    attendance: 94,
    status: "Activo",
    reports: 0,
  },
  {
    id: 4,
    name: "Luis Herrera",
    course: "Álgebra lineal",
    professor: "Diana Torres",
    average: 64,
    attendance: 72,
    status: "Alerta",
    reports: 3,
  },
];

const reports = [
  {
    id: 1,
    title: "Informe mensual de Matemáticas",
    student: "Ana Martínez",
    professor: "Laura Méndez",
    status: "Enviado",
    date: "05/08/2026",
  },
  {
    id: 2,
    title: "Seguimiento de asistencia",
    student: "Luis Herrera",
    professor: "Diana Torres",
    status: "Pendiente",
    date: "04/08/2026",
  },
  {
    id: 3,
    title: "Reporte de bajo rendimiento",
    student: "Carlos Ramírez",
    professor: "Julián Vargas",
    status: "Borrador",
    date: "03/08/2026",
  },
];

function GestionAcademicaAdmin() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.course.toLowerCase().includes(normalizedSearch) ||
        student.professor.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  const averagePerformance = useMemo(() => {
    const total = students.reduce(
      (accumulator, student) => accumulator + student.average,
      0,
    );

    return Math.round(total / students.length);
  }, []);

  const averageAttendance = useMemo(() => {
    const total = students.reduce(
      (accumulator, student) =>
        accumulator + student.attendance,
      0,
    );

    return Math.round(total / students.length);
  }, []);

  return (
    <div className="admin-academic-layout">
      <Sidebar />

      <main className="admin-academic-content">
        <header className="admin-academic-header">
          <div>
            <span className="admin-academic-eyebrow">
              <ShieldCheck size={15} />
              Supervisión institucional
            </span>

            <h1>Gestión académica</h1>

            <p>
              Supervisa estudiantes, profesores, informes, asistencia y
              rendimiento general de StudySync.
            </p>
          </div>
        </header>

        <nav className="admin-academic-tabs">
          {[
            ["resumen", "Resumen"],
            ["estudiantes", "Estudiantes"],
            ["informes", "Informes"],
            ["alertas", "Alertas"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={
                activeTab === value
                  ? "admin-academic-tab-active"
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
            <section className="admin-academic-stats">
              <article>
                <div>
                  <Users size={22} />
                </div>

                <span>Estudiantes</span>
                <strong>1.174</strong>
                <small>Activos en la plataforma</small>
              </article>

              <article>
                <div>
                  <GraduationCap size={22} />
                </div>

                <span>Profesores</span>
                <strong>74</strong>
                <small>Docentes registrados</small>
              </article>

              <article>
                <div>
                  <TrendingUp size={22} />
                </div>

                <span>Promedio general</span>
                <strong>{averagePerformance}%</strong>
                <small>Rendimiento institucional</small>
              </article>

              <article>
                <div>
                  <CheckCircle2 size={22} />
                </div>

                <span>Asistencia</span>
                <strong>{averageAttendance}%</strong>
                <small>Promedio institucional</small>
              </article>
            </section>

            <section className="admin-academic-grid">
              <article className="admin-academic-panel">
                <header>
                  <div>
                    <span>Seguimiento académico</span>
                    <h2>Estudiantes destacados y en alerta</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("estudiantes")}
                  >
                    Ver todos
                    <ChevronRight size={17} />
                  </button>
                </header>

                <div className="admin-academic-student-list">
                  {students.map((student) => (
                    <button
                      type="button"
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="admin-academic-avatar">
                        {student.name
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word.charAt(0))
                          .join("")}
                      </div>

                      <div>
                        <strong>{student.name}</strong>
                        <span>
                          {student.course} · {student.professor}
                        </span>
                      </div>

                      <strong>{student.average}%</strong>

                      <span
                        className={`admin-academic-status admin-academic-status-${student.status.toLowerCase()}`}
                      >
                        {student.status}
                      </span>

                      <ChevronRight size={18} />
                    </button>
                  ))}
                </div>
              </article>

              <article className="admin-academic-panel">
                <header>
                  <div>
                    <span>Documentación</span>
                    <h2>Informes recientes</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("informes")}
                  >
                    Ver todos
                    <ChevronRight size={17} />
                  </button>
                </header>

                <div className="admin-academic-report-list">
                  {reports.map((report) => (
                    <button
                      type="button"
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div>
                        <FileText size={20} />
                      </div>

                      <div>
                        <strong>{report.title}</strong>
                        <span>
                          {report.student} · {report.professor}
                        </span>
                      </div>

                      <span>{report.status}</span>
                    </button>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        {activeTab === "estudiantes" && (
          <section className="admin-academic-panel">
            <header>
              <div>
                <span>Directorio académico</span>
                <h2>Estudiantes registrados</h2>
              </div>

              <small>{filteredStudents.length} resultados</small>
            </header>

            <div className="admin-academic-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar estudiante, curso o profesor..."
              />
            </div>

            <div className="admin-academic-table">
              <div className="admin-academic-table-header">
                <span>Estudiante</span>
                <span>Curso</span>
                <span>Profesor</span>
                <span>Promedio</span>
                <span>Asistencia</span>
                <span>Estado</span>
              </div>

              {filteredStudents.map((student) => (
                <button
                  type="button"
                  className="admin-academic-table-row"
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                >
                  <strong>{student.name}</strong>
                  <span>{student.course}</span>
                  <span>{student.professor}</span>
                  <strong>{student.average}%</strong>
                  <strong>{student.attendance}%</strong>

                  <span
                    className={`admin-academic-status admin-academic-status-${student.status.toLowerCase()}`}
                  >
                    {student.status}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "informes" && (
          <section className="admin-academic-panel">
            <header>
              <div>
                <span>Control documental</span>
                <h2>Informes académicos</h2>
              </div>

              <small>{reports.length} documentos</small>
            </header>

            <div className="admin-academic-report-list admin-academic-report-list-large">
              {reports.map((report) => (
                <button
                  type="button"
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                >
                  <div>
                    <FileText size={21} />
                  </div>

                  <div>
                    <strong>{report.title}</strong>
                    <span>{report.student}</span>
                  </div>

                  <span>{report.professor}</span>
                  <span>{report.date}</span>

                  <span>{report.status}</span>

                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "alertas" && (
          <section className="admin-academic-panel">
            <header>
              <div>
                <span>Centro de alertas</span>
                <h2>Atención académica requerida</h2>
              </div>
            </header>

            <div className="admin-academic-alert-list">
              <article>
                <AlertTriangle size={21} />

                <div>
                  <strong>7 estudiantes en seguimiento</strong>
                  <p>
                    Presentan bajo rendimiento, ausencias o entregas
                    pendientes.
                  </p>
                </div>

                <button type="button">
                  Revisar casos
                </button>
              </article>

              <article>
                <ClipboardList size={21} />

                <div>
                  <strong>3 informes pendientes</strong>
                  <p>
                    Requieren revisión antes de ser enviados.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("informes")}
                >
                  Ver informes
                </button>
              </article>

              <article>
                <BookOpen size={21} />

                <div>
                  <strong>5 cursos con baja actividad</strong>
                  <p>
                    Presentan participación inferior al promedio.
                  </p>
                </div>

                <button type="button">
                  Ver cursos
                </button>
              </article>
            </div>
          </section>
        )}
      </main>

      {selectedStudent && (
        <div className="admin-academic-backdrop">
          <section className="admin-academic-modal">
            <header>
              <div>
                <span>Expediente académico</span>
                <h2>{selectedStudent.name}</h2>
                <p>
                  {selectedStudent.course} · {selectedStudent.professor}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="admin-academic-modal-grid">
              <article>
                <span>Promedio</span>
                <strong>{selectedStudent.average}%</strong>
              </article>

              <article>
                <span>Asistencia</span>
                <strong>{selectedStudent.attendance}%</strong>
              </article>

              <article>
                <span>Estado</span>
                <strong>{selectedStudent.status}</strong>
              </article>

              <article>
                <span>Informes</span>
                <strong>{selectedStudent.reports}</strong>
              </article>
            </div>

            <footer>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
              >
                Cerrar
              </button>
            </footer>
          </section>
        </div>
      )}

      {selectedReport && (
        <div className="admin-academic-backdrop">
          <section className="admin-academic-modal">
            <header>
              <div>
                <span>Informe académico</span>
                <h2>{selectedReport.title}</h2>
                <p>
                  {selectedReport.student} · {selectedReport.professor}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="admin-academic-modal-grid">
              <article>
                <span>Estado</span>
                <strong>{selectedReport.status}</strong>
              </article>

              <article>
                <span>Fecha</span>
                <strong>{selectedReport.date}</strong>
              </article>
            </div>

            <footer>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
              >
                Cerrar
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default GestionAcademicaAdmin;