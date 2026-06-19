import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import './Salas.css'

const rooms = [
  {
    id: 1,
    title: 'Matemáticas',
    category: 'Álgebra y cálculo colaborativo',
    objective: 'Resolver ejercicios de derivadas parciales y reforzar técnicas de integración para el examen final.',
    users: 12,
    focus: true,
    premium: false,
    averageTime: '2h 14m',
    participation: '87%',
    pomodoros: 32,
    members: [
      { name: 'Ana', role: 'Estudiando' },
      { name: 'Luis', role: 'Estudiando' },
      { name: 'Carlos', role: 'Estudiando' },
      { name: 'María', role: 'Estudiando' },
    ],
  },
  {
    id: 2,
    title: 'Programación',
    category: 'JavaScript y React',
    objective: 'Construir componentes interactivos y repasar hooks para la aplicación de estudio colaborativo.',
    users: 21,
    focus: false,
    premium: true,
    averageTime: '1h 48m',
    participation: '92%',
    pomodoros: 28,
    members: [
      { name: 'Sofía', role: 'Programando' },
      { name: 'Mateo', role: 'Debatiendo' },
      { name: 'Daniel', role: 'Revisando' },
      { name: 'Paula', role: 'Escribiendo' },
    ],
  },
  {
    id: 3,
    title: 'Física',
    category: 'Mecánica clásica',
    objective: 'Clarificar conceptos de fuerza y movimiento, y practicar problemas de energía y trabajo.',
    users: 8,
    focus: true,
    premium: false,
    averageTime: '1h 55m',
    participation: '81%',
    pomodoros: 20,
    members: [
      { name: 'Mateo', role: 'Analizando' },
      { name: 'Camila', role: 'Resolviendo' },
      { name: 'Bruno', role: 'Leyendo' },
      { name: 'Nora', role: 'Preguntando' },
    ],
  },
  {
    id: 4,
    title: 'Idiomas',
    category: 'English & French',
    objective: 'Practicar conversación, gramática y vocabulario en inglés y francés con ejercicios guiados.',
    users: 16,
    focus: false,
    premium: true,
    averageTime: '2h 10m',
    participation: '89%',
    pomodoros: 26,
    members: [
      { name: 'Lucía', role: 'Hablando' },
      { name: 'Javier', role: 'Traduciendo' },
      { name: 'Elena', role: 'Escuchando' },
      { name: 'Diego', role: 'Escribiendo' },
    ],
  },
  {
    id: 5,
    title: 'Química',
    category: 'Química orgánica',
    objective: 'Repasar reacciones orgánicas y practicar mecanismos paso a paso con ejemplos reales.',
    users: 6,
    focus: true,
    premium: false,
    averageTime: '1h 40m',
    participation: '78%',
    pomodoros: 18,
    members: [
      { name: 'Marta', role: 'Comprendiendo' },
      { name: 'Alberto', role: 'Evaluando' },
      { name: 'Sara', role: 'Comparando' },
      { name: 'Iván', role: 'Respondiendo' },
    ],
  },
  {
    id: 6,
    title: 'Historia',
    category: 'Historia universal',
    objective: 'Analizar eventos clave del siglo XX y preparar resúmenes rápidos para debatir en grupo.',
    users: 10,
    focus: false,
    premium: false,
    averageTime: '1h 20m',
    participation: '84%',
    pomodoros: 22,
    members: [
      { name: 'Alicia', role: 'Leyendo' },
      { name: 'Pedro', role: 'Escribiendo' },
      { name: 'Carmen', role: 'Comentando' },
      { name: 'Raúl', role: 'Analizando' },
    ],
  },
]

const initialMessages = [
  { author: 'Ana', text: '¿Alguien entiende el ejercicio 4?' },
  { author: 'Luis', text: 'Sí, usa derivadas parciales.' },
]

const defaultTasksByRoom = {
  1: [
    { id: 1, text: 'Revisar fórmulas de derivadas', done: false },
    { id: 2, text: 'Resolver el ejercicio 4 en grupo', done: false },
    { id: 3, text: 'Comparar resultados con la solución', done: false },
  ],
  2: [
    { id: 1, text: 'Repasar hooks básicos', done: false },
    { id: 2, text: 'Construir un componente de lista', done: false },
    { id: 3, text: 'Compartir pantalla con el grupo', done: false },
  ],
  3: [
    { id: 1, text: 'Analizar ejercicios de cinemática', done: false },
    { id: 2, text: 'Discutir leyes de Newton', done: false },
    { id: 3, text: 'Resolver un problema rápido', done: false },
  ],
  4: [
    { id: 1, text: 'Practicar vocabulario clave', done: false },
    { id: 2, text: 'Hacer traducciones en pareja', done: false },
    { id: 3, text: 'Revisar pronunciación', done: false },
  ],
  5: [
    { id: 1, text: 'Repasar mecanismos de reacción', done: false },
    { id: 2, text: 'Resolver un ejemplo de síntesis', done: false },
    { id: 3, text: 'Comparar resultados con compañeros', done: false },
  ],
  6: [
    { id: 1, text: 'Leer eventos clave del siglo XX', done: false },
    { id: 2, text: 'Preparar una mini discusión', done: false },
    { id: 3, text: 'Resumir los puntos principales', done: false },
  ],
}

function Salas() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todas')
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (!pomodoroActive) return

    const interval = setInterval(() => {
      setPomodoroSeconds((current) => {
        if (current <= 1) {
          clearInterval(interval)
          setPomodoroActive(false)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [pomodoroActive])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        room.title.toLowerCase().includes(query) ||
        room.category.toLowerCase().includes(query)

      if (!matchesSearch) return false
      if (filter === 'Focus') return room.focus
      if (filter === 'Premium') return room.premium
      return true
    })
  }, [search, filter])

  const activeRooms = rooms.length
  const totalStudents = rooms.reduce((sum, room) => sum + room.users, 0)
  const focusRooms = rooms.filter((room) => room.focus).length

  const currentMinutes = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')
  const currentSeconds = String(pomodoroSeconds % 60).padStart(2, '0')

  const openRoom = (room) => {
    setActiveRoom(room)
    setMessages(initialMessages)
    setDraft('')
    setTasks(defaultTasksByRoom[room.id] ?? [])
    setNewTask('')
    setPomodoroSeconds(25 * 60)
    setPomodoroActive(false)
  }

  const leaveRoom = () => {
    setActiveRoom(null)
    setPomodoroActive(false)
  }

  const sendMessage = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    setMessages((current) => [...current, { author: 'Tú', text: trimmed }])
    setDraft('')
  }

  const resetPomodoro = () => {
    setPomodoroSeconds(25 * 60)
    setPomodoroActive(false)
  }

  const toggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    )
  }

  const addTask = () => {
    const trimmed = newTask.trim()
    if (!trimmed) return

    setTasks((current) => [
      ...current,
      { id: Date.now(), text: trimmed, done: false },
    ])
    setNewTask('')
  }

  const startPomodoro = () => {
    if (pomodoroSeconds <= 0) {
      setPomodoroSeconds(25 * 60)
    }
    setPomodoroActive(true)
  }

  return (
    <div className="salas-page">
      <div className="salas-app-shell">
        <aside className="salas-sidebar">
          <div className="salas-brand">
            <div className="salas-brand-logo">S</div>
            <div>
              <p className="salas-brand-title">StudySync</p>
              <p className="salas-brand-subtitle">Salas de estudio</p>
            </div>
          </div>

          <nav className="salas-sidebar-nav">
            <Link to="/salas" className="salas-sidebar-link salas-active">
              Salas de estudio
            </Link>
            <Link to="/" className="salas-sidebar-link">Inicio</Link>
            <a href="#" className="salas-sidebar-link">Explorar</a>
            <a href="#" className="salas-sidebar-link">Pomodoro</a>
            <a href="#" className="salas-sidebar-link">Metas</a>
            <a href="#" className="salas-sidebar-link">Coach IA</a>
          </nav>
        </aside>

        <main className="salas-main-panel">
          <div className="salas-main-topbar">
            <div className="salas-topbar-status">
              <span className="salas-status-dot" />
              Sala activa · {totalStudents} estudiantes conectados
            </div>
            <div className="salas-topbar-actions">
              <button className="salas-action-pill" type="button">Focus Mode</button>
              <button className="salas-action-button" type="button" onClick={() => navigate('/')}>Salir</button>
            </div>
          </div>

          {activeRoom ? (
            <div className="salas-room-detail-grid">
              <section className="salas-room-detail-main">
                <div className="salas-room-detail-header">
                  <button className="salas-back-button" type="button" onClick={leaveRoom}>
                    ← Volver
                  </button>
                  <div>
                    <p className="salas-eyebrow">Sala {activeRoom.title}</p>
                    <h1>{activeRoom.title}</h1>
                    <p className="salas-description">{activeRoom.category}</p>
                  </div>
                </div>

                <div className="salas-room-objective-card">
                  <p className="salas-section-label">Objetivo de la sesión</p>
                  <p>{activeRoom.objective}</p>
                </div>

                <div className="salas-task-card">
                  <div className="salas-task-card-header">
                    <div>
                      <p className="salas-section-label">Agenda de la sesión</p>
                      <p className="salas-task-summary">
                        {tasks.filter((task) => task.done).length}/{tasks.length} completadas
                      </p>
                    </div>
                  </div>
                  <ul className="salas-task-list">
                    {tasks.map((task) => (
                      <li key={task.id} className="salas-task-item">
                        <button
                          type="button"
                          className={`salas-task-checkbox ${task.done ? 'salas-done' : ''}`}
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.done ? '✓' : ''}
                        </button>
                        <span className={task.done ? 'salas-task-done' : ''}>{task.text}</span>
                      </li>
                    ))}
                    {tasks.length === 0 && (
                      <li className="salas-task-empty">Agrega tu primera tarea para la sala.</li>
                    )}
                  </ul>
                  <div className="salas-task-input-row">
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
                      placeholder="Añadir tarea de estudio..."
                    />
                    <button className="salas-add-task-button" type="button" onClick={addTask}>
                      Agregar
                    </button>
                  </div>
                </div>

                <div className="salas-kpi-grid">
                  <article className="salas-kpi-card">
                    <span>Tiempo medio</span>
                    <strong>{activeRoom.averageTime}</strong>
                  </article>
                  <article className="salas-kpi-card">
                    <span>Participación</span>
                    <strong>{activeRoom.participation}</strong>
                  </article>
                  <article className="salas-kpi-card">
                    <span>Pomodoros completados</span>
                    <strong>{activeRoom.pomodoros}</strong>
                  </article>
                </div>

                <div className="salas-member-grid">
                  {activeRoom.members.map((member) => (
                    <article key={member.name} className="salas-member-card">
                      <div className="salas-member-avatar">{member.name.charAt(0)}</div>
                      <div>
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="salas-chat-panel">
                  <div className="salas-chat-header">
                    <h2>Chat de estudio</h2>
                  </div>
                  <div className="salas-chat-messages">
                    {messages.map((message, index) => (
                      <div key={index} className="salas-chat-message">
                        <strong>{message.author}:</strong>
                        <span>{message.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="salas-chat-input-row">
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
                    <button className="salas-send-button" type="button" onClick={sendMessage}>
                      Enviar
                    </button>
                  </div>
                </div>
              </section>

              <aside className="salas-room-sidebar">
                <div className="salas-pomodoro-card">
                  <div className="salas-pomodoro-circle">
                    <span>{currentMinutes}:{currentSeconds}</span>
                  </div>
                  <p className="salas-pomodoro-title">Tiempo de enfoque</p>
                  <div className="salas-pomodoro-actions">
                    <button className="salas-pomodoro-action" type="button" onClick={startPomodoro}>
                      Iniciar
                    </button>
                    <button className="salas-pomodoro-action salas-secondary" type="button" onClick={resetPomodoro}>
                      Reiniciar
                    </button>
                  </div>
                </div>
                <div className="salas-status-pill salas-focus-pill">ENFOQUE</div>
                <div className="salas-status-pill salas-live-pill">EN DIRECTO</div>
              </aside>
            </div>
          ) : (
            <>
              <header className="salas-main-header">
                <div>
                  <p className="salas-eyebrow">Salas activas</p>
                  <h1>Salas de estudio</h1>
                  <p className="salas-description">Únete a salas colaborativas en tiempo real.</p>
                </div>
                <div className="salas-stats-row">
                  <div className="salas-stat-box">
                    <span>Salas activas</span>
                    <strong>{activeRooms}</strong>
                  </div>
                  <div className="salas-stat-box">
                    <span>Estudiantes conectados</span>
                    <strong>{totalStudents}</strong>
                  </div>
                  <div className="salas-stat-box">
                    <span>Focus Rooms</span>
                    <strong>{focusRooms}</strong>
                  </div>
                </div>
              </header>

              <section className="salas-filter-bar">
                <div className="salas-search-box">
                  <input
                    type="text"
                    placeholder="Buscar sala..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="salas-filter-chips">
                  {['Todas', 'Focus', 'Premium'].map((option) => (
                    <button
                      key={option}
                      className={`salas-chip ${filter === option ? 'salas-active' : ''}`}
                      onClick={() => setFilter(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>

              <section className="salas-rooms-grid">
                {filteredRooms.length === 0 ? (
                  <div className="salas-empty-state">No se encontraron salas con esa búsqueda.</div>
                ) : (
                  filteredRooms.map((room) => (
                    <article key={room.id} className="salas-room-card">
                      <div className="salas-room-banner">
                        {room.focus ? (
                          <span className="salas-banner-label salas-focus">FOCUS</span>
                        ) : (
                          <span className="salas-banner-label salas-live">LIVE</span>
                        )}
                      </div>
                      <div className="salas-room-content">
                        <div>
                          <h2>{room.title}</h2>
                          <p>{room.category}</p>
                        </div>
                        <div className="salas-room-meta">
                          <div className="salas-room-progress">
                            <div
                              className="salas-progress-fill"
                              style={{ width: `${Math.min(room.users * 6, 100)}%` }}
                            />
                          </div>
                          <div className="salas-room-info-row">
                            <span>{room.users} conectados</span>
                            <span className={room.focus ? 'salas-mode salas-active' : 'salas-mode salas-inactive'}>
                              {room.focus ? 'Activo' : 'Desactivado'}
                            </span>
                          </div>
                        </div>
                        <button className="salas-join-button" type="button" onClick={() => openRoom(room)}>
                          Unirse a la sala
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Salas;
