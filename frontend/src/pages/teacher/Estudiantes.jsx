import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/teacher/Estudiantes.css";


import { useEffect, useMemo, useState } from 'react'

const filters = ['Todos', 'Activos', 'Inactivos']

function Estudiantes() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch('/api/users/students', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        setStudents(data.map(user => ({
          id: user.id,
          name: [user.nombre, user.apellido].filter(Boolean).join(' ') || user.email,
          email: user.email || '',
          initials: ((user.nombre || '').charAt(0) +
                     (user.apellido || '').charAt(0)).toUpperCase() || 'E',
          status: user.activo ? 'Activo' : 'Inactivo',
          course: 'No disponible',
          level: 'Sin datos',
          plan: 'Sin datos',
          progress: null,
          focusTime: '—',
          streak: '—',
          rooms: '—',
          lastActivity: 'Sin datos',
          trend: '—',
          tags: []
        })))
      } catch (err) {
        setError('No fue posible cargar los estudiantes: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

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
      if (filter === 'Activos') return student.status === 'Activo'
      if (filter === 'Inactivos') return student.status === 'Inactivo'
      return true
    })
  }, [students, search, filter])

  const onlineStudents = students.filter((student) => student.status === 'Activo').length
  const premiumStudents = students.filter((student) => student.status === 'Inactivo').length
  const averageProgress = Math.round(
    students.reduce((sum, student) => sum + student.progress, 0) / students.length
  )

  return (
    <div className="estudiantes-layout">
      <Sidebar />



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
            <span>Estudiantes activos</span>
            <strong>{onlineStudents}</strong>
            <small>Cuentas habilitadas</small>
          </article>

          <article className="estudiantes-summary-card">
            <span>Estudiantes inactivos</span>
            <strong>{premiumStudents}</strong>
            <small>Cuentas deshabilitadas</small>
          </article>

          <article className="estudiantes-summary-card">
            <span>Progreso promedio</span>
            <strong>—</strong>
            <small>Rendimiento global</small>
          </article>
        </section>

        <section className="estudiantes-toolbar">
          <label className="estudiantes-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Buscar por nombre o correo..."
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

        {loading ? (
          <p>Cargando estudiantes...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : filteredStudents.length === 0 ? (
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
                    <strong>—</strong>
                  </div>
                  <div className="estudiante-progress-track">
                    <span style={{ width: `$—` }} />
                  </div>
                </div>

                <div className="estudiante-metrics">
                  <div>
                    <span>Tiempo de enfoque</span>
                    <strong>{student.focusTime}</strong>
                  </div>
                  <div>
                    <span>Racha</span>
                    <strong>{student.streak}</strong>
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
                <strong>—</strong>
              </article>
              <article>
                <span>Enfoque</span>
                <strong>{selectedStudent.focusTime}</strong>
              </article>
              <article>
                <span>Racha</span>
                <strong>{selectedStudent.streak}</strong>
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