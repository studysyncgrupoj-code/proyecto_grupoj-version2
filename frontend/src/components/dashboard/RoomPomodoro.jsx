import { useEffect, useMemo, useState } from "react";
import {
  Focus,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

import "./RoomPomodoro.css";

const INITIAL_TIME = 25 * 60;

function RoomPomodoro() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const progress = useMemo(
    () => ((INITIAL_TIME - timeLeft) / INITIAL_TIME) * 100,
    [timeLeft],
  );

  const handleToggle = () => {
    if (timeLeft === 0) {
      setTimeLeft(INITIAL_TIME);
    }

    setIsRunning((currentValue) => !currentValue);
  };

  const handleReset = () => {
    setTimeLeft(INITIAL_TIME);
    setIsRunning(false);
  };

  return (
    <article className="room-compact-timer">
      <header className="room-compact-timer-header">
        <div>
          <span>
            <Focus size={14} />
            Sesión Focus
          </span>

          <h2>Pomodoro</h2>
        </div>

        <small className={isRunning ? "active" : ""}>
          {isRunning ? "En curso" : "Pausado"}
        </small>
      </header>

      <div
        className="room-compact-timer-ring"
        style={{ "--room-timer-progress": `${progress * 3.6}deg` }}
      >
        <div>
          <strong>
            {minutes}:{seconds}
          </strong>

          <span>Tiempo de enfoque</span>
        </div>
      </div>

      <div className="room-compact-progress">
        <div>
          <span>Progreso</span>
          <strong>{Math.round(progress)}%</strong>
        </div>

        <div className="room-compact-progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="room-compact-actions">
        <button type="button" onClick={handleToggle}>
          {isRunning ? <Pause size={17} /> : <Play size={17} />}
          {isRunning ? "Pausar" : "Iniciar"}
        </button>

        <button type="button" onClick={handleReset}>
          <RotateCcw size={17} />
          Reiniciar
        </button>
      </div>
    </article>
  );
}

export default RoomPomodoro;