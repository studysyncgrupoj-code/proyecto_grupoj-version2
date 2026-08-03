import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/login/login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import StudyRooms from "../pages/StudyRooms";
import RoomView from "../pages/RoomView";
import Cursos from "../pages/cursos/Cursos";
import DashboardEstudiante from "../pages/DashboardEstudiante";
import Calendario from "../pages/Calendario";
import Mensajes from "../pages/Mensajes";
import Perfil from "../pages/Perfil";
import Configuracion from "../pages/Configuracion";
import Estudiantes from "../pages/salas/Estudiantes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Accesos a Salas de estudio */}
        <Route path="/salas" element={<StudyRooms />} />
        <Route path="/study-rooms" element={<StudyRooms />} />
        <Route path="/room" element={<RoomView />} />

        <Route path="/cursos" element={<Cursos />} />
        <Route
          path="/dashboard-estudiante"
          element={<DashboardEstudiante />}
        />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracion" element={<Configuracion />} />

        {/* Nuevo acceso a Estudiantes */}
        <Route path="/estudiantes" element={<Estudiantes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

