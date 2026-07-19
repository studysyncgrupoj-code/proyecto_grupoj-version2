import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: "⌂" },
  { label: "Salas de estudio", path: "/salas", icon: "▣" },
  { label: "Cursos", path: "/cursos", icon: "▤" },
  { label: "Pomodoro", path: "/pomodoro", icon: "◷" },
  { label: "Tareas", path: "/tareas", icon: "✓" },
  { label: "Calendario", path: "/calendario", icon: "□" },
  { label: "Estudiantes", path: "/estudiantes", icon: "♙" },
  { label: "Reportes", path: "/reportes", icon: "↗" },
];

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>

        <div className="sidebar-brand-text">
          <h2>StudySync</h2>
          <span>Panel del profesor</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-premium">
        <div className="premium-icon">♛</div>

        <h3>StudySync Premium</h3>

        <p>
          Accede a estadísticas avanzadas, salas exclusivas y herramientas
          adicionales para docentes.
        </p>

        <button type="button">Ver beneficios</button>
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <span className="sidebar-icon">⚙</span>
          <span>Configuración</span>
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <span className="sidebar-icon">◎</span>
          <span>Mi perfil</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Cerrar sesión</span>
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
  );
}

export default Sidebar;