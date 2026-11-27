import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/InformesAdmin.css";

const initialReports = [
  {
    id: 1,
    title: "Informe Primer Parcial",
    student: "Juan Pérez",
    professor: "Laura Méndez",
    course: "Matemáticas",
    date: "12/08/2026",
    status: "Enviado",
    observation:
      "El estudiante presenta un desempeño sobresaliente y cumplimiento constante de sus actividades.",
  },
  {
    id: 2,
    title: "Seguimiento Académico",
    student: "Ana Torres",
    professor: "Carlos Gómez",
    course: "Física",
    date: "10/08/2026",
    status: "Pendiente",
    observation:
      "Se recomienda reforzar los contenidos relacionados con movimiento y fuerzas.",
  },
  {
    id: 3,
    title: "Informe Final",
    student: "Luis Herrera",
    professor: "Diana López",
    course: "Programación",
    date: "05/08/2026",
    status: "Borrador",
    observation:
      "El informe está pendiente de completar con las últimas actividades del curso.",
  },
];

const emptyForm = {
  title: "",
  student: "",
  professor: "",
  course: "",
  date: "",
  status: "Borrador",
  observation: "",
};

function InformesAdmin() {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");

  const statistics = useMemo(() => {
    const sent = reports.filter(
      (report) => report.status === "Enviado",
    ).length;

    const pending = reports.filter(
      (report) => report.status === "Pendiente",
    ).length;

    const professors = new Set(
      reports.map((report) => report.professor),
    ).size;

    return {
      total: reports.length,
      sent,
      pending,
      professors,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !normalizedSearch ||
        report.title.toLowerCase().includes(normalizedSearch) ||
        report.student.toLowerCase().includes(normalizedSearch) ||
        report.professor.toLowerCase().includes(normalizedSearch) ||
        report.course.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormError("");
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedReport(null);
    setFormData(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (report) => {
    setIsEditing(true);
    setSelectedReport(report);

    setFormData({
      title: report.title,
      student: report.student,
      professor: report.professor,
      course: report.course,
      date: report.date,
      status: report.status,
      observation: report.observation,
    });

    setActiveMenu(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedReport(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formData.title.trim() ||
      !formData.student.trim() ||
      !formData.professor.trim() ||
      !formData.course.trim() ||
      !formData.date.trim()
    ) {
      return "Completa todos los campos obligatorios.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (isEditing && selectedReport) {
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                title: formData.title.trim(),
                student: formData.student.trim(),
                professor: formData.professor.trim(),
                course: formData.course.trim(),
                date: formData.date,
                status: formData.status,
                observation: formData.observation.trim(),
              }
            : report,
        ),
      );

      showNotification(
        "Informe actualizado correctamente.",
      );
    } else {
      const newReport = {
        id: Date.now(),
        title: formData.title.trim(),
        student: formData.student.trim(),
        professor: formData.professor.trim(),
        course: formData.course.trim(),
        date: formData.date,
        status: formData.status,
        observation: formData.observation.trim(),
      };

      setReports((currentReports) => [
        newReport,
        ...currentReports,
      ]);

      showNotification("Informe creado correctamente.");
    }

    closeFormModal();
  };

  const openDetails = (report) => {
    setSelectedReport(report);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const markAsSent = (report) => {
    setReports((currentReports) =>
      currentReports.map((currentReport) =>
        currentReport.id === report.id
          ? {
              ...currentReport,
              status: "Enviado",
            }
          : currentReport,
      ),
    );

    setActiveMenu(null);

    showNotification(
      "Informe marcado como enviado.",
    );
  };

  const openDeleteModal = (report) => {
    setSelectedReport(report);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedReport) {
      return;
    }

    setReports((currentReports) =>
      currentReports.filter(
        (report) => report.id !== selectedReport.id,
      ),
    );

    setSelectedReport(null);
    setIsDeleteOpen(false);

    showNotification(
      "Informe eliminado correctamente.",
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("Todos");
  };

  return (
    <div className="reports-admin-layout">
      <Sidebar />

      <main className="reports-admin-content">
        <header className="reports-admin-header">
          <div>
            <span className="reports-admin-eyebrow">
              <ShieldCheck size={15} />
              <SSLocalized text={"Centro de informes"} />
            </span>

            <h1><SSLocalized text={"Informes académicos"} /></h1>

            <p>
              <SSLocalized text={"Consulta, organiza y administra todos los informes generados dentro de StudySync."} />
            </p>
          </div>

          <button
            type="button"
            className="reports-admin-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <SSLocalized text={"Nuevo informe"} />
          </button>
        </header>

        <section className="reports-admin-statistics">
          <article>
            <div>
              <ClipboardList size={22} />
            </div>

            <span><SSLocalized text={"Total informes"} /></span>
            <strong>{statistics.total}</strong>
            <small><SSLocalized text={"Documentos registrados"} /></small>
          </article>

          <article>
            <div>
              <CheckCircle2 size={22} />
            </div>

            <span><SSLocalized text={"Enviados"} /></span>
            <strong>{statistics.sent}</strong>
            <small><SSLocalized text={"Completados correctamente"} /></small>
          </article>

          <article>
            <div>
              <Users size={22} />
            </div>

            <span><SSLocalized text={"Profesores"} /></span>
            <strong>{statistics.professors}</strong>
            <small><SSLocalized text={"Con actividad registrada"} /></small>
          </article>

          <article>
            <div>
              <BarChart3 size={22} />
            </div>

            <span><SSLocalized text={"Pendientes"} /></span>
            <strong>{statistics.pending}</strong>
            <small><SSLocalized text={"Requieren revisión"} /></small>
          </article>
        </section>

        <section className="reports-admin-panel">
          <div className="reports-admin-toolbar">
            <div className="reports-admin-search">
              <Search size={18} />

              <input
                type="search"
                placeholder={ssI18n.t("Buscar informe, estudiante, profesor o curso...")}
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="reports-admin-filter-button"
              onClick={() =>
                setShowFilters((current) => !current)
              }
            >
              <Filter size={17} />
              <SSLocalized text={"Filtros"} />
            </button>
          </div>

          {showFilters && (
            <div className="reports-admin-filter-panel">
              <label>
                <span><SSLocalized text={"Estado del informe"} /></span>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="Todos">
                    <SSLocalized text={"Todos los estados"} />
                  </option>

                  <option value="Enviado">
                    <SSLocalized text={"Enviado"} />
                  </option>

                  <option value="Pendiente">
                    <SSLocalized text={"Pendiente"} />
                  </option>

                  <option value="Borrador">
                    <SSLocalized text={"Borrador"} />
                  </option>
                </select>
              </label>

              {(search || statusFilter !== "Todos") && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  <SSLocalized text={"Limpiar filtros"} />
                </button>
              )}
            </div>
          )}

          <div className="reports-admin-table-heading">
            <div>
              <span><SSLocalized text={"Gestión documental"} /></span>
              <h2><SSLocalized text={"Listado de informes"} /></h2>
            </div>

            <small>
              {filteredReports.length} <SSLocalized text={"resultado"} />
              {filteredReports.length === 1 ? "" : "s"}
            </small>
          </div>

          <div className="reports-admin-table-wrapper">
            <table className="reports-admin-table">
              <thead>
                <tr>
                  <th><SSLocalized text={"Informe"} /></th>
                  <th><SSLocalized text={"Estudiante"} /></th>
                  <th><SSLocalized text={"Profesor"} /></th>
                  <th><SSLocalized text={"Curso"} /></th>
                  <th><SSLocalized text={"Fecha"} /></th>
                  <th><SSLocalized text={"Estado"} /></th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="reports-admin-file">
                        <div className="reports-admin-icon">
                          <FileText size={18} />
                        </div>

                        <div>
                          <strong>{report.title}</strong>
                          <span><SSLocalized text={"ID #"} />{report.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{report.student}</td>
                    <td>{report.professor}</td>
                    <td>{report.course}</td>
                    <td>{report.date}</td>

                    <td>
                      <span
                        className={`reports-admin-status reports-admin-${report.status.toLowerCase()}`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td className="reports-admin-actions-cell">
                      <button
                        type="button"
                        className="reports-admin-actions"
                        onClick={() =>
                          setActiveMenu((currentMenu) =>
                            currentMenu === report.id
                              ? null
                              : report.id,
                          )
                        }
                        aria-label={`Acciones para ${report.title}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === report.id && (
                        <div className="reports-admin-actions-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openDetails(report)
                            }
                          >
                            <Eye size={16} />
                            <SSLocalized text={"Ver detalles"} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(report)
                            }
                          >
                            <Edit3 size={16} />
                            <SSLocalized text={"Editar informe"} />
                          </button>

                          {report.status !== "Enviado" && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsSent(report)
                              }
                            >
                              <Send size={16} />
                              <SSLocalized text={"Marcar como enviado"} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="reports-admin-danger-action"
                            onClick={() =>
                              openDeleteModal(report)
                            }
                          >
                            <Trash2 size={16} />
                            <SSLocalized text={"Eliminar informe"} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className="reports-admin-empty-state">
                <FileText size={36} />

                <h3><SSLocalized text={"No encontramos informes"} /></h3>

                <p>
                  <SSLocalized text={"Cambia los filtros o utiliza otro término de búsqueda."} />
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  <SSLocalized text={"Limpiar filtros"} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {notification && (
        <div className="reports-admin-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isFormOpen && (
        <div className="reports-admin-modal-backdrop">
          <section className="reports-admin-modal">
            <header>
              <div>
                <span>
                  {isEditing
                    ? "Administración documental"
                    : "Nuevo documento"}
                </span>

                <h2>
                  {isEditing
                    ? "Editar informe"
                    : "Crear informe"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                aria-label={ssI18n.t("Cerrar formulario")}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="reports-admin-form-grid">
                <label>
                  <span><SSLocalized text={"Título del informe *"} /></span>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Nombre del informe")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Estudiante *"} /></span>

                  <input
                    type="text"
                    name="student"
                    value={formData.student}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Nombre del estudiante")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Profesor *"} /></span>

                  <input
                    type="text"
                    name="professor"
                    value={formData.professor}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Profesor responsable")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Curso *"} /></span>

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Curso relacionado")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Fecha *"} /></span>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Estado"} /></span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Borrador">
                      <SSLocalized text={"Borrador"} />
                    </option>

                    <option value="Pendiente">
                      <SSLocalized text={"Pendiente"} />
                    </option>

                    <option value="Enviado">
                      <SSLocalized text={"Enviado"} />
                    </option>
                  </select>
                </label>

                <label className="reports-admin-observation-field">
                  <span><SSLocalized text={"Observación académica"} /></span>

                  <textarea
                    name="observation"
                    value={formData.observation}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Describe el rendimiento, novedades y recomendaciones...")}
                  />
                </label>
              </div>

              {formError && (
                <p className="reports-admin-form-error">
                  {formError}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="reports-admin-secondary-button"
                  onClick={closeFormModal}
                >
                  <SSLocalized text={"Cancelar"} />
                </button>

                <button
                  type="submit"
                  className="reports-admin-primary-button"
                >
                  <Check size={17} />

                  {isEditing
                    ? "Guardar cambios"
                    : "Crear informe"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDetailsOpen && selectedReport && (
        <div className="reports-admin-modal-backdrop">
          <section className="reports-admin-details-modal">
            <header>
              <div className="reports-admin-details-icon">
                <FileText size={24} />
              </div>

              <div>
                <span><SSLocalized text={"Ficha documental"} /></span>
                <h2>{selectedReport.title}</h2>
                <p>
                  {selectedReport.student} ·{" "}
                  {selectedReport.course}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                aria-label={ssI18n.t("Cerrar detalles")}
              >
                <X size={20} />
              </button>
            </header>

            <div className="reports-admin-details-grid">
              <article>
                <span><SSLocalized text={"Estudiante"} /></span>
                <strong>{selectedReport.student}</strong>
              </article>

              <article>
                <span><SSLocalized text={"Profesor"} /></span>
                <strong>{selectedReport.professor}</strong>
              </article>

              <article>
                <span><SSLocalized text={"Curso"} /></span>
                <strong>{selectedReport.course}</strong>
              </article>

              <article>
                <span><SSLocalized text={"Fecha"} /></span>
                <strong>{selectedReport.date}</strong>
              </article>

              <article>
                <span><SSLocalized text={"Estado"} /></span>
                <strong>{selectedReport.status}</strong>
              </article>

              <article>
                <span><SSLocalized text={"Identificador"} /></span>
                <strong>#{selectedReport.id}</strong>
              </article>
            </div>

            <div className="reports-admin-observation">
              <span><SSLocalized text={"Observación académica"} /></span>

              <p>
                {selectedReport.observation ||
                  "No se registraron observaciones."}
              </p>
            </div>

            <footer>
              <button
                type="button"
                className="reports-admin-primary-button"
                onClick={() => {
                  const report = selectedReport;
                  setIsDetailsOpen(false);
                  openEditModal(report);
                }}
              >
                <Edit3 size={17} />
                <SSLocalized text={"Editar informe"} />
              </button>
            </footer>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedReport && (
        <div className="reports-admin-modal-backdrop">
          <section className="reports-admin-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2><SSLocalized text={"Eliminar informe"} /></h2>

            <p>
              <SSLocalized text={"Vas a eliminar"} />{" "}
              <strong>{selectedReport.title}</strong><SSLocalized text={". Esta acción no se puede deshacer."} />
            </p>

            <footer>
              <button
                type="button"
                className="reports-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                <SSLocalized text={"Cancelar"} />
              </button>

              <button
                type="button"
                className="reports-admin-delete-button"
                onClick={handleDelete}
              >
                <Trash2 size={17} />
                <SSLocalized text={"Eliminar"} />
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default InformesAdmin;