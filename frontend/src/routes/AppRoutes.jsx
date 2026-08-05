import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import RoleRoute from "../components/auth/RoleRoute";
import PageLoader from "../components/ui/PageLoader";

const Home = lazy(() => import("../pages/auth/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

const DashboardAdmin = lazy(() =>
  import("../pages/admin/DashboardAdmin"),
);

const Dashboard = lazy(() =>
  import("../pages/teacher/DashboardProfesor"),
);

const Estudiantes = lazy(() =>
  import("../pages/teacher/Estudiantes"),
);

const Reportes = lazy(() =>
  import("../pages/teacher/Reportes"),
);

const DashboardEstudiante = lazy(() =>
  import("../pages/student/DashboardEstudiante"),
);

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

const allRoles = [
  "administrador",
  "admin",
  "profesor",
  "teacher",
  "estudiante",
  "student",
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

const adminRoles = [
  "administrador",
  "admin",
];

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard administrador */}
          <Route
            path="/dashboard-admin"
            element={
              <RoleRoute allowedRoles={adminRoles}>
                <DashboardAdmin />
              </RoleRoute>
            }
          />

          {/* Dashboard profesor */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={professorRoles}>
                <Dashboard />
              </RoleRoute>
            }
          />

          {/* Dashboard estudiante */}
          <Route
            path="/dashboard-estudiante"
            element={
              <RoleRoute allowedRoles={studentRoles}>
                <DashboardEstudiante />
              </RoleRoute>
            }
          />

          {/* Rutas compartidas */}
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
              <RoleRoute allowedRoles={allRoles}>
                <StudyRooms />
              </RoleRoute>
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

          {/* Rutas exclusivas de profesor y administrador */}
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

          {/* Debe ir siempre al final */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;