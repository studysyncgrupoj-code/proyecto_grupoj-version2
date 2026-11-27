import ssI18n from "i18next";
import SSLocalized from "../../i18n/Localized.jsx";
import i18n from "../../i18n/index.js";
import { useEffect, useState } from "react";
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

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/shared/Configuracion.css";

const API_BASE_URL = "";

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

const defaultSettings = {
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
};

function Configuracion() {
  const [showPassword, setShowPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [settings, setSettings] = useState(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mfaPassword, setMfaPassword] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaOpen, setMfaOpen] = useState(false);
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaMessage, setMfaMessage] = useState("");

  const storedUser = getStoredUser();
  const userId = storedUser?.id;

  useEffect(() => {
    const loadSettings = async () => {
      if (!userId) {
        setSavedMessage(
          "No se encontró el usuario autenticado.",
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/settings/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Error cargando configuración (${response.status}).`,
          );
        }

        const data = await response.json();

        setSettings((currentSettings) => ({
          ...currentSettings,

          language:
            data.language ?? "es",

          theme:
            data.theme ?? "dark",

          emailNotifications:
            data.emailNotifications ?? true,

          courseNotifications:
            data.courseNotifications ?? true,

          messageNotifications:
            data.messageNotifications ?? true,

          roomNotifications:
            data.roomNotifications ?? false,

          twoFactorAuthentication:
            data.twoFactorAuthentication ?? false,

          profileVisibility:
            data.profileVisibility ?? "public",
        }));
      } catch (error) {
        console.error(
          "Error cargando configuración:",
          error,
        );

        setSavedMessage(
          "No fue posible cargar la configuración.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  useEffect(() => {
    if (isLoading) return;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = () => {
      const theme = settings.theme === "system"
        ? (media.matches ? "dark" : "light")
        : settings.theme;

      document.documentElement.dataset.theme = theme;
    };

    applyTheme();
    media.addEventListener("change", applyTheme);

    return () => {
      media.removeEventListener("change", applyTheme);
    };
  }, [settings.theme, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, isLoading]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setSavedMessage("");
  };

  const handleMfa = async (action) => {
    setMfaBusy(true);
    setMfaMessage("");

    try {
      const response = await fetch(`/api/mfa/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          password: mfaPassword,
          code: mfaCode,
        }),
      });

      if (!response.ok) {
        throw new Error("MFA_ERROR");
      }

      const data = await response.json();

      if (action === "setup") {
        setMfaSecret(data.secret);
      } else {
        setSettings(current => ({
          ...current,
          twoFactorAuthentication: data.enabled,
        }));

        setMfaSecret("");
        setMfaPassword("");
        setMfaCode("");
        setMfaOpen(false);
        setMfaMessage(data.enabled
          ? "Autenticación en dos pasos activada."
          : "Autenticación en dos pasos desactivada.");
      }
    } catch {
      setMfaMessage(
        "No fue posible completar la operación. Verifica la contraseña y el código."
      );
    } finally {
      setMfaBusy(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      setSavedMessage(
        "No se encontró el usuario autenticado.",
      );
      return;
    }

    if (
      settings.newPassword &&
      settings.newPassword !==
        settings.confirmPassword
    ) {
      setSavedMessage(
        "Las contraseñas nuevas no coinciden.",
      );
      return;
    }

    if (
      settings.newPassword &&
      settings.newPassword.length < 8
    ) {
      setSavedMessage(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    const payload = {
      language:
        settings.language,

      theme:
        settings.theme,

      emailNotifications:
        settings.emailNotifications,

      courseNotifications:
        settings.courseNotifications,

      messageNotifications:
        settings.messageNotifications,

      roomNotifications:
        settings.roomNotifications,

      twoFactorAuthentication:
        settings.twoFactorAuthentication,

      profileVisibility:
        settings.profileVisibility,
    };

    try {
      setIsSaving(true);
      setSavedMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/settings/user/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error guardando configuración (${response.status}).`,
        );
      }

      const updatedSettings =
        await response.json();

      setSettings((currentSettings) => ({
        ...currentSettings,

        language:
          updatedSettings.language ?? currentSettings.language,

        theme:
          updatedSettings.theme ?? currentSettings.theme,

        emailNotifications:
          updatedSettings.emailNotifications ??
          currentSettings.emailNotifications,

        courseNotifications:
          updatedSettings.courseNotifications ??
          currentSettings.courseNotifications,

        messageNotifications:
          updatedSettings.messageNotifications ??
          currentSettings.messageNotifications,

        roomNotifications:
          updatedSettings.roomNotifications ??
          currentSettings.roomNotifications,

        twoFactorAuthentication:
          updatedSettings.twoFactorAuthentication ??
          currentSettings.twoFactorAuthentication,

        profileVisibility:
          updatedSettings.profileVisibility ??
          currentSettings.profileVisibility,
      }));

      if (settings.newPassword) {
        const passwordResponse = await fetch(
          `${API_BASE_URL}/api/users/me/password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              currentPassword: settings.currentPassword,
              newPassword: settings.newPassword,
            }),
          }
        );

        if (!passwordResponse.ok) {
          setSavedMessage(
            "Preferencias guardadas. No fue posible cambiar la contraseña. Verifica la contraseña actual y los requisitos."
          );
          return;
        }

        setSettings(current => ({
          ...current,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        setSavedMessage(
          "Configuración y contraseña actualizadas correctamente."
        );
      } else {
        setSavedMessage(
          "Configuración guardada correctamente.",
        );
      }

      window.setTimeout(() => {
        setSavedMessage("");
      }, 4000);
    } catch (error) {
      console.error(
        "Error guardando configuración:",
        error,
      );

      setSavedMessage(
        "No fue posible guardar la configuración.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-layout">
      <Sidebar />

      <main className="settings-content">
        <header className="settings-page-header">
          <div>
            <span className="settings-eyebrow">
              <Settings size={15} /><SSLocalized text={"Preferencias del sistema"} /></span>

            <h1><SSLocalized text={"Configuración"} /></h1>

            <p>
              <SSLocalized text={"Administra tus preferencias, seguridad, notificaciones y privacidad dentro de StudySync."} />
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
                  <span><SSLocalized text={"Experiencia visual"} /></span>
                  <h2><SSLocalized text={"Apariencia"} /></h2>
                </div>
              </header>

              <div className="settings-card-body">
                <div className="settings-field">
                  <label><SSLocalized text={"Tema de la aplicación"} /></label>

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
                        <strong><SSLocalized text={"Oscuro"} /></strong>
                        <span><SSLocalized text={"Diseño actual de StudySync"} /></span>
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
                        <strong><SSLocalized text={"Claro"} /></strong>
                        <span><SSLocalized text={"Fondo blanco y tonos suaves"} /></span>
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
                        <strong><SSLocalized text={"Sistema"} /></strong>
                        <span><SSLocalized text={"Usar la configuración del equipo"} /></span>
                      </div>

                      {settings.theme === "system" && <Check size={17} />}
                    </label>
                  </div>
                </div>

                <div className="settings-field">
                  <label htmlFor="language"><SSLocalized text={"Idioma"} /></label>

                  <div className="settings-input-wrapper">
                    <Globe2 size={18} />

                    <select
                      id="language"
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                    >
                      <option value="es"><SSLocalized text={"Español"} /></option>
                      <option value="en"><SSLocalized text={"English"} /></option>
                      <option value="pt"><SSLocalized text={"Português"} /></option>
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
                  <span><SSLocalized text={"Centro de alertas"} /></span>
                  <h2><SSLocalized text={"Notificaciones"} /></h2>
                </div>
              </header>

              <div className="settings-card-body settings-switch-list">
                <label className="settings-switch-row">
                  <div className="settings-switch-information">
                    <div>
                      <Mail size={18} />
                    </div>

                    <span>
                      <strong><SSLocalized text={"Correos electrónicos"} /></strong>
                      <small>
                        <SSLocalized text={"Recibe novedades importantes en tu correo."} />
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
                      <strong><SSLocalized text={"Cursos y actividades"} /></strong>
                      <small>
                        <SSLocalized text={"Nuevas entregas, tareas y actualizaciones."} />
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
                      <strong><SSLocalized text={"Mensajes directos"} /></strong>
                      <small>
                        <SSLocalized text={"Avisos cuando recibas una conversación nueva."} />
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
                      <strong><SSLocalized text={"Salas de estudio"} /></strong>
                      <small>
                        <SSLocalized text={"Invitaciones y recordatorios de sesiones."} />
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
                  <span><SSLocalized text={"Control de cuenta"} /></span>
                  <h2><SSLocalized text={"Seguridad"} /></h2>
                </div>
              </header>

              <div className="settings-card-body">
                <label className="settings-switch-row settings-security-toggle">
                  <div className="settings-switch-information">
                    <div>
                      <Smartphone size={18} />
                    </div>

                    <span>
                      <strong><SSLocalized text={"Autenticación en dos pasos"} /></strong>
                      <small>
                        <SSLocalized text={"Agrega una capa adicional de protección."} />
                      </small>
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="twoFactorAuthentication"
                    checked={settings.twoFactorAuthentication}
                    disabled={isLoading || isSaving || mfaBusy}
                    onChange={() => {
                      setMfaOpen(current => !current);
                      setMfaPassword("");
                      setMfaSecret("");
                      setMfaCode("");
                      setMfaMessage("");
                    }}
                  />

                  <span className="settings-switch" />
                </label>

                {mfaOpen && (
                  <div className="settings-password-section">
                    <div className="settings-field">
                      <label><SSLocalized text="Contraseña actual" /></label>
                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />
                        <input
                          type="password"
                          autoComplete="current-password"
                          value={mfaPassword}
                          onChange={e => setMfaPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {!settings.twoFactorAuthentication && !mfaSecret && (
                      <button
                        type="button"
                        className="settings-save-button"
                        disabled={mfaBusy || !mfaPassword}
                        onClick={() => handleMfa("setup")}
                      >
                        <SSLocalized text="Generar clave de autenticación" />
                      </button>
                    )}

                    {mfaSecret && (
                      <div className="settings-field">
                        <p>
                          <SSLocalized text="Agrega esta clave manualmente en Google Authenticator o Microsoft Authenticator. Selecciona la opción basada en tiempo." />
                        </p>
                        <div className="settings-input-wrapper">
                          <input
                            type="text"
                            readOnly
                            value={mfaSecret}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    )}

                    {(mfaSecret || settings.twoFactorAuthentication) && (
                      <div className="settings-field">
                        <label><SSLocalized text="Código de autenticación" /></label>
                        <div className="settings-input-wrapper">
                          <ShieldCheck size={17} />
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={mfaCode}
                            maxLength={6}
                            placeholder="000000"
                            onChange={e => setMfaCode(
                              e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                            )}
                          />
                        </div>
                        <button
                          type="button"
                          className="settings-save-button"
                          disabled={mfaBusy || !mfaPassword || mfaCode.length !== 6}
                          onClick={() => handleMfa(
                            settings.twoFactorAuthentication ? "disable" : "enable"
                          )}
                        >
                          <SSLocalized text={settings.twoFactorAuthentication
                            ? "Desactivar 2FA" : "Activar 2FA"} />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={mfaBusy}
                      onClick={() => {
                        setMfaOpen(false);
                        setMfaSecret("");
                        setMfaPassword("");
                        setMfaCode("");
                      }}
                    >
                      <SSLocalized text="Cancelar" />
                    </button>
                  </div>
                )}

                {mfaMessage && (
                  <p role="status">{ssI18n.t(mfaMessage)}</p>
                )}

                <div className="settings-password-section">
                  <div className="settings-password-title">
                    <KeyRound size={19} />

                    <div>
                      <strong><SSLocalized text={"Cambiar contraseña"} /></strong>
                      <span>
                        <SSLocalized text={"Utiliza al menos ocho caracteres para mayor seguridad."} />
                      </span>
                    </div>
                  </div>

                  <div className="settings-password-grid">
                    <label>
                      <span><SSLocalized text={"Contraseña actual"} /></span>

                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={settings.currentPassword}
                          onChange={handleChange}
                          placeholder={ssI18n.t("Contraseña actual")}
                        />

                        <button
                          type="button"
                          aria-label={ssI18n.t("Mostrar u ocultar contraseña")}
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
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
                      <span><SSLocalized text={"Nueva contraseña"} /></span>

                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={settings.newPassword}
                          onChange={handleChange}
                          placeholder={ssI18n.t("Nueva contraseña")}
                        />
                      </div>
                    </label>

                    <label>
                      <span><SSLocalized text={"Confirmar contraseña"} /></span>

                      <div className="settings-input-wrapper">
                        <LockKeyhole size={17} />

                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={settings.confirmPassword}
                          onChange={handleChange}
                          placeholder={ssI18n.t("Confirmar contraseña")}
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
                  <span><SSLocalized text={"Información visible"} /></span>
                  <h2><SSLocalized text={"Privacidad"} /></h2>
                </div>
              </header>

              <div className="settings-card-body">
                <div className="settings-field">
                  <label htmlFor="profileVisibility"><SSLocalized text={"Visibilidad del perfil"} /></label>

                  <div className="settings-input-wrapper">
                    <UserRound size={18} />

                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      value={settings.profileVisibility}
                      onChange={handleChange}
                    >
                      <option value="public"><SSLocalized text={"Visible para todos los usuarios"} /></option>

                      <option value="students"><SSLocalized text={"Solo estudiantes vinculados"} /></option>

                      <option value="private"><SSLocalized text={"Perfil privado"} /></option>
                    </select>
                  </div>
                </div>

                <div className="settings-privacy-note">
                  <ShieldCheck size={21} />

                  <div>
                    <strong><SSLocalized text={"Tus datos están protegidos"} /></strong>

                    <p>
                      <SSLocalized text={"StudySync utiliza tu información únicamente para operar las funciones de la plataforma educativa."} />
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
                    savedMessage.includes("no coinciden") ||
                    savedMessage.includes("No fue") ||
                    savedMessage.includes("No se encontró") ||
                    savedMessage.includes("al menos")
                      ? "error"
                      : ""
                  }`}
                >
                  {savedMessage}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="settings-save-button"
              disabled={isLoading || isSaving}
            >
              <Save size={18} />

              {isSaving
                ? "Guardando..."
                : isLoading
                  ? "Cargando..."
                  : "Guardar configuración"}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}

export default Configuracion;