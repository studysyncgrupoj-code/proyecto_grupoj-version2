import { useMemo, useState } from "react";
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

const initialUsers = [
  {
    id: 1,
    name: "Richard Villaparedes",
    document: "1024587963",
    email: "richard@studysync.com",
    phone: "+57 300 456 7890",
    role: "Administrador",
    status: "Activo",
    lastAccess: "Hoy, 8:42 p. m.",
    createdAt: "15/07/2026",
  },
  {
    id: 2,
    name: "Laura Méndez",
    document: "1032458967",
    email: "laura.mendez@studysync.com",
    phone: "+57 310 824 5687",
    role: "Profesor",
    status: "Activo",
    lastAccess: "Hoy, 6:18 p. m.",
    createdAt: "20/07/2026",
  },
  {
    id: 3,
    name: "Carlos Ramírez",
    document: "1008564921",
    email: "carlos.ramirez@studysync.com",
    phone: "+57 315 587 4521",
    role: "Estudiante",
    status: "Activo",
    lastAccess: "Hace 35 min",
    createdAt: "21/07/2026",
  },
  {
    id: 4,
    name: "Ana Torres",
    document: "1014569872",
    email: "ana.torres@studysync.com",
    phone: "+57 320 458 9632",
    role: "Estudiante",
    status: "Activo",
    lastAccess: "Ayer, 9:16 p. m.",
    createdAt: "22/07/2026",
  },
  {
    id: 5,
    name: "Julián Vargas",
    document: "1056874239",
    email: "julian.vargas@studysync.com",
    phone: "+57 301 695 4782",
    role: "Profesor",
    status: "Inactivo",
    lastAccess: "Hace 8 días",
    createdAt: "24/07/2026",
  },
  {
    id: 6,
    name: "María González",
    document: "1023698754",
    email: "maria.gonzalez@studysync.com",
    phone: "+57 312 845 6974",
    role: "Estudiante",
    status: "Activo",
    lastAccess: "Hoy, 11:35 a. m.",
    createdAt: "26/07/2026",
  },
];

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
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function Usuarios() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");

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
      document: user.document,
      email: user.email,
      phone: user.phone,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (isEditing && selectedUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: formData.name.trim(),
                document: formData.document.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                role: formData.role,
                status: formData.status,
              }
            : user,
        ),
      );

      showNotification("Usuario actualizado correctamente.");
    } else {
      const newUser = {
        id: Date.now(),
        name: formData.name.trim(),
        document: formData.document.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: formData.status,
        lastAccess: "Sin iniciar sesión",
        createdAt: new Date().toLocaleDateString("es-CO"),
      };

      setUsers((currentUsers) => [
        newUser,
        ...currentUsers,
      ]);

      showNotification("Usuario creado correctamente.");
    }

    closeUserModal();
  };

  const handleToggleStatus = (user) => {
    const nextStatus =
      user.status === "Activo" ? "Inactivo" : "Activo";

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? {
              ...currentUser,
              status: nextStatus,
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

  const handleDelete = () => {
    if (!selectedUser) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) => user.id !== selectedUser.id,
      ),
    );

    setIsDeleteModalOpen(false);
    setSelectedUser(null);

    showNotification("Usuario eliminado correctamente.");
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
                  <option value="Todos">Todos los estados</option>
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
              {filteredUsers.length} resultado
              {filteredUsers.length === 1 ? "" : "s"}
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

            {filteredUsers.length === 0 && (
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
                <strong>
                  {selectedUser.phone || "No registrado"}
                </strong>
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
                  setIsDetailsModalOpen(false);
                  openEditModal(selectedUser);
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