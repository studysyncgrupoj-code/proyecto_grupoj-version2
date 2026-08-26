import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Crown,
  DoorOpen,
  Focus,
  Search,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/shared/StudyRooms.css";

const API_URL = "http://localhost:8080/api/rooms";

function StudyRooms() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let storedUser = {};

  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (storageError) {
    console.error("No fue posible leer el usuario:", storageError);
  }

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("No fue posible consultar las salas");
      }

      const data = await response.json();

      setRooms(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error("Error cargando salas:", requestError);
      setError("No fue posible cargar las salas de estudio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    nombre: "",
    descripcion: "",
    privada: false,
  });

  const openCreateModal = () => {
    if (!storedUser.id) {
      alert("Debes iniciar sesión para crear una sala.");
      return;
    }
    setRoomForm({ nombre: "", descripcion: "", privada: false });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateRoom = async (event) => {
    event.preventDefault();

    const nombre = roomForm.nombre.trim();
    const descripcion =
      roomForm.descripcion.trim() || "Sala de estudio colaborativo";

    if (!nombre) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          privada: roomForm.privada,
          creadorId: storedUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible crear la sala");
      }

      const createdRoom = await response.json();
      setRooms((currentRooms) => [...currentRooms, createdRoom]);

      setShowCreateModal(false);
      setRoomForm({ nombre: "", descripcion: "", privada: false });
    } catch (requestError) {
      console.error("Error creando sala:", requestError);
      alert(
        "No fue posible crear la sala. Verifica que el backend esté ejecutándose."
      );
    }
  };

  const filteredRooms = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return rooms.filter((room) => {
      const roomName = (room.nombre || "").toLowerCase();
      const description = (
        room.descripcion || ""
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        roomName.includes(normalizedSearch) ||
        description.includes(normalizedSearch);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "private" &&
          room.privada === true) ||
        (activeFilter === "public" &&
          room.privada !== true);

      return matchesSearch && matchesFilter;
    });
  }, [rooms, searchTerm, activeFilter]);

  const privateRooms = rooms.filter(
    (room) => room.privada === true
  ).length;

  const publicRooms =
    rooms.length - privateRooms;

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
              Encuentra una comunidad, activa tu concentración
              y estudia en tiempo real.
            </p>
          </div>

          <div className="rooms-topbar-actions">
            <Link
              to="/pomodoro"
              className="rooms-secondary-button"
            >
              <Focus size={18} />
              Focus Mode
            </Link>

            <button
              type="button"
              className="rooms-primary-button"
              onClick={openCreateModal}
            >
              <Video size={18} />
              Crear sala
            </button>
          </div>
        </header>

        <section className="rooms-live-banner">
          <div className="rooms-live-status">
            <span className="rooms-live-dot" />

            <div>
              <strong>
                Salas disponibles en StudySync
              </strong>

              <span>
                {rooms.length} sala
                {rooms.length !== 1 ? "s" : ""} registrada
                {rooms.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="rooms-live-meta">
            <span>
              <Video size={16} />
              {publicRooms} públicas
            </span>

            <span>
              <Crown size={16} />
              {privateRooms} privadas
            </span>
          </div>
        </section>

        <section className="rooms-stats-grid">
          <article className="rooms-stat-card">
            <div className="rooms-stat-icon">
              <Video size={22} />
            </div>

            <div>
              <span>Salas registradas</span>
              <strong>{rooms.length}</strong>
              <small>Datos reales del backend</small>
            </div>
          </article>

          <article className="rooms-stat-card">
            <div className="rooms-stat-icon">
              <Users size={22} />
            </div>

            <div>
              <span>Salas públicas</span>
              <strong>{publicRooms}</strong>
              <small>Acceso abierto</small>
            </div>
          </article>

          <article className="rooms-stat-card">
            <div className="rooms-stat-icon">
              <Crown size={22} />
            </div>

            <div>
              <span>Salas privadas</span>
              <strong>{privateRooms}</strong>
              <small>Acceso restringido</small>
            </div>
          </article>
        </section>

        <section className="rooms-toolbar">
          <div className="rooms-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="rooms-filters">
            <button
              type="button"
              className={
                activeFilter === "all" ? "active" : ""
              }
              onClick={() =>
                setActiveFilter("all")
              }
            >
              Todas
            </button>

            <button
              type="button"
              className={
                activeFilter === "public" ? "active" : ""
              }
              onClick={() =>
                setActiveFilter("public")
              }
            >
              <Users size={16} />
              Públicas
            </button>

            <button
              type="button"
              className={
                activeFilter === "private" ? "active" : ""
              }
              onClick={() =>
                setActiveFilter("private")
              }
            >
              <Crown size={16} />
              Privadas
            </button>
          </div>
        </section>

        <section className="rooms-section-header">
          <div>
            <span>Explorar salas</span>
            <h2>Encuentra tu próxima sesión</h2>
          </div>

          <p>
            {filteredRooms.length} sala
            {filteredRooms.length !== 1 ? "s" : ""} disponible
            {filteredRooms.length !== 1 ? "s" : ""}
          </p>
        </section>

        {loading && (
          <section className="rooms-empty-state">
            <Video size={34} />
            <h3>Cargando salas...</h3>
            <p>
              Consultando información de StudySync.
            </p>
          </section>
        )}

        {!loading && error && (
          <section className="rooms-empty-state">
            <Search size={34} />
            <h3>No fue posible cargar las salas</h3>
            <p>{error}</p>

            <button
              type="button"
              className="rooms-primary-button"
              onClick={loadRooms}
            >
              Intentar nuevamente
            </button>
          </section>
        )}

        {!loading && !error && (
          <section className="rooms-grid">
            {filteredRooms.map((room) => {
              const isCreator =
                Number(room.creadorId) ===
                Number(storedUser.id);

              const creatorName = isCreator
                ? storedUser.name || "Tú"
                : `Usuario ${room.creadorId}`;

              return (
                <article
                  className="room-card"
                  key={room.id}
                >
                  <div className="room-card-cover">
                    <div className="room-card-cover-icon">
                      <BookOpen size={30} />
                    </div>

                    <div className="room-card-badges">
                      {room.privada ? (
                        <span className="room-badge room-badge-premium">
                          <Crown size={13} />
                          Privada
                        </span>
                      ) : (
                        <span className="room-badge room-badge-focus">
                          <Users size={13} />
                          Pública
                        </span>
                      )}

                      <span className="room-badge room-badge-live">
                        <span />
                        Disponible
                      </span>
                    </div>
                  </div>

                  <div className="room-card-body">
                    <div className="room-card-heading">
                      <div>
                        <h3>
                          {room.nombre || "Sala StudySync"}
                        </h3>

                        <p>
                          {room.descripcion ||
                            "Sala de estudio colaborativo"}
                        </p>
                      </div>
                    </div>

                    <div className="room-details">
                      <div>
                        <Users size={16} />

                        <span>
                          <small>Creador</small>
                          <strong>{creatorName}</strong>
                        </span>
                      </div>

                      <div>
                        <Video size={16} />

                        <span>
                          <small>Acceso</small>
                          <strong>
                            {room.privada
                              ? "Privado"
                              : "Público"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="room-card-footer">
                      <span
                        className={
                          room.privada
                            ? "room-focus-status"
                            : "room-focus-status active"
                        }
                      >
                        <span />
                        {room.privada
                          ? "Acceso restringido"
                          : "Acceso disponible"}
                      </span>

                      <Link
                        to="/room"
                        state={{ room }}
                        className="room-join-button"
                      >
                        <DoorOpen size={18} />
                        Entrar
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {!loading &&
          !error &&
          filteredRooms.length === 0 && (
            <section className="rooms-empty-state">
              <Search size={34} />
              <h3>No encontramos salas</h3>
              <p>
                Prueba con otra búsqueda, cambia el filtro
                o crea una nueva sala.
              </p>
            </section>
          )}
        {showCreateModal && (
          <div
            className="rooms-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeCreateModal();
            }}
          >
            <section
              className="rooms-create-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-room-title"
            >
              <div className="rooms-create-modal-header">
                <div>
                  <span className="rooms-eyebrow">
                    <Sparkles size={15} />
                    Nueva sala
                  </span>
                  <h2 id="create-room-title">Crear sala de estudio</h2>
                  <p>Configura tu espacio y empieza una nueva sesión.</p>
                </div>

                <button
                  type="button"
                  className="rooms-modal-close"
                  onClick={closeCreateModal}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <form className="rooms-create-form" onSubmit={handleCreateRoom}>
                <label>
                  <span>Nombre de la sala</span>
                  <input
                    type="text"
                    autoFocus
                    maxLength={80}
                    placeholder="Escribe el nombre de la sala"
                    value={roomForm.nombre}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        nombre: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  <span>Descripción</span>
                  <textarea
                    rows={4}
                    maxLength={220}
                    placeholder="Describe el objetivo de esta sala"
                    value={roomForm.descripcion}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        descripcion: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="rooms-private-option">
                  <div>
                    <strong>Sala privada</strong>
                    <small>Actívala si quieres restringir el acceso.</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={roomForm.privada}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        privada: event.target.checked,
                      }))
                    }
                  />
                </label>

                <div className="rooms-create-modal-actions">
                  <button
                    type="button"
                    className="rooms-secondary-button"
                    onClick={closeCreateModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rooms-primary-button"
                    disabled={!roomForm.nombre.trim()}
                  >
                    <Video size={18} />
                    Crear sala
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudyRooms;