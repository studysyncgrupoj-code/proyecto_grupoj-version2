import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <MainLayout>

      <section className="py-32">

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Bienvenido a
          <span className="text-cyan-400"> StudySync</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl">
          Plataforma virtual de estudio colaborativo diseñada
          para mejorar la productividad, concentración y
          aprendizaje en tiempo real.
        </p>

        <div className="flex gap-4 mt-10">

          <button className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-semibold">
            Comenzar
          </button>

          <a
          href="/study-rooms"
         className="border border-slate-700 hover:border-cyan-400 transition px-6 py-3 rounded-xl font-semibold"
        >
        Ver Salas 
        </a>

        </div>

      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-20">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition">
          <h3 className="text-xl font-bold text-cyan-400">Salas de estudio</h3>
          <p className="text-slate-400 mt-3">
            Crea salas colaborativas en vivo para estudiar con otros estudiantes en tiempo real.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition">
          <h3 className="text-xl font-bold text-cyan-400">Pomodoro compartido</h3>
          <p className="text-slate-400 mt-3">
            Organiza sesiones de 25 minutos de estudio y 5 minutos de descanso.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition">
          <h3 className="text-xl font-bold text-cyan-400">Coach con IA</h3>
          <p className="text-slate-400 mt-3">
            Recibe sugerencias personalizadas para mejorar tus hábitos de estudio.
          </p>
        </div>

      </section>

      <section className="py-28">

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

            <div>
              <h2 className="text-5xl font-bold">+10K</h2>
              <p className="mt-3 text-slate-100">
                Horas de estudio registradas
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-bold">+5K</h2>
              <p className="mt-3 text-slate-100">
                Estudiantes activos
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-bold">24/7</h2>
              <p className="mt-3 text-slate-100">
                Salas de estudio disponibles
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>

            <h2 className="text-4xl font-bold leading-tight">
              Estudia de forma
              <span className="text-cyan-400"> organizada </span>
              y colaborativa
            </h2>

            <p className="text-slate-400 text-lg mt-6 leading-relaxed">
              StudySync combina salas de estudio en tiempo real,
              temporizador Pomodoro y herramientas inteligentes
              para ayudarte a mantener el enfoque y alcanzar
              tus objetivos académicos.
            </p>

            <div className="flex gap-4 mt-8">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4">
                <h3 className="text-cyan-400 text-2xl font-bold">25m</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Pomodoro
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4">
                <h3 className="text-cyan-400 text-2xl font-bold">Live</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Study Rooms
                </p>
              </div>

            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">

              <div className="flex justify-between items-center">

                <div>
                  <h3 className="font-bold text-xl">
                    Sala Matemáticas
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    12 estudiantes conectados
                  </p>
                </div>

                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>

              </div>

              <div className="mt-8">

                <div className="flex justify-between text-sm mb-2">
                  <span>Pomodoro</span>
                  <span>25:00</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-cyan-400 h-full w-2/3"></div>
                </div>

              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">

                <div className="bg-slate-900 rounded-xl p-4 text-center">
                  <h4 className="text-2xl font-bold text-cyan-400">8</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Metas
                  </p>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 text-center">
                  <h4 className="text-2xl font-bold text-cyan-400">92%</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Focus
                  </p>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 text-center">
                  <h4 className="text-2xl font-bold text-cyan-400">+120</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Puntos
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </MainLayout>
  );
}

export default Home;