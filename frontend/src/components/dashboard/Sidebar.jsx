import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-72 bg-black border-r border-slate-800 min-h-screen p-6">

      <div className="flex items-center gap-3 mb-10">

        <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-slate-950 font-bold text-2xl">
          S
        </div>

        <div>
          <h1 className="text-xl font-bold text-yellow-400">
            StudySync
          </h1>

          <p className="text-xs text-slate-500">
            Dashboard
          </p>
        </div>

      </div>

      <nav className="space-y-3">

        <Link
          to="/dashboard"
          className="block bg-yellow-400 text-slate-950 px-5 py-3 rounded-xl font-semibold"
        >
          Dashboard
        </Link>

        <Link
          to="/"
          className="block hover:bg-yellow-900/30 px-5 py-3 rounded-xl transition"
        >
          Inicio
        </Link>

        <Link
         to="/study-rooms"
         className="block hover:bg-yellow-900/30 px-5 py-3 rounded-xl transition"
        >
          Salas de estudio
        </Link>

        <Link
          to="/"
          className="block hover:bg-yellow-900/30 px-5 py-3 rounded-xl transition"
        >
          Pomodoro
        </Link>

        <Link
          to="/"
          className="block hover:bg-yellow-900/30 px-5 py-3 rounded-xl transition"
        >
          Metas
        </Link>

        <Link
          to="/"
          className="block hover:bg-yellow-900/30 px-5 py-3 rounded-xl transition"
        >
          Coach IA
        </Link>
        <a
         href="/study-rooms"
        className="hover:text-yellow-400 transition"
    >
        Salas de estudio
    </a>

      </nav>

    </aside>
  );
}

export default Sidebar;