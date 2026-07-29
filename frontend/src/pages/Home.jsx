import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Menu,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

import "../styles/landing.css";

const sections = [
  { id: "home", label: "Inicio" },
  { id: "salas", label: "Salas" },
  { id: "beneficios", label: "Beneficios" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

const features = [
  {
    id: 1,
    title: "Enfoque inteligente",
    description:
      "Organiza tus sesiones, reduce distracciones y construye hábitos de estudio consistentes.",
    icon: Target,
  },
  {
    id: 2,
    title: "Aprendizaje colaborativo",
    description:
      "Estudia junto a compañeros, profesores y comunidades académicas en tiempo real.",
    icon: Users,
  },
  {
    id: 3,
    title: "Progreso medible",
    description:
      "Consulta estadísticas, metas, actividad y evolución desde un mismo espacio.",
    icon: BrainCircuit,
  },
];

const studyRooms = [
  {
    id: 1,
    title: "React y JavaScript",
    subject: "Desarrollo frontend",
    members: 18,
    progress: 82,
    status: "Activa",
  },
  {
    id: 2,
    title: "Cálculo diferencial",
    subject: "Matemáticas",
    members: 12,
    progress: 64,
    status: "Activa",
  },
  {
    id: 3,
    title: "Bases de datos",
    subject: "SQL y modelado",
    members: 9,
    progress: 46,
    status: "Próximamente",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Lucía Martínez",
    role: "Estudiante de desarrollo web",
    initials: "LM",
    quote:
      "StudySync me ayudó a organizar mis sesiones y avanzar en proyectos que antes siempre dejaba incompletos.",
  },
  {
    id: 2,
    name: "Andrés Gómez",
    role: "Estudiante universitario",
    initials: "AG",
    quote:
      "Las salas colaborativas y el Pomodoro compartido hicieron que estudiar fuera mucho más constante.",
  },
  {
    id: 3,
    name: "Camila Rodríguez",
    role: "Profesora de tecnología",
    initials: "CR",
    quote:
      "Ahora puedo acompañar mejor a mis estudiantes, organizar cursos y revisar su progreso desde una sola plataforma.",
  },
];

function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: 0.35,
        rootMargin: "-80px 0px -45% 0px",
      },
    );

    const observedElements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    observedElements.forEach((element) => observer.observe(element));

    return () => {
      observedElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  const menuItems = useMemo(
    () =>
      sections.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={
            activeSection === item.id
              ? "landing-nav-link active"
              : "landing-nav-link"
          }
          onClick={() => {
            setActiveSection(item.id);
            setMobileMenuOpen(false);
          }}
        >
          {item.label}
        </a>
      )),
    [activeSection],
  );

  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <Link to="/" className="landing-brand" aria-label="StudySync inicio">
          <span className="landing-brand-icon">
            <GraduationCap size={25} strokeWidth={2.2} />
          </span>

          <span className="landing-brand-copy">
            <strong>StudySync</strong>
            <small>Aprende. Conecta. Avanza.</small>
          </span>
        </Link>

        <nav
          className={`landing-menu ${mobileMenuOpen ? "open" : ""}`}
          aria-label="Navegación principal"
        >
          {menuItems}
        </nav>

        <div className="landing-navbar-actions">
          <Link to="/login" className="landing-login-link">
            Iniciar sesión
          </Link>

          <Link to="/registro" className="landing-navbar-button">
            Crear cuenta
            <ArrowRight size={17} />
          </Link>

          <button
            type="button"
            className="landing-mobile-button"
            aria-label="Abrir o cerrar menú"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="landing-hero">
          <div className="landing-hero-glow landing-hero-glow-one" />
          <div className="landing-hero-glow landing-hero-glow-two" />

          <div className="landing-hero-content">
            <div className="landing-hero-copy">
              <span className="landing-eyebrow">
                <Sparkles size={15} />
                Tu ecosistema inteligente de estudio
              </span>

              <h1>
                Estudia mejor.
                <span> Avanza con propósito.</span>
              </h1>

              <p>
                Organiza tus cursos, participa en salas colaborativas, mejora tu
                concentración y recibe acompañamiento personalizado desde una
                sola plataforma.
              </p>

              <div className="landing-hero-actions">
                <Link to="/registro" className="landing-primary-button">
                  Comenzar gratis
                  <ArrowRight size={18} />
                </Link>

                <Link to="/login" className="landing-secondary-button">
                  <Play size={17} fill="currentColor" />
                  Explorar plataforma
                </Link>
              </div>

              <div className="landing-hero-benefits">
                <span>
                  <CheckCircle2 size={16} />
                  Sin tarjeta de crédito
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Acceso inmediato
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Para estudiantes y profesores
                </span>
              </div>
            </div>

            <div className="landing-dashboard-preview">
              <div className="landing-preview-header">
                <div className="landing-preview-controls">
                  <span />
                  <span />
                  <span />
                </div>

                <span className="landing-preview-status">
                  <span />
                  Plataforma activa
                </span>
              </div>

              <div className="landing-preview-body">
                <aside className="landing-preview-sidebar">
                  <div className="landing-preview-logo">
                    <GraduationCap size={19} />
                  </div>

                  {[1, 2, 3, 4, 5].map((item) => (
                    <span
                      key={item}
                      className={item === 1 ? "active" : ""}
                    />
                  ))}
                </aside>

                <div className="landing-preview-content">
                  <div className="landing-preview-heading">
                    <div>
                      <small>Bienvenido de nuevo</small>
                      <strong>Tu progreso académico</strong>
                    </div>

                    <span className="landing-preview-avatar">RV</span>
                  </div>

                  <div className="landing-preview-statistics">
                    <article>
                      <span className="landing-preview-stat-icon">
                        <Clock3 size={18} />
                      </span>

                      <div>
                        <small>Tiempo estudiado</small>
                        <strong>24.5 h</strong>
                      </div>
                    </article>

                    <article>
                      <span className="landing-preview-stat-icon">
                        <Target size={18} />
                      </span>

                      <div>
                        <small>Meta semanal</small>
                        <strong>82%</strong>
                      </div>
                    </article>

                    <article>
                      <span className="landing-preview-stat-icon">
                        <Users size={18} />
                      </span>

                      <div>
                        <small>Salas activas</small>
                        <strong>12</strong>
                      </div>
                    </article>
                  </div>

                  <div className="landing-preview-lower">
                    <article className="landing-preview-progress-card">
                      <div>
                        <span>Progreso semanal</span>
                        <strong>18 horas de 22</strong>
                      </div>

                      <div className="landing-preview-chart">
                        {[35, 62, 48, 78, 91, 69, 84].map((height, index) => (
                          <span
                            key={`${height}-${index}`}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </article>

                    <article className="landing-preview-session">
                      <span className="landing-preview-session-icon">
                        <Video size={20} />
                      </span>

                      <div>
                        <small>Próxima sesión</small>
                        <strong>React avanzado</strong>
                        <span>Hoy · 4:30 p. m.</span>
                      </div>

                      <button type="button" aria-label="Entrar a sesión">
                        <ArrowRight size={17} />
                      </button>
                    </article>
                  </div>
                </div>
              </div>

              <div className="landing-floating-card landing-floating-card-left">
                <span>
                  <Zap size={17} />
                </span>

                <div>
                  <small>Racha actual</small>
                  <strong>12 días</strong>
                </div>
              </div>

              <div className="landing-floating-card landing-floating-card-right">
                <span>
                  <Bot size={18} />
                </span>

                <div>
                  <small>IA Coach</small>
                  <strong>Plan actualizado</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-trusted">
            <span>Una plataforma diseñada para potenciar</span>

            <div>
              <strong>Concentración</strong>
              <strong>Colaboración</strong>
              <strong>Organización</strong>
              <strong>Progreso</strong>
            </div>
          </div>
        </section>

        <section className="landing-features-section">
          <div className="landing-section-heading centered">
            <span>
              <BrainCircuit size={15} />
              Aprendizaje con propósito
            </span>

            <h2>Todo lo que necesitas para estudiar mejor</h2>

            <p>
              StudySync combina organización, colaboración y tecnología para
              convertir cada sesión de estudio en progreso real.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.id} className="landing-feature-card">
                  <span className="landing-feature-number">
                    0{feature.id}
                  </span>

                  <div className="landing-feature-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <span className="landing-feature-line" />
                </article>
              );
            })}
          </div>
        </section>

        <section id="salas" className="landing-rooms-section">
          <div className="landing-section-heading">
            <span>
              <Video size={15} />
              Salas de estudio
            </span>

            <h2>Aprender acompañado cambia los resultados</h2>

            <p>
              Únete a sesiones colaborativas, comparte recursos y mantén el
              ritmo junto a personas con tus mismos objetivos.
            </p>
          </div>

          <div className="landing-rooms-layout">
            <div className="landing-rooms-list">
              {studyRooms.map((room) => (
                <article key={room.id} className="landing-room-card">
                  <div className="landing-room-card-top">
                    <div className="landing-room-icon">
                      <Video size={21} />
                    </div>

                    <span
                      className={`landing-room-status ${
                        room.status !== "Activa" ? "upcoming" : ""
                      }`}
                    >
                      <span />
                      {room.status}
                    </span>
                  </div>

                  <span className="landing-room-subject">{room.subject}</span>
                  <h3>{room.title}</h3>

                  <div className="landing-room-progress-copy">
                    <span>Progreso de la sesión</span>
                    <strong>{room.progress}%</strong>
                  </div>

                  <div className="landing-room-progress">
                    <span style={{ width: `${room.progress}%` }} />
                  </div>

                  <footer>
                    <span>
                      <Users size={16} />
                      {room.members} participantes
                    </span>

                    <button type="button" aria-label={`Abrir ${room.title}`}>
                      <ArrowRight size={17} />
                    </button>
                  </footer>
                </article>
              ))}
            </div>

            <aside className="landing-rooms-highlight">
              <span className="landing-highlight-badge">
                <Sparkles size={15} />
                Sesiones en tiempo real
              </span>

              <h3>Convierte el estudio en una experiencia compartida</h3>

              <p>
                Crea salas públicas o privadas, activa sesiones de Pomodoro,
                conversa con tu equipo y consulta materiales sin abandonar la
                sesión.
              </p>

              <div className="landing-highlight-list">
                <span>
                  <CheckCircle2 size={18} />
                  Chat y colaboración en vivo
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Temporizador Pomodoro compartido
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Gestión de recursos y participantes
                </span>
              </div>

              <Link to="/salas" className="landing-highlight-button">
                Explorar salas
                <ArrowRight size={18} />
              </Link>
            </aside>
          </div>
        </section>

        <section id="beneficios" className="landing-benefits-section">
          <div className="landing-benefits-content">
            <div className="landing-section-heading">
              <span>
                <Zap size={15} />
                Una experiencia completa
              </span>

              <h2>Menos herramientas. Más concentración.</h2>

              <p>
                StudySync reúne las funciones esenciales para que puedas
                organizar, estudiar, colaborar y medir tu evolución.
              </p>
            </div>

            <div className="landing-benefits-list">
              <article>
                <span>
                  <CalendarDays size={20} />
                </span>

                <div>
                  <h3>Organización académica</h3>
                  <p>
                    Planifica cursos, sesiones, tareas y eventos desde un
                    calendario centralizado.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  <Clock3 size={20} />
                </span>

                <div>
                  <h3>Pomodoro integrado</h3>
                  <p>
                    Gestiona periodos de concentración y descanso con métricas
                    claras.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  <Bot size={20} />
                </span>

                <div>
                  <h3>Coach académico con IA</h3>
                  <p>
                    Recibe recomendaciones basadas en tus metas, actividad y
                    progreso.
                  </p>
                </div>
              </article>

              <article>
                <span>
                  <MessageCircle size={20} />
                </span>

                <div>
                  <h3>Comunicación directa</h3>
                  <p>
                    Mantén conversaciones con profesores, compañeros y grupos
                    de estudio.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="landing-security-card">
            <span className="landing-security-icon">
              <ShieldCheck size={30} />
            </span>

            <span className="landing-security-label">
              Plataforma confiable
            </span>

            <h3>Tu información y tu progreso siempre protegidos</h3>

            <p>
              StudySync integra controles de privacidad, seguridad de cuenta y
              configuraciones personalizadas para cada usuario.
            </p>

            <div className="landing-security-statistics">
              <article>
                <strong>24/7</strong>
                <span>Disponibilidad</span>
              </article>

              <article>
                <strong>100%</strong>
                <span>Control de privacidad</span>
              </article>
            </div>
          </div>
        </section>

        <section id="testimonios" className="landing-testimonials-section">
          <div className="landing-section-heading centered">
            <span>
              <Star size={15} />
              Historias de progreso
            </span>

            <h2>Personas que ya estudian de otra manera</h2>

            <p>
              Experiencias de estudiantes y profesores que encontraron una
              forma más organizada de avanzar.
            </p>
          </div>

          <div className="landing-testimonials-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id}>
                <div className="landing-testimonial-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={15} fill="currentColor" />
                  ))}
                </div>

                <blockquote>“{testimonial.quote}”</blockquote>

                <footer>
                  <span>{testimonial.initials}</span>

                  <div>
                    <strong>{testimonial.name}</strong>
                    <small>{testimonial.role}</small>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section id="contacto" className="landing-cta-section">
          <div className="landing-cta-glow" />

          <div>
            <span>
              <Sparkles size={15} />
              Tu siguiente sesión comienza aquí
            </span>

            <h2>Construye hoy una mejor forma de aprender</h2>

            <p>
              Crea tu cuenta y empieza a organizar tus cursos, salas, sesiones
              de concentración y objetivos académicos.
            </p>

            <div className="landing-cta-actions">
              <Link to="/registro" className="landing-primary-button">
                Crear cuenta gratis
                <ArrowRight size={18} />
              </Link>

              <Link to="/login" className="landing-secondary-button">
                Ya tengo una cuenta
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-top">
          <Link to="/" className="landing-brand">
            <span className="landing-brand-icon">
              <GraduationCap size={25} strokeWidth={2.2} />
            </span>

            <span className="landing-brand-copy">
              <strong>StudySync</strong>
              <small>Aprende. Conecta. Avanza.</small>
            </span>
          </Link>

          <p>
            Una plataforma para organizar tu aprendizaje, colaborar y avanzar
            con propósito.
          </p>

          <nav>
            <a href="#home">Inicio</a>
            <a href="#salas">Salas</a>
            <a href="#beneficios">Beneficios</a>
            <Link to="/login">Acceder</Link>
          </nav>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 StudySync. Todos los derechos reservados.</span>
          <span>Diseñado para aprender mejor.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;