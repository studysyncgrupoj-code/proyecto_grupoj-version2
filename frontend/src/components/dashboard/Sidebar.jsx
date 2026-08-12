import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Crown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Settings,
  ShieldCheck,
  Timer,
  UserCog,
  UserRound,
  Users,
  Video,
} from "lucide-react";

import "./Sidebar.css";

/* =========================================================
   MENÚ ADMIN
   ========================================================= */

const adminMenu = [
  {
    label: "Dashboard",
    path: "/dashboard-admin",
    icon: LayoutDashboard,
  },
  {
    label: "Usuarios",
    path: "/usuarios",
    icon: Users,
  },
  {
    label: "Profesores",
    path: "/profesores",
    icon: GraduationCap,
  },
  {
    label: "Estudiantes",
    path: "/estudiantes-admin",
    icon: UserCog,
  },
  {
    label: "Cursos",
    path: "/cursos-admin",
    icon: BookOpen,
  },
  {
    label: "Centro académico",
    path: "/gestion-academica-admin",
    icon: ClipboardList,
  },
  {
    label: "Salas",
    path: "/salas",
    icon: Video,
  },
  {
    label: "Informes",
    path: "/informes-admin",
    icon: BarChart3,
  },
  {
    label: "Correos",
    path: "/correos-admin",
    icon: Mail,
  },
  {
    label: "Notificaciones",
    path: "/notificaciones",
    icon: Bell,
  },
  {
    label: "Auditoría",
    path: "/auditoria",
    icon: ShieldCheck,
  },
];

/* =========================================================
   MENÚ PROFESOR
   ========================================================= */

const professorMenu = [
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
    label: "Usuarios",
    path: "/usuarios",
    icon: Users,
  },
  {
    label: "Gestión académica",
    path: "/gestion-academica",
    icon: ClipboardList,
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: BarChart3,
  },
  {
    label: "Perfil",
    path: "/perfil",
    icon: UserRound,
  },
];

/* =========================================================
   MENÚ ESTUDIANTE
   ========================================================= */

const studentMenu = [
  {
    label: "Dashboard",
    path: "/dashboard-estudiante",
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
    label: "Mi gestión académica",
    path: "/mi-gestion-academica",
    icon: ClipboardList,
  },
  {
    label: "Perfil",
    path: "/perfil",
    icon: UserRound,
  },
];

/* =========================================================
   UTILIDADES
   ========================================================= */

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function normalizeRole(role) {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

function getRoleInformation(role) {
  const isAdmin =
    role === "administrador" ||
    role === "admin" ||
    role === "administrator";

  const isStudent =
    role === "estudiante" ||
    role === "student";

  const isProfessor =
    role === "profesor" ||
    role === "teacher";

  if (isAdmin) {
    return {
      type: "admin",
      menu: adminMenu,
      panelTitle: "Panel del administrador",
      roleLabel: "Administrador",
      fallbackName: "Administrador StudySync",
      premiumTitle: "Control institucional",
      premiumDescription:
        "Supervisa usuarios, actividad académica y configuración general.",
    };
  }

  if (isStudent) {
    return {
      type: "student",
      menu: studentMenu,
      panelTitle: "Panel del estudiante",
      roleLabel: "Estudiante",
      fallbackName: "Estudiante StudySync",
      premiumTitle: "StudySync Premium",
      premiumDescription:
        "Accede a herramientas avanzadas para mejorar tu aprendizaje.",
    };
  }

  if (isProfessor) {
    return {
      type: "professor",
      menu: professorMenu,
      panelTitle: "Panel del profesor",
      roleLabel: "Profesor",
      fallbackName: "Profesor StudySync",
      premiumTitle: "StudySync Premium",
      premiumDescription:
        "Accede a estadísticas avanzadas y herramientas adicionales para docentes.",
    };
  }

  return {
    type: "student",
    menu: studentMenu,
    panelTitle: "Panel del estudiante",
    roleLabel: "Estudiante",
    fallbackName: "Usuario StudySync",
    premiumTitle: "StudySync Premium",
    premiumDescription:
      "Accede a herramientas avanzadas para mejorar tu aprendizaje.",
  };
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return (
      localStorage.getItem(
        "studysync-sidebar-collapsed",
      ) === "true"
    );
  });

  const user = getStoredUser();

  const normalizedRole =
    normalizeRole(user?.role);

  const roleInformation =
    getRoleInformation(normalizedRole);

  const {
    type,
    menu,
    panelTitle,
    roleLabel,
    fallbackName,
    premiumTitle,
    premiumDescription,
  } = roleInformation;

  const displayName =
    user?.name?.trim() || fallbackName;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase(),
    )
    .join("");

  /* =======================================================
     GUARDAR ESTADO DEL SIDEBAR
     ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "studysync-sidebar-collapsed",
      String(collapsed),
    );

    document.documentElement.style.setProperty(
      "--ss-sidebar-current-width",
      collapsed ? "82px" : "270px",
    );

    document.body.classList.toggle(
      "ss-sidebar-is-collapsed",
      collapsed,
    );

    return () => {
      document.body.classList.remove(
        "ss-sidebar-is-collapsed",
      );
    };
  }, [collapsed]);

  const handleToggleSidebar = () => {
    setCollapsed((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside
      className={`
        app-sidebar
        sidebar-role-${type}
        ${collapsed ? "sidebar-collapsed" : ""}
      `}
    >
      {/* ================================================
          MARCA
          ================================================ */}

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <GraduationCap
            size={24}
            strokeWidth={2}
          />
        </div>

        <div className="sidebar-brand-text">
          <h2>StudySync</h2>
          <span>{panelTitle}</span>
        </div>

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={handleToggleSidebar}
          aria-label={
            collapsed
              ? "Mostrar menú"
              : "Ocultar menú"
          }
          title={
            collapsed
              ? "Mostrar menú"
              : "Ocultar menú"
          }
        >
          {collapsed ? (
            <ChevronRight
              size={19}
              strokeWidth={2.2}
            />
          ) : (
            <ChevronLeft
              size={19}
              strokeWidth={2.2}
            />
          )}
        </button>
      </div>

      {/* ================================================
          MENÚ
          ================================================ */}

      <nav
        className="sidebar-menu"
        aria-label={panelTitle}
      >
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={`${type}-${item.path}`}
              to={item.path}
              title={
                collapsed
                  ? item.label
                  : undefined
              }
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? "sidebar-link-active"
                    : ""
                }`
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

      {/* ================================================
          PREMIUM
          ================================================ */}

      <div className="sidebar-premium">
        <div className="premium-icon">
          {type === "admin" ? (
            <ShieldCheck
              size={22}
              strokeWidth={2}
            />
          ) : (
            <Crown
              size={22}
              strokeWidth={2}
            />
          )}
        </div>

        <h3>{premiumTitle}</h3>

        <p>{premiumDescription}</p>

        <button type="button">
          {type === "admin"
            ? "Ver estado"
            : "Ver beneficios"}
        </button>
      </div>

      {/* ================================================
          PARTE INFERIOR
          ================================================ */}

      <div className="sidebar-bottom">
        <NavLink
          to="/configuracion"
          title={
            collapsed
              ? "Configuración"
              : undefined
          }
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? "sidebar-link-active"
                : ""
            }`
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
          title={
            collapsed
              ? "Cerrar sesión"
              : undefined
          }
          onClick={handleLogout}
        >
          <LogOut
            className="sidebar-icon"
            size={19}
            strokeWidth={2}
          />

          <span>Cerrar sesión</span>
        </button>

        <div
          className="sidebar-user"
          title={
            collapsed
              ? `${displayName} — ${roleLabel}`
              : undefined
          }
        >
          <div className="sidebar-user-avatar">
            {initials || "SS"}
          </div>

          <div className="sidebar-user-info">
            <strong>{displayName}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;