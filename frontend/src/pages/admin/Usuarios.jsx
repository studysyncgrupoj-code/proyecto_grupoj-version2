import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Edit3,
  Eye,
  KeyRound,
  Mail,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  UserX,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/Usuarios.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const USERS_API = `${API_BASE_URL}/api/users`;

const emptyForm = {
  name: "",
  document: "",
  email: "",
  phone: "",
  role: "Estudiante",
  status: "Activo",
  password: "",
  confirmPassword: "",
};

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function normalizeRole(role) {
  const normalized = String(role || "").toUpperCase();

  if (normalized === "ADMINISTRADOR") {
    return "Administrador";
  }

  if (normalized === "PROFESOR") {
    return "Profesor";
  }

  return "Estudiante";
}

function roleToApi(role) {
  if (role === "Administrador") {
    return "ADMINISTRADOR";
  }

  if (role === "Profesor") {
    return "PROFESOR";
  }

  return "ESTUDIANTE";
}

function mapUserFromApi(user) {
  const fullName = `${user.nombre ?? ""} ${
    user.apellido ?? ""
  }`.trim();

  return {
    id: user.id,
    name: fullName || "Usuario sin nombre",
    document: "No registrado",
    email: user.email ?? "",
    phone: "No registrado",
    role: normalizeRole(user.rol),
    status: user.activo === false ? "Inactivo" : "Activo",
    lastAccess: "Sin información",
    createdAt: user.fechaCreacion
      ? new Date(user.fechaCreacion).toLocaleDateString("es-CO")
      : "Sin información",

    apiData: user,
  };
}

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const nombre = parts.shift() || "";
  const apellido = parts.join(" ");

  return {
    nombre,
    apellido,
  };
}

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(USERS_API);

      if (!response.ok) {
        throw new Error(
          `No fue posible cargar los usuarios (${response.status}).`,
        );
      }

      const data = await response.json();

      const mappedUsers = Array.isArray(data)
        ? data.map(mapUserFromApi)
        : [];

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error cargando usuarios:", error);

      showNotification(
        "No fue posible cargar los usuarios desde el backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const statistics = useMemo(() => {
    return {
      total: users.length,

      administrators: users.filter(
        (user) => user.role === "Administrador",
      ).length,

      professors: users.filter(
        (user) => user.role === "Profesor",
      ).length,

      students: users.filter(
        (user) => user.role === "Estudiante",
      ).length,

      active: users.filter(
        (user) => user.status === "Activo",
      ).length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.document.toLowerCase().includes(normalizedSearch);

      const matchesRole =
        roleFilter === "Todos" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 3000);
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
    setSelectedUser(null);
    setFormData(emptyForm);
    setFormError("");
    setIsUserModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setSelectedUser(user);

    setFormData({
      name: user.name,
      document:
        user.document === "No registrado" ? "" : user.document,
      email: user.email,
      phone: user.phone === "No registrado" ? "" : user.phone,
      role: user.role,
      status: user.status,
      password: "",
      confirmPassword: "",
    });

    setFormError("");
    setActiveMenu(null);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setFormData(emptyForm);
    setSelectedUser(null);
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.document.trim() ||
      !formData.email.trim()
    ) {
      return "Completa los campos obligatorios.";
    }

    const duplicatedEmail = users.some(
      (user) =>
        user.email.toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        user.id !== selectedUser?.id,
    );

    if (duplicatedEmail) {
      return "Ya existe un usuario con ese correo.";
    }

    if (!isEditing && formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      return "Las contraseñas no coinciden.";
    }

    return "";
  };

  const buildPayload = (userForEdit = null) => {
    const { nombre, apellido } = splitName(formData.name);

    const payload = {
      nombre,
      apellido,
      email: formData.email.trim(),
      rol: roleToApi(formData.role),
      activo: formData.status === "Activo",
    };

    if (formData.password) {
      payload.password = formData.password;
    } else if (userForEdit?.apiData?.password) {
      payload.password = userForEdit.apiData.password;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEditing && selectedUser) {
        const response = await fetch(
          `${USERS_API}/${selectedUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              buildPayload(selectedUser),
            ),
          },
        );

        if (!response.ok) {
          throw new Error(
            `No fue posible actualizar el usuario (${response.status}).`,
          );
        }

        const updatedApiUser = await response.json();
        const updatedUser = mapUserFromApi(updatedApiUser);

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...updatedUser,
                  document:
                    formData.document.trim() ||
                    "No registrado",
                  phone:
                    formData.phone.trim() ||
                    "No registrado",
                  lastAccess: user.lastAccess,
                }
              : user,
          ),
        );

        showNotification(
          "Usuario actualizado correctamente.",
        );
      } else {
        const response = await fetch(USERS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload()),
        });

        if (!response.ok) {
          let message = "No fue posible crear el usuario.";

          try {
            const errorData = await response.json();

            message =
              errorData.message ||
              errorData.error ||
              message;
          } catch {
            // El backend no devolvió JSON.
          }

          throw new Error(message);
        }

        const createdApiUser = await response.json();
        const createdUser = mapUserFromApi(createdApiUser);

        setUsers((currentUsers) => [
          {
            ...createdUser,
            document:
              formData.document.trim() || "No registrado",
            phone:
              formData.phone.trim() || "No registrado",
          },
          ...currentUsers,
        ]);

        showNotification("Usuario creado correctamente.");
      }

      closeUserModal();
    } catch (error) {
      console.error("Error guardando usuario:", error);

      setFormError(
        error.message ||
          "No fue posible guardar el usuario.",
      );
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus =
      user.status === "Activo" ? "Inactivo" : "Activo";

    try {
      const payload = {
        nombre: user.apiData?.nombre ?? splitName(user.name).nombre,
        apellido:
          user.apiData?.apellido ?? splitName(user.name).apellido,
        email: user.email,
        password: user.apiData?.password ?? "",
        rol: user.apiData?.rol ?? roleToApi(user.role),
        activo: nextStatus === "Activo",
      };

      const response = await fetch(
        `${USERS_API}/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          `No fue posible cambiar el estado (${response.status}).`,
        );
      }

      const updatedApiUser = await response.json();
      const mappedUser = mapUserFromApi(updatedApiUser);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...mappedUser,
                document: currentUser.document,
                phone: currentUser.phone,
                lastAccess: currentUser.lastAccess,
              }
            : currentUser,
        ),
      );

      setActiveMenu(null);

      showNotification(
        nextStatus === "Activo"
          ? "Usuario activado correctamente."
          : "Usuario desactivado correctamente.",
      );
    } catch (error) {
      console.error(
        "Error cambiando estado del usuario:",
        error,
      );

      showNotification(
        "No fue posible cambiar el estado del usuario.",
      );
    }
  };

  const handleResetPassword = (user) => {
    setActiveMenu(null);

    showNotification(
      `Se generó una solicitud de restablecimiento para ${user.email}.`,
    );
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setActiveMenu(null);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const response = await fetch(
        `${USERS_API}/${selectedUser.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error(
          `No fue posible eliminar el usuario (${response.status}).`,
        );
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== selectedUser.id,
        ),
      );

      setIsDeleteModalOpen(false);
      setSelectedUser(null);

      showNotification("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando usuario:", error);

      showNotification(
        "No fue posible eliminar el usuario.",
      );
    }
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setActiveMenu(null);
    setIsDetailsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("Todos");
    setStatusFilter("Todos");
  };

  return (
    <div className="users-page-layout">
      <Sidebar />

      <main className="users-page-content">
        <header className="users-page-header">
          <div>
            <span className="users-page-eyebrow">
              <ShieldCheck size={15} />
              Administración de usuarios
            </span>

            <h1>Usuarios</h1>

            <p>
              Gestiona administradores, profesores y estudiantes
              registrados en StudySync.
            </p>
          </div>

          <button
            type="button"
            className="users-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nuevo usuario
          </button>
        </header>

        <section className="users-statistics-grid">
          <article className="users-stat-card">
            <div>
              <Users size={21} />
            </div>
            <span>Total usuarios</span>
            <strong>{statistics.total}</strong>
            <small>Registrados en la plataforma</small>
          </article>

          <article className="users-stat-card">
            <div>
              <ShieldCheck size={21} />
            </div>
            <span>Administradores</span>
            <strong>{statistics.administrators}</strong>
            <small>Control institucional</small>
          </article>

          <article className="users-stat-card">
            <div>
              <UserRound size={21} />
            </div>
            <span>Profesores</span>
            <strong>{statistics.professors}</strong>
            <small>Personal docente</small>
          </article>

          <article className="users-stat-card">
            <div>
              <UserCheck size={21} />
            </div>
            <span>Estudiantes</span>
            <strong>{statistics.students}</strong>
            <small>{statistics.active} usuarios activos</small>
          </article>
        </section>

        <section className="users-management-panel">
          <div className="users-toolbar">
            <div className="users-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar por nombre, correo o documento..."
              />
            </div>

            <div className="users-filters">
              <div className="users-filter-control">
                <SlidersHorizontal size={16} />

                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value)
                  }
                  aria-label="Filtrar por rol"
                >
                  <option value="Todos">Todos los roles</option>
                  <option value="Administrador">
                    Administrador
                  </option>
                  <option value="Profesor">Profesor</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
              </div>

              <div className="users-filter-control">
                <UserCheck size={16} />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  aria-label="Filtrar por estado"
                >
                  <option value="Todos">
                    Todos los estados
                  </option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {(searchTerm ||
                roleFilter !== "Todos" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="users-clear-filters"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="users-table-header">
            <div>
              <span>Directorio institucional</span>
              <h2>Usuarios registrados</h2>
            </div>

            <small>
              {isLoading
                ? "Cargando..."
                : `${filteredUsers.length} resultado${
                    filteredUsers.length === 1 ? "" : "s"
                  }`}
            </small>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Documento</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th>Creación</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users-user-cell">
                        <div className="users-avatar">
                          {getInitials(user.name)}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>
                            <Mail size={13} />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="users-document">
                        {user.document}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`users-role-badge users-role-${user.role.toLowerCase()}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`users-status-badge ${
                          user.status === "Activo"
                            ? "users-status-active"
                            : "users-status-inactive"
                        }`}
                      >
                        <span />
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <span className="users-secondary-text">
                        {user.lastAccess}
                      </span>
                    </td>

                    <td>
                      <span className="users-secondary-text">
                        {user.createdAt}
                      </span>
                    </td>

                    <td className="users-actions-cell">
                      <button
                        type="button"
                        className="users-actions-trigger"
                        aria-label={`Acciones para ${user.name}`}
                        onClick={() =>
                          setActiveMenu((currentMenu) =>
                            currentMenu === user.id
                              ? null
                              : user.id,
                          )
                        }
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === user.id && (
                        <div className="users-actions-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openDetailsModal(user)
                            }
                          >
                            <Eye size={16} />
                            Ver detalles
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(user)
                            }
                          >
                            <Edit3 size={16} />
                            Editar usuario
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(user)
                            }
                          >
                            {user.status === "Activo" ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}

                            {user.status === "Activo"
                              ? "Desactivar"
                              : "Activar"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleResetPassword(user)
                            }
                          >
                            <KeyRound size={16} />
                            Restablecer contraseña
                          </button>

                          <button
                            type="button"
                            className="users-action-danger"
                            onClick={() =>
                              openDeleteModal(user)
                            }
                          >
                            <Trash2 size={16} />
                            Eliminar usuario
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!isLoading && filteredUsers.length === 0 && (
              <div className="users-empty-state">
                <Users size={34} />
                <h3>No encontramos usuarios</h3>
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
        <div className="users-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isUserModalOpen && (
        <div className="users-modal-backdrop">
          <section className="users-modal">
            <header className="users-modal-header">
              <div>
                <span>
                  {isEditing
                    ? "Administración de cuenta"
                    : "Nuevo registro"}
                </span>

                <h2>
                  {isEditing
                    ? "Editar usuario"
                    : "Crear usuario"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Cerrar formulario"
                onClick={closeUserModal}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="users-form-grid">
                <label>
                  <span>Nombre completo *</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre y apellidos"
                    required
                  />
                </label>

                <label>
                  <span>Documento *</span>
                  <input
                    type="text"
                    name="document"
                    value={formData.document}
                    onChange={handleChange}
                    placeholder="Número de documento"
                    required
                  />
                </label>

                <label>
                  <span>Correo electrónico *</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@correo.com"
                    required
                  />
                </label>

                <label>
                  <span>Teléfono</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+57 300 000 0000"
                  />
                </label>

                <label>
                  <span>Rol *</span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="Administrador">
                      Administrador
                    </option>
                    <option value="Profesor">
                      Profesor
                    </option>
                    <option value="Estudiante">
                      Estudiante
                    </option>
                  </select>
                </label>

                <label>
                  <span>Estado *</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </label>

                <label>
                  <span>
                    {isEditing
                      ? "Nueva contraseña"
                      : "Contraseña *"}
                  </span>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      isEditing
                        ? "Dejar vacío para conservar"
                        : "Mínimo 6 caracteres"
                    }
                    required={!isEditing}
                  />
                </label>

                <label>
                  <span>
                    {isEditing
                      ? "Confirmar nueva contraseña"
                      : "Confirmar contraseña *"}
                  </span>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    required={!isEditing}
                  />
                </label>
              </div>

              {formError && (
                <p className="users-form-error">
                  {formError}
                </p>
              )}

              <footer className="users-modal-footer">
                <button
                  type="button"
                  className="users-secondary-button"
                  onClick={closeUserModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="users-primary-button"
                >
                  <Check size={18} />
                  {isEditing
                    ? "Guardar cambios"
                    : "Crear usuario"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDeleteModalOpen && selectedUser && (
        <div className="users-modal-backdrop">
          <section className="users-confirm-modal">
            <div className="users-confirm-icon">
              <Trash2 size={24} />
            </div>

            <h2>Eliminar usuario</h2>

            <p>
              Vas a eliminar a{" "}
              <strong>{selectedUser.name}</strong>. Esta acción no
              se puede deshacer.
            </p>

            <div>
              <button
                type="button"
                className="users-secondary-button"
                onClick={() =>
                  setIsDeleteModalOpen(false)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="users-delete-button"
                onClick={handleDelete}
              >
                <Trash2 size={17} />
                Eliminar
              </button>
            </div>
          </section>
        </div>
      )}

      {isDetailsModalOpen && selectedUser && (
        <div className="users-modal-backdrop">
          <section className="users-details-modal">
            <header>
              <div className="users-details-avatar">
                {getInitials(selectedUser.name)}
              </div>

              <div>
                <span>Perfil institucional</span>
                <h2>{selectedUser.name}</h2>
                <p>{selectedUser.role}</p>
              </div>

              <button
                type="button"
                aria-label="Cerrar detalles"
                onClick={() =>
                  setIsDetailsModalOpen(false)
                }
              >
                <X size={20} />
              </button>
            </header>

            <div className="users-details-grid">
              <article>
                <span>Documento</span>
                <strong>{selectedUser.document}</strong>
              </article>

              <article>
                <span>Correo electrónico</span>
                <strong>{selectedUser.email}</strong>
              </article>

              <article>
                <span>Teléfono</span>
                <strong>{selectedUser.phone}</strong>
              </article>

              <article>
                <span>Estado</span>
                <strong>{selectedUser.status}</strong>
              </article>

              <article>
                <span>Último acceso</span>
                <strong>{selectedUser.lastAccess}</strong>
              </article>

              <article>
                <span>Fecha de creación</span>
                <strong>{selectedUser.createdAt}</strong>
              </article>
            </div>

            <footer>
              <button
                type="button"
                className="users-primary-button"
                onClick={() => {
                  const user = selectedUser;
                  setIsDetailsModalOpen(false);
                  openEditModal(user);
                }}
              >
                <Edit3 size={17} />
                Editar usuario
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default Usuarios;