import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Focus,
  LogOut,
  MessageCircle,
  Send,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import RoomPomodoro from "../../components/dashboard/RoomPomodoro";

import "../../styles/shared/RoomView.css";

const participants = [
  { name: "Ana", initials: "AN", status: "Estudiando" },
  { name: "Luis", initials: "LU", status: "Resolviendo ejercicios" },
  { name: "Carlos", initials: "CA", status: "Modo Focus" },
  { name: "María", initials: "MA", status: "Tomando apuntes" },
];

const initialMessages = [
  {
    id: 1,
    author: "Ana",
    text: "¿Alguien entiende el ejercicio 4?",
    time: "Hace 3 min",
  },
  {
    id: 2,
    author: "Luis",
    text: "Sí, usa derivadas parciales y aplica la regla de la cadena.",
    time: "Hace 2 min",
  },
];

const SESSION_API = "http://localhost:8080/api/sessions";

function RoomView() {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;

  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState("");

  const [studySessionId, setStudySessionId] = useState(null);
  const [startingSession, setStartingSession] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const sessionStartedRef = useRef(false);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    if (!room?.id || !storedUser?.id) return;
    if (sessionStartedRef.current) return;

    sessionStartedRef.current = true;

    const startStudySession = async () => {
      setStartingSession(true);
      setSessionError("");

      try {
        const response = await fetch(`${SESSION_API}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: Number(storedUser.id),
            roomId: Number(room.id),
          }),
        });

        if (!response.ok) {
          throw new Error(`No fue posible iniciar la sesión: ${response.status}`);
        }

        const session = await response.json();
        setStudySessionId(session.id);
      } catch (error) {
        console.error("Error iniciando sesión de estudio:", error);
        sessionStartedRef.current = false;
        setSessionError("No fue posible registrar el inicio de la sesión.");
      } finally {
        setStartingSession(false);
      }
    };

    startStudySession();
  }, [room?.id, storedUser?.id]);

  const finishStudySession = async () => {
    if (!studySessionId) {
      return true;
    }

    try {
      const response = await fetch(
        `${SESSION_API}/${studySessionId}/finish`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          `No fue posible finalizar la sesión: ${response.status}`
        );
      }

      setStudySessionId(null);

      return true;
    } catch (error) {
      console.error(
        "Error finalizando sesión de estudio:",
        error
      );

      setSessionError(
        "No fue posible registrar el final de la sesión."
      );

      return false;
    }
  };

  const handleLeaveRoom = async () => {
    const finished = await finishStudySession();

    if (!finished) {
      return;
    }

    navigate("/salas");
  };

  if (!room) {
    return (
      <div className="room-view-layout">
        <Sidebar />

        <main className="room-view-content">
          <section className="room-view-hero">
            <div>
              <span className="room-view-eyebrow">
                <Sparkles size={15} />
                Sesión colaborativa
              </span>

              <h1>Sala no encontrada</h1>

              <p>
                No se recibió información de la sala seleccionada.
              </p>

              <button
                type="button"
                onClick={() => navigate("/salas")}
              >
                Volver a salas
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        author: storedUser.name || "Usuario",
        text: trimmedMessage,
        time: "Ahora",
      },
    ]);

    setMessageText("");
  };

  return (
    <div className="room-view-layout">
      <Sidebar />

      <main className="room-view-content">
        <section className="room-view-hero">
          <div>
            <span className="room-view-eyebrow">
              <Sparkles size={15} />
              Sesión colaborativa
            </span>

            <h1>{room.nombre || "Sala StudySync"}</h1>

            <p>
              {room.descripcion ||
                "Sala de estudio colaborativo"}
            </p>

            {sessionError && (
              <p style={{ color: "#ff6b6b" }}>
                {sessionError}
              </p>
            )}
          </div>

          <div className="room-view-statuses">
            <span className="room-view-badge room-view-badge-focus">
              <Focus size={14} />
              Focus
            </span>

            <span className="room-view-badge room-view-badge-live">
              <span />
              {startingSession
                ? "Iniciando sesión..."
                : studySessionId
                ? "Sesión activa"
                : "Disponible"}
            </span>

            <button
              type="button"
              className="room-view-badge room-view-badge-live"
              onClick={handleLeaveRoom}
              disabled={startingSession}
            >
              <LogOut size={14} />
              Salir de sala
            </button>
          </div>
        </section>

        <section className="room-view-grid">
          <div className="room-view-main-column">
            <article className="room-session-card">
              <div className="room-session-header">
                <div>
                  <span className="room-section-label">
                    Objetivo
                  </span>
                  <h2>Información de la sala</h2>
                </div>

                <div className="room-session-icon">
                  <BookOpen size={22} />
                </div>
              </div>

              <p className="room-session-description">
                {room.descripcion ||
                  "Sala de estudio colaborativo"}
              </p>

              <div className="room-session-stats">
                <article>
                  <div>
                    <Users size={19} />
                  </div>

                  <span>Tipo de acceso</span>
                  <strong>
                    {room.privada ? "Privada" : "Pública"}
                  </strong>
                </article>

                <article>
                  <div>
                    <Video size={19} />
                  </div>

                  <span>Estado</span>
                  <strong>
                    {studySessionId
                      ? "Sesión activa"
                      : "Disponible"}
                  </strong>
                </article>

                <article>
                  <div>
                    <Focus size={19} />
                  </div>

                  <span>Creador</span>
                  <strong>
                    {Number(room.creadorId) ===
                    Number(storedUser.id)
                      ? storedUser.name || "Tú"
                      : `Usuario ${room.creadorId}`}
                  </strong>
                </article>
              </div>
            </article>

            <article className="room-participants-card">
              <div className="room-card-header">
                <div>
                  <span className="room-section-label">
                    Participantes
                  </span>
                  <h2>Estudiantes conectados</h2>
                </div>

                <span className="room-connected-count">
                  <Users size={16} />
                  {participants.length} conectados
                </span>
              </div>

              <div className="room-participants-grid">
                {participants.map((participant) => (
                  <article
                    className="room-participant-item"
                    key={participant.name}
                  >
                    <div className="room-participant-avatar">
                      {participant.initials}
                      <span />
                    </div>

                    <strong>{participant.name}</strong>
                    <small>{participant.status}</small>
                  </article>
                ))}
              </div>
            </article>

            <article className="room-chat-card">
              <div className="room-card-header">
                <div>
                  <span className="room-section-label">
                    Conversación
                  </span>
                  <h2>Chat de estudio</h2>
                </div>

                <div className="room-chat-icon">
                  <MessageCircle size={20} />
                </div>
              </div>

              <div className="room-chat-messages">
                {messages.map((message) => (
                  <article
                    className="room-chat-message"
                    key={message.id}
                  >
                    <div className="room-chat-avatar">
                      {message.author
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div className="room-chat-message-meta">
                        <strong>{message.author}</strong>
                        <span>{message.time}</span>
                      </div>

                      <p>{message.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <form
                className="room-chat-form"
                onSubmit={handleSubmitMessage}
              >
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={messageText}
                  onChange={(event) =>
                    setMessageText(event.target.value)
                  }
                />

                <button
                  type="submit"
                  aria-label="Enviar mensaje"
                >
                  <Send size={18} />
                  Enviar
                </button>
              </form>
            </article>
          </div>

          <aside className="room-view-side-column">
            <article className="room-live-card">
              <div className="room-live-card-header">
                <div>
                  <span className="room-section-label">
                    Estado
                  </span>

                  <h2>
                    {studySessionId
                      ? "Sesión en curso"
                      : "Sala disponible"}
                  </h2>
                </div>

                <Video size={22} />
              </div>

              <div className="room-live-card-status">
                <span />

                {studySessionId
                  ? "Estudiando ahora"
                  : room.privada
                  ? "Acceso restringido"
                  : "Acceso público"}
              </div>

              <p>
                {studySessionId
                  ? "Tu tiempo de estudio está siendo registrado por StudySync."
                  : "Esta sala está registrada en StudySync y lista para una sesión de estudio."}
              </p>
            </article>

            <RoomPomodoro />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default RoomView;