import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import RoleRoute from "../components/auth/RoleRoute";
import PageLoader from "../components/ui/PageLoader";

/* =========================
   PÁGINAS PÚBLICAS
   ========================= */

const Home = lazy(() =>
  import("../pages/auth/Home"),
);

const Login = lazy(() =>
  import("../pages/auth/Login"),
);

const Register = lazy(() =>
  import("../pages/auth/Register"),
);

/* =========================
   ADMINISTRADOR
   ========================= */

const DashboardAdmin = lazy(() =>
  import("../pages/admin/DashboardAdmin"),
);

const GestionAcademicaAdmin = lazy(() =>
  import("../pages/admin/GestionAcademicaAdmin"),
);

const Usuarios = lazy(() =>
  import("../pages/admin/Usuarios"),
);

const Profesores = lazy(() =>
  import("../pages/admin/Profesores"),
);

const EstudiantesAdmin = lazy(() =>
  import("../pages/admin/EstudiantesAdmin"),
);

const CursosAdmin = lazy(() =>
  import("../pages/admin/CursosAdmin"),
);

const InformesAdmin = lazy(() =>
  import("../pages/admin/InformesAdmin"),
);

const CorreosAdmin = lazy(() =>
  import("../pages/admin/CorreosAdmin"),
);

const NotificacionesAdmin = lazy(() =>
  import("../pages/admin/NotificacionesAdmin"),
);

const AuditoriaAdmin = lazy(() =>
  import("../pages/admin/AuditoriaAdmin"),
);

/* =========================
   PROFESOR
   ========================= */

const Dashboard = lazy(() =>
  import("../pages/teacher/DashboardProfesor"),
);

const Estudiantes = lazy(() =>
  import("../pages/teacher/Estudiantes"),
);

const Reportes = lazy(() =>
  import("../pages/teacher/Reportes"),
);

const GestionAcademica = lazy(() =>
  import("../pages/teacher/GestionAcademica"),
);

/* =========================
   ESTUDIANTE
   ========================= */

const DashboardEstudiante = lazy(() =>
  import("../pages/student/DashboardEstudiante"),
);

const MiGestionAcademica = lazy(() =>
  import("../pages/student/MiGestionAcademica"),
);

/* =========================
   PÁGINAS COMPARTIDAS
   ========================= */

const StudyRooms = lazy(() =>
  import("../pages/shared/StudyRooms"),
);

const RoomView = lazy(() =>
  import("../pages/shared/RoomView"),
);

const Cursos = lazy(() =>
  import("../pages/shared/Cursos"),
);

const Calendario = lazy(() =>
  import("../pages/shared/Calendario"),
);

const Mensajes = lazy(() =>
  import("../pages/shared/Mensajes"),
);

const Perfil = lazy(() =>
  import("../pages/shared/Perfil"),
);

const Configuracion = lazy(() =>
  import("../pages/shared/Configuracion"),
);

const NotFound = lazy(() =>
  import("../pages/shared/NotFound"),
);

const PomodoroTimer = lazy(() =>
  import("../components/dashboard/PomodoroTimer"),
);

/* =========================
   ROLES
   ========================= */

const allRoles = [
  "administrador",
  "admin",
  "profesor",
  "teacher",
  "estudiante",
  "student",
];

const adminRoles = [
  "administrador",
  "admin",
];

const professorRoles = [
  "administrador",
  "admin",
  "profesor",
  "teacher",
];

const studentRoles = [
  "administrador",
  "admin",
  "estudiante",
  "student",
];

/* =========================
   ROUTER PRINCIPAL
   ========================= */

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* =========================
              RUTAS PÚBLICAS
              ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/registro"
            element={
              <Navigate
                to="/register"
                replace
              />
            }
          />

          <Route
            path="/crear-cuenta"
            element={
              <Navigate
                to="/register"
                replace
              />
            }
          />

          {/* =========================
              ADMINISTRADOR
              ========================= */}

          <Route
            path="/dashboard-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <DashboardAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <Usuarios />
              </RoleRoute>
            }
          />

          <Route
            path="/profesores"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <Profesores />
              </RoleRoute>
            }
          />

          <Route
            path="/estudiantes-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <EstudiantesAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/cursos-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <CursosAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/gestion-academica-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <GestionAcademicaAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/informes-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <InformesAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/correos-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <CorreosAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/notificaciones"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <NotificacionesAdmin />
              </RoleRoute>
            }
          />

          <Route
            path="/auditoria"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <AuditoriaAdmin />
              </RoleRoute>
            }
          />

          {/* =========================
              PROFESOR
              ========================= */}

          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={professorRoles}>
                <Dashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/estudiantes"
            element={
              <RoleRoute allowedRoles={professorRoles}>
                <Estudiantes />
              </RoleRoute>
            }
          />

          <Route
            path="/reportes"
            element={
              <RoleRoute allowedRoles={professorRoles}>
                <Reportes />
              </RoleRoute>
            }
          />

          <Route
            path="/gestion-academica"
            element={
              <RoleRoute allowedRoles={professorRoles}>
                <GestionAcademica />
              </RoleRoute>
            }
          />

          {/* =========================
              ESTUDIANTE
              ========================= */}

          <Route
            path="/dashboard-estudiante"
            element={
              <RoleRoute allowedRoles={studentRoles}>
                <DashboardEstudiante />
              </RoleRoute>
            }
          />

          <Route
            path="/mi-gestion-academica"
            element={
              <RoleRoute allowedRoles={studentRoles}>
                <MiGestionAcademica />
              </RoleRoute>
            }
          />

          {/* =========================
              RUTAS COMPARTIDAS
              ========================= */}

          <Route
            path="/salas"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <StudyRooms />
              </RoleRoute>
            }
          />

          <Route
            path="/study-rooms"
            element={
              <Navigate
                to="/salas"
                replace
              />
            }
          />

          <Route
            path="/room"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <RoomView />
              </RoleRoute>
            }
          />

          <Route
            path="/cursos"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <Cursos />
              </RoleRoute>
            }
          />

          <Route
            path="/calendario"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <Calendario />
              </RoleRoute>
            }
          />

          <Route
            path="/mensajes"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <Mensajes />
              </RoleRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <Perfil />
              </RoleRoute>
            }
          />

          <Route
            path="/configuracion"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <Configuracion />
              </RoleRoute>
            }
          />

          <Route
            path="/pomodoro"
            element={
              <RoleRoute allowedRoles={allRoles}>
                <PomodoroTimer />
              </RoleRoute>
            }
          />

          {/* =========================
              404 — SIEMPRE AL FINAL
              ========================= */}

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;