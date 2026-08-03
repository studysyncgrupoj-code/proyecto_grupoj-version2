import { useEffect, useMemo, useState } from "react";
import {
  Focus,
  Pause,
  Play,
  RotateCcw,
  TimerReset,
} from "lucide-react";

import "./PomodoroTimer.css";

const FOCUS_TIME = 25 * 60;

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const progress = useMemo(() => {
    return ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100;
  }, [timeLeft]);

  const handleToggle = () => {
    if (timeLeft === 0) {
      setTimeLeft(FOCUS_TIME);
    }

    setIsRunning((currentValue) => !currentValue);
  };

  const handleReset = () => {
    setTimeLeft(FOCUS_TIME);
    setIsRunning(false);
  };

  return (
    <section className="pomodoro-card">
      <header className="pomodoro-header">
        <div>
          <span className="pomodoro-eyebrow">
            <Focus size={14} />
            Focus Mode
          </span>

          <h2>Pomodoro</h2>
          <p>Trabaja en bloques de concentración profunda.</p>
        </div>

        <div
          className={`pomodoro-status ${
            isRunning ? "pomodoro-status-active" : ""
          }`}
        >
          <span />
          {isRunning ? "En curso" : "Pausado"}
        </div>
      </header>

      <div className="pomodoro-timer-area">
        <div
          className="pomodoro-progress-ring"
          style={{ "--pomodoro-progress": `${progress * 3.6}deg` }}
        >
          <div className="pomodoro-progress-inner">
            <TimerReset size={24} />

            <strong>
              {minutes}:{seconds}
            </strong>

            <span>Tiempo de enfoque</span>
          </div>
        </div>
      </div>

      <div className="pomodoro-progress-info">
        <div>
          <span>Progreso de la sesión</span>
          <strong>{Math.round(progress)}%</strong>
        </div>

        <div className="pomodoro-progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="pomodoro-actions">
        <button
          type="button"
          className="pomodoro-primary-button"
          onClick={handleToggle}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? "Pausar" : timeLeft === 0 ? "Reiniciar" : "Iniciar"}
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
    </section>
  );
}

export default PomodoroTimer;