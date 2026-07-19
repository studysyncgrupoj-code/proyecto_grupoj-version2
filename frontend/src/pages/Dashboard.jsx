import Sidebar from "../components/dashboard/Sidebar";

const stats = [
  {
    title: "Estudiantes activos",
    value: "320",
    detail: "+18 esta semana",
    icon: "ES",
  },
  {
    title: "Salas activas",
    value: "6",
    detail: "3 en vivo",
    icon: "SA",
  },
  {
    title: "Clases programadas",
    value: "12",
    detail: "4 para hoy",
    icon: "CL",
  },
  {
    title: "Tareas por revisar",
    value: "24",
    detail: "8 prioritarias",
    icon: "TA",
  },
];

const classes = [
  {
    title: "Matemáticas avanzadas",
    time: "09:00 - 10:30",
    students: "28 estudiantes",
    status: "En vivo",
  },
  {
    title: "Programación en Java",
    time: "11:00 - 12:30",
    students: "34 estudiantes",
    status: "Programada",
  },
  {
    title: "Base de Datos",
    time: "15:00 - 17:00",
    students: "22 estudiantes",
    status: "Pendiente",
  },
];

const activity = [
  {
    title: "María entregó la actividad de Álgebra.",
    time: "Hace poco",
  },
  {
    title: "Carlos completó cuatro ciclos Pomodoro.",
    time: "Hace 10 minutos",
  },
  {
    title: "Nueva sala creada para Física.",
    time: "Hace 20 minutos",
  },
];

function Dashboard() {
  return (
    <div className="teacher-dashboard-layout">
      <Sidebar />

      <main className="teacher-dashboard-content">

        <section className="dashboard-header">

          <div>

            <span className="dashboard-badge">
              PANEL DEL PROFESOR
            </span>

            <h1>Buenos días, profesor</h1>

            <p>
              Administra tus clases, estudiantes y actividades desde un solo
              lugar.
            </p>

          </div>

          <div className="dashboard-actions">

            <button className="btn-secondary">
              Ver calendario
            </button>

            <button className="btn-primary">
              + Crear sala
            </button>

          </div>

        </section>

        <section className="stats-grid">

          {stats.map((stat) => (

            <div className="stat-card" key={stat.title}>

              <div className="stat-icon">
                {stat.icon}
              </div>

              <div>

                <p>{stat.title}</p>

                <h2>{stat.value}</h2>

                <span>{stat.detail}</span>

              </div>

            </div>

          ))}

        </section>

        <section className="dashboard-grid">

          <div className="dashboard-panel">

            <div className="panel-title">

              <span>AGENDA</span>

              <a href="/">Ver todas</a>

            </div>

            <h2>Próximas clases</h2>

            {classes.map((item) => (

              <div className="class-card" key={item.title}>

                <div className="class-icon">
                  CL
                </div>

                <div className="class-info">

                  <strong>{item.title}</strong>

                  <p>{item.time}</p>

                </div>

                <div className="class-status">

                  <span>{item.students}</span>

                  <strong>{item.status}</strong>

                </div>

              </div>

            ))}

          </div>

          <div className="dashboard-panel">

            <div className="panel-title">

              <span>SEGUIMIENTO</span>

              <a href="/">Ver todo</a>

            </div>

            <h2>Actividad reciente</h2>

            {activity.map((item) => (

              <div className="activity-item" key={item.title}>

                <div className="activity-dot"></div>

                <div>

                  <p>{item.title}</p>

                  <span>{item.time}</span>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;