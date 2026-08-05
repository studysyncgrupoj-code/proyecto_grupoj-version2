import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCog,
  Users,
  Video,
} from "lucide-react";


import Sidebar from "../../components/dashboard/Sidebar";
import "../../styles/admin/DashboardAdmin.css";


const summaryCards = [
  { label: "Usuarios registrados", value: "1.248", detail: "+82 este mes", icon: Users },
  { label: "Profesores activos", value: "74", detail: "68 conectados esta semana", icon: GraduationCap },
  { label: "Estudiantes activos", value: "1.174", detail: "94% de actividad", icon: UserCog },
  { label: "Cursos publicados", value: "86", detail: "12 creados este mes", icon: BookOpen },
];

const activityData = [
  { day: "Lun", value: 64 },
  { day: "Mar", value: 78 },
  { day: "Mié", value: 71 },
  { day: "Jue", value: 92 },
  { day: "Vie", value: 86 },
  { day: "Sáb", value: 58 },
  { day: "Dom", value: 67 },
];

const recentActivity = [
  { id: 1, title: "Nuevo profesor registrado", description: "Laura Méndez fue agregada al área de Matemáticas.", time: "Hace 12 min", icon: GraduationCap },
  { id: 2, title: "Informe académico enviado", description: "Se notificó a 18 estudiantes del curso React avanzado.", time: "Hace 42 min", icon: Mail },
  { id: 3, title: "Curso publicado", description: "Arquitectura de software ya está disponible.", time: "Hace 2 h", icon: BookOpen },
  { id: 4, title: "Nueva sala colaborativa", description: "Sala de preparación para examen final.", time: "Ayer", icon: Video },
];

const alerts = [
  { id: 1, title: "7 estudiantes en seguimiento", description: "Presentan bajo rendimiento o entregas pendientes.", type: "warning" },
  { id: 2, title: "3 correos pendientes", description: "No pudieron ser entregados y requieren revisión.", type: "danger" },
  { id: 3, title: "Sistema operativo", description: "Todos los servicios principales están disponibles.", type: "success" },
];

function DashboardAdmin() {
  return (
    <div className="admin-dashboard-layout">
      <Sidebar />

      <main className="admin-dashboard-content">
        <header className="admin-dashboard-header">
          <div>
            <span className="admin-dashboard-eyebrow">
              <ShieldCheck size={15} />
              Centro de administración
            </span>
            <h1>Dashboard administrador</h1>
            <p>
              Supervisa usuarios, actividad académica, cursos, informes y
              servicios generales de StudySync.
            </p>
          </div>

          <button type="button" className="admin-dashboard-action">
            <Sparkles size={18} />
            Crear usuario
          </button>
        </header>

        <section className="admin-summary-grid">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="admin-summary-card" key={card.label}>
                <div className="admin-summary-icon"><Icon size={21} /></div>
                <div>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <small>{card.detail}</small>
                </div>
              </article>
            );
          })}
        </section>

        <section className="admin-primary-grid">
          <article className="admin-panel admin-activity-panel">
            <div className="admin-panel-header">
              <div>
                <span>ACTIVIDAD DEL SISTEMA</span>
                <h2>Usuarios activos por día</h2>
              </div>
              <div className="admin-panel-highlight">
                <TrendingUp size={16} />
                +14% esta semana
              </div>
            </div>

            <div className="admin-chart">
              {activityData.map((item) => (
                <div className="admin-chart-column" key={item.day}>
                  <div className="admin-chart-track">
                    <span style={{ height: `${item.value}%` }} />
                  </div>
                  <strong>{item.day}</strong>
                  <small>{item.value}%</small>
                </div>
              ))}
            </div>
          </article>

          <aside className="admin-panel admin-system-panel">
            <div className="admin-panel-header">
              <div>
                <span>ESTADO GENERAL</span>
                <h2>Plataforma</h2>
              </div>
              <Activity size={22} />
            </div>

            <div className="admin-health-score">
              <strong>98%</strong>
              <span>Disponibilidad</span>
            </div>

            <div className="admin-system-list">
              <article><span>Salas activas</span><strong>23</strong></article>
              <article><span>Informes enviados</span><strong>148</strong></article>
              <article><span>Correos procesados</span><strong>392</strong></article>
              <article><span>Uso IA Coach</span><strong>76%</strong></article>
            </div>
          </aside>
        </section>

        <section className="admin-secondary-grid">
          <article className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span>ACTIVIDAD RECIENTE</span>
                <h2>Últimos movimientos</h2>
              </div>
              <BarChart3 size={22} />
            </div>

            <div className="admin-activity-list">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.id}>
                    <div className="admin-activity-icon"><Icon size={18} /></div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span>{item.time}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>

          <aside className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span>CENTRO DE ALERTAS</span>
                <h2>Atención requerida</h2>
              </div>
              <AlertTriangle size={22} />
            </div>

            <div className="admin-alert-list">
              {alerts.map((alert) => (
                <article className={`admin-alert admin-alert-${alert.type}`} key={alert.id}>
                  <span />
                  <div>
                    <h3>{alert.title}</h3>
                    <p>{alert.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default DashboardAdmin;