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
import JitsiMeeting from "../../components/rooms/JitsiMeeting";

import "../../styles/shared/RoomView.css";

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
const ROOMS_API = "http://localhost:8080/api/rooms";

function RoomView() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRoom = location.state?.room;
  const [room, setRoom] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessError, setAccessError] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsError, setRequestsError] = useState("");
  const [respondingRequestId, setRespondingRequestId] = useState(null);
  const token = localStorage.getItem("token");

  const [jitsiParticipants, setJitsiParticipants] = useState([]);
  useEffect(() => {
  console.log("Participantes reales de Jitsi:", jitsiParticipants);
}, [jitsiParticipants]);

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
    let cancelled = false;
    const checkAccess = async () => {
      setCheckingAccess(true);
      setAccessError("");
      setRoom(null);
      if (!initialRoom?.id || !token) {
        if (!cancelled) {
          setAccessError(!token ? "Debes iniciar sesión para acceder." : "Sala no encontrada.");
          setCheckingAccess(false);
        }
        return;
      }
      try {
        const response = await fetch(`${ROOMS_API}/${initialRoom.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Error al consultar la sala: ${response.status}`);
        const verifiedRoom = await response.json();
        if (verifiedRoom.estado !== "ACTIVA") {
          throw new Error("La sala no está activa.");
        }
        if (!verifiedRoom.meetingUrl) {
          throw new Error("No tienes acceso a esta sala o su enlace no está disponible.");
        }
        if (!cancelled) setRoom(verifiedRoom);
      } catch (error) {
        if (!cancelled) setAccessError(error.message || "No fue posible acceder a la sala.");
      } finally {
        if (!cancelled) setCheckingAccess(false);
      }
    };
    checkAccess();
    return () => { cancelled = true; };
  }, [initialRoom?.id, token]);

  const isPrivateHost = Boolean(room?.privada) &&
    Number(room?.creadorId) === Number(storedUser.id);

  useEffect(() => {
    if (!isPrivateHost || room?.estado !== "ACTIVA" || !token) {
      setPendingRequests([]);
      return;
    }
    let cancelled = false;
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch(`${ROOMS_API}/${room.id}/solicitudes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Error al consultar solicitudes: ${response.status}`);
        const data = await response.json();
        if (!cancelled) {
          setPendingRequests(Array.isArray(data) ? data : []);
          setRequestsError("");
        }
      } catch (error) {
        if (!cancelled) setRequestsError(error.message || "No fue posible consultar las solicitudes.");
      }
    };
    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isPrivateHost, room?.id, room?.estado, token]);

  const handleRespondRequest = async (requestId, action) => {
    if (!isPrivateHost || respondingRequestId !== null) return;
    setRespondingRequestId(requestId);
    setRequestsError("");
    try {
      const response = await fetch(
        `${ROOMS_API}/${room.id}/solicitudes/${requestId}/${action}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error(`No fue posible responder a la solicitud: ${response.status}`);
      setPendingRequests((current) => current.filter((request) => request.id !== requestId));
    } catch (error) {
      setRequestsError(error.message || "No fue posible responder a la solicitud.");
    } finally {
      setRespondingRequestId(null);
    }
  };

  useEffect(() => {
    if (!room?.id || !token || sessionStartedRef.current) return;
    sessionStartedRef.current = true;
    let cancelled = false;
    const startStudySession = async () => {
      setStartingSession(true);
      setSessionError("");
      try {
        const response = await fetch(`${SESSION_API}/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ roomId: Number(room.id) }),
        });
        if (!response.ok) throw new Error(`No fue posible iniciar la sesión: ${response.status}`);
        const session = await response.json();
        if (!cancelled) setStudySessionId(session.id);
      } catch (error) {
        console.error("Error iniciando sesión de estudio:", error);
        if (!cancelled) setSessionError("No fue posible registrar el inicio de la sesión.");
      } finally {
        if (!cancelled) setStartingSession(false);
      }
    };
    startStudySession();
    return () => { cancelled = true; };
  }, [room?.id, token]);

  const finishStudySession = async () => {
    if (!studySessionId) {
      return true;
    }

    try {
      const response = await fetch(
        `${SESSION_API}/${studySessionId}/finish`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
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

              <h1>{checkingAccess ? "Verificando acceso..." : "No se pudo acceder a la sala"}</h1>

              <p>{checkingAccess ? "Consultando permisos con StudySync." : accessError}</p>

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

            
                
            {isPrivateHost && room.estado === "ACTIVA" && (
              <article className="room-session-card" aria-label="Solicitudes de acceso">
                <div className="room-session-header">
                  <div>
                    <span className="room-section-label">Administración de sala privada</span>
                    <h2>Solicitudes de acceso ({pendingRequests.length} pendientes)</h2>
                  </div>
                  <Users size={22} />
                </div>
                {requestsError && (
                  <p role="alert" style={{ color: "#d9534f", marginTop: 12 }}>{requestsError}</p>
                )}
                {pendingRequests.length === 0 ? (
                  <p className="room-session-description">No hay solicitudes pendientes.</p>
                ) : pendingRequests.map((request) => (
                  <div key={request.id} style={{ padding: "14px 0", borderTop: "1px solid #ddd" }}>
                    <p>Estudiante (usuario {request.userId}) desea unirse a tu sala privada «{room.nombre}».</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                      <button type="button" disabled={respondingRequestId !== null}
                        onClick={() => handleRespondRequest(request.id, "aprobar")}
                        style={{ padding: "10px 16px", cursor: "pointer" }}>
                        {respondingRequestId === request.id ? "Procesando..." : "Aceptar solicitud"}
                      </button>
                      <button type="button" disabled={respondingRequestId !== null}
                        onClick={() => handleRespondRequest(request.id, "rechazar")}
                        style={{ padding: "10px 16px", cursor: "pointer" }}>
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </article>
            )}

            {room.estado === "ACTIVA" && room.meetingUrl && (
              <JitsiMeeting
                meetingUrl={room.meetingUrl}
                displayName={storedUser.name || "Participante StudySync"}
                onParticipantsChange={setJitsiParticipants}
              />
            )}


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
                  {jitsiParticipants.length} conectados
                </span>
              </div>

              <div className="room-participants-grid">
                {jitsiParticipants.map((participant) => (
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
