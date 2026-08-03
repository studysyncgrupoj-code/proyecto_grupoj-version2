import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import './Cursos.css'

const courses = [
  {
    id: 1,
    title: 'JavaScript',
    category: 'Fundamentos y aplicaciones web',
    objective: 'Aprende JavaScript moderno con proyectos reales y patrones prácticos.',
    users: 42,
    premium: true,
    averageTime: '3h 20m',
    participation: '93%',
    lessons: 14,
    members: [
      { name: 'Ana', role: 'Programando' },
      { name: 'Luis', role: 'Depurando' },
      { name: 'Sara', role: 'Revisando' },
      { name: 'David', role: 'Testando' },
    ],
  },
  {
    id: 2,
    title: 'Python',
    category: 'Datos, automatización y ciencia',
    objective: 'Construye scripts útiles y automatiza tareas con Python.',
    users: 36,
    premium: false,
    averageTime: '2h 50m',
    participation: '88%',
    lessons: 12,
    members: [
      { name: 'Paula', role: 'Analizando' },
      { name: 'Mateo', role: 'Creando' },
      { name: 'Nora', role: 'Practicando' },
      { name: 'Iván', role: 'Depurando' },
    ],
  },
  {
    id: 3,
    title: 'CSS',
    category: 'Diseño web y estilos modernos',
    objective: 'Aprende a construir interfaces visuales responsive con buen diseño.',
    users: 28,
    premium: false,
    averageTime: '2h 10m',
    participation: '85%',
    lessons: 10,
    members: [
      { name: 'Caro', role: 'Estilando' },
      { name: 'Diego', role: 'Maquetando' },
      { name: 'Ale', role: 'Ajustando' },
      { name: 'Sofía', role: 'Optimizando' },
    ],
  },
  {
    id: 4,
    title: 'Java',
    category: 'Programación orientada a objetos',
    objective: 'Refuerza tus habilidades con Java y crea aplicaciones escalables.',
    users: 40,
    premium: true,
    averageTime: '3h 05m',
    participation: '90%',
    lessons: 13,
    members: [
      { name: 'Nico', role: 'Programando' },
      { name: 'Carla', role: 'Diseñando' },
      { name: 'Mauro', role: 'Evaluando' },
      { name: 'Lucía', role: 'Refactorizando' },
    ],
  },
  {
    id: 5,
    title: 'PHP',
    category: 'Back-end y servidores',
    objective: 'Crea sitios dinámicos con PHP y conecta datos en el servidor.',
    users: 24,
    premium: false,
    averageTime: '2h 35m',
    participation: '82%',
    lessons: 9,
    members: [
      { name: 'Daniel', role: 'Configurando' },
      { name: 'Elena', role: 'Integrando' },
      { name: 'Mario', role: 'Probando' },
      { name: 'Camila', role: 'Revisando' },
    ],
  },
  {
    id: 6,
    title: 'SQL',
    category: 'Consultas y bases de datos',
    objective: 'Domina consultas y modelos de datos en SQL.',
    users: 18,
    premium: false,
    averageTime: '1h 55m',
    participation: '80%',
    lessons: 8,
    members: [
      { name: 'Juli', role: 'Consultando' },
      { name: 'Pedro', role: 'Modelando' },
      { name: 'Rocío', role: 'Optimizando' },
      { name: 'Iván', role: 'Analizando' },
    ],
  },
  {
    id: 7,
    title: 'React',
    category: 'Interfaces dinámicas modernas',
    objective: 'Construye apps interactivas con hooks, rutas y componentes.',
    users: 30,
    premium: false,
    averageTime: '2h 45m',
    participation: '89%',
    lessons: 11,
    members: [
      { name: 'Lola', role: 'Creando' },
      { name: 'Bruno', role: 'Refactorizando' },
      { name: 'Renata', role: 'Probando' },
      { name: 'Alan', role: 'Deployando' },
    ],
  },
]

const initialMessages = [
  { author: 'Ana', text: '¿Alguien ya completó la práctica de hoy?' },
  { author: 'Luis', text: 'Estoy repasando los ejercicios del curso.' },
]

const defaultTasksByCourse = {
  1: [
    { id: 1, text: 'Revisar funciones avanzadas', done: false },
    { id: 2, text: 'Crear un proyecto con DOM', done: false },
    { id: 3, text: 'Resolver el reto de promesas', done: false },
  ],
  2: [
    { id: 1, text: 'Instalar librerías para datos', done: false },
    { id: 2, text: 'Escribir un script de automatización', done: false },
    { id: 3, text: 'Practicar con pandas', done: false },
  ],
  3: [
    { id: 1, text: 'Diseñar un layout responsive', done: false },
    { id: 2, text: 'Crear animaciones con CSS', done: false },
    { id: 3, text: 'Ajustar tipografías y colores', done: false },
  ],
  4: [
    { id: 1, text: 'Repasar clases y objetos', done: false },
    { id: 2, text: 'Construir un mini proyecto Java', done: false },
    { id: 3, text: 'Practicar herencia', done: false },
  ],
  5: [
    { id: 1, text: 'Configurar un servidor local', done: false },
    { id: 2, text: 'Crear CRUD con formularios', done: false },
    { id: 3, text: 'Validar datos de usuario', done: false },
  ],
  6: [
    { id: 1, text: 'Escribir consultas SELECT', done: false },
    { id: 2, text: 'Relacionar tablas', done: false },
    { id: 3, text: 'Optimizar consultas', done: false },
  ],
  7: [
    { id: 1, text: 'Crear componentes reutilizables', done: false },
    { id: 2, text: 'Configurar rutas con React Router', done: false },
    { id: 3, text: 'Gestionar estado con hooks', done: false },
  ],
}

function Cursos() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todas')
  const [activeCourse, setActiveCourse] = useState(null)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)

      if (!matchesSearch) return false
      if (filter === 'Premium') return course.premium
      return true
    })
  }, [search, filter])

  const openCourse = (course) => {
    setActiveCourse(course)
    setTasks(defaultTasksByCourse[course.id] || [])
    setMessages(initialMessages)
    setDraft('')
  }

  const leaveCourse = () => {
    setActiveCourse(null)
    setTasks([])
    setMessages(initialMessages)
    setDraft('')
  }

  const sendMessage = () => {
    if (!draft.trim()) return
    setMessages((current) => [...current, { author: 'Tú', text: draft.trim() }])
    setDraft('')
  }

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  const addTask = () => {
    const content = newTask.trim()
    if (!content) return
    setTasks((current) => [
      ...current,
      { id: current.length + 1, text: content, done: false },
    ])
    setNewTask('')
  }

  const activeCourses = filteredCourses.length
  const totalStudents = filteredCourses.reduce((sum, course) => sum + course.users, 0)
  const premiumCourses = filteredCourses.filter((course) => course.premium).length

  return (
    <div className="cursos-page">
      <div className="cursos-app-shell">
        <aside className="cursos-sidebar">
          <div className="cursos-brand">
            <div className="cursos-brand-logo">C</div>
            <div>
              <p className="cursos-brand-title">StudyCursos</p>
              <p className="cursos-brand-subtitle">Cursos disponibles</p>
            </div>
          </div>

          <nav className="cursos-sidebar-nav">
            <Link to="/cursos" className="cursos-sidebar-link cursos-active">Cursos</Link>
            <Link to="/" className="cursos-sidebar-link">Inicio</Link>
            <Link to="/salas" className="cursos-sidebar-link">Salas</Link>
            <a href="#" className="cursos-sidebar-link">Planes</a>
            <a href="#" className="cursos-sidebar-link">Eventos</a>
            <a href="#" className="cursos-sidebar-link">Soporte</a>
          </nav>
        </aside>

        <main className="cursos-main-panel">
          {activeCourse ? (
            <div className="cursos-course-detail-grid">
              <section className="cursos-course-detail-main">
                <div className="cursos-course-detail-header">
                  <button className="cursos-back-button" type="button" onClick={leaveCourse}>
                    ← Volver
                  </button>
                  <div>
                    <p className="cursos-eyebrow">Curso activo</p>
                    <h1>{activeCourse.title}</h1>
                    <p className="cursos-description">{activeCourse.category}</p>
                  </div>
                </div>

                <div className="cursos-course-objective-card">
                  <p className="cursos-section-label">Objetivo del curso</p>
                  <p>{activeCourse.objective}</p>
                </div>

                <div className="cursos-task-card">
                  <div className="cursos-task-card-header">
                    <div>
                      <p className="cursos-section-label">Agenda de estudio</p>
                      <p className="cursos-task-summary">{tasks.filter((task) => task.done).length}/{tasks.length} completadas</p>
                    </div>
                  </div>
                  <ul className="cursos-task-list">
                    {tasks.map((task) => (
                      <li key={task.id} className="cursos-task-item">
                        <button
                          type="button"
                          className={`cursos-task-checkbox ${task.done ? 'cursos-done' : ''}`}
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.done ? '✓' : ''}
                        </button>
                        <span className={task.done ? 'cursos-task-done' : ''}>{task.text}</span>
                      </li>
                    ))}
                    {tasks.length === 0 && (
                      <li className="cursos-task-empty">No hay tareas definidas para este curso.</li>
                    )}
                  </ul>
                  <div className="cursos-task-input-row">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(event) => setNewTask(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          addTask()
                        }
                      }}
                      placeholder="Añadir tarea del curso..."
                    />
                    <button className="cursos-add-task-button" type="button" onClick={addTask}>Agregar</button>
                  </div>
                </div>

                <div className="cursos-kpi-grid">
                  <article className="cursos-kpi-card">
                    <span>Duración estimada</span>
                    <strong>{activeCourse.averageTime}</strong>
                  </article>
                  <article className="cursos-kpi-card">
                    <span>Participación</span>
                    <strong>{activeCourse.participation}</strong>
                  </article>
                  <article className="cursos-kpi-card">
                    <span>Lecciones</span>
                    <strong>{activeCourse.lessons}</strong>
                  </article>
                </div>

                <div className="cursos-member-grid">
                  {activeCourse.members.map((member) => (
                    <article key={member.name} className="cursos-member-card">
                      <div className="cursos-member-avatar">{member.name.charAt(0)}</div>
                      <div>
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cursos-chat-panel">
                  <div className="cursos-chat-header">
                    <h2>Chat del curso</h2>
                  </div>
                  <div className="cursos-chat-messages">
                    {messages.map((message, index) => (
                      <div key={index} className="cursos-chat-message">
                        <strong>{message.author}:</strong>
                        <span>{message.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="cursos-chat-input-row">
                    <input
                      type="text"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Escribe un mensaje..."
                    />
                    <button className="cursos-send-button" type="button" onClick={sendMessage}>Enviar</button>
                  </div>
                </div>
              </section>

              <aside className="cursos-course-sidebar">
                <div className="cursos-status-pill cursos-focus-pill">EN CURSO</div>
                <div className="cursos-course-summary-card">
                  <h3>Resumen del curso</h3>
                  <p>{activeCourse.title} • {activeCourse.category}</p>
                  <div className="cursos-summary-list">
                    <span>{activeCourse.users} alumnos</span>
                    <span>{activeCourse.premium ? 'Premium' : 'Regular'}</span>
                  </div>
                </div>
                <button className="cursos-exit-button" type="button" onClick={() => navigate('/')}>Ir a inicio</button>
              </aside>
            </div>
          ) : (
            <>
              <header className="cursos-main-header">
                <div>
                  <p className="cursos-eyebrow">Cursos destacados</p>
                  <h1>Encuentra cursos rápidos y prácticos</h1>
                  <p className="cursos-description">Explora nuestra oferta de cursos y selecciona los que más te ayuden a avanzar.</p>
                </div>
                <div className="cursos-stats-row">
                  <div className="cursos-stat-box">
                    <span>Cursos disponibles</span>
                    <strong>{activeCourses}</strong>
                  </div>
                  <div className="cursos-stat-box">
                    <span>Estudiantes activos</span>
                    <strong>{totalStudents}</strong>
                  </div>
                  <div className="cursos-stat-box">
                    <span>Cursos Premium</span>
                    <strong>{premiumCourses}</strong>
                  </div>
                </div>
              </header>

              <div className="cursos-main-topbar">
                <div className="cursos-topbar-status">
                  <span className="cursos-status-dot" /> Cursos en vivo · {activeCourses} disponibles
                </div>
                <div className="cursos-topbar-actions">
                  <button className="cursos-action-pill" type="button" onClick={() => setFilter('Premium')}>
                    Ver Premium
                  </button>
                  <button className="cursos-action-button" type="button" onClick={() => setFilter('Todas')}>
                    Todos los cursos
                  </button>
                </div>
              </div>

              <section className="cursos-filter-bar">
                <div className="cursos-search-box">
                  <input
                    type="text"
                    placeholder="Buscar curso..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="cursos-filter-chips">
                  {['Todas', 'Premium'].map((option) => (
                    <button
                      key={option}
                      className={`cursos-chip ${filter === option ? 'cursos-active' : ''}`}
                      onClick={() => setFilter(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>

              <section className="cursos-cards-grid">
                {filteredCourses.length === 0 ? (
                  <div className="cursos-empty-state">No se encontraron cursos con esa búsqueda.</div>
                ) : (
                  filteredCourses.map((course) => (
                    <article key={course.id} className="cursos-course-card">
                      <div className="cursos-course-banner">
                        <span className={`cursos-banner-label ${course.premium ? 'cursos-premium' : 'cursos-regular'}`}>
                          {course.premium ? 'PREMIUM' : 'STANDARD'}
                        </span>
                      </div>
                      <div className="cursos-course-content">
                        <div>
                          <h2>{course.title}</h2>
                          <p>{course.category}</p>
                        </div>
                        <div className="cursos-course-meta">
                          <span>{course.users} conectados</span>
                          <span>{course.participation} participación</span>
                        </div>
                        <button className="cursos-join-button" type="button" onClick={() => openCourse(course)}>
                          Ver curso
                        </button>
                      </div>
                    </article>
                  ))) }
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Cursos;
