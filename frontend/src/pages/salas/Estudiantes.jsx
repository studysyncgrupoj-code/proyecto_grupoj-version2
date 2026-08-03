import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import './Estudiantes.css'

const students = [
  {
    id: 1,
    name: 'Ana Martínez',
    email: 'ana.martinez@studysync.com',
    initials: 'AM',
    course: 'Matemáticas',
    level: 'Avanzado',
    status: 'En línea',
    plan: 'Premium',
    progress: 92,
    focusTime: '38h 24m',
    streak: 18,
    rooms: 24,
    lastActivity: 'Hace 3 min',
    trend: '+12%',
    tags: ['Cálculo', 'Álgebra'],
  },
  {
    id: 2,
    name: 'Luis González',
    email: 'luis.gonzalez@studysync.com',
    initials: 'LG',
    course: 'Programación',
    level: 'Intermedio',
    status: 'En línea',
    plan: 'Premium',
    progress: 86,
    focusTime: '31h 08m',
    streak: 12,
    rooms: 19,
    lastActivity: 'Hace 8 min',
    trend: '+9%',
    tags: ['React', 'JavaScript'],
  },
  {
    id: 3,
    name: 'Camila Rodríguez',
    email: 'camila.rodriguez@studysync.com',
    initials: 'CR',
    course: 'Física',
    level: 'Avanzado',
    status: 'Ausente',
    plan: 'Estándar',
    progress: 78,
    focusTime: '24h 40m',
    streak: 8,
    rooms: 14,
    lastActivity: 'Hace 1 h',
    trend: '+6%',
    tags: ['Mecánica', 'Energía'],
  },
  {
    id: 4,
    name: 'Mateo Sánchez',
    email: 'mateo.sanchez@studysync.com',
    initials: 'MS',
    course: 'Idiomas',
    level: 'Intermedio',
    status: 'En línea',
    plan: 'Estándar',
    progress: 74,
    focusTime: '22h 16m',
    streak: 7,
    rooms: 12,
    lastActivity: 'Hace 12 min',
    trend: '+4%',
    tags: ['Inglés', 'Francés'],
  },
  {
    id: 5,
    name: 'Sofía Herrera',
    email: 'sofia.herrera@studysync.com',
    initials: 'SH',
    course: 'Química',
    level: 'Inicial',
    status: 'Desconectado',
    plan: 'Premium',
    progress: 68,
    focusTime: '18h 52m',
    streak: 5,
    rooms: 10,
    lastActivity: 'Ayer',
    trend: '+3%',
    tags: ['Orgánica', 'Laboratorio'],
  },
  {
    id: 6,
    name: 'Daniel Vargas',
    email: 'daniel.vargas@studysync.com',
    initials: 'DV',
    course: 'Historia',
    level: 'Intermedio',
    status: 'En línea',
    plan: 'Estándar',
    progress: 81,
    focusTime: '27h 34m',
    streak: 10,
    rooms: 17,
    lastActivity: 'Hace 6 min',
    trend: '+7%',
    tags: ['Historia XX', 'Ensayos'],
  },
  {
    id: 7,
    name: 'Paula Ramírez',
    email: 'paula.ramirez@studysync.com',
    initials: 'PR',
    course: 'Programación',
    level: 'Avanzado',
    status: 'Ausente',
    plan: 'Premium',
    progress: 95,
    focusTime: '42h 11m',
    streak: 23,
    rooms: 28,
    lastActivity: 'Hace 42 min',
    trend: '+15%',
    tags: ['Node.js', 'React'],
  },
  {
    id: 8,
    name: 'Bruno Castillo',
    email: 'bruno.castillo@studysync.com',
    initials: 'BC',
    course: 'Matemáticas',
    level: 'Inicial',
    status: 'Desconectado',
    plan: 'Estándar',
    progress: 61,
    focusTime: '14h 05m',
    streak: 3,
    rooms: 8,
    lastActivity: 'Hace 2 días',
    trend: '+1%',
    tags: ['Álgebra', 'Geometría'],
  },
]

const filters = ['Todos', 'En línea', 'Premium', 'Alto progreso']

function Estudiantes() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.course.toLowerCase().includes(query) ||
        student.tags.some((tag) => tag.toLowerCase().includes(query))

      if (!matchesSearch) return false
      if (filter === 'En línea') return student.status === 'En línea'
      if (filter === 'Premium') return student.plan === 'Premium'
      if (filter === 'Alto progreso') return student.progress >= 85
      return true
    })
  }, [search, filter])

  const onlineStudents = students.filter((student) => student.status === 'En línea').length
  const premiumStudents = students.filter((student) => student.plan === 'Premium').length
  const averageProgress = Math.round(
    students.reduce((sum, student) => sum + student.progress, 0) / students.length
  )

  return (
    <div className="estudiantes-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <div className="sidebar-brand-text">
            <h2>StudySync</h2>
            <span>Panel educativo</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/" className="sidebar-link">Inicio</Link>
          <Link to="/cursos" className="sidebar-link">Cursos</Link>
          <Link to="/calendario" className="sidebar-link">Calendario</Link>
          <Link to="/mensajes" className="sidebar-link">Mensajes</Link>
          <Link to="/estudiantes" className="sidebar-link sidebar-link-active">Estudiantes</Link>
          <Link to="/informes" className="sidebar-link">Informes</Link>
          <Link to="/salas" className="sidebar-link">Salas de estudio</Link>
        </nav>

        <section className="sidebar-premium">
          <div className="premium-icon">♛</div>
          <h3>StudySync Premium</h3>
          <p>Accede a métricas avanzadas y herramientas adicionales para docentes.</p>
          <button type="button">Ver beneficios</button>
        </section>

        <div className="sidebar-bottom">
          <Link to="/configuracion" className="sidebar-link">Configuración</Link>
          <button className="sidebar-logout" type="button" onClick={() => navigate('/')}>
            Cerrar sesión
          </button>

          <div className="sidebar-user">
            <div className="sidebar-user-avatar">RV</div>
            <div className="sidebar-user-info">
              <strong>Profesor Richard</strong>
              <span>Administrador</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="estudiantes-content">
        <header className="estudiantes-topbar">
          <div>
            <span className="estudiantes-eyebrow">GESTIÓN ACADÉMICA</span>
            <h1>Estudiantes</h1>
            <p>Supervisa el progreso, la actividad y el rendimiento de tu comunidad.</p>
          </div>

          <div className="estudiantes-topbar-actions">
            <button className="estudiantes-secondary-button" type="button">
              Exportar
            </button>
            <button className="estudiantes-primary-button" type="button">
              + Agregar estudiante
            </button>
          </div>
        </header>

        <section className="estudiantes-summary-grid">
          <article className="estudiantes-summary-card">
            <span>Total de estudiantes</span>
            <strong>{students.length}</strong>
            <small>Comunidad registrada</small>
          </article>

          <article className="estudiantes-summary-card">
            <span>En línea ahora</span>
            <strong>{onlineStudents}</strong>
            <small>Actividad en tiempo real</small>
          </article>

          <article className="estudiantes-summary-card">
            <span>Usuarios Premium</span>
            <strong>{premiumStudents}</strong>
            <small>Planes activos</small>
          </article>

          <article className="estudiantes-summary-card">
            <span>Progreso promedio</span>
            <strong>{averageProgress}%</strong>
            <small>Rendimiento global</small>
          </article>
        </section>

        <section className="estudiantes-toolbar">
          <label className="estudiantes-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Buscar por nombre, correo, curso o habilidad..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="estudiantes-filter-group">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                className={filter === option ? 'active' : ''}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="estudiantes-view-switch">
            <button
              type="button"
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              aria-label="Vista en cuadrícula"
            >
              ▦
            </button>
            <button
              type="button"
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              aria-label="Vista en lista"
            >
              ☷
            </button>
          </div>
        </section>

        <section className="estudiantes-section-heading">
          <div>
            <span>DIRECTORIO</span>
            <h2>Comunidad de estudiantes</h2>
          </div>
          <p>{filteredStudents.length} resultados</p>
        </section>

        {filteredStudents.length === 0 ? (
          <section className="estudiantes-empty-state">
            <div>⌕</div>
            <h3>No encontramos estudiantes</h3>
            <p>Prueba con otro término de búsqueda o cambia los filtros seleccionados.</p>
          </section>
        ) : (
          <section
            className={
              viewMode === 'grid'
                ? 'estudiantes-grid'
                : 'estudiantes-grid estudiantes-list-view'
            }
          >
            {filteredStudents.map((student) => (
              <article key={student.id} className="estudiante-card">
                <div className="estudiante-card-top">
                  <div className="estudiante-avatar">{student.initials}</div>

                  <div className="estudiante-status-group">
                    <span className={`estudiante-status estudiante-status-${student.status.toLowerCase().replace(' ', '-')}`}>
                      {student.status}
                    </span>
                    {student.plan === 'Premium' && (
                      <span className="estudiante-premium-badge">Premium</span>
                    )}
                  </div>
                </div>

                <div className="estudiante-profile">
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                </div>

                <div className="estudiante-course-row">
                  <div>
                    <span>Curso principal</span>
                    <strong>{student.course}</strong>
                  </div>
                  <span className="estudiante-level">{student.level}</span>
                </div>

                <div className="estudiante-progress">
                  <div className="estudiante-progress-label">
                    <span>Progreso académico</span>
                    <strong>{student.progress}%</strong>
                  </div>
                  <div className="estudiante-progress-track">
                    <span style={{ width: `${student.progress}%` }} />
                  </div>
                </div>

                <div className="estudiante-metrics">
                  <div>
                    <span>Tiempo de enfoque</span>
                    <strong>{student.focusTime}</strong>
                  </div>
                  <div>
                    <span>Racha</span>
                    <strong>{student.streak} días</strong>
                  </div>
                  <div>
                    <span>Salas</span>
                    <strong>{student.rooms}</strong>
                  </div>
                </div>

                <div className="estudiante-tags">
                  {student.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <footer className="estudiante-card-footer">
                  <div>
                    <span>Última actividad</span>
                    <strong>{student.lastActivity}</strong>
                  </div>
                  <button type="button" onClick={() => setSelectedStudent(student)}>
                    Ver perfil
                  </button>
                </footer>
              </article>
            ))}
          </section>
        )}
      </main>

      {selectedStudent && (
        <div className="estudiante-modal-backdrop" role="presentation" onClick={() => setSelectedStudent(null)}>
          <section
            className="estudiante-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="estudiante-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="estudiante-modal-close"
              type="button"
              onClick={() => setSelectedStudent(null)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="estudiante-modal-header">
              <div className="estudiante-modal-avatar">{selectedStudent.initials}</div>
              <div>
                <span>{selectedStudent.plan}</span>
                <h2 id="estudiante-modal-title">{selectedStudent.name}</h2>
                <p>{selectedStudent.email}</p>
              </div>
            </div>

            <div className="estudiante-modal-summary">
              <article>
                <span>Progreso</span>
                <strong>{selectedStudent.progress}%</strong>
              </article>
              <article>
                <span>Enfoque</span>
                <strong>{selectedStudent.focusTime}</strong>
              </article>
              <article>
                <span>Racha</span>
                <strong>{selectedStudent.streak} días</strong>
              </article>
            </div>

            <div className="estudiante-modal-details">
              <div>
                <span>Curso principal</span>
                <strong>{selectedStudent.course}</strong>
              </div>
              <div>
                <span>Nivel</span>
                <strong>{selectedStudent.level}</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>{selectedStudent.status}</strong>
              </div>
              <div>
                <span>Tendencia</span>
                <strong>{selectedStudent.trend}</strong>
              </div>
            </div>

            <div className="estudiante-modal-actions">
              <button type="button" className="estudiantes-secondary-button">
                Enviar mensaje
              </button>
              <button type="button" className="estudiantes-primary-button">
                Ver reporte completo
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Estudiantes