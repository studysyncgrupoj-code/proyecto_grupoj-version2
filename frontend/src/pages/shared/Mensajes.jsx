import { useEffect, useMemo, useState } from "react";
import {
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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const USERS_API = `${API_BASE_URL}/api/users`;
const MESSAGES_API = `${API_BASE_URL}/api/messages`;

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase(),
    )
    .join("");
}

function getRoleLabel(role) {
  const normalizedRole =
    String(role || "").toUpperCase();

  if (normalizedRole === "ADMINISTRADOR") {
    return "Administrador";
  }

  if (normalizedRole === "PROFESOR") {
    return "Profesor";
  }

  if (normalizedRole === "ESTUDIANTE") {
    return "Estudiante";
  }

  return "Usuario";
}

function formatMessageTime(value) {
  if (!value) {
    return "";
  }

  try {
    const date = new Date(value);

    return date.toLocaleTimeString(
      "es-CO",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  } catch {
    return "";
  }
}

function Mensajes() {
  const storedUser = getStoredUser();

  const currentUserId =
    storedUser?.id;

  const [users, setUsers] =
    useState([]);

  const [selectedConversationId, setSelectedConversationId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [messageText, setMessageText] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [isLoadingUsers, setIsLoadingUsers] =
    useState(true);

  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false);

  const [error, setError] =
    useState("");

  const conversations = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.id !== currentUserId &&
          user.activo !== false,
      )
      .map((user) => {
        const name =
          `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim() ||
          user.email ||
          "Usuario StudySync";

        return {
          id: user.id,
          name,
          initials:
            getInitials(name) || "SS",
          type:
            getRoleLabel(user.rol),
          email:
            user.email ?? "",
          online: false,
          unread: 0,
          apiData: user,
        };
      });
  }, [users, currentUserId]);

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        selectedConversationId,
    ) ?? null;

  const filteredConversations =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return conversations;
      }

      return conversations.filter(
        (conversation) =>
          `${conversation.name} ${conversation.type} ${conversation.email}`
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
      );
    }, [
      searchTerm,
      conversations,
    ]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!currentUserId) {
        setError(
          "No se encontró el usuario autenticado.",
        );
        setIsLoadingUsers(false);
        return;
      }

      try {
        setIsLoadingUsers(true);
        setError("");

        const response =
          await fetch(USERS_API);

        if (!response.ok) {
          throw new Error(
            `No fue posible cargar los usuarios (${response.status}).`,
          );
        }

        const data =
          await response.json();

        const realUsers =
          Array.isArray(data)
            ? data
            : [];

        setUsers(realUsers);

        const firstAvailable =
          realUsers.find(
            (user) =>
              user.id !== currentUserId &&
              user.activo !== false,
          );

        if (firstAvailable) {
          setSelectedConversationId(
            firstAvailable.id,
          );
        }
      } catch (loadError) {
        console.error(
          "Error cargando usuarios:",
          loadError,
        );

        setError(
          "No fue posible cargar las conversaciones.",
        );
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, [currentUserId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (
        !currentUserId ||
        !selectedConversationId
      ) {
        setMessages([]);
        return;
      }

      try {
        setIsLoadingMessages(true);
        setError("");

        const response =
          await fetch(
            `${MESSAGES_API}/conversation/${currentUserId}/${selectedConversationId}`,
          );

        if (!response.ok) {
          throw new Error(
            `No fue posible cargar los mensajes (${response.status}).`,
          );
        }

        const data =
          await response.json();

        setMessages(
          Array.isArray(data)
            ? data
            : [],
        );

        await fetch(
          `${MESSAGES_API}/conversation/${currentUserId}/${selectedConversationId}/read`,
          {
            method: "PUT",
          },
        );
      } catch (loadError) {
        console.error(
          "Error cargando mensajes:",
          loadError,
        );

        setError(
          "No fue posible cargar los mensajes.",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [
    currentUserId,
    selectedConversationId,
  ]);

  const handleSelectConversation = (
    conversationId,
  ) => {
    setSelectedConversationId(
      conversationId,
    );

    setMessageText("");
    setError("");
  };

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    const trimmedMessage =
      messageText.trim();

    if (
      !trimmedMessage ||
      !currentUserId ||
      !selectedConversationId
    ) {
      return;
    }

    const payload = {
      senderId:
        currentUserId,

      recipientId:
        selectedConversationId,

      content:
        trimmedMessage,
    };

    try {
      setError("");

      const response =
        await fetch(
          MESSAGES_API,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload,
            ),
          },
        );

      if (!response.ok) {
        let message =
          `No fue posible enviar el mensaje (${response.status}).`;

        try {
          const errorData =
            await response.json();

          message =
            errorData.message ||
            errorData.error ||
            message;
        } catch {
          // El backend no devolvió JSON.
        }

        throw new Error(message);
      }

      const savedMessage =
        await response.json();

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          savedMessage,
        ],
      );

      setMessageText("");
    } catch (sendError) {
      console.error(
        "Error enviando mensaje:",
        sendError,
      );

      setError(
        sendError.message ||
          "No fue posible enviar el mensaje.",
      );
    }
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

            <h1>
              Mensajes
            </h1>

            <p>
              Conversa con estudiantes y profesores de StudySync.
            </p>
          </div>

          <button
            type="button"
            className="messages-new-button"
          >
            <Send size={18} />
            Nuevo mensaje
          </button>
        </header>

        {error && (
          <p
            style={{
              marginBottom: "14px",
            }}
          >
            {error}
          </p>
        )}

        <section className="messages-workspace">
          <aside className="messages-conversations-panel">
            <div className="messages-conversations-header">
              <div>
                <span>
                  Conversaciones
                </span>

                <strong>
                  {isLoadingUsers
                    ? "..."
                    : conversations.length}
                </strong>
              </div>

              <button
                type="button"
                aria-label="Opciones"
              >
                <MoreHorizontal
                  size={19}
                />
              </button>
            </div>

            <label className="messages-search-box">
              <Search size={18} />

              <input
                type="search"
                placeholder="Buscar conversación..."
                value={
                  searchTerm
                }
                onChange={(
                  event,
                ) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
              />
            </label>

            <div className="messages-conversation-list">
              {filteredConversations.map(
                (conversation) => (
                  <button
                    type="button"
                    className={`messages-conversation-item ${
                      selectedConversationId ===
                      conversation.id
                        ? "active"
                        : ""
                    }`}
                    key={
                      conversation.id
                    }
                    onClick={() =>
                      handleSelectConversation(
                        conversation.id,
                      )
                    }
                  >
                    <div className="messages-avatar">
                      {
                        conversation.initials
                      }

                      {conversation.online && (
                        <span />
                      )}
                    </div>

                    <div className="messages-conversation-copy">
                      <div>
                        <strong>
                          {
                            conversation.name
                          }
                        </strong>

                        <time>
                          {conversation.time ||
                            ""}
                        </time>
                      </div>

                      <span>
                        {
                          conversation.type
                        }
                      </span>

                      <p>
                        {
                          conversation.email
                        }
                      </p>
                    </div>

                    {conversation.unread >
                      0 && (
                      <span className="messages-unread-badge">
                        {
                          conversation.unread
                        }
                      </span>
                    )}
                   </button>
                ))}

              {!isLoadingUsers &&
                filteredConversations.length ===
                  0 && (
                  <div
                    style={{
                      padding:
                        "20px",
                    }}
                  >
                    No hay usuarios disponibles.
                  </div>
                )}
            </div>
          </aside>

          <section className="messages-chat-panel">
            {selectedConversation ? (
              <>
                <header className="messages-chat-header">
                  <div className="messages-contact">
                    <div className="messages-avatar">
                      {
                        selectedConversation.initials
                      }
                    </div>

                    <div>
                      <strong>
                        {
                          selectedConversation.name
                        }
                      </strong>

                      <span>
                        {
                          selectedConversation.type
                        }
                      </span>
                    </div>
                  </div>

                  <div className="messages-chat-actions">
                    <button
                      type="button"
                      aria-label="Llamar"
                    >
                      <Phone
                        size={18}
                      />
                    </button>

                    <button
                      type="button"
                      aria-label="Videollamada"
                    >
                      <Video
                        size={18}
                      />
                    </button>

                    <button
                      type="button"
                      aria-label="Más opciones"
                    >
                      <MoreHorizontal
                        size={19}
                      />
                    </button>
                  </div>
                </header>

                <div className="messages-chat-body">
                  <div className="messages-date-divider">
                    <span>
                      Conversación
                    </span>
                  </div>

                  {isLoadingMessages ? (
                    <div
                      style={{
                        padding:
                          "20px",
                      }}
                    >
                      Cargando mensajes...
                    </div>
                  ) : messages.length ===
                    0 ? (
                    <div
                      style={{
                        padding:
                          "20px",
                      }}
                    >
                      Aún no hay mensajes con este usuario.
                    </div>
                  ) : (
                    messages.map(
                      (message) => {
                        const own =
                          Number(
                            message.senderId,
                          ) ===
                          Number(
                            currentUserId,
                          );

                        return (
                          <article
                            className={`messages-message ${
                              own
                                ? "own"
                                : ""
                            }`}
                            key={
                              message.id
                            }
                          >
                            {!own && (
                              <div className="messages-message-avatar">
                                {
                                  selectedConversation.initials
                                }
                              </div>
                            )}

                            <div className="messages-message-content">
                              {!own && (
                                <strong>
                                  {
                                    selectedConversation.name
                                  }
                                </strong>
                              )}

                              <p>
                                {
                                  message.content
                                }
                              </p>

                              <span>
                                {formatMessageTime(
                                  message.sentAt,
                                )}

                                {own && (
                                  <CheckCheck
                                    size={14}
                                  />
                                )}
                              </span>
                            </div>
                          </article>
                        );
                      },
                    )
                  )}
                </div>

                <form
                  className="messages-composer"
                  onSubmit={
                    handleSubmit
                  }
                >
                  <button
                    type="button"
                    aria-label="Adjuntar archivo"
                  >
                    <Paperclip
                      size={19}
                    />
                  </button>

                  <input
                    type="text"
                    placeholder={`Escribe un mensaje a ${selectedConversation.name}...`}
                    value={
                      messageText
                    }
                    onChange={(
                      event,
                    ) =>
                      setMessageText(
                        event.target.value,
                      )
                    }
                  />

                  <button
                    type="button"
                    aria-label="Agregar emoji"
                  >
                    <Smile
                      size={19}
                    />
                  </button>

                  <button
                    type="submit"
                    className="messages-send-button"
                    aria-label="Enviar mensaje"
                  >
                    <Send
                      size={18}
                    />
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  padding: "30px",
                }}
              >
                Selecciona un usuario para comenzar una conversación.
              </div>
            )}
          </section>

          <aside className="messages-profile-panel">
            {selectedConversation ? (
              <>
                <div className="messages-profile-avatar">
                  {
                    selectedConversation.initials
                  }
                </div>

                <h2>
                  {
                    selectedConversation.name
                  }
                </h2>

                <p>
                  {
                    selectedConversation.type
                  }
                </p>

                <div className="messages-profile-status">
                  <span />
                  Usuario StudySync
                </div>

                <div className="messages-profile-stats">
                  <article>
                    <strong>
                      {
                        messages.length
                      }
                    </strong>

                    <span>
                      Mensajes
                    </span>
                  </article>

                  <article>
                    <strong>
                      —
                    </strong>

                    <span>
                      Salas
                    </span>
                  </article>
                </div>

                <div className="messages-profile-info">
                  <span>
                    Correo
                  </span>

                  <strong>
                    {
                      selectedConversation.email
                    }
                  </strong>

                  <span>
                    Rol
                  </span>

                  <strong>
                    {
                      selectedConversation.type
                    }
                  </strong>

                  <span>
                    Estado
                  </span>

                  <strong>
                    Activo
                  </strong>
                </div>

                <button
                  type="button"
                  className="messages-profile-button"
                >
                  Ver perfil
                </button>
              </>
            ) : (
              <p>
                Sin conversación seleccionada.
              </p>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Mensajes;