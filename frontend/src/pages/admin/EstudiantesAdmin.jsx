import { useMemo, useState } from "react";
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

const initialStudents = [
  {
    id: 1,
    name: "Ana Martínez",
    initials: "AM",
    email: "ana.martinez@studysync.com",
    phone: "+57 310 824 5687",
    course: "Matemáticas avanzadas",
    average: 92,
    attendance: 96,
    reports: 2,
    status: "Activo",
    academicStatus: "Excelente",
    lastAccess: "Hoy, 8:20 p. m.",
  },
  {
    id: 2,
    name: "Carlos Ramírez",
    initials: "CR",
    email: "carlos.ramirez@studysync.com",
    phone: "+57 315 689 4578",
    course: "Cálculo diferencial",
    average: 78,
    attendance: 88,
    reports: 1,
    status: "Activo",
    academicStatus: "Seguimiento",
    lastAccess: "Hoy, 6:35 p. m.",
  },
  {
    id: 3,
    name: "María González",
    initials: "MG",
    email: "maria.gonzalez@studysync.com",
    phone: "+57 301 568 9742",
    course: "Física aplicada",
    average: 86,
    attendance: 94,
    reports: 0,
    status: "Activo",
    academicStatus: "Estable",
    lastAccess: "Hace 42 min",
  },
  {
    id: 4,
    name: "Luis Herrera",
    initials: "LH",
    email: "luis.herrera@studysync.com",
    phone: "+57 320 476 8521",
    course: "Álgebra lineal",
    average: 64,
    attendance: 72,
    reports: 3,
    status: "Suspendido",
    academicStatus: "Alerta",
    lastAccess: "Hace 9 días",
  },
  {
    id: 5,
    name: "Sofía López",
    initials: "SL",
    email: "sofia.lopez@studysync.com",
    phone: "+57 312 785 4690",
    course: "Programación básica",
    average: 89,
    attendance: 97,
    reports: 1,
    status: "Activo",
    academicStatus: "Excelente",
    lastAccess: "Ayer, 9:10 p. m.",
  },
];

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
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function EstudiantesAdmin() {
  const [students, setStudents] = useState(initialStudents);
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

  const statistics = useMemo(() => {
    const active = students.filter(
      (student) => student.status === "Activo",
    ).length;

    const suspended = students.filter(
      (student) => student.status === "Suspendido",
    ).length;

    const average = Math.round(
      students.reduce(
        (accumulator, student) =>
          accumulator + student.average,
        0,
      ) / students.length,
    );

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
      ...new Set(students.map((student) => student.course)),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !normalizedSearch ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch) ||
        student.course.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        student.status === statusFilter;

      const matchesCourse =
        courseFilter === "Todos" ||
        student.course === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, searchTerm, statusFilter, courseFilter]);

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
      phone: student.phone,
      course: student.course,
      average: String(student.average),
      attendance: String(student.attendance),
      status: student.status,
      academicStatus: student.academicStatus,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const average = Math.min(
      100,
      Math.max(0, Number(formData.average) || 0),
    );

    const attendance = Math.min(
      100,
      Math.max(0, Number(formData.attendance) || 0),
    );

    if (isEditing && selectedStudent) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                name: formData.name.trim(),
                initials: getInitials(formData.name),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                course: formData.course.trim(),
                average,
                attendance,
                status: formData.status,
                academicStatus: formData.academicStatus,
              }
            : student,
        ),
      );

      showNotification(
        "Estudiante actualizado correctamente.",
      );
    } else {
      const newStudent = {
        id: Date.now(),
        name: formData.name.trim(),
        initials: getInitials(formData.name),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.course.trim(),
        average,
        attendance,
        reports: 0,
        status: formData.status,
        academicStatus: formData.academicStatus,
        lastAccess: "Sin iniciar sesión",
      };

      setStudents((currentStudents) => [
        newStudent,
        ...currentStudents,
      ]);

      showNotification(
        "Estudiante creado correctamente.",
      );
    }

    closeModal();
  };

  const toggleStatus = (student) => {
    const nextStatus =
      student.status === "Activo"
        ? "Suspendido"
        : "Activo";

    setStudents((currentStudents) =>
      currentStudents.map((currentStudent) =>
        currentStudent.id === student.id
          ? {
              ...currentStudent,
              status: nextStatus,
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

  const handleDelete = () => {
    if (!selectedStudent) {
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.filter(
        (student) => student.id !== selectedStudent.id,
      ),
    );

    setSelectedStudent(null);
    setIsDeleteOpen(false);

    showNotification(
      "Estudiante eliminado correctamente.",
    );
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
              Gestión institucional
            </span>

            <h1>Estudiantes</h1>

            <p>
              Supervisa expedientes, rendimiento, asistencia, alertas y
              estado general de los estudiantes.
            </p>
          </div>

          <button
            type="button"
            className="students-admin-create-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nuevo estudiante
          </button>
        </header>

        <section className="students-admin-statistics">
          <article>
            <div>
              <Users size={22} />
            </div>
            <span>Total estudiantes</span>
            <strong>{statistics.total}</strong>
            <small>Registrados en StudySync</small>
          </article>

          <article>
            <div>
              <UserCheck size={22} />
            </div>
            <span>Estudiantes activos</span>
            <strong>{statistics.active}</strong>
            <small>Con acceso habilitado</small>
          </article>

          <article>
            <div>
              <UserX size={22} />
            </div>
            <span>Suspendidos</span>
            <strong>{statistics.suspended}</strong>
            <small>Requieren revisión</small>
          </article>

          <article>
            <div>
              <TrendingUp size={22} />
            </div>
            <span>Promedio general</span>
            <strong>{statistics.average}%</strong>
            <small>Rendimiento académico</small>
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
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar estudiante, correo o curso..."
              />
            </div>

            <div className="students-admin-filters">
              <select
                value={courseFilter}
                onChange={(event) =>
                  setCourseFilter(event.target.value)
                }
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course === "Todos"
                      ? "Todos los cursos"
                      : course}
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
                <option value="Suspendido">
                  Suspendido
                </option>
              </select>

              {(searchTerm ||
                courseFilter !== "Todos" ||
                statusFilter !== "Todos") && (
                <button
                  type="button"
                  className="students-admin-clear-button"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="students-admin-table-heading">
            <div>
              <span>Directorio académico</span>
              <h2>Estudiantes registrados</h2>
            </div>

            <small>
              {filteredStudents.length} resultado
              {filteredStudents.length === 1 ? "" : "s"}
            </small>
          </div>

          <div className="students-admin-table-wrapper">
            <table className="students-admin-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Promedio</th>
                  <th>Asistencia</th>
                  <th>Informes</th>
                  <th>Estado académico</th>
                  <th>Acceso</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="students-admin-user-cell">
                        <div className="students-admin-avatar">
                          {student.initials}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                          <span>
                            <Mail size={13} />
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="students-admin-course">
                        <BookOpen size={14} />
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
                        {student.attendance}%
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
                        {student.academicStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`students-admin-status ${
                          student.status === "Activo"
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
                          setActiveMenu((current) =>
                            current === student.id
                              ? null
                              : student.id,
                          )
                        }
                        aria-label={`Acciones para ${student.name}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === student.id && (
                        <div className="students-admin-actions-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openDetails(student)
                            }
                          >
                            <Eye size={16} />
                            Ver expediente
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(student)
                            }
                          >
                            <Edit3 size={16} />
                            Editar estudiante
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(student)
                            }
                          >
                            {student.status === "Activo" ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}

                            {student.status === "Activo"
                              ? "Suspender"
                              : "Activar"}
                          </button>

                          <button
                            type="button"
                            className="students-admin-danger-action"
                            onClick={() =>
                              openDeleteModal(student)
                            }
                          >
                            <Trash2 size={16} />
                            Eliminar estudiante
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="students-admin-empty-state">
                <GraduationCap size={36} />

                <h3>No encontramos estudiantes</h3>

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
                    placeholder="estudiante@correo.com"
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
                  <span>Curso *</span>

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="Ej. Matemáticas avanzadas"
                    required
                  />
                </label>

                <label>
                  <span>Promedio</span>

                  <input
                    type="number"
                    name="average"
                    min="0"
                    max="100"
                    value={formData.average}
                    onChange={handleChange}
                    placeholder="0 - 100"
                  />
                </label>

                <label>
                  <span>Asistencia</span>

                  <input
                    type="number"
                    name="attendance"
                    min="0"
                    max="100"
                    value={formData.attendance}
                    onChange={handleChange}
                    placeholder="0 - 100"
                  />
                </label>

                <label>
                  <span>Estado de acceso</span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Activo">
                      Activo
                    </option>

                    <option value="Suspendido">
                      Suspendido
                    </option>
                  </select>
                </label>

                <label>
                  <span>Estado académico</span>

                  <select
                    name="academicStatus"
                    value={formData.academicStatus}
                    onChange={handleChange}
                  >
                    <option value="Excelente">
                      Excelente
                    </option>

                    <option value="Estable">
                      Estable
                    </option>

                    <option value="Seguimiento">
                      Seguimiento
                    </option>

                    <option value="Alerta">
                      Alerta
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
                  Cancelar
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

      {isDetailsOpen && selectedStudent && (
        <div className="students-admin-modal-backdrop">
          <section className="students-admin-details-modal">
            <header>
              <div className="students-admin-details-avatar">
                {selectedStudent.initials}
              </div>

              <div>
                <span>Expediente académico</span>
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.course}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="students-admin-details-grid">
              <article>
                <span>Correo</span>
                <strong>{selectedStudent.email}</strong>
              </article>

              <article>
                <span>Teléfono</span>
                <strong>
                  {selectedStudent.phone ||
                    "No registrado"}
                </strong>
              </article>

              <article>
                <span>Promedio</span>
                <strong>
                  {selectedStudent.average}%
                </strong>
              </article>

              <article>
                <span>Asistencia</span>
                <strong>
                  {selectedStudent.attendance}%
                </strong>
              </article>

              <article>
                <span>Informes</span>
                <strong>
                  {selectedStudent.reports}
                </strong>
              </article>

              <article>
                <span>Estado académico</span>
                <strong>
                  {selectedStudent.academicStatus}
                </strong>
              </article>

              <article>
                <span>Acceso</span>
                <strong>
                  {selectedStudent.status}
                </strong>
              </article>

              <article>
                <span>Último acceso</span>
                <strong>
                  {selectedStudent.lastAccess}
                </strong>
              </article>
            </div>

            <div className="students-admin-alert-box">
              <AlertTriangle size={19} />

              <p>
                Aquí se mostrarán observaciones, alertas,
                evidencias e informes asociados al estudiante.
              </p>
            </div>

            <footer>
              <button
                type="button"
                className="students-admin-primary-button"
                onClick={() => {
                  const student = selectedStudent;
                  setIsDetailsOpen(false);
                  openEditModal(student);
                }}
              >
                <Edit3 size={17} />
                Editar estudiante
              </button>
            </footer>
          </section>
        </div>
      )}

      {isDeleteOpen && selectedStudent && (
        <div className="students-admin-modal-backdrop">
          <section className="students-admin-delete-modal">
            <div>
              <Trash2 size={25} />
            </div>

            <h2>Eliminar estudiante</h2>

            <p>
              Vas a eliminar a{" "}
              <strong>{selectedStudent.name}</strong>. Esta acción
              no se puede deshacer.
            </p>

            <footer>
              <button
                type="button"
                className="students-admin-secondary-button"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="students-admin-delete-button"
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

export default EstudiantesAdmin;