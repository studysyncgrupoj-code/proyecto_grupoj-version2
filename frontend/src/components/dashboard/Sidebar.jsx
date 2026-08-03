<<<<<<< HEAD
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
  MessageCircle,
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
    label: "Mensajes",
    path: "/mensajes",
    icon: MessageCircle,
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
=======
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 min-h-screen p-6">

      <div className="flex items-center gap-3 mb-10">

        <div className="w-12 h-12 rounded-2xl bg-cyan-400 flex items-center justify-center text-slate-950 font-bold text-2xl">
          S
        </div>

        <div>
          <h1 className="text-xl font-bold text-cyan-400">
            StudySync
          </h1>

          <p className="text-xs text-slate-500">
            Dashboard
          </p>
        </div>

      </div>

      <nav className="space-y-3">

        <Link
          to="/dashboard"
          className="block bg-cyan-400 text-slate-950 px-5 py-3 rounded-xl font-semibold"
        >
          Dashboard
        </Link>

        <Link
          to="/"
          className="block hover:bg-slate-800 px-5 py-3 rounded-xl transition"
        >
          Inicio
        </Link>

        <Link
         to="/study-rooms"
         className="block hover:bg-slate-800 px-5 py-3 rounded-xl transition"
        >
          Salas de estudio
        </Link>

        <Link
          to="/"
          className="block hover:bg-slate-800 px-5 py-3 rounded-xl transition"
        >
          Pomodoro
        </Link>

        <Link
          to="/"
          className="block hover:bg-slate-800 px-5 py-3 rounded-xl transition"
        >
          Metas
        </Link>

        <Link
          to="/"
          className="block hover:bg-slate-800 px-5 py-3 rounded-xl transition"
        >
          Coach IA
        </Link>
        <a
         href="/study-rooms"
        className="hover:text-cyan-400 transition"
    >
        Salas de estudio
    </a>

      </nav>

>>>>>>> origin/main
    </aside>
  );
}

export default Sidebar;