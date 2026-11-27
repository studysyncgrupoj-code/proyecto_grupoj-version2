import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  Megaphone,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/NotificacionesAdmin.css";

const initialNotifications = [
  {
    id: 1,
    title: "Nuevo informe académico disponible",
    message:
      "Se ha publicado un nuevo informe académico para estudiantes del curso Matemáticas avanzadas.",
    audience: "Estudiantes",
    type: "Académica",
    date: "06/08/2026",
    time: "8:40 p. m.",
    status: "Enviada",
    priority: "Normal",
  },
  {
    id: 2,
    title: "Mantenimiento programado",
    message:
      "StudySync realizará mantenimiento preventivo el sábado entre las 2:00 a. m. y las 4:00 a. m.",
    audience: "Todos",
    type: "Sistema",
    date: "07/08/2026",
    time: "9:00 a. m.",
    status: "Programada",
    priority: "Alta",
  },
  {
    id: 3,
    title: "Recordatorio de entrega",
    message:
      "Recuerda completar las actividades pendientes antes del cierre del módulo.",
    audience: "Estudiantes",
    type: "Recordatorio",
    date: "06/08/2026",
    time: "5:30 p. m.",
    status: "Enviada",
    priority: "Normal",
  },
  {
    id: 4,
    title: "Seguimiento académico requerido",
    message:
      "Hay estudiantes con bajo rendimiento que requieren revisión por parte del equipo docente.",
    audience: "Profesores",
    type: "Alerta",
    date: "06/08/2026",
    time: "3:15 p. m.",
    status: "Pendiente",
    priority: "Alta",
  },
];

const emptyForm = {
  title: "",
  message: "",
  audience: "Todos",
  type: "Académica",
  status: "Enviada",
  priority: "Normal",
};

function NotificacionesAdmin() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todas");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notificationMessage, setNotificationMessage] =
    useState("");

  const statistics = useMemo(() => {
    const sent = notifications.filter(
      (item) => item.status === "Enviada",
    ).length;

    const pending = notifications.filter(
      (item) => item.status === "Pendiente",
    ).length;

    const scheduled = notifications.filter(
      (item) => item.status === "Programada",
    ).length;

    const highPriority = notifications.filter(
      (item) => item.priority === "Alta",
    ).length;

    return {
      total: notifications.length,
      sent,
      pending,
      scheduled,
      highPriority,
    };
  }, [notifications]);

  const types = useMemo(() => {
    return [
      "Todas",
      ...new Set(
        notifications.map(
          (notification) => notification.type,
        ),
      ),
    ];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return notifications.filter((notification) => {
      const matchesSearch =
        !normalizedSearch ||
        notification.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        notification.message
          .toLowerCase()
          .includes(normalizedSearch) ||
        notification.audience
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        notification.status === statusFilter;

      const matchesType =
        typeFilter === "Todas" ||
        notification.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [
    notifications,
    searchTerm,
    statusFilter,
    typeFilter,
  ]);

  const showNotification = (message) => {
    setNotificationMessage(message);

    window.setTimeout(() => {
      setNotificationMessage("");
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

  const openForm = () => {
    setFormData(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setFormData(emptyForm);
    setFormError("");
    setIsFormOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.message.trim()
    ) {
      setFormError(
        "Completa el título y el mensaje de la notificación.",
      );
      return;
    }

    const now = new Date();

    const newNotification = {
      id: Date.now(),
      title: formData.title.trim(),
      message: formData.message.trim(),
      audience: formData.audience,
      type: formData.type,
      status: formData.status,
      priority: formData.priority,
      date: now.toLocaleDateString("es-CO"),
      time: now.toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setNotifications((currentNotifications) => [
      newNotification,
      ...currentNotifications,
    ]);

    closeForm();

    showNotification(
      formData.status === "Programada"
        ? "Notificación programada correctamente."
        : "Notificación creada correctamente.",
    );
  };

  const openDetails = (notification) => {
    setSelectedNotification(notification);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const markAsSent = (notification) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              status: "Enviada",
            }
          : item,
      ),
    );

    setActiveMenu(null);

    showNotification(
      "Notificación marcada como enviada.",
    );
  };

  const openDeleteModal = (notification) => {
    setSelectedNotification(notification);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedNotification) {
      return;
    }

    setNotifications((currentNotifications) =>
      currentNotifications.filter(
        (notification) =>
          notification.id !== selectedNotification.id,
      ),
    );

    setSelectedNotification(null);
    setIsDeleteOpen(false);

    showNotification(
      "Notificación eliminada correctamente.",
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setTypeFilter("Todas");
  };

  return (
    <div className="notifications-admin-layout">
      <Sidebar />

      <main className="notifications-admin-content">
        <header className="notifications-admin-header">
          <div>
            <span className="notifications-admin-eyebrow">
              <ShieldCheck size={15} />
              <SSLocalized text={"Centro de notificaciones"} />
            </span>

            <h1><SSLocalized text={"Notificaciones"} /></h1>

            <p>
              <SSLocalized text={"Gestiona avisos académicos, alertas, recordatorios y comunicaciones generales de StudySync."} />
            </p>
          </div>

          <button
            type="button"
            className="notifications-admin-create-button"
            onClick={openForm}
          >
            <Plus size={18} />
            <SSLocalized text={"Nueva notificación"} />
          </button>
        </header>

        <section className="notifications-admin-statistics">
          <article>
            <div>
              <Bell size={22} />
            </div>
            <span><SSLocalized text={"Total notificaciones"} /></span>
            <strong>{statistics.total}</strong>
            <small><SSLocalized text={"Registros actuales"} /></small>
          </article>

          <article>
            <div>
              <CheckCircle2 size={22} />
            </div>
            <span><SSLocalized text={"Enviadas"} /></span>
            <strong>{statistics.sent}</strong>
            <small><SSLocalized text={"Comunicaciones completadas"} /></small>
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
              {statistics.scheduled} <SSLocalized text={"programadas"} />
            </small>
          </article>

          <article>
            <div>
              <AlertTriangle size={22} />
            </div>
            <span><SSLocalized text={"Prioridad alta"} /></span>
            <strong>{statistics.highPriority}</strong>
            <small><SSLocalized text={"Requieren atención"} /></small>
          </article>
        </section>

        <section className="notifications-admin-panel">
          <div className="notifications-admin-toolbar">
            <div className="notifications-admin-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={ssI18n.t("Buscar título, mensaje o destinatario...")}
              />
            </div>

            <div className="notifications-admin-filters">
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === "Todas"
                      ? "Todos los tipos"
                      : type}
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
                <option value="Enviada">
                  <SSLocalized text={"Enviada"} />
                </option>
                <option value="Pendiente">
                  <SSLocalized text={"Pendiente"} />
                </option>
                <option value="Programada">
                  <SSLocalized text={"Programada"} />
                </option>
              </select>

              {(searchTerm ||
                typeFilter !== "Todas" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="notifications-admin-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  <SSLocalized text={"Limpiar"} />
                </button>
              )}
            </div>
          </div>

          <div className="notifications-admin-table-heading">
            <div>
              <span><SSLocalized text={"Actividad del sistema"} /></span>
              <h2><SSLocalized text={"Historial de notificaciones"} /></h2>
            </div>

            <small>
              {filteredNotifications.length} <SSLocalized text={"resultado"} />
              {filteredNotifications.length === 1
                ? ""
                : "s"}
            </small>
          </div>

          <div className="notifications-admin-list">
            {filteredNotifications.map((notification) => (
              <article
                className="notifications-admin-item"
                key={notification.id}
              >
                <div
                  className={`notifications-admin-type-icon notifications-admin-type-${notification.type.toLowerCase()}`}
                >
                  {notification.type === "Alerta" ? (
                    <AlertTriangle size={20} />
                  ) : notification.type === "Sistema" ? (
                    <Megaphone size={20} />
                  ) : (
                    <Bell size={20} />
                  )}
                </div>

                <div className="notifications-admin-main">
                  <div className="notifications-admin-title-row">
                    <strong>{notification.title}</strong>

                    <span
                      className={`notifications-admin-priority notifications-admin-priority-${notification.priority.toLowerCase()}`}
                    >
                      {notification.priority}
                    </span>
                  </div>

                  <p>{notification.message}</p>

                  <div className="notifications-admin-meta">
                    <span>
                      <Users size={13} />
                      {notification.audience}
                    </span>

                    <span>{notification.type}</span>

                    <span>
                      {notification.date} ·{" "}
                      {notification.time}
                    </span>
                  </div>
                </div>

                <div className="notifications-admin-status-area">
                  <span
                    className={`notifications-admin-status notifications-admin-status-${notification.status.toLowerCase()}`}
                  >
                    <span />
                    {notification.status}
                  </span>
                </div>

                <div className="notifications-admin-actions-cell">
                  <button
                    type="button"
                    className="notifications-admin-actions-trigger"
                    onClick={() =>
                      setActiveMenu((current) =>
                        current === notification.id
                          ? null
                          : notification.id,
                      )
                    }
                    aria-label={`Acciones para ${notification.title}`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {activeMenu === notification.id && (
                    <div className="notifications-admin-actions-menu">
                      <button
                        type="button"
                        onClick={() =>
                          openDetails(notification)
                        }
                      >
                        <Eye size={16} />
                        <SSLocalized text={"Ver detalles"} />
                      </button>

                      {notification.status !== "Enviada" && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsSent(notification)
                          }
                        >
                          <Check size={16} />
                          <SSLocalized text={"Marcar como enviada"} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="notifications-admin-danger-action"
                        onClick={() =>
                          openDeleteModal(notification)
                        }
                      >
                        <Trash2 size={16} />
                        <SSLocalized text={"Eliminar"} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="notifications-admin-empty-state">
                <Bell size={36} />

                <h3><SSLocalized text={"No encontramos notificaciones"} /></h3>

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

      {notificationMessage && (
        <div className="notifications-admin-notification">
          <Check size={18} />
          {notificationMessage}
        </div>
      )}

      {isFormOpen && (
        <div className="notifications-admin-modal-backdrop">
          <section className="notifications-admin-modal">
            <header>
              <div>
                <span><SSLocalized text={"Nueva comunicación"} /></span>
                <h2><SSLocalized text={"Crear notificación"} /></h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label={ssI18n.t("Cerrar formulario")}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="notifications-admin-form-grid">
                <label className="notifications-admin-full-field">
                  <span><SSLocalized text={"Título *"} /></span>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Título de la notificación")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Destinatarios"} /></span>

                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                  >
                    <option value="Todos"><SSLocalized text={"Todos"} /></option>
                    <option value="Estudiantes"><SSLocalized text={"Estudiantes"} /></option>
                    <option value="Profesores"><SSLocalized text={"Profesores"} /></option>
                    <option value="Administradores">
                      <SSLocalized text={"Administradores"} />
                    </option>
                  </select>
                </label>

                <label>
                  <span><SSLocalized text={"Tipo"} /></span>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Académica">
                      <SSLocalized text={"Académica"} />
                    </option>
                    <option value="Recordatorio">
                      <SSLocalized text={"Recordatorio"} />
                    </option>
                    <option value="Alerta">
                      <SSLocalized text={"Alerta"} />
                    </option>
                    <option value="Sistema"><SSLocalized text={"Sistema"} /></option>
                  </select>
                </label>

                <label>
                  <span><SSLocalized text={"Prioridad"} /></span>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Normal">
                      <SSLocalized text={"Normal"} />
                    </option>
                    <option value="Alta">
                      <SSLocalized text={"Alta"} />
                    </option>
                  </select>
                </label>

                <label>
                  <span><SSLocalized text={"Estado"} /></span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Enviada">
                      <SSLocalized text={"Enviar ahora"} />
                    </option>
                    <option value="Programada">
                      <SSLocalized text={"Programar"} />
                    </option>
                    <option value="Pendiente">
                      <SSLocalized text={"Guardar pendiente"} />
                    </option>
                  </select>
                </label>

                <label className="notifications-admin-full-field">
                  <span><SSLocalized text={"Mensaje *"} /></span>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Escribe el contenido de la notificación...")}
                    required
                  />
                </label>
              </div>

              {formError && (
                <p className="notifications-admin-form-error">
                  {formError}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="notifications-admin-secondary-button"
                  onClick={closeForm}
                >
                  <SSLocalized text={"Cancelar"} />
                </button>

                <button
                  type="submit"
                  className="notifications-admin-primary-button"
                >
                  <Bell size={17} />
                  <SSLocalized text={"Procesar notificación"} />
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDetailsOpen && selectedNotification && (
        <div className="notifications-admin-modal-backdrop">
          <section className="notifications-admin-details-modal">
            <header>
              <div className="notifications-admin-details-icon">
                <Bell size={24} />
              </div>

              <div>
                <span><SSLocalized text={"Detalle de notificación"} /></span>
                <h2>
                  {selectedNotification.title}
                </h2>
                <p>
                  <SSLocalized text={"Dirigida a"} />{" "}
                  {selectedNotification.audience}
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

            <div className="notifications-admin-details-grid">
              <article>
                <span><SSLocalized text={"Destinatarios"} /></span>
                <strong>
                  {selectedNotification.audience}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Tipo"} /></span>
                <strong>
                  {selectedNotification.type}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Prioridad"} /></span>
                <strong>
                  {selectedNotification.priority}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Estado"} /></span>
                <strong>
                  {selectedNotification.status}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Fecha"} /></span>
                <strong>
                  {selectedNotification.date}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Hora"} /></span>
                <strong>
                  {selectedNotification.time}
                </strong>
              </article>
            </div>

            <div className="notifications-admin-message-body">
              <span><SSLocalized text={"Mensaje"} /></span>
              <p>{selectedNotification.message}</p>
            </div>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedNotification && (
        <div className="notifications-admin-modal-backdrop">
          <section className="notifications-admin-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2><SSLocalized text={"Eliminar notificación"} /></h2>

            <p>
              <SSLocalized text={"Vas a eliminar"} />{" "}
              <strong>
                {selectedNotification.title}
              </strong>
              <SSLocalized text={". Esta acción no se puede deshacer."} />
            </p>

            <footer>
              <button
                type="button"
                className="notifications-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                <SSLocalized text={"Cancelar"} />
              </button>

              <button
                type="button"
                className="notifications-admin-delete-button"
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

export default NotificacionesAdmin;