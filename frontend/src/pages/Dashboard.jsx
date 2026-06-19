import Sidebar from "../components/dashboard/Sidebar";
import PomodoroTimer from "../components/dashboard/PomodoroTimer";

function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <section className="py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <h1 className="text-4xl font-bold">
                Dashboard
              </h1>

              <p className="text-slate-400 mt-3">
                Bienvenido nuevamente a StudySync.
              </p>
            </div>

            <button className="bg-yellow-400 hover:bg-yellow-300 transition text-slate-950 px-6 py-3 rounded-xl font-semibold">
              Crear Sala
            </button>

          </div>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-zinc-950 border border-yellow-700/40 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Horas estudiadas
            </h3>

            <h2 className="text-5xl font-bold text-yellow-400 mt-4">
              42h
            </h2>
          </div>

          <div className="bg-zinc-950 border border-yellow-700/40 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Metas completadas
            </h3>

            <h2 className="text-5xl font-bold text-yellow-400 mt-4">
              18
            </h2>
          </div>

          <div className="bg-zinc-950 border border-yellow-700/40 rounded-2xl p-6">
            <h3 className="text-slate-400">
              Puntos obtenidos
            </h3>

            <h2 className="text-5xl font-bold text-yellow-400 mt-4">
              +320
            </h2>
          </div>

        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-10">

          <PomodoroTimer />

          <div className="bg-zinc-950 border border-yellow-700/40 rounded-2xl p-8">

            <h2 className="text-2xl font-bold">
              Salas activas
            </h2>

            <div className="space-y-4 mt-8">

              <div className="bg-black rounded-xl p-5 border border-yellow-700/40 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Matemáticas
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    12 estudiantes conectados
                  </p>
                </div>

                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

              </div>

              <div className="bg-black rounded-xl p-5 border border-yellow-700/40 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Física
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    8 estudiantes conectados
                  </p>
                </div>

                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

              </div>

              <div className="bg-black rounded-xl p-5 border border-yellow-700/40 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Programación
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    21 estudiantes conectados
                  </p>
                </div>

                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;