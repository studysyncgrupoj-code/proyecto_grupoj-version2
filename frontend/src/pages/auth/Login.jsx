import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
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

import "../../styles/auth/Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "estudiante",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
            otp: otp,
          }),
        }
      );

      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));

        if (data.code === "MFA_REQUIRED" || data.code === "MFA_INVALID") {
          setMfaRequired(true);
          setOtp("");

          if (data.code === "MFA_INVALID") {
            alert(ssI18n.t("Código inválido, expirado o utilizado."));
          }
          return;
        }

        setMfaRequired(false);
        setOtp("");
        alert(ssI18n.t("Correo o contraseña incorrectos."));
        return;
      }

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const user = await response.json();

      if (!user || !user.id) {
        alert("Correo o contraseña incorrectos.");
        return;
      }

      if (user.activo === false) {
        alert("Este usuario se encuentra inactivo.");
        return;
      }

      const role = (user.rol || "").trim().toLowerCase();
      const selectedRole = formData.role.trim().toLowerCase();

      if (role !== selectedRole) {
        alert(
          `Este usuario está registrado como ${user.rol}. Selecciona el tipo de usuario correcto.`
        );
        return;
      }

      const frontendUser = {
        id: user.id,
        name: `${user.nombre || ""} ${user.apellido || ""}`.trim(),
        email: user.email,
        role:
          role === "administrador"
            ? "Administrador"
            : role === "profesor"
            ? "Profesor"
            : "Estudiante",
        activo: user.activo,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(frontendUser)
      );
      localStorage.setItem("token", user.token);

      if (role === "administrador") {
        navigate("/dashboard-admin");
        return;
      }

      if (role === "profesor") {
        navigate("/dashboard");
        return;
      }

      navigate("/dashboard-estudiante");
    } catch (error) {
      console.error("Error de login:", error);

      alert(
        "No fue posible conectar con el backend. Verifica que Spring Boot esté ejecutándose."
      );
    }
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
            <strong><SSLocalized text={"StudySync"} /></strong>
            <small><SSLocalized text={"Study Together"} /></small>
          </span>
        </Link>

        <div className="login-showcase-content">
          <span className="login-eyebrow">
            <Sparkles size={15} />
            <SSLocalized text={"Tu espacio de aprendizaje"} />
          </span>

          <h1>
            <SSLocalized text={"Estudia mejor."} />
            <span> <SSLocalized text={"Avanza acompañado."} /></span>
          </h1>

          <p>
            <SSLocalized text={"Organiza tus cursos, participa en salas de estudio y mejora tu rendimiento desde una sola plataforma."} />
          </p>

          <div className="login-benefits">
            <article className="login-benefit-card">
              <div>
                <Users size={21} />
              </div>

              <span>
                <strong><SSLocalized text={"Salas colaborativas"} /></strong>
                <small><SSLocalized text={"Aprende junto a tu comunidad."} /></small>
              </span>
            </article>

            <article className="login-benefit-card">
              <div>
                <ShieldCheck size={21} />
              </div>

              <span>
                <strong><SSLocalized text={"Progreso centralizado"} /></strong>
                <small><SSLocalized text={"Consulta tu actividad y resultados."} /></small>
              </span>
            </article>
          </div>
        </div>

        <div className="login-showcase-footer">
          <span><SSLocalized text={"© 2026 StudySync"} /></span>
          <span><SSLocalized text={"Aprende. Colabora. Crece."} /></span>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-mobile-brand">
            <span className="login-brand-icon">
              <GraduationCap size={24} />
            </span>

            <strong><SSLocalized text={"StudySync"} /></strong>
          </div>

          <header className="login-form-header">
            <span className="login-form-label">
              <SSLocalized text={"Bienvenido de nuevo"} />
            </span>

            <h2><SSLocalized text={"Inicia sesión"} /></h2>

            <p>
              <SSLocalized text={"Ingresa tus datos para continuar a tu espacio de trabajo."} />
            </p>
          </header>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <label className="login-field">
              <span><SSLocalized text={"Correo electrónico"} /></span>

              <div className="login-input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={ssI18n.t("nombre@correo.com")}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span><SSLocalized text={"Tipo de usuario"} /></span>

              <div className="login-input-wrapper">
                <Users size={18} />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="estudiante">
                    <SSLocalized text={"Estudiante"} />
                  </option>

                  <option value="profesor">
                    <SSLocalized text={"Profesor"} />
                  </option>

                  <option value="administrador">
                    <SSLocalized text={"Administrador"} />
                  </option>
                </select>
              </div>
            </label>

            <label className="login-field">
              <span><SSLocalized text={"Contraseña"} /></span>

              <div className="login-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={ssI18n.t("Ingresa tu contraseña")}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
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

            {mfaRequired && (
              <label className="login-field">
                <span><SSLocalized text="Código de autenticación" /></span>
                <div className="login-input-wrapper">
                  <ShieldCheck size={18} />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                    )}
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    required
                    autoFocus
                  />
                </div>
              </label>
            )}

            <div className="login-form-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span><SSLocalized text={"Recordarme"} /></span>
              </label>

              <Link to="/recuperar-password">
                <SSLocalized text={"¿Olvidaste tu contraseña?"} />
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit-button"
            >
              <span><SSLocalized text={"Iniciar sesión"} /></span>
              <ArrowRight size={19} />
            </button>

            <div className="login-divider">
              <span><SSLocalized text={"o continúa con"} /></span>
            </div>

            <button
              type="button"
              className="login-google-button"
            >
              <span className="login-google-icon">
                <SSLocalized text={"G"} />
              </span>

              <SSLocalized text={"Continuar con Google"} />
            </button>
          </form>

          <p className="login-register-text">
            <SSLocalized text={"¿Todavía no tienes una cuenta?"} />
            <Link to="/register">
              <SSLocalized text={"Crear cuenta"} />
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;