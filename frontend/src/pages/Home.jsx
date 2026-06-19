import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/landing.css'

const sections = [
  { id: 'home', label: 'Inicio' },
  { id: 'salas', label: 'Salas' },
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'contacto', label: 'Contacto' },
]

function Home() {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('home')
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.4 }
    )

    const elementsToObserve = []

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
        elementsToObserve.push(element)
      }
    })

    return () => {
      elementsToObserve.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [])

  const menuItems = useMemo(
    () =>
      sections.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={activeSection === item.id ? 'nav-link active' : 'nav-link'}
          onClick={() => setActiveSection(item.id)}
        >
          {item.label}
        </a>
      )),
    [activeSection]
  )

  return (
    <>
      {isLanding && (
        <header className="hero-nav">
          <Link to="/" className="brand">
            <img src="/Logo.png" alt="logo studybest" className="logo-img" />
          </Link>
          <nav className="menu">{menuItems}</nav>
        </header>
      )}

      <div className={isLanding ? 'app-shell' : 'app-shell app-shell--full'}>
        <main>
          <section id="home" className="hero-section">
            <div className="hero-copy">
              <span className="eyebrow">Aprende hoy, crece mañana</span>
              <h1>Domina nuevas habilidades con clases interactivas y prácticas</h1>
              <p>
                Clases diseñadas para ayudarte a avanzar rápido: desarrollo web, diseño UX, marketing digital y más.
                Empieza hoy con una experiencia clara, moderna y enfocada en resultados.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
                <Link to="/cursos" className="btn btn-secondary">Ir a Cursos</Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="card-highlight">
                <span>Más de 5,000 estudiantes activos</span>
                <strong>+95%</strong>
                <p>Satisfacción garantizada con clases accesibles y prácticas.</p>
                <p>24/7 Salas y cursos de estudio disponibles</p>
              </div>
            </div>
          </section>

          <section id="cursos" className="content-section section-alt">
            <div className="section-heading">
              <span>Cambia tú futuro</span>
              <h2>Formación pensada para resultados reales</h2>
            </div>
            <div className="course-grid">
              <article className="course-card">
                <span className="course-tag">Disciplina</span>
                <h3>“Donde la disciplina se convierte en resultados.”</h3>
                <p>Un espacio para enfocarte, ser constante y ver progreso real.</p>
              </article>
              <article className="course-card">
                <span className="course-tag">Colaboración</span>
                <h3>“Estudia acompañado, crece sin límites.”</h3>
                <p>Conéctate, mantente motivado y avanza junto a otros.</p>
              </article>
              <article className="course-card">
                <span className="course-tag">Innovación</span>
                <h3>“Aprende hoy, construye tu futuro.”</h3>
                <p>Convierte cada sesión en habilidades que sí importan y pueden hacer la diferencia.</p>
              </article>
            </div>
          </section>

          <section id="salas" className="content-section section-alt">
            <div className="section-heading">
              <span>Salas de estudio</span>
              <h2>Únete a una sala colaborativa en tiempo real</h2>
            </div>
            <div className="stats-grid">
              <article className="stat-card">
                <h3>Salas de Estudio</h3>
                <p>Crea salas colaborativas en vivo para estudiar con otros estudiantes en tiempo real.</p>
              </article>
              <article className="stat-card">
                <h3>Pomodoro Compartido</h3>
                <p>Organiza sesiones de 25 minutos de estudio y 5 minutos de descanso.</p>
              </article>
              <article className="stat-card">
                <h3>Coach con IA</h3>
                <p>Recibe sugerencias personalizadas para mejorar tus hábitos de estudio.</p>
              </article>
            </div>

            <div className="room-cards">
              <article className="room-card">
                <div className="room-card-header">
                  <h3>Matemáticas</h3>
                  <p>Álgebra y cálculo</p>
                </div>
                <div className="room-progress">
                  <span style={{ width: '74%' }} />
                </div>
                <div className="room-card-footer">
                  <p className="room-meta">12 estudiantes conectados</p>
                  <p className="room-status">Activo</p>
                </div>
              </article>

              <article className="room-card">
                <div className="room-card-header">
                  <h3>Programación</h3>
                  <p>JavaScript y React</p>
                </div>
                <div className="room-progress">
                  <span style={{ width: '64%' }} />
                </div>
                <div className="room-card-footer">
                  <p className="room-meta">21 estudiantes conectados</p>
                  <p className="room-status off">Desactivado</p>
                </div>
              </article>

              <article className="room-card">
                <div className="room-card-header">
                  <h3>Física</h3>
                  <p>Mecánica clásica</p>
                </div>
                <div className="room-progress">
                  <span style={{ width: '38%' }} />
                </div>
                <div className="room-card-footer">
                  <p className="room-meta">8 estudiantes conectados</p>
                  <p className="room-status">Activo</p>
                </div>
              </article>
            </div>

            <Link to="/salas" className="salas-bottom">Ir a Salas</Link>
          </section>

          <section id="beneficios" className="content-section">
            <div className="benefits-grid">
              <div>
                <h2>Por qué elegirnos</h2>
                <p>Una experiencia clara, soporte directo y cursos actualizados que te permiten aprender con confianza.</p>
              </div>
              <div className="benefit-item">
                <h4>El Ecosistema del Aprendizaje</h4>
                <p>Study Best ofrece herramientas como recordatorios, organización de tareas y contenido educativo.</p>
              </div>
              <div className="benefit-item">
                <h4>Productividad sin Límites</h4>
                <p>La plataforma permite a los estudiantes gestionar su tiempo y mejorar su rendimiento académico.</p>
              </div>
              <div className="benefit-item">
                <h4>Tu Aliado hacia el Éxito</h4>
                <p>Study Best transforma tu rutina diaria en un camino estructurado hacia la excelencia profesional.</p>
              </div>
            </div>
          </section>

          <section id="testimonios" className="content-section section-alt testimonials-section">
            <div className="section-heading">
              <span>Testimonios</span>
              <h2>Alumnos que lograron avanzar</h2>
            </div>
            <div className="testimonial-grid">
              <blockquote>
                <p>Los cursos me ayudaron a conseguir mi primer empleo como desarrollador en solo 3 meses.</p>
                <footer>— Lucía M.</footer>
              </blockquote>
              <blockquote>
                <p>El contenido es práctico, claro y está actualizado. Ideal para crecer rápido.</p>
                <footer>— Andrés G.</footer>
              </blockquote>
            </div>
          </section>

          <section id="contacto" className="content-section contact-section">
            <div className="contact-card">
              <h2>¿Listo para empezar?</h2>
              <p>Déjanos tus datos y te ayudamos a elegir el curso ideal para ti.</p>
              <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
                <input type="text" placeholder="Tu nombre" aria-label="Nombre" />
                <input type="email" placeholder="Tu correo" aria-label="Correo electrónico" />
                <button type="submit" className="salas-bottom">Enviar mensaje</button>
              </form>
            </div>
          </section>
        </main>
      </div>

      {isLanding && (
        <footer className="footer">
          <p>&copy; 2026 StudyBest. Todos los derechos reservados.</p>
        </footer>
      )}
    </>
  )
}

export default Home