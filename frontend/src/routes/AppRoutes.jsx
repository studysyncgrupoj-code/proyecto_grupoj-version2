import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import RoleRoute from "../components/auth/RoleRoute";
import PageLoader from "../components/ui/PageLoader";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/login/login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const StudyRooms = lazy(() => import("../pages/StudyRooms"));
const RoomView = lazy(() => import("../pages/RoomView"));
const Cursos = lazy(() => import("../pages/cursos/Cursos"));

const DashboardEstudiante = lazy(() =>
  import("../pages/DashboardEstudiante")
);

const NotFound = lazy(() => import("../pages/NotFound"));
const Calendario = lazy(() => import("../pages/Calendario"));
const Mensajes = lazy(() => import("../pages/Mensajes"));
const Perfil = lazy(() => import("../pages/Perfil"));
const Configuracion = lazy(() =>
  import("../pages/Configuracion")
);

const Estudiantes = lazy(() =>
  import("../pages/salas/Estudiantes")
);

const PomodoroTimer = lazy(() =>
  import("../components/dashboard/PomodoroTimer")
);

const Reportes = lazy(() => import("../pages/Reportes"));
const DashboardAdmin = lazy(() => import("../pages/DashboardAdmin"));

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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard profesor y administrador */}
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

          {/* Exclusivas de profesor y administrador */}
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

          <Route path="*" element={<NotFound />} />
          <Route
              path="/dashboard-admin"
              element={
                <RoleRoute allowedRoles={["administrador", "admin"]}>
                  <DashboardAdmin />
                </RoleRoute>
              }
            />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;