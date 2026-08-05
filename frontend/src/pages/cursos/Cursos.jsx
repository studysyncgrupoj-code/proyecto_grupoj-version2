import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Clock3,
  Crown,
  Flame,
  GraduationCap,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import "./Cursos.css";

const courses = [
  {
    id: 1,
    title: "JavaScript",
    category: "Fundamentos y aplicaciones web",
    objective:
      "Aprende JavaScript moderno con proyectos reales, patrones prácticos y ejercicios guiados.",
    users: 42,
    premium: true,
    featured: true,
    averageTime: "3h 20m",
    participation: 93,
    lessons: 14,
    progress: 78,
    rating: 4.9,
    level: "Intermedio",
    instructor: "Camilo Parra",
    members: [
      { name: "Ana", role: "Programando" },
      { name: "Luis", role: "Depurando" },
      { name: "Sara", role: "Revisando" },
      { name: "David", role: "Probando" },
    ],
  },
  {
    id: 2,
    title: "Python",
    category: "Datos, automatización y ciencia",
    objective:
      "Construye scripts útiles, automatiza tareas y comienza a trabajar con análisis de datos.",
    users: 36,
    premium: false,
    featured: true,
    averageTime: "2h 50m",
    participation: 88,
    lessons: 12,
    progress: 64,
    rating: 4.8,
    level: "Inicial",
    instructor: "María López",
    members: [
      { name: "Paula", role: "Analizando" },
      { name: "Mateo", role: "Creando" },
      { name: "Nora", role: "Practicando" },
      { name: "Iván", role: "Depurando" },
    ],
  },
  {
    id: 3,
    title: "CSS",
    category: "Diseño web y estilos modernos",
    objective:
      "Aprende a construir interfaces visuales responsive con una identidad moderna y consistente.",
    users: 28,
    premium: false,
    featured: false,
    averageTime: "2h 10m",
    participation: 85,
    lessons: 10,
    progress: 56,
    rating: 4.7,
    level: "Inicial",
    instructor: "Laura Méndez",
    members: [
      { name: "Caro", role: "Estilando" },
      { name: "Diego", role: "Maquetando" },
      { name: "Ale", role: "Ajustando" },
      { name: "Sofía", role: "Optimizando" },
    ],
  },
  {
    id: 4,
    title: "Java",
    category: "Programación orientada a objetos",
    objective:
      "Refuerza tus habilidades con Java y crea aplicaciones mantenibles y escalables.",
    users: 40,
    premium: true,
    featured: true,
    averageTime: "3h 05m",
    participation: 90,
    lessons: 13,
    progress: 72,
    rating: 4.9,
    level: "Avanzado",
    instructor: "Andrés Gómez",
    members: [
      { name: "Nico", role: "Programando" },
      { name: "Carla", role: "Diseñando" },
      { name: "Mauro", role: "Evaluando" },
      { name: "Lucía", role: "Refactorizando" },
    ],
  },
  {
    id: 5,
    title: "PHP",
    category: "Back-end y servidores",
    objective:
      "Crea sitios dinámicos con PHP, administra formularios y conecta datos en el servidor.",
    users: 24,
    premium: false,
    featured: false,
    averageTime: "2h 35m",
    participation: 82,
    lessons: 9,
    progress: 48,
    rating: 4.5,
    level: "Intermedio",
    instructor: "Carlos Ruiz",
    members: [
      { name: "Daniel", role: "Configurando" },
      { name: "Elena", role: "Integrando" },
      { name: "Mario", role: "Probando" },
      { name: "Camila", role: "Revisando" },
    ],
  },
  {
    id: 6,
    title: "SQL",
    category: "Consultas y bases de datos",
    objective:
      "Domina consultas, relaciones y optimización básica de modelos de datos en SQL.",
    users: 18,
    premium: false,
    featured: false,
    averageTime: "1h 55m",
    participation: 80,
    lessons: 8,
    progress: 44,
    rating: 4.6,
    level: "Inicial",
    instructor: "Natalia Pérez",
    members: [
      { name: "Juli", role: "Consultando" },
      { name: "Pedro", role: "Modelando" },
      { name: "Rocío", role: "Optimizando" },
      { name: "Iván", role: "Analizando" },
    ],
  },
  {
    id: 7,
    title: "React",
    category: "Interfaces dinámicas modernas",
    objective:
      "Construye aplicaciones interactivas con hooks, rutas y componentes reutilizables.",
    users: 30,
    premium: true,
    featured: true,
    averageTime: "2h 45m",
    participation: 89,
    lessons: 11,
    progress: 68,
    rating: 4.9,
    level: "Intermedio",
    instructor: "Sofía Torres",
    members: [
      { name: "Lola", role: "Creando" },
      { name: "Bruno", role: "Refactorizando" },
      { name: "Renata", role: "Probando" },
      { name: "Alan", role: "Desplegando" },
    ],
  },
];

const initialMessages = [
  { author: "Ana", text: "¿Alguien ya completó la práctica de hoy?" },
  { author: "Luis", text: "Estoy repasando los ejercicios del curso." },
];

const defaultTasksByCourse = {
  1: [
    { id: 1, text: "Revisar funciones avanzadas", done: false },
    { id: 2, text: "Crear un proyecto con DOM", done: false },
    { id: 3, text: "Resolver el reto de promesas", done: false },
  ],
  2: [
    { id: 1, text: "Instalar librerías para datos", done: false },
    { id: 2, text: "Escribir un script de automatización", done: false },
    { id: 3, text: "Practicar con pandas", done: false },
  ],
  3: [
    { id: 1, text: "Diseñar un layout responsive", done: false },
    { id: 2, text: "Crear animaciones con CSS", done: false },
    { id: 3, text: "Ajustar tipografías y colores", done: false },
  ],
  4: [
    { id: 1, text: "Repasar clases y objetos", done: false },
    { id: 2, text: "Construir un mini proyecto Java", done: false },
    { id: 3, text: "Practicar herencia", done: false },
  ],
  5: [
    { id: 1, text: "Configurar un servidor local", done: false },
    { id: 2, text: "Crear CRUD con formularios", done: false },
    { id: 3, text: "Validar datos de usuario", done: false },
  ],
  6: [
    { id: 1, text: "Escribir consultas SELECT", done: false },
    { id: 2, text: "Relacionar tablas", done: false },
    { id: 3, text: "Optimizar consultas", done: false },
  ],
  7: [
    { id: 1, text: "Crear componentes reutilizables", done: false },
    { id: 2, text: "Configurar rutas con React Router", done: false },
    { id: 3, text: "Gestionar estado con hooks", done: false },
  ],
};

const filters = ["Todos", "Premium", "Destacados", "En progreso"];

function Cursos() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [activeCourse, setActiveCourse] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (filter === "Premium") return course.premium;
      if (filter === "Destacados") return course.featured;
      if (filter === "En progreso") return course.progress > 0;
      return true;
    });
  }, [search, filter]);

  const totalStudents = courses.reduce((sum, course) => sum + course.users, 0);
  const premiumCourses = courses.filter((course) => course.premium).length;
  const averageParticipation = Math.round(
    courses.reduce((sum, course) => sum + course.participation, 0) /
      courses.length
  );

  const openCourse = (course) => {
    setActiveCourse(course);
    setTasks(defaultTasksByCourse[course.id] || []);
    setMessages(initialMessages);
    setDraft("");
    setNewTask("");
  };

  const leaveCourse = () => {
    setActiveCourse(null);
    setTasks([]);
    setMessages(initialMessages);
    setDraft("");
    setNewTask("");
  };

  const sendMessage = () => {
    const message = draft.trim();

    if (!message) return;

    setMessages((current) => [
      ...current,
      { author: "Tú", text: message },
    ]);
    setDraft("");
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const addTask = () => {
    const content = newTask.trim();

    if (!content) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), text: content, done: false },
    ]);
    setNewTask("");
  };

  return (
    <div className="courses-layout">
      <Sidebar />

      <main className="courses-content">
        {activeCourse ? (
          <section className="course-detail-view">
            <header className="course-detail-header">
              <button
                type="button"
                className="course-back-button"
                onClick={leaveCourse}
              >
                <ArrowLeft size={18} />
                Volver a cursos
              </button>

              <div className="course-detail-heading">
                <div>
                  <span className="courses-eyebrow">
                    <Sparkles size={14} />
                    Curso activo
                  </span>

                  <h1>{activeCourse.title}</h1>
                  <p>{activeCourse.category}</p>
                </div>

                <div className="course-detail-badges">
                  <span>
                    <GraduationCap size={15} />
                    {activeCourse.level}
                  </span>

                  {activeCourse.premium && (
                    <span className="course-premium-badge">
                      <Crown size={15} />
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </header>

            <div className="course-detail-grid">
              <div className="course-detail-main">
                <article className="course-objective-card">
                  <div className="course-section-heading">
                    <div>
                      <span>OBJETIVO DEL CURSO</span>
                      <h2>Ruta de aprendizaje</h2>
                    </div>

                    <BookOpen size={22} />
                  </div>

                  <p>{activeCourse.objective}</p>
                </article>

                <section className="course-task-card">
                  <div className="course-section-heading">
                    <div>
                      <span>AGENDA DE ESTUDIO</span>
                      <h2>
                        {tasks.filter((task) => task.done).length}/{tasks.length} tareas completadas
                      </h2>
                    </div>

                    <Check size={22} />
                  </div>

                  <div className="course-task-list">
                    {tasks.map((task) => (
                      <article
                        key={task.id}
                        className={`course-task-item ${
                          task.done ? "course-task-item-done" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          aria-label={
                            task.done
                              ? "Marcar como pendiente"
                              : "Marcar como completada"
                          }
                        >
                          {task.done && <Check size={14} />}
                        </button>

                        <span>{task.text}</span>
                      </article>
                    ))}
                  </div>

                  <div className="course-task-input">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(event) => setNewTask(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTask();
                        }
                      }}
                      placeholder="Añadir una tarea del curso..."
                    />

                    <button type="button" onClick={addTask}>
                      <Plus size={17} />
                      Agregar
                    </button>
                  </div>
                </section>

                <section className="course-member-grid">
                  {activeCourse.members.map((member) => (
                    <article key={member.name} className="course-member-card">
                      <div>{member.name.charAt(0)}</div>

                      <div>
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="course-chat-panel">
                  <div className="course-section-heading">
                    <div>
                      <span>COMUNIDAD</span>
                      <h2>Chat del curso</h2>
                    </div>

                    <MessageCircle size={22} />
                  </div>

                  <div className="course-chat-messages">
                    {messages.map((message, index) => (
                      <article key={`${message.author}-${index}`}>
                        <strong>{message.author}</strong>
                        <p>{message.text}</p>
                      </article>
                    ))}

                    <div ref={chatEndRef} />
                  </div>

                  <div className="course-chat-input">
                    <input
                      type="text"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Escribe un mensaje..."
                    />

                    <button type="button" onClick={sendMessage}>
                      Enviar
                    </button>
                  </div>
                </section>
              </div>

              <aside className="course-detail-sidebar">
                <article className="course-progress-card">
                  <div className="course-section-heading">
                    <div>
                      <span>PROGRESO</span>
                      <h2>{activeCourse.progress}% completado</h2>
                    </div>

                    <TrendingUp size={22} />
                  </div>

                  <div className="course-progress-track">
                    <span style={{ width: `${activeCourse.progress}%` }} />
                  </div>

                  <div className="course-progress-data">
                    <span>{activeCourse.lessons} lecciones</span>
                    <span>{activeCourse.averageTime}</span>
                  </div>
                </article>

                <article className="course-instructor-card">
                  <span>INSTRUCTOR</span>
                  <div>
                    <div>{activeCourse.instructor.charAt(0)}</div>
                    <section>
                      <h3>{activeCourse.instructor}</h3>
                      <p>Docente principal</p>
                    </section>
                  </div>
                </article>

                <article className="course-metrics-card">
                  <div>
                    <Users size={18} />
                    <span>Estudiantes</span>
                    <strong>{activeCourse.users}</strong>
                  </div>

                  <div>
                    <Flame size={18} />
                    <span>Participación</span>
                    <strong>{activeCourse.participation}%</strong>
                  </div>

                  <div>
                    <Star size={18} />
                    <span>Valoración</span>
                    <strong>{activeCourse.rating}</strong>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        ) : (
          <>
            <header className="courses-header">
              <div>
                <span className="courses-eyebrow">
                  <Sparkles size={14} />
                  Catálogo StudySync
                </span>

                <h1>Cursos</h1>

                <p>
                  Encuentra rutas de aprendizaje prácticas, mide tu progreso y
                  estudia con una comunidad activa.
                </p>
              </div>

              <button type="button" className="courses-create-button">
                <Plus size={18} />
                Crear curso
              </button>
            </header>

            <section className="courses-summary-grid">
              <article>
                <BookOpen size={21} />
                <div>
                  <span>Cursos disponibles</span>
                  <strong>{courses.length}</strong>
                  <small>Catálogo activo</small>
                </div>
              </article>

              <article>
                <Users size={21} />
                <div>
                  <span>Estudiantes activos</span>
                  <strong>{totalStudents}</strong>
                  <small>Comunidad conectada</small>
                </div>
              </article>

              <article>
                <Crown size={21} />
                <div>
                  <span>Cursos Premium</span>
                  <strong>{premiumCourses}</strong>
                  <small>Contenido exclusivo</small>
                </div>
              </article>

              <article>
                <TrendingUp size={21} />
                <div>
                  <span>Participación media</span>
                  <strong>{averageParticipation}%</strong>
                  <small>Rendimiento global</small>
                </div>
              </article>
            </section>

            <section className="courses-toolbar">
              <label className="courses-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Buscar por curso, categoría o instructor..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <div className="courses-filter-group">
                {filters.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={filter === option ? "active" : ""}
                    onClick={() => setFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section className="courses-section-heading">
              <div>
                <span>EXPLORAR</span>
                <h2>Rutas de aprendizaje</h2>
              </div>

              <p>{filteredCourses.length} resultados</p>
            </section>

            {filteredCourses.length === 0 ? (
              <section className="courses-empty-state">
                <Search size={28} />
                <h3>No encontramos cursos</h3>
                <p>
                  Prueba con otro término o cambia los filtros seleccionados.
                </p>
              </section>
            ) : (
              <section className="courses-grid">
                {filteredCourses.map((course) => (
                  <article key={course.id} className="course-card">
                    <div className="course-card-cover">
                      <div className="course-card-icon">
                        <BookOpen size={24} />
                      </div>

                      <div className="course-card-badges">
                        {course.featured && (
                          <span className="course-featured-badge">
                            <Sparkles size={13} />
                            Destacado
                          </span>
                        )}

                        {course.premium && (
                          <span className="course-premium-badge">
                            <Crown size={13} />
                            Premium
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="course-card-body">
                      <div className="course-card-title-row">
                        <div>
                          <span>{course.level}</span>
                          <h3>{course.title}</h3>
                        </div>

                        <div className="course-rating">
                          <Star size={14} />
                          {course.rating}
                        </div>
                      </div>

                      <p>{course.category}</p>

                      <div className="course-card-progress">
                        <div>
                          <span>Progreso</span>
                          <strong>{course.progress}%</strong>
                        </div>

                        <div className="course-progress-track">
                          <span style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>

                      <div className="course-card-metrics">
                        <span>
                          <Users size={15} />
                          {course.users}
                        </span>

                        <span>
                          <Clock3 size={15} />
                          {course.averageTime}
                        </span>

                        <span>
                          <BookOpen size={15} />
                          {course.lessons}
                        </span>
                      </div>

                      <footer className="course-card-footer">
                        <div>
                          <span>Instructor</span>
                          <strong>{course.instructor}</strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => openCourse(course)}
                        >
                          Ver curso
                        </button>
                      </footer>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Cursos;