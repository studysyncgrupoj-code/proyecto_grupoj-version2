import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Crown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Timer,
  Users,
  Video,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Salas de estudio",
    path: "/salas",
    icon: Video,
  },
  {
    label: "Cursos",
    path: "/cursos",
    icon: BookOpen,
  },
  {
    label: "Pomodoro",
    path: "/pomodoro",
    icon: Timer,
  },
  {
    label: "Calendario",
    path: "/calendario",
    icon: CalendarDays,
  },
  {
    label: "Estudiantes",
    path: "/estudiantes",
    icon: Users,
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: BarChart3,
  },
];

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <GraduationCap size={24} strokeWidth={2.2} />
        </div>

        <div className="sidebar-brand-text">
          <h2>StudySync</h2>
          <span>Panel del profesor</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <Icon
                className="sidebar-icon"
                size={19}
                strokeWidth={2}
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-premium">
        <div className="premium-icon">
          <Crown size={22} strokeWidth={2} />
        </div>

        <h3>StudySync Premium</h3>

        <p>
          Accede a estadísticas avanzadas y herramientas adicionales para
          docentes.
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
          <Settings
            className="sidebar-icon"
            size={19}
            strokeWidth={2}
          />

          <span>Configuración</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut
            className="sidebar-icon"
            size={19}
            strokeWidth={2}
          />

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