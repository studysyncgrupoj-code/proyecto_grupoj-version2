import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Focus,
  Plus,
  Users,
  Video,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/shared/Calendario.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const CALENDAR_API = `${API_BASE_URL}/api/calendar`;

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
];

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

function sameDay(dateA, dateB) {
  return (
    dateA.getFullYear() ===
      dateB.getFullYear() &&
    dateA.getMonth() ===
      dateB.getMonth() &&
    dateA.getDate() ===
      dateB.getDate()
  );
}

function formatTime(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  return date.toLocaleTimeString(
    "es-CO",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  );
}

function formatEventTime(event) {
  const start =
    formatTime(event.startDateTime);

  if (!event.endDateTime) {
    return start;
  }

  return `${start} - ${formatTime(
    event.endDateTime,
  )}`;
}

function formatDateLabel(date) {
  return date.toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "long",
    },
  );
}

function getEventIcon(type) {
  const normalized =
    String(type || "").toLowerCase();

  if (
    normalized.includes("sala") ||
    normalized.includes("room")
  ) {
    return Video;
  }

  if (
    normalized.includes("focus") ||
    normalized.includes("pomodoro")
  ) {
    return Focus;
  }

  return CalendarDays;
}

function createCalendarDays(
  year,
  month,
  events,
) {
  const firstDay =
    new Date(year, month, 1);

  const lastDay =
    new Date(year, month + 1, 0);

  const mondayIndex =
    (firstDay.getDay() + 6) % 7;

  const daysInMonth =
    lastDay.getDate();

  const previousMonthLastDay =
    new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (
    let index = mondayIndex - 1;
    index >= 0;
    index -= 1
  ) {
    const day =
      previousMonthLastDay - index;

    const date =
      new Date(year, month - 1, day);

    calendarDays.push({
      day,
      date,
      muted: true,
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    const date =
      new Date(year, month, day);

    const eventCount =
      events.filter((event) =>
        sameDay(
          new Date(
            event.startDateTime,
          ),
          date,
        ),
      ).length;

    calendarDays.push({
      day,
      date,
      muted: false,
      events: eventCount,
    });
  }

  let nextMonthDay = 1;

  while (
    calendarDays.length < 35 ||
    calendarDays.length % 7 !== 0
  ) {
    const date =
      new Date(
        year,
        month + 1,
        nextMonthDay,
      );

    calendarDays.push({
      day: nextMonthDay,
      date,
      muted: true,
    });

    nextMonthDay += 1;
  }

  return calendarDays;
}

function Calendario() {
  const storedUser =
    getStoredUser();

  const userId =
    storedUser?.id;

  const today =
    useMemo(
      () => new Date(),
      [],
    );

  const [visibleDate, setVisibleDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [events, setEvents] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      type: "Curso",
      date: "",
      startTime: "",
      endTime: "",
      participants: 1,
      description: "",
    });

  const loadEvents = async () => {
    if (!userId) {
      setError(
        "No se encontró el usuario autenticado.",
      );
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response =
        await fetch(
          `${CALENDAR_API}/user/${userId}`,
        );

      if (!response.ok) {
        throw new Error(
          `No fue posible cargar el calendario (${response.status}).`,
        );
      }

      const data =
        await response.json();

      setEvents(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (loadError) {
      console.error(
        "Error cargando calendario:",
        loadError,
      );

      setError(
        "No fue posible cargar los eventos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const calendarDays =
    useMemo(
      () =>
        createCalendarDays(
          visibleDate.getFullYear(),
          visibleDate.getMonth(),
          events,
        ),
      [visibleDate, events],
    );

  const currentMonthEvents =
    useMemo(
      () =>
        events.filter((event) => {
          const date =
            new Date(
              event.startDateTime,
            );

          return (
            date.getFullYear() ===
              visibleDate.getFullYear() &&
            date.getMonth() ===
              visibleDate.getMonth()
          );
        }),
      [events, visibleDate],
    );

  const selectedDayEvents =
    useMemo(
      () =>
        events
          .filter((event) =>
            sameDay(
              new Date(
                event.startDateTime,
              ),
              selectedDate,
            ),
          )
          .sort(
            (a, b) =>
              new Date(
                a.startDateTime,
              ) -
              new Date(
                b.startDateTime,
              ),
          ),
      [events, selectedDate],
    );

  const focusEvents =
    currentMonthEvents.filter(
      (event) =>
        String(event.type)
          .toLowerCase()
          .includes("focus") ||
        String(event.type)
          .toLowerCase()
          .includes("pomodoro"),
    );

  const roomEvents =
    currentMonthEvents.filter(
      (event) =>
        String(event.type)
          .toLowerCase()
          .includes("sala"),
    );

  const handlePreviousMonth = () => {
    setVisibleDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    );
  };

  const handleNextMonth = () => {
    setVisibleDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
    );
  };

  const handleToday = () => {
    const current =
      new Date();

    setVisibleDate(
      new Date(
        current.getFullYear(),
        current.getMonth(),
        1,
      ),
    );

    setSelectedDate(current);
  };

  const handleSelectDay = (
    calendarDay,
  ) => {
    setSelectedDate(
      calendarDay.date,
    );

    if (calendarDay.muted) {
      setVisibleDate(
        new Date(
          calendarDay.date.getFullYear(),
          calendarDay.date.getMonth(),
          1,
        ),
      );
    }
  };

  const openCreateModal = () => {
    const year =
      selectedDate.getFullYear();

    const month =
      String(
        selectedDate.getMonth() + 1,
      ).padStart(2, "0");

    const day =
      String(
        selectedDate.getDate(),
      ).padStart(2, "0");

    setFormData({
      title: "",
      type: "Curso",
      date: `${year}-${month}-${day}`,
      startTime: "",
      endTime: "",
      participants: 1,
      description: "",
    });

    setError("");
    setShowCreateModal(true);
  };

  const handleFormChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      }),
    );
  };

  const handleCreateEvent =
    async (event) => {
      event.preventDefault();

      if (
        !formData.title.trim() ||
        !formData.date ||
        !formData.startTime
      ) {
        setError(
          "Completa título, fecha y hora de inicio.",
        );
        return;
      }

      const startDateTime =
        `${formData.date}T${formData.startTime}:00`;

      const endDateTime =
        formData.endTime
          ? `${formData.date}T${formData.endTime}:00`
          : null;

      const payload = {
        userId,
        title:
          formData.title.trim(),
        type:
          formData.type,
        startDateTime,
        endDateTime,
        participants:
          Math.max(
            1,
            Number(
              formData.participants,
            ) || 1,
          ),
        description:
          formData.description.trim(),
      };

      try {
        setIsSaving(true);
        setError("");

        const response =
          await fetch(
            CALENDAR_API,
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
          throw new Error(
            `No fue posible crear el evento (${response.status}).`,
          );
        }

        const savedEvent =
          await response.json();

        setEvents(
          (current) => [
            ...current,
            savedEvent,
          ],
        );

        setSelectedDate(
          new Date(
            savedEvent.startDateTime,
          ),
        );

        setVisibleDate(
          new Date(
            new Date(
              savedEvent.startDateTime,
            ).getFullYear(),
            new Date(
              savedEvent.startDateTime,
            ).getMonth(),
            1,
          ),
        );

        setShowCreateModal(false);
      } catch (saveError) {
        console.error(
          "Error creando evento:",
          saveError,
        );

        setError(
          "No fue posible crear el evento.",
        );
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <div className="calendar-layout">
      <Sidebar />

      <main className="calendar-content">
        <header className="calendar-header">
          <div>
            <span className="calendar-eyebrow">
              <CalendarDays
                size={15}
              />
              Agenda académica
            </span>

            <h1>
              Calendario
            </h1>

            <p>
              Organiza tus clases, salas de estudio, tareas y sesiones Focus.
            </p>
          </div>

          <button
            type="button"
            className="calendar-create-button"
            onClick={
              openCreateModal
            }
          >
            <Plus size={18} />
            Crear evento
          </button>
        </header>

        {error &&
          !showCreateModal && (
            <p
              style={{
                marginBottom:
                  "14px",
              }}
            >
              {error}
            </p>
          )}

        <section className="calendar-stats-grid">
          <article className="calendar-stat-card">
            <span>
              Eventos este mes
            </span>

            <strong>
              {isLoading
                ? "..."
                : currentMonthEvents.length}
            </strong>

            <small>
              Eventos registrados en tu agenda
            </small>
          </article>

          <article className="calendar-stat-card">
            <span>
              Sesiones Focus
            </span>

            <strong>
              {isLoading
                ? "..."
                : focusEvents.length}
            </strong>

            <small>
              Sesiones programadas este mes
            </small>
          </article>

          <article className="calendar-stat-card">
            <span>
              Salas programadas
            </span>

            <strong>
              {isLoading
                ? "..."
                : roomEvents.length}
            </strong>

            <small>
              Salas registradas en el calendario
            </small>
          </article>
        </section>

        <section className="calendar-main-grid">
          <article className="calendar-panel calendar-month-panel">
            <div className="calendar-panel-header">
              <div>
                <span className="calendar-section-label">
                  Vista mensual
                </span>

                <h2>
                  {
                    MONTH_NAMES[
                      visibleDate.getMonth()
                    ]
                  }{" "}
                  {
                    visibleDate.getFullYear()
                  }
                </h2>
              </div>

              <div className="calendar-navigation">
                <button
                  type="button"
                  aria-label="Mes anterior"
                  onClick={
                    handlePreviousMonth
                  }
                >
                  <ChevronLeft
                    size={18}
                  />
                </button>

                <button
                  type="button"
                  className="calendar-today-button"
                  onClick={
                    handleToday
                  }
                >
                  Hoy
                </button>

                <button
                  type="button"
                  aria-label="Mes siguiente"
                  onClick={
                    handleNextMonth
                  }
                >
                  <ChevronRight
                    size={18}
                  />
                </button>
              </div>
            </div>

            <div className="calendar-weekdays">
              {WEEKDAYS.map(
                (weekday) => (
                  <span
                    key={
                      weekday
                    }
                  >
                    {weekday}
                  </span>
                ),
              )}
            </div>

            <div className="calendar-days-grid">
              {calendarDays.map(
                (
                  date,
                  index,
                ) => {
                  const isToday =
                    sameDay(
                      date.date,
                      today,
                    );

                  const isSelected =
                    sameDay(
                      date.date,
                      selectedDate,
                    );

                  return (
                    <button
                      type="button"
                      className={[
                        "calendar-day",
                        date.muted
                          ? "muted"
                          : "",
                        isToday
                          ? "current"
                          : "",
                        isSelected
                          ? "selected"
                          : "",
                      ]
                        .filter(
                          Boolean,
                        )
                        .join(
                          " ",
                        )}
                      key={`${date.date.toISOString()}-${index}`}
                      onClick={() =>
                        handleSelectDay(
                          date,
                        )
                      }
                    >
                      <span>
                        {
                          date.day
                        }
                      </span>

                      {date.events >
                        0 && (
                        <small>
                          {
                            date.events
                          }{" "}
                          evento
                          {date.events >
                          1
                            ? "s"
                            : ""}
                        </small>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </article>

          <aside className="calendar-side-column">
            <article className="calendar-panel calendar-agenda-panel">
              <div className="calendar-panel-header">
                <div>
                  <span className="calendar-section-label">
                    Agenda
                  </span>

                  <h2>
                    Eventos del día
                  </h2>
                </div>

                <span className="calendar-date-label">
                  {formatDateLabel(
                    selectedDate,
                  )}
                </span>
              </div>

              <div className="calendar-events-list">
                {selectedDayEvents.length ===
                0 ? (
                  <p>
                    No hay eventos programados para este día.
                  </p>
                ) : (
                  selectedDayEvents.map(
                    (event) => {
                      const EventIcon =
                        getEventIcon(
                          event.type,
                        );

                      return (
                        <article
                          className="calendar-event-item"
                          key={
                            event.id
                          }
                        >
                          <div className="calendar-event-icon">
                            <EventIcon
                              size={
                                19
                              }
                            />
                          </div>

                          <div className="calendar-event-info">
                            <strong>
                              {
                                event.title
                              }
                            </strong>

                            <span>
                              {
                                event.type
                              }
                            </span>

                            <div className="calendar-event-meta">
                              <small>
                                <Clock3
                                  size={
                                    14
                                  }
                                />
                                {formatEventTime(
                                  event,
                                )}
                              </small>

                              <small>
                                <Users
                                  size={
                                    14
                                  }
                                />
                                {event.participants ??
                                  1}
                              </small>
                            </div>
                          </div>
                        </article>
                      );
                    },
                  )
                )}
              </div>
            </article>

            <article className="calendar-panel calendar-focus-panel">
              <span className="calendar-section-label">
                Focus de hoy
              </span>

              <h2>
                {
                  events.filter(
                    (event) =>
                      sameDay(
                        new Date(
                          event.startDateTime,
                        ),
                        today,
                      ) &&
                      (String(
                        event.type,
                      )
                        .toLowerCase()
                        .includes(
                          "focus",
                        ) ||
                        String(
                          event.type,
                        )
                          .toLowerCase()
                          .includes(
                            "pomodoro",
                          )),
                  ).length
                }{" "}
                sesiones programadas
              </h2>

              <div className="calendar-progress-track">
                <span />
              </div>

              <p>
                Consulta tus sesiones Focus programadas y mantén organizada tu jornada de estudio.
              </p>

              <button
                type="button"
              >
                <Focus
                  size={17}
                />
                Iniciar Pomodoro
              </button>
            </article>
          </aside>
        </section>
      </main>

      {showCreateModal && (
        <div className="calendar-modal-backdrop">
          <section className="calendar-create-modal">
            <header>
              <div>
                <span className="calendar-section-label">
                  Nueva actividad
                </span>

                <h2>
                  Crear evento
                </h2>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                onClick={() =>
                  setShowCreateModal(
                    false,
                  )
                }
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={
                handleCreateEvent
              }
            >
              <label>
                <span>
                  Título
                </span>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Nombre del evento"
                  required
                />
              </label>

              <label>
                <span>
                  Tipo
                </span>

                <select
                  name="type"
                  value={
                    formData.type
                  }
                  onChange={
                    handleFormChange
                  }
                >
                  <option value="Curso">
                    Curso
                  </option>

                  <option value="Sala de estudio">
                    Sala de estudio
                  </option>

                  <option value="Focus">
                    Focus
                  </option>

                  <option value="Tarea">
                    Tarea
                  </option>

                  <option value="Otro">
                    Otro
                  </option>
                </select>
              </label>

              <label>
                <span>
                  Fecha
                </span>

                <input
                  type="date"
                  name="date"
                  value={
                    formData.date
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                />
              </label>

              <label>
                <span>
                  Hora de inicio
                </span>

                <input
                  type="time"
                  name="startTime"
                  value={
                    formData.startTime
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                />
              </label>

              <label>
                <span>
                  Hora de finalización
                </span>

                <input
                  type="time"
                  name="endTime"
                  value={
                    formData.endTime
                  }
                  onChange={
                    handleFormChange
                  }
                />
              </label>

              <label>
                <span>
                  Participantes
                </span>

                <input
                  type="number"
                  name="participants"
                  min="1"
                  value={
                    formData.participants
                  }
                  onChange={
                    handleFormChange
                  }
                />
              </label>

              <label>
                <span>
                  Descripción
                </span>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleFormChange
                  }
                  rows="4"
                  placeholder="Descripción opcional"
                />
              </label>

              {error && (
                <p>
                  {error}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(
                      false,
                    )
                  }
                  disabled={
                    isSaving
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="calendar-create-button"
                  disabled={
                    isSaving
                  }
                >
                  <Plus
                    size={18}
                  />

                  {isSaving
                    ? "Creando..."
                    : "Crear evento"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Calendario;