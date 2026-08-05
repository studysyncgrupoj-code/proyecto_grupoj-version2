import { useMemo, useState } from "react";
import {
  Bot,
  CheckCheck,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Users,
  Video,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/shared/Mensajes.css";
const conversations = [
  {
    id: 1,
    name: "Ana Martínez",
    initials: "AM",
    type: "Estudiante",
    preview: "¿Terminamos hoy la práctica de React?",
    time: "10:42",
    online: true,
    unread: 2,
  },
  {
    id: 2,
    name: "Luis Hernández",
    initials: "LH",
    type: "Estudiante",
    preview: "Te envié los ejercicios de SQL.",
    time: "09:18",
    online: true,
    unread: 0,
  },
  {
    id: 3,
    name: "Profesor Camilo",
    initials: "PC",
    type: "Profesor",
    preview: "La próxima clase comienza a las 3:00.",
    time: "Ayer",
    online: false,
    unread: 1,
  },
  {
    id: 4,
    name: "Grupo React",
    initials: "GR",
    type: "Grupo · 14 miembros",
    preview: "María: Ya subí el proyecto.",
    time: "Ayer",
    online: true,
    unread: 4,
  },
  {
    id: 5,
    name: "StudySync Coach",
    initials: "IA",
    type: "Asistente de IA",
    preview: "Puedo ayudarte a organizar tu sesión.",
    time: "Lun",
    online: true,
    unread: 0,
    assistant: true,
  },
];

const initialMessages = {
  1: [
    {
      id: 1,
      sender: "Ana Martínez",
      text: "Hola Richard, ¿pudiste revisar el ejercicio de componentes?",
      time: "10:31",
      own: false,
    },
    {
      id: 2,
      sender: "Richard",
      text: "Sí. La estructura está bien, pero debemos separar mejor los componentes.",
      time: "10:34",
      own: true,
    },
    {
      id: 3,
      sender: "Ana Martínez",
      text: "Perfecto. ¿Terminamos hoy la práctica de React?",
      time: "10:42",
      own: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: "Luis Hernández",
      text: "Te envié los ejercicios de SQL para que los revisemos.",
      time: "09:18",
      own: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: "Profesor Camilo",
      text: "Recuerda que la próxima clase comienza a las 3:00.",
      time: "Ayer",
      own: false,
    },
  ],
  4: [
    {
      id: 1,
      sender: "María",
      text: "Ya subí el proyecto del grupo.",
      time: "Ayer",
      own: false,
    },
  ],
  5: [
    {
      id: 1,
      sender: "StudySync Coach",
      text: "Hola. Puedo ayudarte a organizar tareas, cursos y sesiones de estudio.",
      time: "Lun",
      own: false,
    },
  ],
};

function Mensajes() {
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? conversations[0];

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.type}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [searchTerm]);

  const currentMessages = messages[selectedConversationId] ?? [];

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: "Richard",
      text: trimmedMessage,
      time: "Ahora",
      own: true,
    };

    setMessages((currentMessagesState) => ({
      ...currentMessagesState,
      [selectedConversationId]: [
        ...(currentMessagesState[selectedConversationId] ?? []),
        newMessage,
      ],
    }));

    setMessageText("");
  };

  return (
    <div className="messages-layout">
      <Sidebar />

      <main className="messages-content">
        <header className="messages-page-header">
          <div>
            <span className="messages-eyebrow">
              <Users size={15} />
              Centro de comunicación
            </span>

            <h1>Mensajes</h1>

            <p>
              Conversa con estudiantes, profesores, grupos y tu asistente de IA.
            </p>
          </div>

          <button type="button" className="messages-new-button">
            <Send size={18} />
            Nuevo mensaje
          </button>
        </header>

        <section className="messages-workspace">
          <aside className="messages-conversations-panel">
            <div className="messages-conversations-header">
              <div>
                <span>Conversaciones</span>
                <strong>{conversations.length}</strong>
              </div>

              <button type="button" aria-label="Opciones">
                <MoreHorizontal size={19} />
              </button>
            </div>

            <label className="messages-search-box">
              <Search size={18} />

              <input
                type="search"
                placeholder="Buscar conversación..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="messages-conversation-list">
              {filteredConversations.map((conversation) => (
                <button
                  type="button"
                  className={`messages-conversation-item ${
                    selectedConversationId === conversation.id ? "active" : ""
                  }`}
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                >
                  <div
                    className={`messages-avatar ${
                      conversation.assistant ? "assistant" : ""
                    }`}
                  >
                    {conversation.assistant ? (
                      <Bot size={21} />
                    ) : (
                      conversation.initials
                    )}

                    {conversation.online && <span />}
                  </div>

                  <div className="messages-conversation-copy">
                    <div>
                      <strong>{conversation.name}</strong>
                      <time>{conversation.time}</time>
                    </div>

                    <span>{conversation.type}</span>

                    <p>{conversation.preview}</p>
                  </div>

                  {conversation.unread > 0 && (
                    <span className="messages-unread-badge">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <section className="messages-chat-panel">
            <header className="messages-chat-header">
              <div className="messages-contact">
                <div
                  className={`messages-avatar ${
                    selectedConversation.assistant ? "assistant" : ""
                  }`}
                >
                  {selectedConversation.assistant ? (
                    <Bot size={21} />
                  ) : (
                    selectedConversation.initials
                  )}

                  {selectedConversation.online && <span />}
                </div>

                <div>
                  <strong>{selectedConversation.name}</strong>

                  <span>
                    {selectedConversation.online
                      ? "En línea"
                      : selectedConversation.type}
                  </span>
                </div>
              </div>

              <div className="messages-chat-actions">
                <button type="button" aria-label="Llamar">
                  <Phone size={18} />
                </button>

                <button type="button" aria-label="Videollamada">
                  <Video size={18} />
                </button>

                <button type="button" aria-label="Más opciones">
                  <MoreHorizontal size={19} />
                </button>
              </div>
            </header>

            <div className="messages-chat-body">
              <div className="messages-date-divider">
                <span>Hoy</span>
              </div>

              {currentMessages.map((message) => (
                <article
                  className={`messages-message ${
                    message.own ? "own" : ""
                  }`}
                  key={message.id}
                >
                  {!message.own && (
                    <div className="messages-message-avatar">
                      {selectedConversation.initials}
                    </div>
                  )}

                  <div className="messages-message-content">
                    {!message.own && <strong>{message.sender}</strong>}

                    <p>{message.text}</p>

                    <span>
                      {message.time}
                      {message.own && <CheckCheck size={14} />}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <form className="messages-composer" onSubmit={handleSubmit}>
              <button type="button" aria-label="Adjuntar archivo">
                <Paperclip size={19} />
              </button>

              <input
                type="text"
                placeholder={`Escribe un mensaje a ${selectedConversation.name}...`}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
              />

              <button type="button" aria-label="Agregar emoji">
                <Smile size={19} />
              </button>

              <button
                type="submit"
                className="messages-send-button"
                aria-label="Enviar mensaje"
              >
                <Send size={18} />
              </button>
            </form>
          </section>

          <aside className="messages-profile-panel">
            <div
              className={`messages-profile-avatar ${
                selectedConversation.assistant ? "assistant" : ""
              }`}
            >
              {selectedConversation.assistant ? (
                <Bot size={38} />
              ) : (
                selectedConversation.initials
              )}

              {selectedConversation.online && <span />}
            </div>

            <h2>{selectedConversation.name}</h2>
            <p>{selectedConversation.type}</p>

            <div className="messages-profile-status">
              <span />
              {selectedConversation.online ? "Disponible" : "Desconectado"}
            </div>

            <div className="messages-profile-stats">
              <article>
                <strong>18</strong>
                <span>Mensajes</span>
              </article>

              <article>
                <strong>4</strong>
                <span>Salas</span>
              </article>
            </div>

            <div className="messages-profile-info">
              <span>Curso actual</span>
              <strong>React avanzado</strong>

              <span>Última actividad</span>
              <strong>Hace 3 minutos</strong>

              <span>Zona horaria</span>
              <strong>Bogotá, Colombia</strong>
            </div>

            <button type="button" className="messages-profile-button">
              Ver perfil
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Mensajes;