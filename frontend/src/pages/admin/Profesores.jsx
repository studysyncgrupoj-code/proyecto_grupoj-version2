import { useMemo, useState } from "react";
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

const initialProfessors = [
  {
    id: 1,
    name: "Laura Méndez",
    initials: "LM",
    email: "laura.mendez@studysync.com",
    phone: "+57 310 824 5687",
    specialty: "Matemáticas",
    courses: 4,
    students: 128,
    reports: 18,
    status: "Activo",
    lastAccess: "Hoy, 8:20 p. m.",
  },
  {
    id: 2,
    name: "Carlos Andrade",
    initials: "CA",
    email: "carlos.andrade@studysync.com",
    phone: "+57 315 689 4578",
    specialty: "Física",
    courses: 3,
    students: 94,
    reports: 12,
    status: "Activo",
    lastAccess: "Hoy, 6:35 p. m.",
  },
  {
    id: 3,
    name: "Diana Torres",
    initials: "DT",
    email: "diana.torres@studysync.com",
    phone: "+57 301 568 9742",
    specialty: "Álgebra",
    courses: 5,
    students: 146,
    reports: 22,
    status: "Activo",
    lastAccess: "Hace 42 min",
  },
  {
    id: 4,
    name: "Julián Vargas",
    initials: "JV",
    email: "julian.vargas@studysync.com",
    phone: "+57 320 476 8521",
    specialty: "Programación",
    courses: 2,
    students: 73,
    reports: 8,
    status: "Inactivo",
    lastAccess: "Hace 9 días",
  },
  {
    id: 5,
    name: "Mariana López",
    initials: "ML",
    email: "mariana.lopez@studysync.com",
    phone: "+57 312 785 4690",
    specialty: "Lenguaje",
    courses: 4,
    students: 118,
    reports: 16,
    status: "Activo",
    lastAccess: "Ayer, 9:10 p. m.",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialty: "",
  status: "Activo",
};

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function Profesores() {
  const [professors, setProfessors] = useState(initialProfessors);
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
      phone: professor.phone,
      specialty: professor.specialty,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (isEditing && selectedProfessor) {
      setProfessors((currentProfessors) =>
        currentProfessors.map((professor) =>
          professor.id === selectedProfessor.id
            ? {
                ...professor,
                name: formData.name.trim(),
                initials: getInitials(formData.name),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                specialty: formData.specialty.trim(),
                status: formData.status,
              }
            : professor,
        ),
      );

      showNotification(
        "Profesor actualizado correctamente.",
      );
    } else {
      const newProfessor = {
        id: Date.now(),
        name: formData.name.trim(),
        initials: getInitials(formData.name),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        specialty: formData.specialty.trim(),
        courses: 0,
        students: 0,
        reports: 0,
        status: formData.status,
        lastAccess: "Sin iniciar sesión",
      };

      setProfessors((currentProfessors) => [
        newProfessor,
        ...currentProfessors,
      ]);

      showNotification(
        "Profesor creado correctamente.",
      );
    }

    closeModal();
  };

  const toggleStatus = (professor) => {
    const nextStatus =
      professor.status === "Activo"
        ? "Inactivo"
        : "Activo";

    setProfessors((currentProfessors) =>
      currentProfessors.map((currentProfessor) =>
        currentProfessor.id === professor.id
          ? {
              ...currentProfessor,
              status: nextStatus,
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

  const handleDelete = () => {
    if (!selectedProfessor) {
      return;
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
                <option value="Activo">Activo</option>
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
              {filteredProfessors.length} resultado
              {filteredProfessors.length === 1
                ? ""
                : "s"}
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

            {filteredProfessors.length === 0 && (
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
                onClick={() => setIsDeleteOpen(false)}
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