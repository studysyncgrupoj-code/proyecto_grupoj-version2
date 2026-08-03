<<<<<<< HEAD

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import "./Login.css";


function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Richard Villaparedes",
        role: "Profesor",
        email: formData.email,
      })
    );

    navigate("/dashboard");
  };

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-showcase-glow login-showcase-glow-one" />
        <div className="login-showcase-glow login-showcase-glow-two" />

        <Link to="/" className="login-brand">
          <span className="login-brand-icon">
            <GraduationCap size={26} strokeWidth={2.2} />
          </span>

          <span className="login-brand-copy">
            <strong>StudySync</strong>
            <small>Study Together</small>
          </span>
        </Link>

        <div className="login-showcase-content">
          <span className="login-eyebrow">
            <Sparkles size={15} />
            Tu espacio de aprendizaje
          </span>

          <h1>
            Estudia mejor.
            <span> Avanza acompañado.</span>
          </h1>

          <p>
            Organiza tus cursos, participa en salas de estudio y mejora tu
            rendimiento desde una sola plataforma.
          </p>

          <div className="login-benefits">
            <article className="login-benefit-card">
              <div>
                <Users size={21} />
              </div>

              <span>
                <strong>Salas colaborativas</strong>
                <small>Aprende junto a tu comunidad.</small>
              </span>
            </article>

            <article className="login-benefit-card">
              <div>
                <ShieldCheck size={21} />
              </div>

              <span>
                <strong>Progreso centralizado</strong>
                <small>Consulta tu actividad y resultados.</small>
              </span>
            </article>
          </div>
        </div>

        <div className="login-showcase-footer">
          <span>© 2026 StudySync</span>
          <span>Aprende. Colabora. Crece.</span>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-mobile-brand">
            <span className="login-brand-icon">
              <GraduationCap size={24} />
            </span>

            <strong>StudySync</strong>
          </div>

          <header className="login-form-header">
            <span className="login-form-label">Bienvenido de nuevo</span>

            <h2>Inicia sesión</h2>

            <p>
              Ingresa tus datos para continuar a tu espacio de trabajo.
            </p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Correo electrónico</span>

              <div className="login-input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span>Contraseña</span>

              <div className="login-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <div className="login-form-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>

              <Link to="/recuperar-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="login-submit-button">
              <span>Iniciar sesión</span>
              <ArrowRight size={19} />
            </button>

            <div className="login-divider">
              <span>o continúa con</span>
            </div>

            <button type="button" className="login-google-button">
              <span className="login-google-icon">G</span>
              Continuar con Google
            </button>
          </form>

          <p className="login-register-text">
            ¿Todavía no tienes una cuenta?
            <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </section>
    </main>
=======
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
>>>>>>> origin/main
  );
}

export default Login;