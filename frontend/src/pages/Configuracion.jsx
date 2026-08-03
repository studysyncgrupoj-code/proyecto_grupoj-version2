import { useState } from "react";
import {
  Bell,
  Check,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  Moon,
  Palette,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  UserRound,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import "./Configuracion.css";

function Configuracion() {
  const [showPassword, setShowPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [settings, setSettings] = useState({
    language: "es",
    theme: "dark",
    emailNotifications: true,
    courseNotifications: true,
    messageNotifications: true,
    roomNotifications: false,
    twoFactorAuthentication: false,
    profileVisibility: "public",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      settings.newPassword &&
      settings.newPassword !== settings.confirmPassword
    ) {
      setSavedMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    setSavedMessage("Configuración guardada correctamente.");

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  return (
    <div className="settings-layout">
      <Sidebar />

      <main className="settings-content">
        <header className="settings-page-header">
          <div>
            <span className="settings-eyebrow">
              <Settings size={15} />
              Preferencias del sistema
            </span>

            <h1>Configuración</h1>

            <p>
              Administra tus preferencias, seguridad, notificaciones y
              privacidad dentro de StudySync.
            </p>
          </div>
        </header>

        <form className="settings-form" onSubmit={handleSubmit}>
          <section className="settings-grid">
            <article className="settings-card">
              <header className="settings-card-header">
                <div className="settings-card-icon">
                  <Palette size={21} />
                </div>

                <div>
                  <span>Experiencia visual</span>
                  <h2>Apariencia</h2>
                </div>
              </header>

              <div className="settings-card-body">
                <div className="settings-field">
                  <label>Tema de la aplicación</label>

                  <div className="settings-theme-grid">
                    <label
                      className={`settings-theme-option ${
                        settings.theme === "dark" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={settings.theme === "dark"}
                        onChange={handleChange}
                      />

                      <Moon size={22} />

                      <div>
                        <strong>Oscuro</strong>
                        <span>Diseño actual de StudySync</span>
                      </div>

                      {settings.theme === "dark" && <Check size={17} />}
                    </label>

                    <label
                      className={`settings-theme-option ${
                        settings.theme === "light" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={settings.theme === "light"}
                        onChange={handleChange}
                      />

                      <Sun size={22} />

                      <div>
                        <strong>Claro</strong>
                        <span>Fondo blanco y tonos suaves</span>
                      </div>

                      {settings.theme === "light" && <Check size={17} />}
                    </label>

                    <label
                      className={`settings-theme-option ${
                        settings.theme === "system" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value="system"
                        checked={settings.theme === "system"}
                        onChange={handleChange}
                      />

                      <Monitor size={22} />

                      <div>
                        <strong>Sistema</strong>
                        <span>Usar la configuración del equipo</span>
                      </div>

                      {settings.theme === "system" && <Check size={17} />}
                    </label>
                  </div>
                </div>

                <div className="settings-field">
                  <label htmlFor="language">Idioma</label>

                  <div className="settings-input-wrapper">
                    <Globe2 size={18} />

                    <select
                      id="language"
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <header className="settings-card-header">
                <div className="settings-card-icon">
                  <Bell size={21} />
                </div>

                <div>
                  <span>Centro de alertas</span>
                  <h2>Notificaciones</h2>
                </div>
              </header>

              <div className="settings-card-body settings-switch-list">
                <label className="settings-switch-row">
                  <div className="settings-switch-information">
                    <div>
                      <Mail size={18} />
                    </div>

                    <span>
                      <strong>Correos electrónicos</strong>
                      <small>
                        Recibe novedades importantes en tu correo.
                      </small>
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                  />

                  <span className="settings-switch" />
                </label>

                <label className="settings-switch-row">
                  <div className="settings-switch-information">
                    <div>
                      <Monitor size={18} />
                    </div>

                    <span>
                      <strong>Cursos y actividades</strong>
                      <small>
                        Nuevas entregas, tareas y actualizaciones.
                      </small>
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="courseNotifications"
                    checked={settings.courseNotifications}
                    onChange={handleChange}
                  />

                  <span className="settings-switch" />
                </label>

                <label className="settings-switch-row">
                  <div className="settings-switch-information">
                    <div>
                      <Smartphone size={18} />
                    </div>

                    <span>
                      <strong>Mensajes directos</strong>
                      <small>
                        Avisos cuando recibas una conversación nueva.
                      </small>
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="messageNotifications"
                    checked={settings.messageNotifications}
                    onChange={handleChange}
                  />

                  <span className="settings-switch" />
                </label>

                <label className="settings-switch-row">
                  <div className="settings-switch-information">
                    <div>
                      <UserRound size={18} />
                    </div>

                    <span>
                      <strong>Salas de estudio</strong>
                      <small>
                        Invitaciones y recordatorios de sesiones.
                      </small>
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="roomNotifications"
                    checked={settings.roomNotifications}
                    onChange={handleChange}
                  />

                  <span className="settings-switch" />
                </label>
              </div>
            </article>

            <article className="settings-card">
              <header className="settings-card-header">
                <div className="settings-card-icon">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <span>Control de cuenta</span>
                  <h2>Seguridad</h2>
                </div>
              </header>

              <div className="settings-card-body">
                <label className="settings-switch-row settings-security-toggle">
                  <div className="settings-switch-information">
                    <div>
                      <Smartphone size={18} />
                    </div>

                    <span>
                      <strong>Autenticación en dos pasos</strong>
                      <small>
                        Agrega una capa adicional de protección.
                      </small>
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="twoFactorAuthentication"
                    checked={settings.twoFactorAuthentication}
                    onChange={handleChange}
                  />

                  <span className="settings-switch" />
                </label>

                <div className="settings-password-section">
                  <div className="settings-password-title">
                    <KeyRound size={19} />

                    <div>
                      <strong>Cambiar contraseña</strong>
                      <span>
                        Utiliza al menos ocho caracteres para mayor seguridad.
                      </span>
                    </div>
                  </div>

                  <div className="settings-password-grid">
                    <label>
                      <span>Contraseña actual</span>

                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={settings.currentPassword}
                          onChange={handleChange}
                          placeholder="Contraseña actual"
                        />

                        <button
                          type="button"
                          aria-label="Mostrar u ocultar contraseña"
                          onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </label>

                    <label>
                      <span>Nueva contraseña</span>

                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={settings.newPassword}
                          onChange={handleChange}
                          placeholder="Nueva contraseña"
                        />
                      </div>
                    </label>

                    <label>
                      <span>Confirmar contraseña</span>

                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={settings.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirmar contraseña"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <header className="settings-card-header">
                <div className="settings-card-icon">
                  <Eye size={21} />
                </div>

                <div>
                  <span>Información visible</span>
                  <h2>Privacidad</h2>
                </div>
              </header>

              <div className="settings-card-body">
                <div className="settings-field">
                  <label htmlFor="profileVisibility">
                    Visibilidad del perfil
                  </label>

                  <div className="settings-input-wrapper">
                    <UserRound size={18} />

                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      value={settings.profileVisibility}
                      onChange={handleChange}
                    >
                      <option value="public">
                        Visible para todos los usuarios
                      </option>

                      <option value="students">
                        Solo estudiantes vinculados
                      </option>

                      <option value="private">
                        Perfil privado
                      </option>
                    </select>
                  </div>
                </div>

                <div className="settings-privacy-note">
                  <ShieldCheck size={21} />

                  <div>
                    <strong>Tus datos están protegidos</strong>

                    <p>
                      StudySync utiliza tu información únicamente para operar
                      las funciones de la plataforma educativa.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <footer className="settings-form-footer">
            <div>
              {savedMessage && (
                <span
                  className={`settings-save-message ${
                    savedMessage.includes("no coinciden") ? "error" : ""
                  }`}
                >
                  {savedMessage}
                </span>
              )}
            </div>

            <button type="submit" className="settings-save-button">
              <Save size={18} />
              Guardar configuración
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}

export default Configuracion;