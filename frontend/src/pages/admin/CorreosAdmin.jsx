import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock3,
  Eye,
  Mail,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/CorreosAdmin.css";

const initialEmails = [
  {
    id: 1,
    recipient: "ana.martinez@studysync.com",
    recipientName: "Ana Martínez",
    subject: "Informe académico disponible",
    preview:
      "Tu informe académico del curso Matemáticas avanzadas ya está disponible para consulta.",
    body:
      "Hola Ana,\n\nTu informe académico del curso Matemáticas avanzadas ya se encuentra disponible en StudySync.\n\nPuedes ingresar a tu panel para consultar el documento y las observaciones de tu profesor.\n\nSaludos,\nEquipo StudySync",
    date: "06/08/2026",
    time: "8:42 p. m.",
    status: "Enviado",
    category: "Académico",
  },
  {
    id: 2,
    recipient: "carlos.ramirez@studysync.com",
    recipientName: "Carlos Ramírez",
    subject: "Seguimiento académico pendiente",
    preview:
      "Se ha generado una nueva observación de seguimiento en tu expediente académico.",
    body:
      "Hola Carlos,\n\nSe ha registrado una nueva observación de seguimiento académico en tu expediente.\n\nTe recomendamos revisar tu panel y consultar las actividades pendientes.\n\nSaludos,\nEquipo StudySync",
    date: "06/08/2026",
    time: "6:15 p. m.",
    status: "Pendiente",
    category: "Seguimiento",
  },
  {
    id: 3,
    recipient: "laura.mendez@studysync.com",
    recipientName: "Laura Méndez",
    subject: "Resumen semanal de estudiantes",
    preview:
      "Consulta el resumen semanal de actividad y rendimiento de tus estudiantes.",
    body:
      "Hola Laura,\n\nStudySync generó el resumen semanal de actividad de tus estudiantes.\n\nPuedes revisar métricas, alertas e informes desde tu panel docente.\n\nSaludos,\nEquipo StudySync",
    date: "05/08/2026",
    time: "4:30 p. m.",
    status: "Enviado",
    category: "Profesor",
  },
  {
    id: 4,
    recipient: "luis.herrera@studysync.com",
    recipientName: "Luis Herrera",
    subject: "Error al enviar notificación",
    preview:
      "No fue posible entregar la notificación académica al destinatario.",
    body:
      "Este correo no pudo ser entregado al destinatario.\n\nVerifica la dirección registrada antes de intentar reenviarlo.",
    date: "05/08/2026",
    time: "11:22 a. m.",
    status: "Fallido",
    category: "Sistema",
  },
  {
    id: 5,
    recipient: "sofia.lopez@studysync.com",
    recipientName: "Sofía López",
    subject: "Recordatorio de sesión",
    preview:
      "Recuerda tu próxima sesión de estudio programada para mañana.",
    body:
      "Hola Sofía,\n\nTe recordamos que tienes una sesión de estudio programada para mañana.\n\nPuedes consultar los detalles en tu calendario de StudySync.\n\nSaludos,\nEquipo StudySync",
    date: "07/08/2026",
    time: "8:00 a. m.",
    status: "Programado",
    category: "Recordatorio",
  },
];

const emptyForm = {
  recipientName: "",
  recipient: "",
  subject: "",
  category: "Académico",
  status: "Enviado",
  body: "",
};

function CorreosAdmin() {
  const [emails, setEmails] = useState(initialEmails);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");

  const statistics = useMemo(() => {
    const sent = emails.filter(
      (email) => email.status === "Enviado",
    ).length;

    const pending = emails.filter(
      (email) => email.status === "Pendiente",
    ).length;

    const failed = emails.filter(
      (email) => email.status === "Fallido",
    ).length;

    const scheduled = emails.filter(
      (email) => email.status === "Programado",
    ).length;

    return {
      total: emails.length,
      sent,
      pending,
      failed,
      scheduled,
    };
  }, [emails]);

  const categories = useMemo(() => {
    return [
      "Todas",
      ...new Set(emails.map((email) => email.category)),
    ];
  }, [emails]);

  const filteredEmails = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return emails.filter((email) => {
      const matchesSearch =
        !normalizedSearch ||
        email.recipientName
          .toLowerCase()
          .includes(normalizedSearch) ||
        email.recipient
          .toLowerCase()
          .includes(normalizedSearch) ||
        email.subject
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        email.status === statusFilter;

      const matchesCategory =
        categoryFilter === "Todas" ||
        email.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    emails,
    searchTerm,
    statusFilter,
    categoryFilter,
  ]);

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

  const openComposeModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setIsComposeOpen(true);
  };

  const closeComposeModal = () => {
    setIsComposeOpen(false);
    setFormData(emptyForm);
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formData.recipientName.trim() ||
      !formData.recipient.trim() ||
      !formData.subject.trim() ||
      !formData.body.trim()
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

    const now = new Date();

    const newEmail = {
      id: Date.now(),
      recipientName: formData.recipientName.trim(),
      recipient: formData.recipient.trim(),
      subject: formData.subject.trim(),
      preview: formData.body.trim().slice(0, 95),
      body: formData.body.trim(),
      category: formData.category,
      status: formData.status,
      date: now.toLocaleDateString("es-CO"),
      time: now.toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setEmails((currentEmails) => [
      newEmail,
      ...currentEmails,
    ]);

    closeComposeModal();

    showNotification(
      formData.status === "Programado"
        ? "Correo programado correctamente."
        : "Correo creado correctamente.",
    );
  };

  const openDetails = (email) => {
    setSelectedEmail(email);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const resendEmail = (email) => {
    setEmails((currentEmails) =>
      currentEmails.map((currentEmail) =>
        currentEmail.id === email.id
          ? {
              ...currentEmail,
              status: "Enviado",
            }
          : currentEmail,
      ),
    );

    setActiveMenu(null);

    showNotification(
      "Correo reenviado correctamente.",
    );
  };

  const markPendingAsSent = (email) => {
    setEmails((currentEmails) =>
      currentEmails.map((currentEmail) =>
        currentEmail.id === email.id
          ? {
              ...currentEmail,
              status: "Enviado",
            }
          : currentEmail,
      ),
    );

    setActiveMenu(null);

    showNotification(
      "Correo marcado como enviado.",
    );
  };

  const openDeleteModal = (email) => {
    setSelectedEmail(email);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedEmail) {
      return;
    }

    setEmails((currentEmails) =>
      currentEmails.filter(
        (email) => email.id !== selectedEmail.id,
      ),
    );

    setSelectedEmail(null);
    setIsDeleteOpen(false);

    showNotification(
      "Correo eliminado correctamente.",
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setCategoryFilter("Todas");
  };

  return (
    <div className="emails-admin-layout">
      <Sidebar />

      <main className="emails-admin-content">
        <header className="emails-admin-header">
          <div>
            <span className="emails-admin-eyebrow">
              <ShieldCheck size={15} />
              <SSLocalized text={"Centro de comunicaciones"} />
            </span>

            <h1><SSLocalized text={"Correos"} /></h1>

            <p>
              <SSLocalized text={"Supervisa comunicaciones institucionales, entregas, errores, mensajes programados y notificaciones académicas."} />
            </p>
          </div>

          <button
            type="button"
            className="emails-admin-create-button"
            onClick={openComposeModal}
          >
            <Plus size={18} />
            <SSLocalized text={"Nuevo correo"} />
          </button>
        </header>

        <section className="emails-admin-statistics">
          <article>
            <div>
              <Mail size={22} />
            </div>

            <span><SSLocalized text={"Total procesados"} /></span>
            <strong>{statistics.total}</strong>
            <small><SSLocalized text={"Registros actuales"} /></small>
          </article>

          <article>
            <div>
              <Check size={22} />
            </div>

            <span><SSLocalized text={"Enviados"} /></span>
            <strong>{statistics.sent}</strong>
            <small><SSLocalized text={"Entrega completada"} /></small>
          </article>

          <article>
            <div>
              <Clock3 size={22} />
            </div>

            <span><SSLocalized text={"Pendientes"} /></span>
            <strong>
              {statistics.pending + statistics.scheduled}
            </strong>
            <small>
              {statistics.scheduled} <SSLocalized text={"programados"} />
            </small>
          </article>

          <article>
            <div>
              <AlertTriangle size={22} />
            </div>

            <span><SSLocalized text={"Fallidos"} /></span>
            <strong>{statistics.failed}</strong>
            <small><SSLocalized text={"Requieren revisión"} /></small>
          </article>
        </section>

        <section className="emails-admin-panel">
          <div className="emails-admin-toolbar">
            <div className="emails-admin-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={ssI18n.t("Buscar destinatario, correo o asunto...")}
              />
            </div>

            <div className="emails-admin-filters">
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "Todas"
                      ? "Todas las categorías"
                      : category}
                  </option>
                ))}
              </select>

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

                <option value="Programado">
                  <SSLocalized text={"Programado"} />
                </option>

                <option value="Fallido">
                  <SSLocalized text={"Fallido"} />
                </option>
              </select>

              {(searchTerm ||
                categoryFilter !== "Todas" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="emails-admin-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  <SSLocalized text={"Limpiar"} />
                </button>
              )}
            </div>
          </div>

          <div className="emails-admin-table-heading">
            <div>
              <span><SSLocalized text={"Actividad de correo"} /></span>
              <h2><SSLocalized text={"Historial de comunicaciones"} /></h2>
            </div>

            <small>
              {filteredEmails.length} <SSLocalized text={"resultado"} />
              {filteredEmails.length === 1 ? "" : "s"}
            </small>
          </div>

          <div className="emails-admin-table-wrapper">
            <table className="emails-admin-table">
              <thead>
                <tr>
                  <th><SSLocalized text={"Destinatario"} /></th>
                  <th><SSLocalized text={"Asunto"} /></th>
                  <th><SSLocalized text={"Categoría"} /></th>
                  <th><SSLocalized text={"Fecha"} /></th>
                  <th><SSLocalized text={"Estado"} /></th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id}>
                    <td>
                      <div className="emails-admin-recipient-cell">
                        <div className="emails-admin-avatar">
                          {email.recipientName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((word) =>
                              word.charAt(0).toUpperCase(),
                            )
                            .join("")}
                        </div>

                        <div>
                          <strong>
                            {email.recipientName}
                          </strong>

                          <span>
                            {email.recipient}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="emails-admin-subject-cell">
                        <strong>{email.subject}</strong>
                        <span>{email.preview}</span>
                      </div>
                    </td>

                    <td>
                      <span className="emails-admin-category">
                        {email.category}
                      </span>
                    </td>

                    <td>
                      <div className="emails-admin-date">
                        <strong>{email.date}</strong>
                        <span>{email.time}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`emails-admin-status emails-admin-status-${email.status.toLowerCase()}`}
                      >
                        <span />
                        {email.status}
                      </span>
                    </td>

                    <td className="emails-admin-actions-cell">
                      <button
                        type="button"
                        className="emails-admin-actions-trigger"
                        onClick={() =>
                          setActiveMenu((current) =>
                            current === email.id
                              ? null
                              : email.id,
                          )
                        }
                        aria-label={`Acciones para ${email.subject}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === email.id && (
                        <div className="emails-admin-actions-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openDetails(email)
                            }
                          >
                            <Eye size={16} />
                            <SSLocalized text={"Ver correo"} />
                          </button>

                          {(email.status === "Fallido" ||
                            email.status === "Enviado") && (
                            <button
                              type="button"
                              onClick={() =>
                                resendEmail(email)
                              }
                            >
                              <RefreshCw size={16} />
                              <SSLocalized text={"Reenviar"} />
                            </button>
                          )}

                          {(email.status === "Pendiente" ||
                            email.status === "Programado") && (
                            <button
                              type="button"
                              onClick={() =>
                                markPendingAsSent(email)
                              }
                            >
                              <Send size={16} />
                              <SSLocalized text={"Enviar ahora"} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="emails-admin-danger-action"
                            onClick={() =>
                              openDeleteModal(email)
                            }
                          >
                            <Trash2 size={16} />
                            <SSLocalized text={"Eliminar"} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmails.length === 0 && (
              <div className="emails-admin-empty-state">
                <Mail size={36} />

                <h3><SSLocalized text={"No encontramos correos"} /></h3>

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
        <div className="emails-admin-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isComposeOpen && (
        <div className="emails-admin-modal-backdrop">
          <section className="emails-admin-modal">
            <header>
              <div>
                <span><SSLocalized text={"Nueva comunicación"} /></span>
                <h2><SSLocalized text={"Enviar correo"} /></h2>
              </div>

              <button
                type="button"
                onClick={closeComposeModal}
                aria-label={ssI18n.t("Cerrar formulario")}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="emails-admin-form-grid">
                <label>
                  <span><SSLocalized text={"Nombre del destinatario *"} /></span>

                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Nombre completo")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Correo electrónico *"} /></span>

                  <input
                    type="email"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder={ssI18n.t("correo@studysync.com")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Categoría"} /></span>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Académico">
                      <SSLocalized text={"Académico"} />
                    </option>

                    <option value="Seguimiento">
                      <SSLocalized text={"Seguimiento"} />
                    </option>

                    <option value="Profesor">
                      <SSLocalized text={"Profesor"} />
                    </option>

                    <option value="Recordatorio">
                      <SSLocalized text={"Recordatorio"} />
                    </option>

                    <option value="Sistema"><SSLocalized text={"Sistema"} /></option>
                  </select>
                </label>

                <label>
                  <span><SSLocalized text={"Tipo de envío"} /></span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Enviado">
                      <SSLocalized text={"Enviar ahora"} />
                    </option>

                    <option value="Programado">
                      <SSLocalized text={"Programar"} />
                    </option>

                    <option value="Pendiente">
                      <SSLocalized text={"Guardar pendiente"} />
                    </option>
                  </select>
                </label>

                <label className="emails-admin-full-field">
                  <span><SSLocalized text={"Asunto *"} /></span>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Asunto del correo")}
                    required
                  />
                </label>

                <label className="emails-admin-full-field">
                  <span><SSLocalized text={"Mensaje *"} /></span>

                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Escribe el mensaje...")}
                    required
                  />
                </label>
              </div>

              {formError && (
                <p className="emails-admin-form-error">
                  {formError}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="emails-admin-secondary-button"
                  onClick={closeComposeModal}
                >
                  <SSLocalized text={"Cancelar"} />
                </button>

                <button
                  type="submit"
                  className="emails-admin-primary-button"
                >
                  <Send size={17} />
                  <SSLocalized text={"Procesar correo"} />
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDetailsOpen && selectedEmail && (
        <div className="emails-admin-modal-backdrop">
          <section className="emails-admin-details-modal">
            <header>
              <div className="emails-admin-details-icon">
                <Mail size={24} />
              </div>

              <div>
                <span><SSLocalized text={"Detalle de comunicación"} /></span>
                <h2>{selectedEmail.subject}</h2>
                <p>
                  <SSLocalized text={"Para"} /> {selectedEmail.recipientName}
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

            <div className="emails-admin-details-grid">
              <article>
                <span><SSLocalized text={"Destinatario"} /></span>
                <strong>
                  {selectedEmail.recipientName}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Correo"} /></span>
                <strong>
                  {selectedEmail.recipient}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Fecha"} /></span>
                <strong>
                  {selectedEmail.date}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Hora"} /></span>
                <strong>
                  {selectedEmail.time}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Categoría"} /></span>
                <strong>
                  {selectedEmail.category}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Estado"} /></span>
                <strong>
                  {selectedEmail.status}
                </strong>
              </article>
            </div>

            <div className="emails-admin-message-body">
              <span><SSLocalized text={"Mensaje"} /></span>

              <p>{selectedEmail.body}</p>
            </div>

            <footer>
              <button
                type="button"
                className="emails-admin-primary-button"
                onClick={() => {
                  const email = selectedEmail;
                  setIsDetailsOpen(false);
                  resendEmail(email);
                }}
              >
                <RefreshCw size={17} />
                <SSLocalized text={"Reenviar correo"} />
              </button>
            </footer>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedEmail && (
        <div className="emails-admin-modal-backdrop">
          <section className="emails-admin-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2><SSLocalized text={"Eliminar correo"} /></h2>

            <p>
              <SSLocalized text={"Vas a eliminar el correo"} />{" "}
              <strong>{selectedEmail.subject}</strong><SSLocalized text={". Esta acción no se puede deshacer."} />
            </p>

            <footer>
              <button
                type="button"
                className="emails-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                <SSLocalized text={"Cancelar"} />
              </button>

              <button
                type="button"
                className="emails-admin-delete-button"
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

export default CorreosAdmin;