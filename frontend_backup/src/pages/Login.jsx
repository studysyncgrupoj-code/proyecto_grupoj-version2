import MainLayout from "../layouts/MainLayout";

function Login() {
  return (
    <MainLayout>
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center">
            Iniciar sesión
          </h1>

          <p className="text-slate-400 text-center mt-3">
            Accede a tus salas de estudio y metas diarias.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-slate-300">Correo</label>
              <input
                type="email"
                placeholder="estudiante@email.com"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Contraseña</label>
              <input
                type="password"
                placeholder="********"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="button"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold py-3 rounded-xl transition"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-cyan-400 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;