<<<<<<< HEAD
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
=======
import Sidebar from "../components/dashboard/Sidebar";
import PomodoroTimer from "../components/dashboard/PomodoroTimer";

function RoomView() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex flex-col lg:flex-row gap-8">

          <div className="flex-1">

            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">

              <div className="flex items-center justify-between">

                <div>

                  <h1 className="text-4xl font-bold">
                    Sala Matemáticas
                  </h1>

                  <p className="text-slate-400 mt-3">
                    Álgebra y cálculo colaborativo
                  </p>
                  <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-5">

                    <h3 className="text-cyan-400 font-semibold">
                        Objetivo de la sesión
                    </h3>

                    <p className="text-slate-300 mt-3 leading-relaxed">
                        Resolver ejercicios de derivadas parciales y reforzar técnicas
                        de integración para el examen final.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

                        <p className="text-slate-400 text-sm">
                        Tiempo promedio
                        </p>

                        <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                        2h 14m
                        </h2>

                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

                        <p className="text-slate-400 text-sm">
                        Participación
                        </p>

                        <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                        87%
                        </h2>

                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

                        <p className="text-slate-400 text-sm">
                        Pomodoros completados
                        </p>

                        <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                        32
                        </h2>

                    </div>

                    </div>

                    </div>

                </div>

                <div className="flex gap-2">

                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                    FOCUS
                  </span>

                  <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full">
                    LIVE
                  </span>

                </div>

              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">

                {["Ana", "Luis", "Carlos", "María"].map((user) => (

                  <div
                    key={user}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center"
                  >

                    <div className="relative w-16 h-16 mx-auto mb-4">

                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>

                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-slate-900"></span>

                    </div>

                    <h3 className="font-semibold">
                      {user}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      Estudiando
                    </p>

                  </div>

                ))}

              </div>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mt-8">

              <h2 className="text-2xl font-bold">
                Chat de estudio
              </h2>

              <div className="space-y-5 mt-8 max-h-[400px] overflow-y-auto pr-2">

                <div className="bg-slate-950 rounded-2xl p-4">
                  <span className="text-cyan-400 font-semibold">
                    Ana:
                  </span>

                  <p className="text-slate-300 mt-2">
                    ¿Alguien entiende el ejercicio 4?
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex gap-3 mt-8">

                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                        />

                        <button className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 rounded-2xl font-semibold transition">
                            Enviar
                        </button>

                    </div>          
                  <span className="text-cyan-400 font-semibold">
                    Luis:
                  </span>

                  <p className="text-slate-300 mt-2">
                    Sí, usa derivadas parciales.
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="w-full lg:w-[420px]">

            <PomodoroTimer />

          </div>

        </div>

      </main>

>>>>>>> origin/main
    </div>
  );
}

export default RoomView;