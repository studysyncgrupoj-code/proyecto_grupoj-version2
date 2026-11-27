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
  User,
  Users,
} from "lucide-react";

import "../../styles/auth/Register.css";

const INITIAL_FORM_DATA = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  rol: "ESTUDIANTE",
  activo: true,
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (formData.password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);

      const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

          const REGISTER_PATH =
            import.meta.env.VITE_REGISTER_PATH || "/auth/register";

          const response = await fetch(`${API_BASE_URL}${REGISTER_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          rol: formData.rol,
          activo: true,
        }),
              });

      if (!response.ok) {
        let errorMessage = "Error al registrar el usuario.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          // El backend no devolvió JSON.
        }

        throw new Error(errorMessage);
      }

      setMessage("Usuario registrado correctamente.");
      setMessageType("success");

      setFormData(INITIAL_FORM_DATA);
      setConfirmPassword("");

      window.setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (error instanceof TypeError) {
        setMessage(
          "No fue posible conectar con el backend. Verifica que Spring Boot esté ejecutándose en el puerto 8080."
        );
      } else {
        setMessage(error.message || "No se pudo registrar el usuario.");
      }

      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-showcase">
        <div className="register-showcase-glow register-showcase-glow-one" />
        <div className="register-showcase-glow register-showcase-glow-two" />

        <Link to="/" className="register-brand">
          <span className="register-brand-icon">
            <GraduationCap size={26} strokeWidth={2.2} />
          </span>

          <span className="register-brand-copy">
            <strong><SSLocalized text={"StudySync"} /></strong>
            <small><SSLocalized text={"Study Together"} /></small>
          </span>
        </Link>

        <div className="register-showcase-content">
          <span className="register-eyebrow">
            <Sparkles size={15} />
            <SSLocalized text={"Empieza hoy"} />
          </span>

          <h1>
            <SSLocalized text={"Crea tu espacio."} />
            <span> <SSLocalized text={"Aprende sin límites."} /></span>
          </h1>

          <p>
            <SSLocalized text={"Únete a StudySync y organiza tus cursos, salas de estudio, actividades y progreso desde una sola plataforma."} />
          </p>

          <div className="register-benefits">
            <article className="register-benefit-card">
              <div>
                <Users size={21} />
              </div>

              <span>
                <strong><SSLocalized text={"Comunidad activa"} /></strong>
                <small><SSLocalized text={"Conecta con estudiantes y profesores."} /></small>
              </span>
            </article>

            <article className="register-benefit-card">
              <div>
                <ShieldCheck size={21} />
              </div>

              <span>
                <strong><SSLocalized text={"Cuenta protegida"} /></strong>
                <small><SSLocalized text={"Tus datos y avances permanecen seguros."} /></small>
              </span>
            </article>
          </div>
        </div>

        <div className="register-showcase-footer">
          <span><SSLocalized text={"© 2026 StudySync"} /></span>
          <span><SSLocalized text={"Aprende. Colabora. Crece."} /></span>
        </div>
      </section>

      <section className="register-form-section">
        <div className="register-form-wrapper">
          <div className="register-mobile-brand">
            <span className="register-brand-icon">
              <GraduationCap size={24} />
            </span>

            <strong><SSLocalized text={"StudySync"} /></strong>
          </div>

          <header className="register-form-header">
            <span className="register-form-label"><SSLocalized text={"Nueva cuenta"} /></span>

            <h2><SSLocalized text={"Regístrate"} /></h2>

            <p>
              <SSLocalized text={"Completa tus datos para empezar a utilizar StudySync."} />
            </p>
          </header>

          <form className="register-form" onSubmit={handleSubmit}>
            <label className="register-field">
              <span><SSLocalized text={"Nombre"} /></span>

              <div className="register-input-wrapper">
                <User size={18} />

                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={ssI18n.t("Escribe tu nombre")}
                  autoComplete="given-name"
                  required
                />
              </div>
            </label>

            <label className="register-field">
              <span><SSLocalized text={"Apellido"} /></span>

              <div className="register-input-wrapper">
                <User size={18} />

                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder={ssI18n.t("Escribe tu apellido")}
                  autoComplete="family-name"
                  required
                />
              </div>
            </label>

            <label className="register-field">
              <span><SSLocalized text={"Correo electrónico"} /></span>

              <div className="register-input-wrapper">
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

            <label className="register-field">
              <span><SSLocalized text={"Tipo de cuenta"} /></span>

              <div className="register-input-wrapper">
                <Users size={18} />

                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="ESTUDIANTE"><SSLocalized text={"Estudiante"} /></option>
                  <option value="PROFESOR"><SSLocalized text={"Profesor"} /></option>
                  <option value="ADMINISTRADOR"><SSLocalized text={"Administrador"} /></option>
                </select>
              </div>
            </label>

            <label className="register-field">
              <span><SSLocalized text={"Contraseña"} /></span>

              <div className="register-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={ssI18n.t("Crea una contraseña")}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
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

            <label className="register-field">
              <span><SSLocalized text={"Confirmar contraseña"} /></span>

              <div className="register-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder={ssI18n.t("Confirma tu contraseña")}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <label className="register-terms">
              <input type="checkbox" required />

              <span>
                <SSLocalized text={"Acepto los términos y la política de privacidad."} />
              </span>
            </label>

            {message && (
              <p
                className={`register-message register-message-${messageType}`}
                role="status"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="register-submit-button"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting ? "Registrando..." : "Crear cuenta"}
              </span>

              {!isSubmitting && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="register-login-text">
            <SSLocalized text={"¿Ya tienes una cuenta?"} />
            <Link to="/login"><SSLocalized text={"Iniciar sesión"} /></Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;