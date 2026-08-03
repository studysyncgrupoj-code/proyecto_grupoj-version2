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

  }, [isRunning, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  return (

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

  );
}

export default PomodoroTimer;