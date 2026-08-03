import { Link } from "react-router-dom";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/80 border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center text-slate-950 font-bold text-xl">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold text-cyan-400">
                StudySync
              </h1>

              <p className="text-xs text-slate-500">
                Study Together
              </p>
            </div>

          </div>

          <nav className="hidden md:flex gap-8 text-sm items-center">

            <Link to="/" className="hover:text-cyan-400 transition">
              Inicio
            </Link>

            <Link to="/" className="hover:text-cyan-400 transition">
              Salas
            </Link>

            <Link to="/" className="hover:text-cyan-400 transition">
              Pomodoro
            </Link>

            <Link to="/" className="hover:text-cyan-400 transition">
              Coach IA
            </Link>

          </nav>

          <div className="flex gap-3">

            <Link
              to="/login"
              className="border border-slate-700 hover:border-cyan-400 transition px-5 py-2 rounded-xl text-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-cyan-400 hover:bg-cyan-300 transition text-slate-950 px-5 py-2 rounded-xl text-sm font-semibold"
            >
              Registrarse
            </Link>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-slate-400 text-sm">
            © 2026 StudySync. Plataforma virtual de estudio colaborativo.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">

            <Link to="/" className="hover:text-cyan-400 transition">
              Inicio
            </Link>

            <Link to="/login" className="hover:text-cyan-400 transition">
              Login
            </Link>

            <Link to="/register" className="hover:text-cyan-400 transition">
              Registro
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default MainLayout;