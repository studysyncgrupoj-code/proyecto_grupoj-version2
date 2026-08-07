import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Clock3,
  Edit3,
  Eye,
  GraduationCap,
  Layers3,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/CursosAdmin.css";

const initialCourses = [
  {
    id: 1,
    name: "Matemáticas avanzadas",
    category: "Matemáticas",
    professor: "Laura Méndez",
    duration: "12 semanas",
    students: 128,
    capacity: 160,
    progress: 68,
    status: "Activo",
    description:
      "Curso enfocado en razonamiento matemático, funciones y resolución de problemas.",
  },
  {
    id: 2,
    name: "Física aplicada",
    category: "Física",
    professor: "Carlos Andrade",
    duration: "10 semanas",
    students: 94,
    capacity: 120,
    progress: 54,
    status: "Activo",
    description:
      "Fundamentos de física con actividades prácticas y análisis de casos.",
  },
  {
    id: 3,
    name: "Álgebra lineal",
    category: "Matemáticas",
    professor: "Diana Torres",
    duration: "8 semanas",
    students: 76,
    capacity: 100,
    progress: 81,
    status: "Activo",
    description:
      "Matrices, vectores, sistemas de ecuaciones y aplicaciones.",
  },
  {
    id: 4,
    name: "Programación básica",
    category: "Tecnología",
    professor: "Julián Vargas",
    duration: "14 semanas",
    students: 73,
    capacity: 90,
    progress: 42,
    status: "Borrador",
    description:
      "Introducción a lógica, estructuras de control y desarrollo de software.",
  },
  {
    id: 5,
    name: "Comunicación efectiva",
    category: "Lenguaje",
    professor: "Mariana López",
    duration: "6 semanas",
    students: 118,
    capacity: 140,
    progress: 100,
    status: "Finalizado",
    description:
      "Fortalecimiento de habilidades de lectura, escritura y comunicación oral.",
  },
];

const emptyForm = {
  name: "",
  category: "",
  professor: "",
  duration: "",
  capacity: "",
  status: "Activo",
  description: "",
};

function CursosAdmin() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState("");

  const statistics = useMemo(() => {
    const active = courses.filter(
      (course) => course.status === "Activo",
    ).length;

    const totalStudents = courses.reduce(
      (accumulator, course) =>
        accumulator + course.students,
      0,
    );

    const professors = new Set(
      courses.map((course) => course.professor),
    ).size;

    return {
      total: courses.length,
      active,
      students: totalStudents,
      professors,
    };
  }, [courses]);

  const categories = useMemo(() => {
    return [
      "Todas",
      ...new Set(courses.map((course) => course.category)),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.name.toLowerCase().includes(normalizedSearch) ||
        course.professor
          .toLowerCase()
          .includes(normalizedSearch) ||
        course.category
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        course.status === statusFilter;

      const matchesCategory =
        categoryFilter === "Todas" ||
        course.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    courses,
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

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedCourse(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setIsEditing(true);
    setSelectedCourse(course);

    setFormData({
      name: course.name,
      category: course.category,
      professor: course.professor,
      duration: course.duration,
      capacity: String(course.capacity),
      status: course.status,
      description: course.description,
    });

    setActiveMenu(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.professor.trim()
    ) {
      return "Completa los campos obligatorios.";
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

    const capacity = Math.max(
      1,
      Number(formData.capacity) || 1,
    );

    if (isEditing && selectedCourse) {
      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === selectedCourse.id
            ? {
                ...course,
                name: formData.name.trim(),
                category: formData.category.trim(),
                professor: formData.professor.trim(),
                duration: formData.duration.trim(),
                capacity,
                status: formData.status,
                description: formData.description.trim(),
              }
            : course,
        ),
      );

      showNotification(
        "Curso actualizado correctamente.",
      );
    } else {
      const newCourse = {
        id: Date.now(),
        name: formData.name.trim(),
        category: formData.category.trim(),
        professor: formData.professor.trim(),
        duration: formData.duration.trim(),
        students: 0,
        capacity,
        progress: 0,
        status: formData.status,
        description: formData.description.trim(),
      };

      setCourses((currentCourses) => [
        newCourse,
        ...currentCourses,
      ]);

      showNotification(
        "Curso creado correctamente.",
      );
    }

    closeModal();
  };

  const openDetails = (course) => {
    setSelectedCourse(course);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedCourse) {
      return;
    }

    setCourses((currentCourses) =>
      currentCourses.filter(
        (course) => course.id !== selectedCourse.id,
      ),
    );

    setSelectedCourse(null);
    setIsDeleteOpen(false);

    showNotification("Curso eliminado correctamente.");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setCategoryFilter("Todas");
  };

  return (
    <div className="courses-admin-layout">
      <Sidebar />

      <main className="courses-admin-content">
        <header className="courses-admin-header">
          <div>
            <span className="courses-admin-eyebrow">
              <ShieldCheck size={15} />
              Gestión institucional
            </span>

            <h1>Cursos</h1>

            <p>
              Administra cursos, profesores responsables, cupos,
              estudiantes, estados y progreso académico.
            </p>
          </div>

          <button
            type="button"
            className="courses-admin-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nuevo curso
          </button>
        </header>

        <section className="courses-admin-statistics">
          <article>
            <div>
              <BookOpen size={22} />
            </div>
            <span>Total cursos</span>
            <strong>{statistics.total}</strong>
            <small>Registrados en StudySync</small>
          </article>

          <article>
            <div>
              <UserCheck size={22} />
            </div>
            <span>Cursos activos</span>
            <strong>{statistics.active}</strong>
            <small>Disponibles actualmente</small>
          </article>

          <article>
            <div>
              <Users size={22} />
            </div>
            <span>Estudiantes inscritos</span>
            <strong>{statistics.students}</strong>
            <small>En toda la plataforma</small>
          </article>

          <article>
            <div>
              <GraduationCap size={22} />
            </div>
            <span>Profesores asignados</span>
            <strong>{statistics.professors}</strong>
            <small>Responsables académicos</small>
          </article>
        </section>

        <section className="courses-admin-panel">
          <div className="courses-admin-toolbar">
            <div className="courses-admin-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar curso, profesor o categoría..."
              />
            </div>

            <div className="courses-admin-filters">
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
                  Todos los estados
                </option>
                <option value="Activo">Activo</option>
                <option value="Borrador">Borrador</option>
                <option value="Finalizado">
                  Finalizado
                </option>
              </select>

              {(searchTerm ||
                categoryFilter !== "Todas" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="courses-admin-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="courses-admin-table-heading">
            <div>
              <span>Directorio académico</span>
              <h2>Cursos registrados</h2>
            </div>

            <small>
              {filteredCourses.length} resultado
              {filteredCourses.length === 1 ? "" : "s"}
            </small>
          </div>

          <div className="courses-admin-table-wrapper">
            <table className="courses-admin-table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Profesor</th>
                  <th>Categoría</th>
                  <th>Duración</th>
                  <th>Estudiantes</th>
                  <th>Progreso</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => {
                  const occupancy = Math.round(
                    (course.students / course.capacity) *
                      100,
                  );

                  return (
                    <tr key={course.id}>
                      <td>
                        <div className="courses-admin-course-cell">
                          <div className="courses-admin-icon">
                            <BookOpen size={19} />
                          </div>

                          <div>
                            <strong>{course.name}</strong>
                            <span>
                              Cupo: {course.students}/
                              {course.capacity} · {occupancy}%
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="courses-admin-professor">
                          <GraduationCap size={14} />
                          {course.professor}
                        </span>
                      </td>

                      <td>
                        <span className="courses-admin-category">
                          <Layers3 size={14} />
                          {course.category}
                        </span>
                      </td>

                      <td>
                        <span className="courses-admin-secondary-text">
                          <Clock3 size={14} />
                          {course.duration}
                        </span>
                      </td>

                      <td>
                        <strong className="courses-admin-number">
                          {course.students}
                        </strong>
                      </td>

                      <td>
                        <div className="courses-admin-progress">
                          <div>
                            <span
                              style={{
                                width: `${course.progress}%`,
                              }}
                            />
                          </div>

                          <strong>
                            {course.progress}%
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`courses-admin-status courses-admin-status-${course.status.toLowerCase()}`}
                        >
                          {course.status}
                        </span>
                      </td>

                      <td className="courses-admin-actions-cell">
                        <button
                          type="button"
                          className="courses-admin-actions-trigger"
                          onClick={() =>
                            setActiveMenu((current) =>
                              current === course.id
                                ? null
                                : course.id,
                            )
                          }
                          aria-label={`Acciones para ${course.name}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenu === course.id && (
                          <div className="courses-admin-actions-menu">
                            <button
                              type="button"
                              onClick={() =>
                                openDetails(course)
                              }
                            >
                              <Eye size={16} />
                              Ver detalles
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(course)
                              }
                            >
                              <Edit3 size={16} />
                              Editar curso
                            </button>

                            <button
                              type="button"
                              className="courses-admin-danger-action"
                              onClick={() =>
                                openDeleteModal(course)
                              }
                            >
                              <Trash2 size={16} />
                              Eliminar curso
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredCourses.length === 0 && (
              <div className="courses-admin-empty-state">
                <BookOpen size={36} />

                <h3>No encontramos cursos</h3>

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
        <div className="courses-admin-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isModalOpen && (
        <div className="courses-admin-modal-backdrop">
          <section className="courses-admin-modal">
            <header>
              <div>
                <span>
                  {isEditing
                    ? "Administración académica"
                    : "Nuevo registro"}
                </span>

                <h2>
                  {isEditing
                    ? "Editar curso"
                    : "Crear curso"}
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
              <div className="courses-admin-form-grid">
                <label>
                  <span>Nombre del curso *</span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre del curso"
                    required
                  />
                </label>

                <label>
                  <span>Categoría *</span>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Ej. Matemáticas"
                    required
                  />
                </label>

                <label>
                  <span>Profesor responsable *</span>

                  <input
                    type="text"
                    name="professor"
                    value={formData.professor}
                    onChange={handleChange}
                    placeholder="Nombre del profesor"
                    required
                  />
                </label>

                <label>
                  <span>Duración</span>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Ej. 12 semanas"
                  />
                </label>

                <label>
                  <span>Cupos</span>

                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Cantidad máxima"
                  />
                </label>

                <label>
                  <span>Estado</span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Borrador">
                      Borrador
                    </option>
                    <option value="Finalizado">
                      Finalizado
                    </option>
                  </select>
                </label>

                <label className="courses-admin-description-field">
                  <span>Descripción</span>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe el objetivo y contenido del curso..."
                  />
                </label>
              </div>

              {formError && (
                <p className="courses-admin-form-error">
                  {formError}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="courses-admin-secondary-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="courses-admin-primary-button"
                >
                  <Check size={17} />

                  {isEditing
                    ? "Guardar cambios"
                    : "Crear curso"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDetailsOpen && selectedCourse && (
        <div className="courses-admin-modal-backdrop">
          <section className="courses-admin-details-modal">
            <header>
              <div className="courses-admin-details-icon">
                <BookOpen size={24} />
              </div>

              <div>
                <span>Ficha del curso</span>
                <h2>{selectedCourse.name}</h2>
                <p>
                  {selectedCourse.category} ·{" "}
                  {selectedCourse.professor}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="courses-admin-details-grid">
              <article>
                <span>Profesor</span>
                <strong>
                  {selectedCourse.professor}
                </strong>
              </article>

              <article>
                <span>Duración</span>
                <strong>
                  {selectedCourse.duration ||
                    "No definida"}
                </strong>
              </article>

              <article>
                <span>Estudiantes</span>
                <strong>
                  {selectedCourse.students}
                </strong>
              </article>

              <article>
                <span>Cupos</span>
                <strong>
                  {selectedCourse.capacity}
                </strong>
              </article>

              <article>
                <span>Progreso</span>
                <strong>
                  {selectedCourse.progress}%
                </strong>
              </article>

              <article>
                <span>Estado</span>
                <strong>
                  {selectedCourse.status}
                </strong>
              </article>
            </div>

            <div className="courses-admin-description">
              <span>Descripción</span>
              <p>
                {selectedCourse.description ||
                  "No se ha registrado una descripción."}
              </p>
            </div>

            <footer>
              <button
                type="button"
                className="courses-admin-primary-button"
                onClick={() => {
                  const course = selectedCourse;
                  setIsDetailsOpen(false);
                  openEditModal(course);
                }}
              >
                <Edit3 size={17} />
                Editar curso
              </button>
            </footer>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedCourse && (
        <div className="courses-admin-modal-backdrop">
          <section className="courses-admin-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2>Eliminar curso</h2>

            <p>
              Vas a eliminar{" "}
              <strong>{selectedCourse.name}</strong>. Esta acción
              no se puede deshacer.
            </p>

            <footer>
              <button
                type="button"
                className="courses-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="courses-admin-delete-button"
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

export default CursosAdmin;