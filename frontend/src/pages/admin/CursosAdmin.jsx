import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
import { useEffect, useMemo, useState } from "react";
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

const COURSES_API = "http://localhost:8080/api/courses";

const initialCourses = [];

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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(COURSES_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`No fue posible cargar los cursos: ${response.status}`);
        }

        const data = await response.json();

        setCourses(
          data.map((course) => ({
            ...course,
            students: Number(course.students ?? 0),
            capacity: Number(course.capacity ?? 1),
            progress: Number(course.progress ?? 0),
            category: course.category ?? "",
            professor: course.professor ?? "",
            duration: course.duration ?? "",
            status: course.status ?? "Activo",
            description: course.description ?? "",
          }))
        );
      } catch (error) {
        console.error("Error cargando cursos:", error);
        setLoadError("No fue posible cargar los cursos desde el backend.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const statistics = useMemo(() => {
    const active = courses.filter(
      (course) => course.status === "Activo",
    ).length;

    const totalStudents = courses.reduce(
      (accumulator, course) =>
        accumulator + Number(course.students ?? 0),
      0,
    );

    const professors = new Set(
      courses.map((course) => course.professor).filter(Boolean),
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
        (course.name || "").toLowerCase().includes(normalizedSearch) ||
        (course.professor || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (course.category || "")
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

  const handleSubmit = async (event) => {
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

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      professor: formData.professor.trim(),
      duration: formData.duration.trim(),
      capacity,
      progress:
        isEditing && selectedCourse
          ? Number(selectedCourse.progress ?? 0)
          : 0,
      status: formData.status,
      description: formData.description.trim(),
    };

    try {
      const url =
        isEditing && selectedCourse
          ? `${COURSES_API}/${selectedCourse.id}`
          : COURSES_API;

      const response = await fetch(url, {
        method:
          isEditing && selectedCourse
            ? "PUT"
            : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `No fue posible guardar el curso: ${response.status}`
        );
      }

      const savedCourse = await response.json();

      const normalizedCourse = {
        ...savedCourse,
        students: Number(
          savedCourse.students ??
            selectedCourse?.students ??
            0
        ),
        capacity: Number(savedCourse.capacity ?? capacity),
        progress: Number(savedCourse.progress ?? 0),
      };

      if (isEditing && selectedCourse) {
        setCourses((currentCourses) =>
          currentCourses.map((course) =>
            course.id === selectedCourse.id
              ? normalizedCourse
              : course,
          ),
        );

        showNotification(
          "Curso actualizado correctamente.",
        );
      } else {
        setCourses((currentCourses) => [
          normalizedCourse,
          ...currentCourses,
        ]);

        showNotification(
          "Curso creado correctamente.",
        );
      }

      closeModal();
    } catch (error) {
      console.error("Error guardando curso:", error);
      setFormError(
        "No fue posible guardar el curso. Verifica que el backend esté ejecutándose."
      );
    }
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

  const handleDelete = async () => {
    if (!selectedCourse) {
      return;
    }

    try {
      const response = await fetch(
        `${COURSES_API}/${selectedCourse.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `No fue posible eliminar el curso: ${response.status}`
        );
      }

      setCourses((currentCourses) =>
        currentCourses.filter(
          (course) => course.id !== selectedCourse.id,
        ),
      );

      setSelectedCourse(null);
      setIsDeleteOpen(false);

      showNotification("Curso eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando curso:", error);
      setIsDeleteOpen(false);
      showNotification(
        "No fue posible eliminar el curso."
      );
    }
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
              <SSLocalized text={"Gestión institucional"} />
            </span>

            <h1><SSLocalized text={"Cursos"} /></h1>

            <p>
              <SSLocalized text={"Administra cursos, profesores responsables, cupos, estudiantes, estados y progreso académico."} />
            </p>
          </div>

          <button
            type="button"
            className="courses-admin-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <SSLocalized text={"Nuevo curso"} />
          </button>
        </header>

        <section className="courses-admin-statistics">
          <article>
            <div>
              <BookOpen size={22} />
            </div>
            <span><SSLocalized text={"Total cursos"} /></span>
            <strong>{statistics.total}</strong>
            <small><SSLocalized text={"Registrados en StudySync"} /></small>
          </article>

          <article>
            <div>
              <UserCheck size={22} />
            </div>
            <span><SSLocalized text={"Cursos activos"} /></span>
            <strong>{statistics.active}</strong>
            <small><SSLocalized text={"Disponibles actualmente"} /></small>
          </article>

          <article>
            <div>
              <Users size={22} />
            </div>
            <span><SSLocalized text={"Estudiantes inscritos"} /></span>
            <strong>{statistics.students}</strong>
            <small><SSLocalized text={"En toda la plataforma"} /></small>
          </article>

          <article>
            <div>
              <GraduationCap size={22} />
            </div>
            <span><SSLocalized text={"Profesores asignados"} /></span>
            <strong>{statistics.professors}</strong>
            <small><SSLocalized text={"Responsables académicos"} /></small>
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
                placeholder={ssI18n.t("Buscar curso, profesor o categoría...")}
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
                  <SSLocalized text={"Todos los estados"} />
                </option>
                <option value="Activo"><SSLocalized text={"Activo"} /></option>
                <option value="Borrador"><SSLocalized text={"Borrador"} /></option>
                <option value="Finalizado">
                  <SSLocalized text={"Finalizado"} />
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
                  <SSLocalized text={"Limpiar"} />
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="courses-admin-empty-state">
              <BookOpen size={36} />
              <h3><SSLocalized text={"Cargando cursos..."} /></h3>
              <p><SSLocalized text={"Consultando información del backend."} /></p>
            </div>
          )}

          {loadError && !loading && (
            <div className="courses-admin-empty-state">
              <BookOpen size={36} />
              <h3><SSLocalized text={"No fue posible cargar los cursos"} /></h3>
              <p>{loadError}</p>
            </div>
          )}

          <div className="courses-admin-table-heading">
            <div>
              <span><SSLocalized text={"Directorio académico"} /></span>
              <h2><SSLocalized text={"Cursos registrados"} /></h2>
            </div>

            <small>
              {filteredCourses.length} <SSLocalized text={"resultado"} />
              {filteredCourses.length === 1 ? "" : "s"}
            </small>
          </div>

          <div className="courses-admin-table-wrapper">
            <table className="courses-admin-table">
              <thead>
                <tr>
                  <th><SSLocalized text={"Curso"} /></th>
                  <th><SSLocalized text={"Profesor"} /></th>
                  <th><SSLocalized text={"Categoría"} /></th>
                  <th><SSLocalized text={"Duración"} /></th>
                  <th><SSLocalized text={"Estudiantes"} /></th>
                  <th><SSLocalized text={"Progreso"} /></th>
                  <th><SSLocalized text={"Estado"} /></th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => {
                  const occupancy = Math.round(
                    (Number(course.students ?? 0) /
                      Math.max(1, Number(course.capacity ?? 1))) *
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
                              <SSLocalized text={"Cupo:"} /> {course.students}/
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
                              <SSLocalized text={"Ver detalles"} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(course)
                              }
                            >
                              <Edit3 size={16} />
                              <SSLocalized text={"Editar curso"} />
                            </button>

                            <button
                              type="button"
                              className="courses-admin-danger-action"
                              onClick={() =>
                                openDeleteModal(course)
                              }
                            >
                              <Trash2 size={16} />
                              <SSLocalized text={"Eliminar curso"} />
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

                <h3><SSLocalized text={"No encontramos cursos"} /></h3>

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
                  <span><SSLocalized text={"Nombre del curso *"} /></span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Nombre del curso")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Categoría *"} /></span>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Ej. Matemáticas")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Profesor responsable *"} /></span>

                  <input
                    type="text"
                    name="professor"
                    value={formData.professor}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Nombre del profesor")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Duración"} /></span>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Ej. 12 semanas")}
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Cupos"} /></span>

                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Cantidad máxima")}
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Estado"} /></span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Activo"><SSLocalized text={"Activo"} /></option>
                    <option value="Borrador">
                      <SSLocalized text={"Borrador"} />
                    </option>
                    <option value="Finalizado">
                      <SSLocalized text={"Finalizado"} />
                    </option>
                  </select>
                </label>

                <label className="courses-admin-description-field">
                  <span><SSLocalized text={"Descripción"} /></span>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Describe el objetivo y contenido del curso...")}
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
                  <SSLocalized text={"Cancelar"} />
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
                <span><SSLocalized text={"Ficha del curso"} /></span>
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
                <span><SSLocalized text={"Profesor"} /></span>
                <strong>
                  {selectedCourse.professor}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Duración"} /></span>
                <strong>
                  {selectedCourse.duration ||
                    "No definida"}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Estudiantes"} /></span>
                <strong>
                  {selectedCourse.students}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Cupos"} /></span>
                <strong>
                  {selectedCourse.capacity}
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Progreso"} /></span>
                <strong>
                  {selectedCourse.progress}%
                </strong>
              </article>

              <article>
                <span><SSLocalized text={"Estado"} /></span>
                <strong>
                  {selectedCourse.status}
                </strong>
              </article>
            </div>

            <div className="courses-admin-description">
              <span><SSLocalized text={"Descripción"} /></span>
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
                <SSLocalized text={"Editar curso"} />
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

            <h2><SSLocalized text={"Eliminar curso"} /></h2>

            <p>
              <SSLocalized text={"Vas a eliminar"} />{" "}
              <strong>{selectedCourse.name}</strong><SSLocalized text={". Esta acción no se puede deshacer."} />
            </p>

            <footer>
              <button
                type="button"
                className="courses-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                <SSLocalized text={"Cancelar"} />
              </button>

              <button
                type="button"
                className="courses-admin-delete-button"
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

export default CursosAdmin;