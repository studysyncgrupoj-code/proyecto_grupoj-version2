<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";

function PomodoroTimer() {

  const initialTime = 25 * 60;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {

    let timer;

    if (isRunning && timeLeft > 0) {

      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

    }

    return () => clearInterval(timer);

>>>>>>> origin/main
  }, [isRunning, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

<<<<<<< HEAD
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
=======
  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
>>>>>>> origin/main
    setIsRunning(false);
  };

  return (
<<<<<<< HEAD
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
=======

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Pomodoro
        </h2>

        <span className="text-cyan-400">
          Focus Mode
        </span>

      </div>

      <div className="flex items-center justify-center py-16">

        <div className="w-56 h-56 rounded-full border-8 border-cyan-400 flex items-center justify-center">

          <div className="text-center">

            <h1 className="text-6xl font-bold">
              {minutes}:{seconds}
            </h1>

            <p className="text-slate-400 mt-2">
              Tiempo de enfoque
            </p>

          </div>

        </div>

      </div>

      <div className="flex justify-center gap-4">

        <button
          onClick={handleStart}
          className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3 rounded-xl font-semibold transition"
        >
          Iniciar
        </button>

        <button
          onClick={handleReset}
          className="border border-slate-700 hover:border-cyan-400 px-6 py-3 rounded-xl transition"
        >
          Reiniciar
        </button>

      </div>

    </div>

>>>>>>> origin/main
  );
}

export default PomodoroTimer;