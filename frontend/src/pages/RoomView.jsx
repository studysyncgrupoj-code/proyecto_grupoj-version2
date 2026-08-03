import { useState } from "react";
import {
  BookOpen,
  Clock3,
  Focus,
  MessageCircle,
  Send,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import PomodoroTimer from "../components/dashboard/PomodoroTimer";

import "./RoomView.css";

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

function RoomView() {
  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState("");

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
        author: "Richard",
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

            <h1>Sala Matemáticas</h1>

            <p>
              Álgebra y cálculo colaborativo en tiempo real.
            </p>
          </div>

          <div className="room-view-statuses">
            <span className="room-view-badge room-view-badge-focus">
              <Focus size={14} />
              Focus
            </span>

            <span className="room-view-badge room-view-badge-live">
              <span />
              En vivo
            </span>
          </div>
        </section>

        <section className="room-view-grid">
          <div className="room-view-main-column">
            <article className="room-session-card">
              <div className="room-session-header">
                <div>
                  <span className="room-section-label">Objetivo</span>
                  <h2>Objetivo de la sesión</h2>
                </div>

                <div className="room-session-icon">
                  <BookOpen size={22} />
                </div>
              </div>

              <p className="room-session-description">
                Resolver ejercicios de derivadas parciales y reforzar técnicas
                de integración para el examen final.
              </p>

              <div className="room-session-stats">
                <article>
                  <div>
                    <Clock3 size={19} />
                  </div>

                  <span>Tiempo promedio</span>
                  <strong>2h 14m</strong>
                </article>

                <article>
                  <div>
                    <Users size={19} />
                  </div>

                  <span>Participación</span>
                  <strong>87%</strong>
                </article>

                <article>
                  <div>
                    <Focus size={19} />
                  </div>

                  <span>Pomodoros completados</span>
                  <strong>32</strong>
                </article>
              </div>
            </article>

            <article className="room-participants-card">
              <div className="room-card-header">
                <div>
                  <span className="room-section-label">Participantes</span>
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
                  <span className="room-section-label">Conversación</span>
                  <h2>Chat de estudio</h2>
                </div>

                <div className="room-chat-icon">
                  <MessageCircle size={20} />
                </div>
              </div>

              <div className="room-chat-messages">
                {messages.map((message) => (
                  <article className="room-chat-message" key={message.id}>
                    <div className="room-chat-avatar">
                      {message.author.slice(0, 2).toUpperCase()}
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
                  onChange={(event) => setMessageText(event.target.value)}
                />

                <button type="submit" aria-label="Enviar mensaje">
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
                  <span className="room-section-label">Estado</span>
                  <h2>Sala activa</h2>
                </div>

                <Video size={22} />
              </div>

              <div className="room-live-card-status">
                <span />
                12 estudiantes conectados
              </div>

              <p>
                La sesión se encuentra activa y sincronizada para todos los
                participantes.
              </p>
            </article>

            <div className="room-pomodoro-wrapper">
              <PomodoroTimer />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default RoomView;