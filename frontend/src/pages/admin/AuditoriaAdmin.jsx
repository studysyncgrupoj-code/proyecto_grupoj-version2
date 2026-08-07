import { useMemo, useState } from "react";
import {
  Activity,
  Check,
  Eye,
  FileClock,
  Filter,
  KeyRound,
  MoreVertical,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/AuditoriaAdmin.css";

const initialLogs = [
  {
    id: 1,
    user: "Administrador StudySync",
    role: "Administrador",
    action: "Creación de usuario",
    module: "Usuarios",
    description:
      "Se creó una nueva cuenta de estudiante en la plataforma.",
    date: "07/08/2026",
    time: "9:14 p. m.",
    ip: "192.168.1.24",
    status: "Exitoso",
    level: "Información",
  },
  {
    id: 2,
    user: "Laura Méndez",
    role: "Profesor",
    action: "Actualización académica",
    module: "Gestión Académica",
    description:
      "Se actualizó el seguimiento académico de un estudiante.",
    date: "07/08/2026",
    time: "8:40 p. m.",
    ip: "192.168.1.41",
    status: "Exitoso",
    level: "Información",
  },
  {
    id: 3,
    user: "Administrador StudySync",
    role: "Administrador",
    action: "Cambio de permisos",
    module: "Usuarios",
    description:
      "Se modificaron los permisos de acceso de un usuario.",
    date: "07/08/2026",
    time: "7:12 p. m.",
    ip: "192.168.1.24",
    status: "Exitoso",
    level: "Seguridad",
  },
  {
    id: 4,
    user: "Sistema StudySync",
    role: "Sistema",
    action: "Intento de acceso",
    module: "Autenticación",
    description:
      "Se detectó un intento de acceso con credenciales inválidas.",
    date: "07/08/2026",
    time: "6:03 p. m.",
    ip: "192.168.1.87",
    status: "Rechazado",
    level: "Advertencia",
  },
  {
    id: 5,
    user: "Carlos Andrade",
    role: "Profesor",
    action: "Generación de informe",
    module: "Informes",
    description:
      "Se generó un nuevo informe académico para un estudiante.",
    date: "07/08/2026",
    time: "4:55 p. m.",
    ip: "192.168.1.63",
    status: "Exitoso",
    level: "Información",
  },
];

function AuditoriaAdmin() {
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const statistics = useMemo(() => {
    const successful = logs.filter(
      (log) => log.status === "Exitoso",
    ).length;

    const rejected = logs.filter(
      (log) => log.status === "Rechazado",
    ).length;

    const security = logs.filter(
      (log) => log.level === "Seguridad",
    ).length;

    return {
      total: logs.length,
      successful,
      rejected,
      security,
    };
  }, [logs]);

  const modules = useMemo(() => {
    return [
      "Todos",
      ...new Set(logs.map((log) => log.module)),
    ];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        log.user.toLowerCase().includes(normalizedSearch) ||
        log.action.toLowerCase().includes(normalizedSearch) ||
        log.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        log.ip.toLowerCase().includes(normalizedSearch);

      const matchesModule =
        moduleFilter === "Todos" ||
        log.module === moduleFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        log.status === statusFilter;

      return (
        matchesSearch &&
        matchesModule &&
        matchesStatus
      );
    });
  }, [
    logs,
    searchTerm,
    moduleFilter,
    statusFilter,
  ]);

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  };

  const openDetails = (log) => {
    setSelectedLog(log);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const openDeleteModal = (log) => {
    setSelectedLog(log);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedLog) {
      return;
    }

    setLogs((currentLogs) =>
      currentLogs.filter(
        (log) => log.id !== selectedLog.id,
      ),
    );

    setSelectedLog(null);
    setIsDeleteOpen(false);

    showNotification(
      "Registro eliminado correctamente.",
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setModuleFilter("Todos");
    setStatusFilter("Todos");
  };

  return (
    <div className="audit-admin-layout">
      <Sidebar />

      <main className="audit-admin-content">
        <header className="audit-admin-header">
          <div>
            <span className="audit-admin-eyebrow">
              <ShieldCheck size={15} />
              Seguridad y trazabilidad
            </span>

            <h1>Auditoría</h1>

            <p>
              Consulta accesos, cambios administrativos,
              acciones de usuarios y eventos relevantes del
              sistema.
            </p>
          </div>
        </header>

        <section className="audit-admin-statistics">
          <article>
            <div>
              <Activity size={22} />
            </div>

            <span>Eventos registrados</span>
            <strong>{statistics.total}</strong>
            <small>Actividad disponible</small>
          </article>

          <article>
            <div>
              <Check size={22} />
            </div>

            <span>Operaciones exitosas</span>
            <strong>{statistics.successful}</strong>
            <small>Procesadas correctamente</small>
          </article>

          <article>
            <div>
              <KeyRound size={22} />
            </div>

            <span>Eventos de seguridad</span>
            <strong>{statistics.security}</strong>
            <small>Requieren trazabilidad</small>
          </article>

          <article>
            <div>
              <ShieldCheck size={22} />
            </div>

            <span>Accesos rechazados</span>
            <strong>{statistics.rejected}</strong>
            <small>Intentos bloqueados</small>
          </article>
        </section>

        <section className="audit-admin-panel">
          <div className="audit-admin-toolbar">
            <div className="audit-admin-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar usuario, acción, IP o descripción..."
              />
            </div>

            <div className="audit-admin-filters">
              <div>
                <Filter size={16} />

                <select
                  value={moduleFilter}
                  onChange={(event) =>
                    setModuleFilter(event.target.value)
                  }
                >
                  {modules.map((module) => (
                    <option
                      key={module}
                      value={module}
                    >
                      {module === "Todos"
                        ? "Todos los módulos"
                        : module}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="Todos">
                  Todos los estados
                </option>
                <option value="Exitoso">
                  Exitoso
                </option>
                <option value="Rechazado">
                  Rechazado
                </option>
              </select>

              {(searchTerm ||
                moduleFilter !== "Todos" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="audit-admin-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="audit-admin-table-heading">
            <div>
              <span>Registro de actividad</span>
              <h2>Eventos del sistema</h2>
            </div>

            <small>
              {filteredLogs.length} resultado
              {filteredLogs.length === 1 ? "" : "s"}
            </small>
          </div>

          <div className="audit-admin-table-wrapper">
            <table className="audit-admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Módulo</th>
                  <th>Fecha</th>
                  <th>IP</th>
                  <th>Nivel</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="audit-admin-user-cell">
                        <div className="audit-admin-avatar">
                          <UserCog size={18} />
                        </div>

                        <div>
                          <strong>{log.user}</strong>
                          <span>{log.role}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="audit-admin-action-cell">
                        <strong>{log.action}</strong>
                        <span>{log.description}</span>
                      </div>
                    </td>

                    <td>
                      <span className="audit-admin-module">
                        {log.module}
                      </span>
                    </td>

                    <td>
                      <div className="audit-admin-date">
                        <strong>{log.date}</strong>
                        <span>{log.time}</span>
                      </div>
                    </td>

                    <td>
                      <span className="audit-admin-ip">
                        {log.ip}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`audit-admin-level audit-admin-level-${log.level.toLowerCase()}`}
                      >
                        {log.level}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`audit-admin-status audit-admin-status-${log.status.toLowerCase()}`}
                      >
                        <span />
                        {log.status}
                      </span>
                    </td>

                    <td className="audit-admin-actions-cell">
                      <button
                        type="button"
                        className="audit-admin-actions-trigger"
                        onClick={() =>
                          setActiveMenu((current) =>
                            current === log.id
                              ? null
                              : log.id,
                          )
                        }
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === log.id && (
                        <div className="audit-admin-actions-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openDetails(log)
                            }
                          >
                            <Eye size={16} />
                            Ver detalles
                          </button>

                          <button
                            type="button"
                            className="audit-admin-danger-action"
                            onClick={() =>
                              openDeleteModal(log)
                            }
                          >
                            <Trash2 size={16} />
                            Eliminar registro
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="audit-admin-empty-state">
                <FileClock size={36} />

                <h3>No encontramos registros</h3>

                <p>
                  Cambia los filtros o utiliza otro término de
                  búsqueda.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {notification && (
        <div className="audit-admin-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isDetailsOpen && selectedLog && (
        <div className="audit-admin-modal-backdrop">
          <section className="audit-admin-details-modal">
            <header>
              <div className="audit-admin-details-icon">
                <FileClock size={24} />
              </div>

              <div>
                <span>Registro de auditoría</span>
                <h2>{selectedLog.action}</h2>
                <p>{selectedLog.user}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="audit-admin-details-grid">
              <article>
                <span>Usuario</span>
                <strong>{selectedLog.user}</strong>
              </article>

              <article>
                <span>Rol</span>
                <strong>{selectedLog.role}</strong>
              </article>

              <article>
                <span>Módulo</span>
                <strong>{selectedLog.module}</strong>
              </article>

              <article>
                <span>Estado</span>
                <strong>{selectedLog.status}</strong>
              </article>

              <article>
                <span>Fecha</span>
                <strong>{selectedLog.date}</strong>
              </article>

              <article>
                <span>Hora</span>
                <strong>{selectedLog.time}</strong>
              </article>

              <article>
                <span>Dirección IP</span>
                <strong>{selectedLog.ip}</strong>
              </article>

              <article>
                <span>Nivel</span>
                <strong>{selectedLog.level}</strong>
              </article>
            </div>

            <div className="audit-admin-description">
              <span>Descripción del evento</span>
              <p>{selectedLog.description}</p>
            </div>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedLog && (
        <div className="audit-admin-modal-backdrop">
          <section className="audit-admin-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2>Eliminar registro</h2>

            <p>
              Vas a eliminar el registro de{" "}
              <strong>{selectedLog.action}</strong>. Esta acción
              no se puede deshacer.
            </p>

            <footer>
              <button
                type="button"
                className="audit-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="audit-admin-delete-button"
                onClick={handleDelete}
              >
                <Trash2 size={17} />
                Eliminar
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default AuditoriaAdmin;