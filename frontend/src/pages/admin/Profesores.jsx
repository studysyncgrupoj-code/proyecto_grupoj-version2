import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Edit3,
  Eye,
  GraduationCap,
  Mail,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/Profesores.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const USERS_API = `${API_BASE_URL}/api/users`;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialty: "",
  status: "Activo",
};

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    nombre: parts.shift() || "",
    apellido: parts.join(" "),
  };
}

function mapProfessorFromApi(user) {
  const name = `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim();

  return {
    id: user.id,
    name: name || "Profesor sin nombre",
    initials: getInitials(name),
    email: user.email ?? "",
    phone: "No registrado",
    specialty: "No registrada",
    courses: 0,
    students: 0,
    reports: 0,
    status: user.activo === false ? "Inactivo" : "Activo",
    lastAccess: "Sin información",
    apiData: user,
  };
}

function Profesores() {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [specialtyFilter, setSpecialtyFilter] = useState("Todas");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2800);
  };

  const loadProfessors = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(USERS_API);

      if (!response.ok) {
        throw new Error(
          `No fue posible cargar los profesores (${response.status}).`,
        );
      }

      const data = await response.json();

      const professorUsers = Array.isArray(data)
        ? data
            .filter(
              (user) =>
                String(user.rol || "").toUpperCase() === "PROFESOR",
            )
            .map(mapProfessorFromApi)
        : [];

      setProfessors(professorUsers);
    } catch (error) {
      console.error("Error cargando profesores:", error);

      showNotification(
        "No fue posible cargar los profesores desde el backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfessors();
  }, []);

  const statistics = useMemo(() => {
    const active = professors.filter(
      (professor) => professor.status === "Activo",
    ).length;

    const totalCourses = professors.reduce(
      (accumulator, professor) =>
        accumulator + professor.courses,
      0,
    );

    const totalStudents = professors.reduce(
      (accumulator, professor) =>
        accumulator + professor.students,
      0,
    );

    return {
      total: professors.length,
      active,
      courses: totalCourses,
      students: totalStudents,
    };
  }, [professors]);

  const specialties = useMemo(() => {
    return [
      "Todas",
      ...new Set(
        professors.map((professor) => professor.specialty),
      ),
    ];
  }, [professors]);

  const filteredProfessors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return professors.filter((professor) => {
      const matchesSearch =
        !normalizedSearch ||
        professor.name.toLowerCase().includes(normalizedSearch) ||
        professor.email.toLowerCase().includes(normalizedSearch) ||
        professor.specialty
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        professor.status === statusFilter;

      const matchesSpecialty =
        specialtyFilter === "Todas" ||
        professor.specialty === specialtyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSpecialty
      );
    });
  }, [
    professors,
    searchTerm,
    statusFilter,
    specialtyFilter,
  ]);

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
    setSelectedProfessor(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (professor) => {
    setIsEditing(true);
    setSelectedProfessor(professor);

    setFormData({
      name: professor.name,
      email: professor.email,
      phone:
        professor.phone === "No registrado"
          ? ""
          : professor.phone,
      specialty:
        professor.specialty === "No registrada"
          ? ""
          : professor.specialty,
      status: professor.status,
    });

    setActiveMenu(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfessor(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.specialty.trim()
    ) {
      return "Completa los campos obligatorios.";
    }

    const duplicatedEmail = professors.some(
      (professor) =>
        professor.email.toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        professor.id !== selectedProfessor?.id,
    );

    if (duplicatedEmail) {
      return "Ya existe un profesor con ese correo.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const { nombre, apellido } = splitName(formData.name);

    const payload = {
      nombre,
      apellido,
      email: formData.email.trim(),
      rol: "PROFESOR",
      activo: formData.status === "Activo",
    };

    try {
      if (isEditing && selectedProfessor) {
        const response = await fetch(
          `${USERS_API}/${selectedProfessor.id}`,
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
            `No fue posible actualizar el profesor (${response.status}).`,
          );
        }

        const updatedApiProfessor = await response.json();
        const updatedProfessor =
          mapProfessorFromApi(updatedApiProfessor);

        setProfessors((currentProfessors) =>
          currentProfessors.map((professor) =>
            professor.id === selectedProfessor.id
              ? {
                  ...updatedProfessor,
                  phone:
                    formData.phone.trim() ||
                    professor.phone ||
                    "No registrado",
                  specialty:
                    formData.specialty.trim() ||
                    professor.specialty ||
                    "No registrada",
                  courses: professor.courses,
                  students: professor.students,
                  reports: professor.reports,
                  lastAccess: professor.lastAccess,
                }
              : professor,
          ),
        );

        showNotification(
          "Profesor actualizado correctamente.",
        );
      } else {
        const response = await fetch(USERS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let message =
            "No fue posible crear el profesor.";

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

        const createdApiProfessor = await response.json();

        const createdProfessor = {
          ...mapProfessorFromApi(createdApiProfessor),
          phone:
            formData.phone.trim() ||
            "No registrado",
          specialty:
            formData.specialty.trim() ||
            "No registrada",
        };

        setProfessors((currentProfessors) => [
          createdProfessor,
          ...currentProfessors,
        ]);

        showNotification(
          "Profesor creado correctamente.",
        );
      }

      closeModal();
    } catch (error) {
      console.error("Error guardando profesor:", error);

      setFormError(
        error.message ||
          "No fue posible guardar el profesor.",
      );
    }
  };

  const toggleStatus = async (professor) => {
    const nextStatus =
      professor.status === "Activo"
        ? "Inactivo"
        : "Activo";

    const names = splitName(professor.name);

    const payload = {
      nombre:
        professor.apiData?.nombre ??
        names.nombre,

      apellido:
        professor.apiData?.apellido ??
        names.apellido,

      email: professor.email,

      rol: "PROFESOR",

      activo: nextStatus === "Activo",
    };

    try {
      const response = await fetch(
        `${USERS_API}/${professor.id}`,
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

      const updatedApiProfessor = await response.json();
      const updatedProfessor =
        mapProfessorFromApi(updatedApiProfessor);

      setProfessors((currentProfessors) =>
        currentProfessors.map((currentProfessor) =>
          currentProfessor.id === professor.id
            ? {
                ...updatedProfessor,
                phone: currentProfessor.phone,
                specialty: currentProfessor.specialty,
                courses: currentProfessor.courses,
                students: currentProfessor.students,
                reports: currentProfessor.reports,
                lastAccess: currentProfessor.lastAccess,
              }
            : currentProfessor,
        ),
      );

      setActiveMenu(null);

      showNotification(
        nextStatus === "Activo"
          ? "Profesor activado correctamente."
          : "Profesor desactivado correctamente.",
      );
    } catch (error) {
      console.error(
        "Error cambiando estado del profesor:",
        error,
      );

      showNotification(
        "No fue posible cambiar el estado del profesor.",
      );
    }
  };

  const openDetails = (professor) => {
    setSelectedProfessor(professor);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const openDeleteModal = (professor) => {
    setSelectedProfessor(professor);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProfessor) {
      return;
    }

    try {
      const response = await fetch(
        `${USERS_API}/${selectedProfessor.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error(
          `No fue posible eliminar el profesor (${response.status}).`,
        );
      }

      setProfessors((currentProfessors) =>
        currentProfessors.filter(
          (professor) =>
            professor.id !== selectedProfessor.id,
        ),
      );

      setSelectedProfessor(null);
      setIsDeleteOpen(false);

      showNotification(
        "Profesor eliminado correctamente.",
      );
    } catch (error) {
      console.error(
        "Error eliminando profesor:",
        error,
      );

      showNotification(
        "No fue posible eliminar el profesor.",
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setSpecialtyFilter("Todas");
  };

  return (
    <div className="professors-page-layout">
      <Sidebar />

      <main className="professors-page-content">
        <header className="professors-page-header">
          <div>
            <span className="professors-page-eyebrow">
              <ShieldCheck size={15} />
              Gestión institucional
            </span>

            <h1>Profesores</h1>

            <p>
              Administra docentes, especialidades, cursos asignados,
              estudiantes e informes académicos.
            </p>
          </div>

          <button
            type="button"
            className="professors-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nuevo profesor
          </button>
        </header>

        <section className="professors-statistics-grid">
          <article className="professors-stat-card">
            <div>
              <GraduationCap size={22} />
            </div>

            <span>Total profesores</span>
            <strong>{statistics.total}</strong>
            <small>Docentes registrados</small>
          </article>

          <article className="professors-stat-card">
            <div>
              <UserCheck size={22} />
            </div>

            <span>Profesores activos</span>
            <strong>{statistics.active}</strong>
            <small>Disponibles actualmente</small>
          </article>

          <article className="professors-stat-card">
            <div>
              <BookOpen size={22} />
            </div>

            <span>Cursos asignados</span>
            <strong>{statistics.courses}</strong>
            <small>En toda la plataforma</small>
          </article>

          <article className="professors-stat-card">
            <div>
              <Users size={22} />
            </div>

            <span>Estudiantes atendidos</span>
            <strong>{statistics.students}</strong>
            <small>Participación académica</small>
          </article>
        </section>

        <section className="professors-management-panel">
          <div className="professors-toolbar">
            <div className="professors-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar profesor, correo o especialidad..."
              />
            </div>

            <div className="professors-filters">
              <select
                value={specialtyFilter}
                onChange={(event) =>
                  setSpecialtyFilter(event.target.value)
                }
              >
                {specialties.map((specialty) => (
                  <option
                    key={specialty}
                    value={specialty}
                  >
                    {specialty === "Todas"
                      ? "Todas las especialidades"
                      : specialty}
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
                  Todos los estados
                </option>

                <option value="Activo">
                  Activo
                </option>

                <option value="Inactivo">
                  Inactivo
                </option>
              </select>

              {(searchTerm ||
                specialtyFilter !== "Todas" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="professors-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="professors-table-heading">
            <div>
              <span>Directorio docente</span>
              <h2>Profesores registrados</h2>
            </div>

            <small>
              {isLoading
                ? "Cargando..."
                : `${filteredProfessors.length} resultado${
                    filteredProfessors.length === 1
                      ? ""
                      : "s"
                  }`}
            </small>
          </div>

          <div className="professors-table-wrapper">
            <table className="professors-table">
              <thead>
                <tr>
                  <th>Profesor</th>
                  <th>Especialidad</th>
                  <th>Cursos</th>
                  <th>Estudiantes</th>
                  <th>Informes</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredProfessors.map((professor) => (
                  <tr key={professor.id}>
                    <td>
                      <div className="professors-user-cell">
                        <div className="professors-avatar">
                          {professor.initials}
                        </div>

                        <div>
                          <strong>
                            {professor.name}
                          </strong>

                          <span>
                            <Mail size={13} />
                            {professor.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="professors-specialty">
                        {professor.specialty}
                      </span>
                    </td>

                    <td>
                      <strong className="professors-number">
                        {professor.courses}
                      </strong>
                    </td>

                    <td>
                      <strong className="professors-number">
                        {professor.students}
                      </strong>
                    </td>

                    <td>
                      <strong className="professors-number">
                        {professor.reports}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`professors-status ${
                          professor.status === "Activo"
                            ? "professors-status-active"
                            : "professors-status-inactive"
                        }`}
                      >
                        <span />
                        {professor.status}
                      </span>
                    </td>

                    <td>
                      <span className="professors-secondary-text">
                        {professor.lastAccess}
                      </span>
                    </td>

                    <td className="professors-actions-cell">
                      <button
                        type="button"
                        className="professors-actions-trigger"
                        onClick={() =>
                          setActiveMenu((current) =>
                            current === professor.id
                              ? null
                              : professor.id,
                          )
                        }
                        aria-label={`Acciones para ${professor.name}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === professor.id && (
                        <div className="professors-actions-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openDetails(professor)
                            }
                          >
                            <Eye size={16} />
                            Ver detalles
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(professor)
                            }
                          >
                            <Edit3 size={16} />
                            Editar profesor
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(professor)
                            }
                          >
                            {professor.status === "Activo" ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}

                            {professor.status === "Activo"
                              ? "Desactivar"
                              : "Activar"}
                          </button>

                          <button
                            type="button"
                            className="professors-danger-action"
                            onClick={() =>
                              openDeleteModal(professor)
                            }
                          >
                            <Trash2 size={16} />
                            Eliminar profesor
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!isLoading &&
              filteredProfessors.length === 0 && (
                <div className="professors-empty-state">
                  <GraduationCap size={36} />

                  <h3>No encontramos profesores</h3>

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
        <div className="professors-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isModalOpen && (
        <div className="professors-modal-backdrop">
          <section className="professors-modal">
            <header>
              <div>
                <span>
                  {isEditing
                    ? "Administración docente"
                    : "Nuevo registro"}
                </span>

                <h2>
                  {isEditing
                    ? "Editar profesor"
                    : "Crear profesor"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="professors-form-grid">
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
                  <span>Correo electrónico *</span>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="profesor@correo.com"
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
                  <span>Especialidad *</span>

                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Ej. Matemáticas"
                    required
                  />
                </label>

                <label>
                  <span>Estado *</span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Activo">
                      Activo
                    </option>

                    <option value="Inactivo">
                      Inactivo
                    </option>
                  </select>
                </label>
              </div>

              {formError && (
                <p className="professors-form-error">
                  {formError}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="professors-secondary-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="professors-primary-button"
                >
                  <Check size={17} />

                  {isEditing
                    ? "Guardar cambios"
                    : "Crear profesor"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDetailsOpen && selectedProfessor && (
        <div className="professors-modal-backdrop">
          <section className="professors-details-modal">
            <header>
              <div className="professors-details-avatar">
                {selectedProfessor.initials}
              </div>

              <div>
                <span>Perfil docente</span>

                <h2>{selectedProfessor.name}</h2>

                <p>{selectedProfessor.specialty}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="professors-details-grid">
              <article>
                <span>Correo</span>

                <strong>
                  {selectedProfessor.email}
                </strong>
              </article>

              <article>
                <span>Teléfono</span>

                <strong>
                  {selectedProfessor.phone ||
                    "No registrado"}
                </strong>
              </article>

              <article>
                <span>Cursos asignados</span>

                <strong>
                  {selectedProfessor.courses}
                </strong>
              </article>

              <article>
                <span>Estudiantes</span>

                <strong>
                  {selectedProfessor.students}
                </strong>
              </article>

              <article>
                <span>Informes enviados</span>

                <strong>
                  {selectedProfessor.reports}
                </strong>
              </article>

              <article>
                <span>Estado</span>

                <strong>
                  {selectedProfessor.status}
                </strong>
              </article>

              <article>
                <span>Último acceso</span>

                <strong>
                  {selectedProfessor.lastAccess}
                </strong>
              </article>
            </div>

            <footer>
              <button
                type="button"
                className="professors-primary-button"
                onClick={() => {
                  const professor = selectedProfessor;

                  setIsDetailsOpen(false);

                  openEditModal(professor);
                }}
              >
                <Edit3 size={17} />
                Editar profesor
              </button>
            </footer>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedProfessor && (
        <div className="professors-modal-backdrop">
          <section className="professors-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2>Eliminar profesor</h2>

            <p>
              Vas a eliminar a{" "}
              <strong>
                {selectedProfessor.name}
              </strong>
              . Esta acción no se puede deshacer.
            </p>

            <footer>
              <button
                type="button"
                className="professors-secondary-button"
                onClick={() =>
                  setIsDeleteOpen(false)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="professors-delete-button"
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

export default Profesores;