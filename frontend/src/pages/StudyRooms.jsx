<<<<<<< HEAD
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  BrainCircuit,
  Clock3,
  Crown,
  DoorOpen,
  Flame,
  Focus,
  Search,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import "./StudyRooms.css";

const rooms = [
  {
    name: "Matemáticas",
    users: 12,
    focus: true,
    premium: false,
    category: "Álgebra y cálculo",
    teacher: "Profesor Richard",
    duration: "90 minutos",
    icon: BookOpen,
  },
  {
    name: "Programación",
    users: 21,
    focus: false,
    premium: true,
    category: "JavaScript y React",
    teacher: "Profesor Camilo",
    duration: "120 minutos",
    icon: BrainCircuit,
  },
  {
    name: "Física",
    users: 8,
    focus: true,
    premium: false,
    category: "Mecánica clásica",
    teacher: "Profesora María",
    duration: "75 minutos",
    icon: Sparkles,
  },
  {
    name: "Idiomas",
    users: 15,
    focus: false,
    premium: true,
    category: "English & French",
    teacher: "Profesora Andrea",
    duration: "60 minutos",
    icon: Users,
  },
  {
    name: "Química",
    users: 6,
    focus: true,
    premium: false,
    category: "Química orgánica",
    teacher: "Profesor Carlos",
    duration: "80 minutos",
    icon: Flame,
  },
  {
    name: "Historia",
    users: 10,
    focus: false,
    premium: false,
    category: "Historia universal",
    teacher: "Profesor Daniel",
    duration: "60 minutos",
    icon: Clock3,
  },
];

function StudyRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.teacher.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "focus" && room.focus) ||
        (activeFilter === "premium" && room.premium);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="study-rooms-layout">
      <Sidebar />

      <main className="study-rooms-content">
        <header className="rooms-topbar">
          <div>
            <span className="rooms-eyebrow">
              <Sparkles size={15} />
              Comunidad StudySync
            </span>

            <h1>Salas de estudio</h1>

            <p>
              Encuentra una comunidad, activa tu concentración y estudia en
              tiempo real.
            </p>
          </div>

          <div className="rooms-topbar-actions">
            <button type="button" className="rooms-secondary-button">
              <Focus size={18} />
              Focus Mode
            </button>

            <button type="button" className="rooms-primary-button">
              <Video size={18} />
              Crear sala
            </button>
          </div>
        </header>

        <section className="rooms-live-banner">
          <div className="rooms-live-status">
            <span className="rooms-live-dot" />

            <div>
              <strong>La comunidad está activa</strong>
              <span>312 estudiantes conectados en este momento</span>
            </div>
          </div>

          <div className="rooms-live-meta">
            <span>
              <Video size={16} />
              24 salas activas
            </span>

            <span>
              <Focus size={16} />
              12 Focus Rooms
            </span>
          </div>
        </section>

        <section className="rooms-stats-grid">
          <article className="rooms-stat-card">
            <div className="rooms-stat-icon">
              <Video size={22} />
            </div>

            <div>
              <span>Salas activas</span>
              <strong>24</strong>
              <small>+12% desde ayer</small>
            </div>
          </article>

          <article className="rooms-stat-card">
            <div className="rooms-stat-icon">
              <Users size={22} />
            </div>

            <div>
              <span>Estudiantes conectados</span>
              <strong>312</strong>
              <small>68 nuevos hoy</small>
            </div>
          </article>

          <article className="rooms-stat-card">
            <div className="rooms-stat-icon">
              <Focus size={22} />
            </div>

            <div>
              <span>Focus Rooms</span>
              <strong>12</strong>
              <small>8 disponibles</small>
            </div>
          </article>
        </section>

        <section className="rooms-toolbar">
          <div className="rooms-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Buscar por sala, categoría o profesor..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="rooms-filters">
            <button
              type="button"
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => setActiveFilter("all")}
            >
              Todas
            </button>

            <button
              type="button"
              className={activeFilter === "focus" ? "active" : ""}
              onClick={() => setActiveFilter("focus")}
            >
              <Focus size={16} />
              Focus
            </button>

            <button
              type="button"
              className={activeFilter === "premium" ? "active" : ""}
              onClick={() => setActiveFilter("premium")}
            >
              <Crown size={16} />
              Premium
            </button>
          </div>
        </section>

        <section className="rooms-section-header">
          <div>
            <span>Explorar salas</span>
            <h2>Encuentra tu próxima sesión</h2>
          </div>

          <p>{filteredRooms.length} salas disponibles</p>
        </section>

        <section className="rooms-grid">
          {filteredRooms.map((room) => {
            const RoomIcon = room.icon;
            const occupancy = Math.min(room.users * 4, 100);

            return (
              <article className="room-card" key={room.name}>
                <div className="room-card-cover">
                  <div className="room-card-cover-icon">
                    <RoomIcon size={30} />
                  </div>

                  <div className="room-card-badges">
                    {room.focus && (
                      <span className="room-badge room-badge-focus">
                        <Focus size={13} />
                        Focus
                      </span>
                    )}

                    {room.premium && (
                      <span className="room-badge room-badge-premium">
                        <Crown size={13} />
                        Premium
                      </span>
                    )}

                    <span className="room-badge room-badge-live">
                      <span />
                      En vivo
                    </span>
                  </div>
                </div>

                <div className="room-card-body">
                  <div className="room-card-heading">
                    <div>
                      <h3>{room.name}</h3>
                      <p>{room.category}</p>
                    </div>

                    <div className="room-users-count">
                      <Users size={16} />
                      {room.users}
                    </div>
                  </div>

                  <div className="room-progress">
                    <div className="room-progress-label">
                      <span>Ocupación actual</span>
                      <strong>{occupancy}%</strong>
                    </div>

                    <div className="room-progress-track">
                      <span style={{ width: `${occupancy}%` }} />
                    </div>
                  </div>

                  <div className="room-details">
                    <div>
                      <Users size={16} />
                      <span>
                        <small>Profesor</small>
                        <strong>{room.teacher}</strong>
                      </span>
                    </div>

                    <div>
                      <Clock3 size={16} />
                      <span>
                        <small>Duración</small>
                        <strong>{room.duration}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="room-card-footer">
                    <span
                      className={
                        room.focus
                          ? "room-focus-status active"
                          : "room-focus-status"
                      }
                    >
                      <span />
                      Focus {room.focus ? "activo" : "desactivado"}
                    </span>

                    <Link to="/room" className="room-join-button">
                      <DoorOpen size={18} />
                      Entrar
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {filteredRooms.length === 0 && (
          <section className="rooms-empty-state">
            <Search size={34} />
            <h3>No encontramos salas</h3>
            <p>Prueba con otra búsqueda o selecciona otro filtro.</p>
          </section>
        )}
      </main>
=======
import Sidebar from "../components/dashboard/Sidebar";
import { Link } from "react-router-dom";

function StudyRooms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

            <span className="text-slate-300">
              Sala activa • 12 estudiantes conectados
            </span>

          </div>

          <div className="flex gap-3">

            <button className="bg-cyan-400 text-slate-950 px-5 py-2 rounded-xl font-semibold hover:bg-cyan-300 transition">
              Focus Mode
            </button>

            <button className="border border-slate-700 hover:border-red-400 hover:text-red-400 px-5 py-2 rounded-xl transition">
              Salir
            </button>

          </div>

        </div>

        <h1 className="text-4xl font-bold">
          Salas de estudio
        </h1>

        <p className="text-slate-400 mt-3">
          Únete a salas colaborativas en tiempo real.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Salas activas
            </h3>

            <h2 className="text-5xl font-bold text-cyan-400 mt-4">
              24
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Estudiantes conectados
            </h3>

            <h2 className="text-5xl font-bold text-cyan-400 mt-4">
              312
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Focus Rooms
            </h3>

            <h2 className="text-5xl font-bold text-cyan-400 mt-4">
              12
            </h2>
          </div>

        </div>

        <div className="flex flex-col xl:flex-row gap-6 justify-between xl:items-center mt-10">

          <input
            type="text"
            placeholder="Buscar sala..."
            className="w-full xl:w-96 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 outline-none focus:border-cyan-400"
          />

          <div className="flex gap-3 flex-wrap">

            <button className="bg-cyan-400 text-slate-950 px-5 py-2 rounded-xl font-semibold">
              Todas
            </button>

            <button className="border border-slate-700 hover:border-cyan-400 px-5 py-2 rounded-xl transition">
              Focus
            </button>

            <button className="border border-slate-700 hover:border-cyan-400 px-5 py-2 rounded-xl transition">
              Premium
            </button>

          </div>

        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {[
            { name: "Matemáticas", users: 12, focus: true, category: "Álgebra y cálculo" },
            { name: "Programación", users: 21, focus: false, premium: true, category: "JavaScript y React" },
            { name: "Física", users: 8, focus: true, category: "Mecánica clásica" },
            { name: "Idiomas", users: 15, focus: false, premium: true, category: "English & French" },
            { name: "Química", users: 6, focus: true, category: "Química orgánica" },
            { name: "Historia", users: 10, focus: false, category: "Historia universal" },
          ].map((room) => (

            <div
              key={room.name}
              className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-cyan-400 hover:-translate-y-2 transition duration-300 shadow-xl"
            >
              <div className="w-full h-32 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_40%)]"></div>
              </div>

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-cyan-400">
                    {room.name}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    {room.category}
                  </p>

                </div>

                <div className="flex gap-2 items-center">

                  {room.focus && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                        FOCUS
                      </span>
                    )}

                    <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full">
                      LIVE
                    </span>

                  </div>

              </div>
              <div className="mt-8 space-y-4">
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ width: `${room.users * 4}%` }}
                ></div>

              </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-400">
                    Estudiantes conectados
                  </span>

                  <div className="flex items-center gap-2">

                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

                    <span className="font-semibold">
                    {room.users}
                    </span>

                  </div>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-400">
                    Modo Focus
                  </span>

                  <span className={room.focus ? "text-green-400" : "text-red-400"}>
                    {room.focus ? "Activo" : "Desactivado"}
                  </span>

                </div>

              </div>

              <Link
               to="/room"
                  className="block text-center w-full mt-8 bg-cyan-400 hover:bg-cyan-300 hover:scale-[1.02] active:scale-95 text-slate-950 py-3 rounded-xl font-semibold transition duration-300 shadow-lg shadow-cyan-500/20">
                  Unirse a la sala
              </Link>
            </div>

          ))}

        </section>

      </main>

>>>>>>> origin/main
    </div>
  );
}

export default StudyRooms;