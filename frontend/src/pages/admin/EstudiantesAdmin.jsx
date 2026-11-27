import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
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
  TrendingUp,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/EstudiantesAdmin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const USERS_API = `${API_BASE_URL}/api/users`;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  course: "",
  average: "",
  attendance: "",
  status: "Activo",
  academicStatus: "Estable",
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

function mapStudentFromApi(user) {
  const name = `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim();

  return {
    id: user.id,
    name: name || "Estudiante sin nombre",
    initials: getInitials(name),
    email: user.email ?? "",

    // Estos campos todavía no existen en User.java.
    phone: "No registrado",
    course: "Sin curso asignado",
    average: 0,
    attendance: 0,
    reports: 0,
    academicStatus: "Estable",
    lastAccess: "Sin información",

    status:
      user.activo === false
        ? "Suspendido"
        : "Activo",

    apiData: user,
  };
}

function EstudiantesAdmin() {
  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [courseFilter, setCourseFilter] = useState("Todos");

  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const loadStudents = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(USERS_API);

      if (!response.ok) {
        throw new Error(
          `No fue posible cargar los estudiantes (${response.status}).`,
        );
      }

      const data = await response.json();

      const studentUsers = Array.isArray(data)
        ? data
            .filter(
              (user) =>
                String(user.rol || "").toUpperCase() ===
                "ESTUDIANTE",
            )
            .map(mapStudentFromApi)
        : [];

      setStudents(studentUsers);
    } catch (error) {
      console.error("Error cargando estudiantes:", error);

      showNotification(
        "No fue posible cargar los estudiantes desde el backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const statistics = useMemo(() => {
    const active = students.filter(
      (student) => student.status === "Activo",
    ).length;

    const suspended = students.filter(
      (student) => student.status === "Suspendido",
    ).length;

    const average =
      students.length > 0
        ? Math.round(
            students.reduce(
              (accumulator, student) =>
                accumulator + Number(student.average || 0),
              0,
            ) / students.length,
          )
        : 0;

    return {
      total: students.length,
      active,
      suspended,
      average,
    };
  }, [students]);

  const courses = useMemo(() => {
    return [
      "Todos",
      ...new Set(
        students.map(
          (student) =>
            student.course || "Sin curso asignado",
        ),
      ),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !normalizedSearch ||
        student.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.course
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        student.status === statusFilter;

      const matchesCourse =
        courseFilter === "Todos" ||
        student.course === courseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse
      );
    });
  }, [
    students,
    searchTerm,
    statusFilter,
    courseFilter,
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
    setSelectedStudent(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setIsEditing(true);
    setSelectedStudent(student);

    setFormData({
      name: student.name,
      email: student.email,

      phone:
        student.phone === "No registrado"
          ? ""
          : student.phone,

      course:
        student.course === "Sin curso asignado"
          ? ""
          : student.course,

      average: String(student.average),
      attendance: String(student.attendance),

      status: student.status,

      academicStatus:
        student.academicStatus || "Estable",
    });

    setActiveMenu(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.course.trim()
    ) {
      return "Completa los campos obligatorios.";
    }

    const duplicatedEmail = students.some(
      (student) =>
        student.email.toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        student.id !== selectedStudent?.id,
    );

    if (duplicatedEmail) {
      return "Ya existe un estudiante con ese correo.";
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

    const average = Math.min(
      100,
      Math.max(
        0,
        Number(formData.average) || 0,
      ),
    );

    const attendance = Math.min(
      100,
      Math.max(
        0,
        Number(formData.attendance) || 0,
      ),
    );

    const { nombre, apellido } =
      splitName(formData.name);

    const payload = {
      nombre,
      apellido,
      email: formData.email.trim(),
      rol: "ESTUDIANTE",
      activo: formData.status === "Activo",
    };

    try {
      if (isEditing && selectedStudent) {
        const response = await fetch(
          `${USERS_API}/${selectedStudent.id}`,
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
            `No fue posible actualizar el estudiante (${response.status}).`,
          );
        }

        const updatedApiStudent =
          await response.json();

        const updatedStudent =
          mapStudentFromApi(updatedApiStudent);

        setStudents((currentStudents) =>
          currentStudents.map((student) =>
            student.id === selectedStudent.id
              ? {
                  ...updatedStudent,

                  // Se mantienen en React porque User.java
                  // todavía no posee estos campos.
                  phone:
                    formData.phone.trim() ||
                    student.phone ||
                    "No registrado",

                  course:
                    formData.course.trim() ||
                    student.course ||
                    "Sin curso asignado",

                  average,
                  attendance,

                  reports: student.reports,

                  academicStatus:
                    formData.academicStatus,

                  lastAccess:
                    student.lastAccess,
                }
              : student,
          ),
        );

        showNotification(
          "Estudiante actualizado correctamente.",
        );
      } else {
        const response = await fetch(USERS_API, {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let message =
            "No fue posible crear el estudiante.";

          try {
            const errorData =
              await response.json();

            message =
              errorData.message ||
              errorData.error ||
              message;
          } catch {
            // El backend no devolvió JSON.
          }

          throw new Error(message);
        }

        const createdApiStudent =
          await response.json();

        const createdStudent = {
          ...mapStudentFromApi(
            createdApiStudent,
          ),

          phone:
            formData.phone.trim() ||
            "No registrado",

          course:
            formData.course.trim() ||
            "Sin curso asignado",

          average,
          attendance,

          academicStatus:
            formData.academicStatus,
        };

        setStudents(
          (currentStudents) => [
            createdStudent,
            ...currentStudents,
          ],
        );

        showNotification(
          "Estudiante creado correctamente.",
        );
      }

      closeModal();
    } catch (error) {
      console.error(
        "Error guardando estudiante:",
        error,
      );

      setFormError(
        error.message ||
          "No fue posible guardar el estudiante.",
      );
    }
  };

  const toggleStatus = async (student) => {
    const nextStatus =
      student.status === "Activo"
        ? "Suspendido"
        : "Activo";

    const names =
      splitName(student.name);

    const payload = {
      nombre:
        student.apiData?.nombre ??
        names.nombre,

      apellido:
        student.apiData?.apellido ??
        names.apellido,

      email: student.email,

      rol: "ESTUDIANTE",

      activo:
        nextStatus === "Activo",
    };

    try {
      const response = await fetch(
        `${USERS_API}/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          `No fue posible cambiar el estado (${response.status}).`,
        );
      }

      const updatedApiStudent =
        await response.json();

      const updatedStudent =
        mapStudentFromApi(
          updatedApiStudent,
        );

      setStudents((currentStudents) =>
        currentStudents.map(
          (currentStudent) =>
            currentStudent.id ===
            student.id
              ? {
                  ...updatedStudent,

                  phone:
                    currentStudent.phone,

                  course:
                    currentStudent.course,

                  average:
                    currentStudent.average,

                  attendance:
                    currentStudent.attendance,

                  reports:
                    currentStudent.reports,

                  academicStatus:
                    currentStudent.academicStatus,

                  lastAccess:
                    currentStudent.lastAccess,
                }
              : currentStudent,
        ),
      );

      setActiveMenu(null);

      showNotification(
        nextStatus === "Activo"
          ? "Estudiante activado correctamente."
          : "Estudiante suspendido correctamente.",
      );
    } catch (error) {
      console.error(
        "Error cambiando estado del estudiante:",
        error,
      );

      showNotification(
        "No fue posible cambiar el estado del estudiante.",
      );
    }
  };

  const openDetails = (student) => {
    setSelectedStudent(student);
    setActiveMenu(null);
    setIsDetailsOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setActiveMenu(null);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) {
      return;
    }

    try {
      const response = await fetch(
        `${USERS_API}/${selectedStudent.id}`,
        {
          method: "DELETE",
        },
      );

      if (
        !response.ok &&
        response.status !== 204
      ) {
        throw new Error(
          `No fue posible eliminar el estudiante (${response.status}).`,
        );
      }

      setStudents(
        (currentStudents) =>
          currentStudents.filter(
            (student) =>
              student.id !==
              selectedStudent.id,
          ),
      );

      setSelectedStudent(null);
      setIsDeleteOpen(false);

      showNotification(
        "Estudiante eliminado correctamente.",
      );
    } catch (error) {
      console.error(
        "Error eliminando estudiante:",
        error,
      );

      showNotification(
        "No fue posible eliminar el estudiante.",
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setCourseFilter("Todos");
  };

  return (
    <div className="students-admin-layout">
      <Sidebar />

      <main className="students-admin-content">
        <header className="students-admin-header">
          <div>
            <span className="students-admin-eyebrow">
              <ShieldCheck size={15} />
              <SSLocalized text={"Gestión institucional"} />
            </span>

            <h1><SSLocalized text={"Estudiantes"} /></h1>

            <p>
              <SSLocalized text={"Supervisa expedientes, rendimiento, asistencia, alertas y estado general de los estudiantes."} />
            </p>
          </div>

          <button
            type="button"
            className="students-admin-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <SSLocalized text={"Nuevo estudiante"} />
          </button>
        </header>

        <section className="students-admin-statistics">
          <article>
            <div>
              <Users size={22} />
            </div>

            <span><SSLocalized text={"Total estudiantes"} /></span>
            <strong>{statistics.total}</strong>
            <small><SSLocalized text={"Registrados en StudySync"} /></small>
          </article>

          <article>
            <div>
              <UserCheck size={22} />
            </div>

            <span><SSLocalized text={"Estudiantes activos"} /></span>
            <strong>{statistics.active}</strong>
            <small><SSLocalized text={"Con acceso habilitado"} /></small>
          </article>

          <article>
            <div>
              <UserX size={22} />
            </div>

            <span><SSLocalized text={"Suspendidos"} /></span>
            <strong>{statistics.suspended}</strong>
            <small><SSLocalized text={"Requieren revisión"} /></small>
          </article>

          <article>
            <div>
              <TrendingUp size={22} />
            </div>

            <span><SSLocalized text={"Promedio general"} /></span>
            <strong>{statistics.average}%</strong>
            <small><SSLocalized text={"Rendimiento académico"} /></small>
          </article>
        </section>

        <section className="students-admin-panel">
          <div className="students-admin-toolbar">
            <div className="students-admin-search">
              <Search size={18} />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
                placeholder={ssI18n.t("Buscar estudiante, correo o curso...")}
              />
            </div>

            <div className="students-admin-filters">
              <select
                value={courseFilter}
                onChange={(event) =>
                  setCourseFilter(
                    event.target.value,
                  )
                }
              >
                {courses.map((course) => (
                  <option
                    key={course}
                    value={course}
                  >
                    {course === "Todos"
                      ? "Todos los cursos"
                      : course}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value,
                  )
                }
              >
                <option value="Todos">
                  <SSLocalized text={"Todos los estados"} />
                </option>

                <option value="Activo">
                  <SSLocalized text={"Activo"} />
                </option>

                <option value="Suspendido">
                  <SSLocalized text={"Suspendido"} />
                </option>
              </select>

              {(searchTerm ||
                courseFilter !== "Todos" ||
                statusFilter !==
                  "Todos") && (
                <button
                  type="button"
                  className="students-admin-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  <SSLocalized text={"Limpiar"} />
                </button>
              )}
            </div>
          </div>

          <div className="students-admin-table-heading">
            <div>
              <span>
                <SSLocalized text={"Directorio académico"} />
              </span>

              <h2>
                <SSLocalized text={"Estudiantes registrados"} />
              </h2>
            </div>

            <small>
              {isLoading
                ? "Cargando..."
                : `${filteredStudents.length} resultado${
                    filteredStudents.length ===
                    1
                      ? ""
                      : "s"
                  }`}
            </small>
          </div>

          <div className="students-admin-table-wrapper">
            <table className="students-admin-table">
              <thead>
                <tr>
                  <th><SSLocalized text={"Estudiante"} /></th>
                  <th><SSLocalized text={"Curso"} /></th>
                  <th><SSLocalized text={"Promedio"} /></th>
                  <th><SSLocalized text={"Asistencia"} /></th>
                  <th><SSLocalized text={"Informes"} /></th>
                  <th>
                    <SSLocalized text={"Estado académico"} />
                  </th>
                  <th><SSLocalized text={"Acceso"} /></th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map(
                  (student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="students-admin-user-cell">
                          <div className="students-admin-avatar">
                            {
                              student.initials
                            }
                          </div>

                          <div>
                            <strong>
                              {student.name}
                            </strong>

                            <span>
                              <Mail
                                size={13}
                              />
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="students-admin-course">
                          <BookOpen
                            size={14}
                          />
                          {student.course}
                        </span>
                      </td>

                      <td>
                        <strong className="students-admin-number">
                          {student.average}%
                        </strong>
                      </td>

                      <td>
                        <strong className="students-admin-number">
                          {
                            student.attendance
                          }
                          %
                        </strong>
                      </td>

                      <td>
                        <strong className="students-admin-number">
                          {student.reports}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`students-admin-academic-status students-admin-${student.academicStatus.toLowerCase()}`}
                        >
                          {
                            student.academicStatus
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={`students-admin-status ${
                            student.status ===
                            "Activo"
                              ? "students-admin-status-active"
                              : "students-admin-status-suspended"
                          }`}
                        >
                          <span />
                          {student.status}
                        </span>
                      </td>

                      <td className="students-admin-actions-cell">
                        <button
                          type="button"
                          className="students-admin-actions-trigger"
                          onClick={() =>
                            setActiveMenu(
                              (current) =>
                                current ===
                                student.id
                                  ? null
                                  : student.id,
                            )
                          }
                          aria-label={`Acciones para ${student.name}`}
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>

                        {activeMenu ===
                          student.id && (
                          <div className="students-admin-actions-menu">
                            <button
                              type="button"
                              onClick={() =>
                                openDetails(
                                  student,
                                )
                              }
                            >
                              <Eye size={16} />
                              <SSLocalized text={"Ver expediente"} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  student,
                                )
                              }
                            >
                              <Edit3
                                size={16}
                              />
                              <SSLocalized text={"Editar estudiante"} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(
                                  student,
                                )
                              }
                            >
                              {student.status ===
                              "Activo" ? (
                                <UserX
                                  size={16}
                                />
                              ) : (
                                <UserCheck
                                  size={16}
                                />
                              )}

                              {student.status ===
                              "Activo"
                                ? "Suspender"
                                : "Activar"}
                            </button>

                            <button
                              type="button"
                              className="students-admin-danger-action"
                              onClick={() =>
                                openDeleteModal(
                                  student,
                                )
                              }
                            >
                              <Trash2
                                size={16}
                              />
                              <SSLocalized text={"Eliminar estudiante"} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            {!isLoading &&
              filteredStudents.length ===
                0 && (
                <div className="students-admin-empty-state">
                  <GraduationCap
                    size={36}
                  />

                  <h3>
                    <SSLocalized text={"No encontramos estudiantes"} />
                  </h3>

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
        <div className="students-admin-notification">
          <Check size={18} />
          {notification}
        </div>
      )}

      {isModalOpen && (
        <div className="students-admin-modal-backdrop">
          <section className="students-admin-modal">
            <header>
              <div>
                <span>
                  {isEditing
                    ? "Administración académica"
                    : "Nuevo registro"}
                </span>

                <h2>
                  {isEditing
                    ? "Editar estudiante"
                    : "Crear estudiante"}
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
              <div className="students-admin-form-grid">
                <label>
                  <span>
                    <SSLocalized text={"Nombre completo *"} />
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Nombre y apellidos")}
                    required
                  />
                </label>

                <label>
                  <span>
                    <SSLocalized text={"Correo electrónico *"} />
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={ssI18n.t("estudiante@correo.com")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Teléfono"} /></span>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+57 300 000 0000"
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Curso *"} /></span>

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder={ssI18n.t("Ej. Matemáticas avanzadas")}
                    required
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Promedio"} /></span>

                  <input
                    type="number"
                    name="average"
                    min="0"
                    max="100"
                    value={
                      formData.average
                    }
                    onChange={handleChange}
                    placeholder="0 - 100"
                  />
                </label>

                <label>
                  <span><SSLocalized text={"Asistencia"} /></span>

                  <input
                    type="number"
                    name="attendance"
                    min="0"
                    max="100"
                    value={
                      formData.attendance
                    }
                    onChange={handleChange}
                    placeholder="0 - 100"
                  />
                </label>

                <label>
                  <span>
                    <SSLocalized text={"Estado de acceso"} />
                  </span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Activo">
                      <SSLocalized text={"Activo"} />
                    </option>

                    <option value="Suspendido">
                      <SSLocalized text={"Suspendido"} />
                    </option>
                  </select>
                </label>

                <label>
                  <span>
                    <SSLocalized text={"Estado académico"} />
                  </span>

                  <select
                    name="academicStatus"
                    value={
                      formData.academicStatus
                    }
                    onChange={handleChange}
                  >
                    <option value="Excelente">
                      <SSLocalized text={"Excelente"} />
                    </option>

                    <option value="Estable">
                      <SSLocalized text={"Estable"} />
                    </option>

                    <option value="Seguimiento">
                      <SSLocalized text={"Seguimiento"} />
                    </option>

                    <option value="Alerta">
                      <SSLocalized text={"Alerta"} />
                    </option>
                  </select>
                </label>
              </div>

              {formError && (
                <p className="students-admin-form-error">
                  {formError}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="students-admin-secondary-button"
                  onClick={closeModal}
                >
                  <SSLocalized text={"Cancelar"} />
                </button>

                <button
                  type="submit"
                  className="students-admin-primary-button"
                >
                  <Check size={17} />

                  {isEditing
                    ? "Guardar cambios"
                    : "Crear estudiante"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDetailsOpen &&
        selectedStudent && (
          <div className="students-admin-modal-backdrop">
            <section className="students-admin-details-modal">
              <header>
                <div className="students-admin-details-avatar">
                  {
                    selectedStudent.initials
                  }
                </div>

                <div>
                  <span>
                    <SSLocalized text={"Expediente académico"} />
                  </span>

                  <h2>
                    {selectedStudent.name}
                  </h2>

                  <p>
                    {
                      selectedStudent.course
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsDetailsOpen(
                      false,
                    )
                  }
                >
                  <X size={20} />
                </button>
              </header>

              <div className="students-admin-details-grid">
                <article>
                  <span><SSLocalized text={"Correo"} /></span>

                  <strong>
                    {
                      selectedStudent.email
                    }
                  </strong>
                </article>

                <article>
                  <span><SSLocalized text={"Teléfono"} /></span>

                  <strong>
                    {selectedStudent.phone ||
                      "No registrado"}
                  </strong>
                </article>

                <article>
                  <span><SSLocalized text={"Promedio"} /></span>

                  <strong>
                    {
                      selectedStudent.average
                    }
                    %
                  </strong>
                </article>

                <article>
                  <span><SSLocalized text={"Asistencia"} /></span>

                  <strong>
                    {
                      selectedStudent.attendance
                    }
                    %
                  </strong>
                </article>

                <article>
                  <span><SSLocalized text={"Informes"} /></span>

                  <strong>
                    {
                      selectedStudent.reports
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    <SSLocalized text={"Estado académico"} />
                  </span>

                  <strong>
                    {
                      selectedStudent.academicStatus
                    }
                  </strong>
                </article>

                <article>
                  <span><SSLocalized text={"Acceso"} /></span>

                  <strong>
                    {
                      selectedStudent.status
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    <SSLocalized text={"Último acceso"} />
                  </span>

                  <strong>
                    {
                      selectedStudent.lastAccess
                    }
                  </strong>
                </article>
              </div>

              <div className="students-admin-alert-box">
                <AlertTriangle
                  size={19}
                />

                <p>
                  <SSLocalized text={"Aquí se mostrarán observaciones, alertas, evidencias e informes asociados al estudiante."} />
                </p>
              </div>

              <footer>
                <button
                  type="button"
                  className="students-admin-primary-button"
                  onClick={() => {
                    const student =
                      selectedStudent;

                    setIsDetailsOpen(false);

                    openEditModal(
                      student,
                    );
                  }}
                >
                  <Edit3 size={17} />
                  <SSLocalized text={"Editar estudiante"} />
                </button>
              </footer>
            </section>
          </div>
        )}

      {isDeleteOpen &&
        selectedStudent && (
          <div className="students-admin-modal-backdrop">
            <section className="students-admin-delete-modal">
              <div>
                <Trash2 size={25} />
              </div>

              <h2>
                <SSLocalized text={"Eliminar estudiante"} />
              </h2>

              <p>
                <SSLocalized text={"Vas a eliminar a"} />{" "}
                <strong>
                  {
                    selectedStudent.name
                  }
                </strong>
                <SSLocalized text={". Esta acción no se puede deshacer."} />
              </p>

              <footer>
                <button
                  type="button"
                  className="students-admin-secondary-button"
                  onClick={() =>
                    setIsDeleteOpen(
                      false,
                    )
                  }
                >
                  <SSLocalized text={"Cancelar"} />
                </button>

                <button
                  type="button"
                  className="students-admin-delete-button"
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

export default EstudiantesAdmin;