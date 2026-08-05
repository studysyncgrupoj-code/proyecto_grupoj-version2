import { useState } from "react";
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

import Sidebar from "../components/dashboard/Sidebar";
import "./Perfil.css";

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
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function Perfil() {
  const storedUser = getStoredUser();
  const normalizedRole = storedUser?.role?.toLowerCase() ?? "";
  const isStudent =
    normalizedRole === "estudiante" || normalizedRole === "student";

  const defaultProfile = isStudent
    ? {
        name: storedUser?.name || "Estudiante StudySync",
        role: "Estudiante",
        email: storedUser?.email || "estudiante@studysync.com",
        location: "Bogotá, Colombia",
        specialty: "Desarrollo web y aprendizaje colaborativo",
        biography:
          "Estudiante enfocado en mejorar sus habilidades, participar en salas de estudio y alcanzar sus objetivos académicos dentro de StudySync.",
      }
    : {
        name: storedUser?.name || "Profesor Richard",
        role: "Profesor y administrador",
        email: storedUser?.email || "richard@studysync.com",
        location: "Bogotá, Colombia",
        specialty: "Desarrollo web y arquitectura de software",
        biography:
          "Profesor enfocado en desarrollo web, buenas prácticas, arquitectura frontend y construcción de proyectos tecnológicos colaborativos.",
      };

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);

  const achievements = isStudent
    ? studentAchievements
    : professorAchievements;

  const recentActivity = isStudent
    ? studentActivity
    : professorActivity;

  const initials = getInitials(profile.name) || "SS";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setProfile(formData);

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...(storedUser ?? {}),
        name: formData.name,
        role: isStudent ? "Estudiante" : "Profesor",
        email: formData.email,
      }),
    );

    setIsEditing(false);
  };

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

            <h1>Mi perfil</h1>

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
            >
              <Edit3 size={18} />
              Editar perfil
            </button>
          )}
        </header>

        <section className="profile-main-grid">
          <section className="profile-card profile-identity-card">
            <div className="profile-cover">
              <div className="profile-cover-glow" />
            </div>

            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <span>{initials}</span>

                <button type="button" aria-label="Cambiar foto de perfil">
                  <Camera size={17} />
                </button>
              </div>
            </div>

            <div className="profile-identity-content">
              <div className="profile-name-section">
                <div>
                  <div className="profile-name-line">
                    <h2>{profile.name}</h2>
                    <CheckCircle2 size={20} />
                  </div>

                  <p>{profile.role}</p>
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
                    <span>Correo electrónico</span>
                    <strong>{profile.email}</strong>
                  </div>
                </article>

                <article>
                  <MapPin size={18} />
                  <div>
                    <span>Ubicación</span>
                    <strong>{profile.location}</strong>
                  </div>
                </article>

                <article>
                  <BookOpen size={18} />
                  <div>
                    <span>{isStudent ? "Área de estudio" : "Especialidad"}</span>
                    <strong>{profile.specialty}</strong>
                  </div>
                </article>
              </div>

              <div className="profile-biography">
                <span>Acerca de mí</span>
                <p>{profile.biography}</p>
              </div>
            </div>
          </section>

          <aside className="profile-side-column">
            <section className="profile-card profile-level-card">
              <div className="profile-card-heading">
                <div>
                  <span>{isStudent ? "Nivel académico" : "Nivel profesional"}</span>
                  <h3>{isStudent ? "Estudiante avanzado" : "Profesor experto"}</h3>
                </div>

                <div className="profile-level-icon">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="profile-level-progress">
                <div>
                  <span>Progreso al siguiente nivel</span>
                  <strong>{isStudent ? "64%" : "78%"}</strong>
                </div>

                <div className="profile-progress-track">
                  <span style={{ width: isStudent ? "64%" : "78%" }} />
                </div>
              </div>

              <div className="profile-level-footer">
                <span>{isStudent ? "2.560 XP obtenidos" : "3.940 XP obtenidos"}</span>
                <span>{isStudent ? "1.440 XP restantes" : "1.060 XP restantes"}</span>
              </div>
            </section>

            <section className="profile-card profile-statistics-card">
              <div className="profile-card-title">
                <h3>Estadísticas</h3>
                <span>Este semestre</span>
              </div>

              <div className="profile-statistics-grid">
                {isStudent ? (
                  <>
                    <article>
                      <strong>18h</strong>
                      <span>Tiempo estudiado</span>
                    </article>
                    <article>
                      <strong>3</strong>
                      <span>Cursos activos</span>
                    </article>
                    <article>
                      <strong>24</strong>
                      <span>Sesiones Focus</span>
                    </article>
                    <article>
                      <strong>8</strong>
                      <span>Logros</span>
                    </article>
                  </>
                ) : (
                  <>
                    <article>
                      <strong>128</strong>
                      <span>Estudiantes</span>
                    </article>
                    <article>
                      <strong>12</strong>
                      <span>Cursos</span>
                    </article>
                    <article>
                      <strong>46</strong>
                      <span>Salas creadas</span>
                    </article>
                    <article>
                      <strong>4.9</strong>
                      <span>Calificación</span>
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
                <span>Reconocimientos</span>
                <h2>Logros destacados</h2>
              </div>

              <Award size={22} />
            </div>

            <div className="profile-achievements-list">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;

                return (
                  <article key={achievement.id}>
                    <div className="profile-achievement-icon">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="profile-card profile-activity-card">
            <div className="profile-section-heading">
              <div>
                <span>Historial reciente</span>
                <h2>Actividad</h2>
              </div>

              <Clock3 size={22} />
            </div>

            <div className="profile-activity-list">
              {recentActivity.map((activity) => (
                <article key={activity.id}>
                  <div className="profile-activity-point" />

                  <div>
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    <span>{activity.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

      {isEditing && (
        <div className="profile-modal-backdrop">
          <section className="profile-edit-modal">
            <header>
              <div>
                <span>Configuración personal</span>
                <h2>Editar perfil</h2>
              </div>

              <button
                type="button"
                aria-label="Cerrar formulario"
                onClick={handleCancel}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSave}>
              <div className="profile-form-grid">
                <label>
                  <span>Nombre completo</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span>Cargo o rol</span>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span>Correo electrónico</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span>Ubicación</span>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="profile-form-full-width">
                  <span>Especialidad</span>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="profile-form-full-width">
                  <span>Biografía</span>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    rows="5"
                    required
                  />
                </label>
              </div>

              <footer>
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>

                <button type="submit" className="profile-save-button">
                  <Save size={18} />
                  Guardar cambios
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