import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import StudyRooms from "../pages/StudyRooms";
import RoomView from "../pages/RoomView";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study-rooms" element={<StudyRooms />} />
        <Route path="/room" element={<RoomView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;