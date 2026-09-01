import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock3,
  Edit3,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  X,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";

import "../../styles/shared/Perfil.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const USERS_API = `${API_BASE_URL}/api/users`;

const professorAchievements = [
  {
    id: 1,
    title: "Profesor destacado",
    description: "Calificación superior a 4.8 durante el último mes.",
    icon: Star,
  },
  {
    id: 2,
    title: "100 estudiantes",
    description: "Más de 100 estudiantes vinculados a tus cursos.",
    icon: Users,
  },
  {
    id: 3,
    title: "Mentor activo",
    description: "Participación constante en salas y sesiones de estudio.",
    icon: Award,
  },
];

const professorActivity = [
  {
    id: 1,
    title: "Publicaste una nueva actividad",
    description: "Curso de React avanzado",
    time: "Hace 24 minutos",
  },
  {
    id: 2,
    title: "Creaste una sala de estudio",
    description: "Repaso de arquitectura frontend",
    time: "Hace 2 horas",
  },
  {
    id: 3,
    title: "Calificaste una entrega",
    description: "Proyecto final de JavaScript",
    time: "Ayer",
  },
  {
    id: 4,
    title: "Actualizaste un curso",
    description: "Introducción a bases de datos",
    time: "Hace 2 días",
  },
];

const studentAchievements = [
  {
    id: 1,
    title: "Racha de estudio",
    description: "Completaste siete días consecutivos de aprendizaje.",
    icon: Star,
  },
  {
    id: 2,
    title: "Estudiante colaborativo",
    description: "Participaste activamente en salas y grupos de estudio.",
    icon: Users,
  },
  {
    id: 3,
    title: "Meta cumplida",
    description: "Superaste tus objetivos académicos de este mes.",
    icon: Award,
  },
];

const studentActivity = [
  {
    id: 1,
    title: "Completaste una sesión Focus",
    description: "25 minutos de concentración",
    time: "Hace 18 minutos",
  },
  {
    id: 2,
    title: "Ingresaste a una sala de estudio",
    description: "Sala de Matemáticas",
    time: "Hace 1 hora",
  },
  {
    id: 3,
    title: "Avanzaste en un curso",
    description: "JavaScript moderno",
    time: "Ayer",
  },
  {
    id: 4,
    title: "Completaste una actividad",
    description: "Ejercicios de bases de datos",
    time: "Hace 2 días",
  },
];

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

function getUserRole(user) {
  return String(
    user?.rol ??
      user?.role ??
      "",
  ).toUpperCase();
}

function roleLabel(role) {
  const normalizedRole =
    String(role || "").toUpperCase();

  if (normalizedRole === "ADMINISTRADOR") {
    return "Administrador";
  }

  if (normalizedRole === "PROFESOR") {
    return "Profesor";
  }

  if (normalizedRole === "ESTUDIANTE") {
    return "Estudiante";
  }

  return "Usuario";
}

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase(),
    )
    .join("");
}

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    nombre: parts.shift() || "",
    apellido: parts.join(" "),
  };
}

function createProfileFromUser(
  user,
  currentProfile = null,
) {
  const role =
    getUserRole(user);

  const isStudent =
    role === "ESTUDIANTE" ||
    role === "STUDENT";

  const fullName =
    `${user?.nombre ?? ""} ${
      user?.apellido ?? ""
    }`.trim() ||
    user?.name ||
    currentProfile?.name ||
    (isStudent
      ? "Estudiante StudySync"
      : "Usuario StudySync");

  return {
    name: fullName,

    role:
      roleLabel(role),

    email:
      user?.email ??
      currentProfile?.email ??
      "",

    location:
      currentProfile?.location ??
      "Bogotá, Colombia",

    specialty:
      currentProfile?.specialty ??
      (isStudent
        ? "Desarrollo web y aprendizaje colaborativo"
        : "Desarrollo web y arquitectura de software"),

    biography:
      currentProfile?.biography ??
      (isStudent
        ? "Estudiante enfocado en mejorar sus habilidades, participar en salas de estudio y alcanzar sus objetivos académicos dentro de StudySync."
        : "Profesor enfocado en desarrollo web, buenas prácticas, arquitectura frontend y construcción de proyectos tecnológicos colaborativos."),
  };
}

function Perfil() {
  const [storedUser, setStoredUser] =
    useState(() => getStoredUser());

  const [apiUser, setApiUser] =
    useState(null);

  const initialRole =
    getUserRole(storedUser);

  const initialIsStudent =
    initialRole === "ESTUDIANTE" ||
    initialRole === "STUDENT";

  const initialProfile =
    createProfileFromUser(
      storedUser,
      {
        location: "Bogotá, Colombia",

        specialty:
          initialIsStudent
            ? "Desarrollo web y aprendizaje colaborativo"
            : "Desarrollo web y arquitectura de software",

        biography:
          initialIsStudent
            ? "Estudiante enfocado en mejorar sus habilidades, participar en salas de estudio y alcanzar sus objetivos académicos dentro de StudySync."
            : "Profesor enfocado en desarrollo web, buenas prácticas, arquitectura frontend y construcción de proyectos tecnológicos colaborativos.",
      },
    );

  const [isEditing, setIsEditing] =
    useState(false);

  const [profile, setProfile] =
    useState(initialProfile);

  const [formData, setFormData] =
    useState(initialProfile);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const currentRole =
    getUserRole(
      apiUser || storedUser,
    );

  const isStudent =
    currentRole === "ESTUDIANTE" ||
    currentRole === "STUDENT";

  const userId =
    apiUser?.id ??
    storedUser?.id;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response =
          await fetch(
            `${USERS_API}/${userId}`,
          );

        if (!response.ok) {
          throw new Error(
            `No fue posible cargar el perfil (${response.status}).`,
          );
        }

        const user =
          await response.json();

        setApiUser(user);

        setStoredUser(user);

        const backendProfile =
          createProfileFromUser(
            user,
            profile,
          );

        setProfile(backendProfile);
        setFormData(backendProfile);

        localStorage.setItem(
          "user",
          JSON.stringify(user),
        );
      } catch (loadError) {
        console.error(
          "Error cargando perfil:",
          loadError,
        );

        setError(
          "No fue posible cargar el perfil desde el backend.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const achievements =
    isStudent
      ? studentAchievements
      : professorAchievements;

  const recentActivity =
    isStudent
      ? studentActivity
      : professorActivity;

  const initials =
    getInitials(profile.name) ||
    "SS";

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      }),
    );

    setError("");
  };

  const handleEdit = () => {
    setFormData(profile);
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (
    event,
  ) => {
    event.preventDefault();

    if (!userId) {
      setError(
        "No se encontró el identificador del usuario autenticado.",
      );
      return;
    }

    const {
      nombre,
      apellido,
    } = splitName(
      formData.name,
    );

    const currentApiUser =
      apiUser ||
      storedUser ||
      {};

    const payload = {
      ...currentApiUser,

      nombre,
      apellido,

      email:
        formData.email.trim(),

      rol:
        currentApiUser.rol ||
        currentApiUser.role ||
        "ESTUDIANTE",

      activo:
        currentApiUser.activo ??
        true,
    };

    delete payload.name;
    delete payload.role;

    try {
      setIsSaving(true);
      setError("");

      const response =
        await fetch(
          `${USERS_API}/${userId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload,
            ),
          },
        );

      if (!response.ok) {
        let message =
          `No fue posible actualizar el perfil (${response.status}).`;

        try {
          const errorData =
            await response.json();

          message =
            errorData.message ||
            errorData.error ||
            message;
        } catch {
          // El backend no devolvió JSON.
        }

        throw new Error(message);
      }

      const updatedUser =
        await response.json();

      setApiUser(updatedUser);
      setStoredUser(updatedUser);

      const updatedProfile =
        createProfileFromUser(
          updatedUser,
          {
            ...formData,

            location:
              formData.location,

            specialty:
              formData.specialty,

            biography:
              formData.biography,
          },
        );

      setProfile(
        updatedProfile,
      );

      setFormData(
        updatedProfile,
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser,
        ),
      );

      localStorage.setItem(
        `profile_extra_${userId}`,
        JSON.stringify({
          location:
            formData.location,

          specialty:
            formData.specialty,

          biography:
            formData.biography,
        }),
      );

      setIsEditing(false);
    } catch (saveError) {
      console.error(
        "Error actualizando perfil:",
        saveError,
      );

      setError(
        saveError.message ||
          "No fue posible guardar los cambios.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    try {
      const storedExtras =
        localStorage.getItem(
          `profile_extra_${userId}`,
        );

      if (!storedExtras) {
        return;
      }

      const extras =
        JSON.parse(
          storedExtras,
        );

      setProfile(
        (currentProfile) => ({
          ...currentProfile,
          ...extras,
        }),
      );

      setFormData(
        (currentProfile) => ({
          ...currentProfile,
          ...extras,
        }),
      );
    } catch {
      // Si falla el dato local adicional,
      // simplemente se utilizan los valores por defecto.
    }
  }, [userId]);

  return (
    <div className="profile-layout">
      <Sidebar />

      <main className="profile-content">
        <header className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              <UserRound size={15} />
              Perfil profesional
            </span>

            <h1>
              Mi perfil
            </h1>

            <p>
              {isStudent
                ? "Administra tu información personal, progreso y actividad académica dentro de StudySync."
                : "Administra tu información personal, experiencia y actividad dentro de StudySync."}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="profile-edit-button"
              onClick={handleEdit}
              disabled={isLoading}
            >
              <Edit3 size={18} />
              Editar perfil
            </button>
          )}
        </header>

        {error && (
          <p
            style={{
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <section className="profile-main-grid">
          <section className="profile-card profile-identity-card">
            <div className="profile-cover">
              <div className="profile-cover-glow" />
            </div>

            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <span>
                  {initials}
                </span>

                <button
                  type="button"
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera size={17} />
                </button>
              </div>
            </div>

            <div className="profile-identity-content">
              <div className="profile-name-section">
                <div>
                  <div className="profile-name-line">
                    <h2>
                      {isLoading
                        ? "Cargando..."
                        : profile.name}
                    </h2>

                    <CheckCircle2
                      size={20}
                    />
                  </div>

                  <p>
                    {profile.role}
                  </p>
                </div>

                <span className="profile-status">
                  <span />
                  Disponible
                </span>
              </div>

              <div className="profile-information-list">
                <article>
                  <Mail size={18} />

                  <div>
                    <span>
                      Correo electrónico
                    </span>

                    <strong>
                      {profile.email}
                    </strong>
                  </div>
                </article>

                <article>
                  <MapPin size={18} />

                  <div>
                    <span>
                      Ubicación
                    </span>

                    <strong>
                      {
                        profile.location
                      }
                    </strong>
                  </div>
                </article>

                <article>
                  <BookOpen
                    size={18}
                  />

                  <div>
                    <span>
                      {isStudent
                        ? "Área de estudio"
                        : "Especialidad"}
                    </span>

                    <strong>
                      {
                        profile.specialty
                      }
                    </strong>
                  </div>
                </article>
              </div>

              <div className="profile-biography">
                <span>
                  Acerca de mí
                </span>

                <p>
                  {profile.biography}
                </p>
              </div>
            </div>
          </section>

          <aside className="profile-side-column">
            <section className="profile-card profile-level-card">
              <div className="profile-card-heading">
                <div>
                  <span>
                    {isStudent
                      ? "Nivel académico"
                      : "Nivel profesional"}
                  </span>

                  <h3>
                    {isStudent
                      ? "Estudiante avanzado"
                      : "Profesor experto"}
                  </h3>
                </div>

                <div className="profile-level-icon">
                  <ShieldCheck
                    size={24}
                  />
                </div>
              </div>

              <div className="profile-level-progress">
                <div>
                  <span>
                    Progreso al siguiente nivel
                  </span>

                  <strong>
                    {isStudent
                      ? "64%"
                      : "78%"}
                  </strong>
                </div>

                <div className="profile-progress-track">
                  <span
                    style={{
                      width:
                        isStudent
                          ? "64%"
                          : "78%",
                    }}
                  />
                </div>
              </div>

              <div className="profile-level-footer">
                <span>
                  {isStudent
                    ? "2.560 XP obtenidos"
                    : "3.940 XP obtenidos"}
                </span>

                <span>
                  {isStudent
                    ? "1.440 XP restantes"
                    : "1.060 XP restantes"}
                </span>
              </div>
            </section>

            <section className="profile-card profile-statistics-card">
              <div className="profile-card-title">
                <h3>
                  Estadísticas
                </h3>

                <span>
                  Este semestre
                </span>
              </div>

              <div className="profile-statistics-grid">
                {isStudent ? (
                  <>
                    <article>
                      <strong>
                        18h
                      </strong>
                      <span>
                        Tiempo estudiado
                      </span>
                    </article>

                    <article>
                      <strong>
                        3
                      </strong>
                      <span>
                        Cursos activos
                      </span>
                    </article>

                    <article>
                      <strong>
                        24
                      </strong>
                      <span>
                        Sesiones Focus
                      </span>
                    </article>

                    <article>
                      <strong>
                        8
                      </strong>
                      <span>
                        Logros
                      </span>
                    </article>
                  </>
                ) : (
                  <>
                    <article>
                      <strong>
                        128
                      </strong>
                      <span>
                        Estudiantes
                      </span>
                    </article>

                    <article>
                      <strong>
                        12
                      </strong>
                      <span>
                        Cursos
                      </span>
                    </article>

                    <article>
                      <strong>
                        46
                      </strong>
                      <span>
                        Salas creadas
                      </span>
                    </article>

                    <article>
                      <strong>
                        4.9
                      </strong>
                      <span>
                        Calificación
                      </span>
                    </article>
                  </>
                )}
              </div>
            </section>
          </aside>
        </section>

        <section className="profile-secondary-grid">
          <section className="profile-card profile-achievements-card">
            <div className="profile-section-heading">
              <div>
                <span>
                  Reconocimientos
                </span>

                <h2>
                  Logros destacados
                </h2>
              </div>

              <Award size={22} />
            </div>

            <div className="profile-achievements-list">
              {achievements.map(
                (achievement) => {
                  const Icon =
                    achievement.icon;

                  return (
                    <article
                      key={
                        achievement.id
                      }
                    >
                      <div className="profile-achievement-icon">
                        <Icon
                          size={21}
                        />
                      </div>

                      <div>
                        <h3>
                          {
                            achievement.title
                          }
                        </h3>

                        <p>
                          {
                            achievement.description
                          }
                        </p>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </section>

          <section className="profile-card profile-activity-card">
            <div className="profile-section-heading">
              <div>
                <span>
                  Historial reciente
                </span>

                <h2>
                  Actividad
                </h2>
              </div>

              <Clock3 size={22} />
            </div>

            <div className="profile-activity-list">
              {recentActivity.map(
                (activity) => (
                  <article
                    key={activity.id}
                  >
                    <div className="profile-activity-point" />

                    <div>
                      <h3>
                        {
                          activity.title
                        }
                      </h3>

                      <p>
                        {
                          activity.description
                        }
                      </p>

                      <span>
                        {
                          activity.time
                        }
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>
        </section>
      </main>

      {isEditing && (
        <div className="profile-modal-backdrop">
          <section className="profile-edit-modal">
            <header>
              <div>
                <span>
                  Configuración personal
                </span>

                <h2>
                  Editar perfil
                </h2>
              </div>

              <button
                type="button"
                aria-label="Cerrar formulario"
                onClick={handleCancel}
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={handleSave}
            >
              <div className="profile-form-grid">
                <label>
                  <span>
                    Nombre completo
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>

                <label>
                  <span>
                    Cargo o rol
                  </span>

                  <input
                    type="text"
                    name="role"
                    value={
                      formData.role
                    }
                    readOnly
                  />
                </label>

                <label>
                  <span>
                    Correo electrónico
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>

                <label>
                  <span>
                    Ubicación
                  </span>

                  <input
                    type="text"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>

                <label className="profile-form-full-width">
                  <span>
                    {isStudent
                      ? "Área de estudio"
                      : "Especialidad"}
                  </span>

                  <input
                    type="text"
                    name="specialty"
                    value={
                      formData.specialty
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>

                <label className="profile-form-full-width">
                  <span>
                    Biografía
                  </span>

                  <textarea
                    name="biography"
                    value={
                      formData.biography
                    }
                    onChange={
                      handleChange
                    }
                    rows="5"
                    required
                  />
                </label>
              </div>

              {error && (
                <p
                  style={{
                    marginTop:
                      "12px",
                  }}
                >
                  {error}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    handleCancel
                  }
                  disabled={
                    isSaving
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={
                    isSaving
                  }
                >
                  <Save
                    size={18}
                  />

                  {isSaving
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Perfil;