import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock3,
  Coffee,
  Focus,
  ListTodo,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  TimerReset,
  Trash2,
} from "lucide-react";

import "./PomodoroTimer.css";

const STORAGE_KEY = "studysync-pomodoro-settings";

const PRESETS = [
  {
    id: "classic",
    label: "25 / 5",
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cycles: 4,
  },
  {
    id: "study",
    label: "45 / 10",
    focusMinutes: 45,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
    cycles: 4,
  },
  {
    id: "class",
    label: "50 / 10",
    focusMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
    cycles: 4,
  },
  {
    id: "deep",
    label: "60 / 15",
    focusMinutes: 60,
    shortBreakMinutes: 15,
    longBreakMinutes: 25,
    cycles: 3,
  },
];

const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cycles: 4,
  autoStartNext: false,
};

const clampValue = (value, min, max) => {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return min;
  }

  return Math.min(Math.max(parsedValue, min), max);
};

const loadSettings = () => {
  try {
    const savedSettings = window.localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const loadUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

function PomodoroTimer() {
  const [settings, setSettings] = useState(loadSettings);
  const [mode, setMode] = useState("focus");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(settings.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [taskDraft, setTaskDraft] = useState("");
  const [tasks, setTasks] = useState([]);

  // ID de la sesión Pomodoro actualmente registrada en PostgreSQL.
  const [activePomodoroId, setActivePomodoroId] = useState(null);

  const storedUser = useMemo(() => loadUser(), []);
  const userId = storedUser?.id;

  const modeDuration = useMemo(() => {
    if (mode === "shortBreak") {
      return settings.shortBreakMinutes * 60;
    }

    if (mode === "longBreak") {
      return settings.longBreakMinutes * 60;
    }

    return settings.focusMinutes * 60;
  }, [mode, settings]);

  const startBackendPomodoro = async () => {
    if (!userId) {
      throw new Error("No existe un usuario autenticado.");
    }

    const response = await fetch(
      "http://localhost:8080/api/pomodoro/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          roomId: null,
          durationMinutes: settings.focusMinutes,
          breakMinutes: settings.shortBreakMinutes,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("No fue posible iniciar el Pomodoro en el backend.");
    }

    const session = await response.json();

    if (!session?.id) {
      throw new Error("El backend no devolvió el ID del Pomodoro.");
    }

    setActivePomodoroId(session.id);

    return session.id;
  };

  const pauseBackendPomodoro = async (pomodoroId) => {
    if (!pomodoroId) {
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/pomodoro/${pomodoroId}/pause`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error("No fue posible pausar el Pomodoro.");
    }
  };

  const resumeBackendPomodoro = async (pomodoroId) => {
    if (!pomodoroId) {
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/pomodoro/${pomodoroId}/resume`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error("No fue posible reanudar el Pomodoro.");
    }
  };

  const finishBackendPomodoro = async (pomodoroId) => {
    if (!pomodoroId) {
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/pomodoro/${pomodoroId}/finish`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error("No fue posible finalizar el Pomodoro.");
    }

    setActivePomodoroId(null);
  };

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => Math.max(currentTime - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0) {
      return;
    }

    const completeCurrentBlock = async () => {
      setIsRunning(false);

      if (mode === "focus") {
        try {
          if (activePomodoroId) {
            await finishBackendPomodoro(activePomodoroId);
          }
        } catch (error) {
          console.error(
            "Error finalizando Pomodoro en el backend:",
            error
          );
        }

        setCompletedSessions((currentValue) => currentValue + 1);

        const isLastCycle = currentCycle >= settings.cycles;
        const nextMode = isLastCycle ? "longBreak" : "shortBreak";

        setMode(nextMode);

        setTimeLeft(
          nextMode === "longBreak"
            ? settings.longBreakMinutes * 60
            : settings.shortBreakMinutes * 60
        );

        if (settings.autoStartNext) {
          setIsRunning(true);
        }

        return;
      }

      const nextCycle =
        mode === "longBreak"
          ? 1
          : Math.min(currentCycle + 1, settings.cycles);

      setCurrentCycle(nextCycle);
      setMode("focus");
      setTimeLeft(settings.focusMinutes * 60);

      if (settings.autoStartNext) {
        try {
          await startBackendPomodoro();
          setIsRunning(true);
        } catch (error) {
          console.error(
            "Error iniciando automáticamente el siguiente Pomodoro:",
            error
          );
        }
      }
    };

    completeCurrentBlock();
  }, [
    activePomodoroId,
    currentCycle,
    mode,
    settings.autoStartNext,
    settings.cycles,
    settings.focusMinutes,
    settings.longBreakMinutes,
    settings.shortBreakMinutes,
    timeLeft,
  ]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const progress = useMemo(() => {
    if (modeDuration <= 0) {
      return 0;
    }

    return ((modeDuration - timeLeft) / modeDuration) * 100;
  }, [modeDuration, timeLeft]);

  const modeLabel = {
    focus: "Tiempo de enfoque",
    shortBreak: "Descanso corto",
    longBreak: "Descanso largo",
  }[mode];

  const handleToggle = async () => {
    if (timeLeft <= 0) {
      setTimeLeft(modeDuration);
    }

    // Los descansos funcionan localmente.
    if (mode !== "focus") {
      setIsRunning((currentValue) => !currentValue);
      return;
    }

    try {
      // Está corriendo: debemos pausarlo.
      if (isRunning) {
        if (activePomodoroId) {
          await pauseBackendPomodoro(activePomodoroId);
        }

        setIsRunning(false);
        return;
      }

      // Existe una sesión pausada: debemos reanudarla.
      if (activePomodoroId) {
        await resumeBackendPomodoro(activePomodoroId);
        setIsRunning(true);
        return;
      }

      // No existe una sesión: crearla en PostgreSQL.
      await startBackendPomodoro();
      setIsRunning(true);
    } catch (error) {
      console.error("Error sincronizando Pomodoro:", error);

      alert(
        "No fue posible sincronizar el Pomodoro con el backend. Verifica que Spring Boot esté ejecutándose."
      );
    }
  };

  const handleReset = async () => {
    try {
      // Si hay una sesión activa, la dejamos pausada.
      if (activePomodoroId && isRunning && mode === "focus") {
        await pauseBackendPomodoro(activePomodoroId);
      }
    } catch (error) {
      console.error(
        "No fue posible pausar la sesión antes de reiniciar:",
        error
      );
    }

    setTimeLeft(modeDuration);
    setIsRunning(false);
  };

  const changeMode = async (nextMode) => {
    try {
      // Evitar dejar una sesión activa corriendo en el backend
      // si el usuario cambia manualmente a descanso.
      if (
        mode === "focus" &&
        isRunning &&
        activePomodoroId
      ) {
        await pauseBackendPomodoro(activePomodoroId);
      }
    } catch (error) {
      console.error(
        "No fue posible pausar el Pomodoro al cambiar de modo:",
        error
      );
    }

    setMode(nextMode);
    setIsRunning(false);

    if (nextMode === "focus") {
      setTimeLeft(settings.focusMinutes * 60);
      return;
    }

    if (nextMode === "shortBreak") {
      setTimeLeft(settings.shortBreakMinutes * 60);
      return;
    }

    setTimeLeft(settings.longBreakMinutes * 60);
  };

  const applyPreset = async (preset) => {
    try {
      if (
        mode === "focus" &&
        isRunning &&
        activePomodoroId
      ) {
        await pauseBackendPomodoro(activePomodoroId);
      }
    } catch (error) {
      console.error(
        "No fue posible pausar la sesión antes de cambiar el preset:",
        error
      );
    }

    const nextSettings = {
      ...settings,
      focusMinutes: preset.focusMinutes,
      shortBreakMinutes: preset.shortBreakMinutes,
      longBreakMinutes: preset.longBreakMinutes,
      cycles: preset.cycles,
    };

    setSettings(nextSettings);
    setMode("focus");
    setCurrentCycle(1);
    setTimeLeft(preset.focusMinutes * 60);
    setIsRunning(false);
  };

  const updateSetting = (settingName, value, min, max) => {
    const nextValue = clampValue(value, min, max);

    setSettings((currentSettings) => ({
      ...currentSettings,
      [settingName]: nextValue,
    }));

    if (settingName === "focusMinutes" && mode === "focus") {
      setTimeLeft(nextValue * 60);
      setIsRunning(false);
    }

    if (settingName === "shortBreakMinutes" && mode === "shortBreak") {
      setTimeLeft(nextValue * 60);
      setIsRunning(false);
    }

    if (settingName === "longBreakMinutes" && mode === "longBreak") {
      setTimeLeft(nextValue * 60);
      setIsRunning(false);
    }
  };

  const addTask = () => {
    const trimmedTask = taskDraft.trim();

    if (!trimmedTask) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        text: trimmedTask,
        completed: false,
      },
    ]);

    setTaskDraft("");
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  };

  return (
    <section className="pomodoro-card">
      <header className="pomodoro-header">
        <div>
          <span className="pomodoro-eyebrow">
            <Focus size={14} />
            Focus Mode
          </span>

          <h2>Temporizador inteligente</h2>

          <p>
            Configura la duración de tu clase, tus descansos y la cantidad de
            ciclos.
          </p>
        </div>

        <div className="pomodoro-header-actions">
          <div
            className={`pomodoro-status ${
              isRunning ? "pomodoro-status-active" : ""
            }`}
          >
            <span />
            {isRunning ? "En curso" : "Pausado"}
          </div>

          <button
            type="button"
            className={`pomodoro-settings-button ${
              showSettings ? "pomodoro-settings-button-active" : ""
            }`}
            onClick={() => setShowSettings((currentValue) => !currentValue)}
          >
            <Settings2 size={17} />
            Configurar
          </button>
        </div>
      </header>

      <div className="pomodoro-presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
          >
            <Clock3 size={15} />
            {preset.label}
          </button>
        ))}
      </div>

      {showSettings && (
        <div className="pomodoro-settings-panel">
          <div className="pomodoro-setting-field">
            <label htmlFor="pomodoro-focus-minutes">
              Duración de la clase
            </label>

            <div>
              <input
                id="pomodoro-focus-minutes"
                type="number"
                min="5"
                max="180"
                value={settings.focusMinutes}
                onChange={(event) =>
                  updateSetting(
                    "focusMinutes",
                    event.target.value,
                    5,
                    180
                  )
                }
              />

              <span>min</span>
            </div>
          </div>

          <div className="pomodoro-setting-field">
            <label htmlFor="pomodoro-short-break">
              Descanso corto
            </label>

            <div>
              <input
                id="pomodoro-short-break"
                type="number"
                min="1"
                max="60"
                value={settings.shortBreakMinutes}
                onChange={(event) =>
                  updateSetting(
                    "shortBreakMinutes",
                    event.target.value,
                    1,
                    60
                  )
                }
              />

              <span>min</span>
            </div>
          </div>

          <div className="pomodoro-setting-field">
            <label htmlFor="pomodoro-long-break">
              Descanso largo
            </label>

            <div>
              <input
                id="pomodoro-long-break"
                type="number"
                min="1"
                max="90"
                value={settings.longBreakMinutes}
                onChange={(event) =>
                  updateSetting(
                    "longBreakMinutes",
                    event.target.value,
                    1,
                    90
                  )
                }
              />

              <span>min</span>
            </div>
          </div>

          <div className="pomodoro-setting-field">
            <label htmlFor="pomodoro-cycles">
              Ciclos
            </label>

            <div>
              <input
                id="pomodoro-cycles"
                type="number"
                min="1"
                max="12"
                value={settings.cycles}
                onChange={(event) =>
                  updateSetting(
                    "cycles",
                    event.target.value,
                    1,
                    12
                  )
                }
              />

              <span>ciclos</span>
            </div>
          </div>

          <label className="pomodoro-auto-start">
            <input
              type="checkbox"
              checked={settings.autoStartNext}
              onChange={(event) =>
                setSettings((currentSettings) => ({
                  ...currentSettings,
                  autoStartNext: event.target.checked,
                }))
              }
            />

            <span>
              Iniciar automáticamente el siguiente bloque
            </span>
          </label>
        </div>
      )}

      <div className="pomodoro-main-grid">
        <div className="pomodoro-timer-column">
          <div className="pomodoro-mode-tabs">
            <button
              type="button"
              className={mode === "focus" ? "active" : ""}
              onClick={() => changeMode("focus")}
            >
              <Focus size={15} />
              Clase
            </button>

            <button
              type="button"
              className={mode === "shortBreak" ? "active" : ""}
              onClick={() => changeMode("shortBreak")}
            >
              <Coffee size={15} />
              Descanso corto
            </button>

            <button
              type="button"
              className={mode === "longBreak" ? "active" : ""}
              onClick={() => changeMode("longBreak")}
            >
              <Coffee size={15} />
              Descanso largo
            </button>
          </div>

          <div className="pomodoro-timer-area">
            <div
              className="pomodoro-progress-ring"
              style={{
                "--pomodoro-progress": `${Math.max(
                  0,
                  Math.min(progress, 100)
                ) * 3.6}deg`,
              }}
            >
              <div className="pomodoro-progress-inner">
                <TimerReset size={24} />

                <strong>
                  {minutes}:{seconds}
                </strong>

                <span>{modeLabel}</span>
              </div>
            </div>
          </div>

          <div className="pomodoro-progress-info">
            <div>
              <span>Progreso del bloque</span>
              <strong>{Math.round(progress)}%</strong>
            </div>

            <div className="pomodoro-progress-track">
              <span style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>

          <div className="pomodoro-actions">
            <button
              type="button"
              className="pomodoro-primary-button"
              onClick={handleToggle}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? "Pausar" : "Iniciar"}
            </button>

            <button
              type="button"
              className="pomodoro-secondary-button"
              onClick={handleReset}
            >
              <RotateCcw size={18} />
              Reiniciar
            </button>
          </div>
        </div>

        <aside className="pomodoro-session-panel">
          <div className="pomodoro-session-heading">
            <div>
              <span>SESIÓN ACTUAL</span>
              <h3>Plan de estudio</h3>
            </div>

            <ListTodo size={20} />
          </div>

          <div className="pomodoro-session-stats">
            <article>
              <span>Ciclo actual</span>
              <strong>
                {currentCycle}/{settings.cycles}
              </strong>
            </article>

            <article>
              <span>Sesiones completadas</span>
              <strong>{completedSessions}</strong>
            </article>

            <article>
              <span>Tiempo configurado</span>
              <strong>{settings.focusMinutes} min</strong>
            </article>
          </div>

          <div className="pomodoro-task-input">
            <input
              type="text"
              value={taskDraft}
              onChange={(event) => setTaskDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTask();
                }
              }}
              placeholder="Añadir tarea para esta sesión..."
            />

            <button
              type="button"
              onClick={addTask}
              aria-label="Agregar tarea"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="pomodoro-task-list">
            {tasks.length === 0 ? (
              <div className="pomodoro-task-empty">
                <ListTodo size={22} />
                <p>Añade las tareas que quieres completar en esta sesión.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <article
                  key={task.id}
                  className={`pomodoro-task-item ${
                    task.completed ? "pomodoro-task-item-done" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="pomodoro-task-check"
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? "Marcar como pendiente"
                        : "Marcar como completada"
                    }
                  >
                    {task.completed && <Check size={15} />}
                  </button>

                  <span>{task.text}</span>

                  <button
                    type="button"
                    className="pomodoro-task-delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PomodoroTimer;