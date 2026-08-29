import { Button } from '@/components/ui/Button';
import { CustomLink } from '@/components/ui/Link';
import { IconMap } from '@/lib/iconMap';

export default function Home() {
  const {
    bot: Bot,
    checkCircle: CheckCircle,
    clock: Clock,
    graduationCap: GraduationCap,
    sparkles: Sparkles,
    target: Target,
    users: Users,
    video: Video,
    zap: Zap,
    brain: BrainCircuit,
    arrowRight: ArrowRight,
    checkCircle: CheckCircle2,
    calendar: CalendarDays,
    clock: Clock3,
    message: MessageCircle,
    shield: ShieldCheck,
    star: Star,
  } = IconMap.ui;

  const stats = [
    {
      icon: Clock,
      title: 'Tiempo estudiado',
      value: '24.5 h',
    },
    {
      icon: Target,
      title: 'Meta semanal',
      value: '82%',
    },
    {
      icon: Users,
      title: 'Salas activas',
      value: '12',
    },
  ];

  const chartHeights = [35, 62, 48, 78, 91, 69, 84];

  const benefits = [
    'Sin tarjeta de crédito',
    'Acceso inmediato',
    'Para estudiantes y profesores',
  ];

  const dashboardItems = [1, 2, 3, 4, 5];

  const features = [
    {
      id: 1,
      title: 'Enfoque inteligente',
      description:
        'Organiza tus sesiones, reduce distracciones y construye hábitos de estudio consistentes.',
      icon: Target,
    },
    {
      id: 2,
      title: 'Aprendizaje colaborativo',
      description:
        'Estudia junto a compañeros, profesores y comunidades académicas en tiempo real.',
      icon: Users,
    },
    {
      id: 3,
      title: 'Progreso medible',
      description:
        'Consulta estadísticas, metas, actividad y evolución desde un mismo espacio.',
      icon: BrainCircuit,
    },
  ];

  const studyRooms = [
    {
      id: 1,
      title: 'React y JavaScript',
      subject: 'Desarrollo frontend',
      members: 18,
      progress: 82,
      status: 'Activa',
    },
    {
      id: 2,
      title: 'Cálculo diferencial',
      subject: 'Matemáticas',
      members: 12,
      progress: 64,
      status: 'Activa',
    },
    {
      id: 3,
      title: 'Bases de datos',
      subject: 'SQL y modelado',
      members: 9,
      progress: 46,
      status: 'Próximamente',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Lucía Martínez',
      role: 'Estudiante de desarrollo web',
      initials: 'LM',
      quote:
        'StudySync me ayudó a organizar mis sesiones y avanzar en proyectos que antes siempre dejaba incompletos.',
    },
    {
      id: 2,
      name: 'Andrés Gómez',
      role: 'Estudiante universitario',
      initials: 'AG',
      quote:
        'Las salas colaborativas y el Pomodoro compartido hicieron que estudiar fuera mucho más constante.',
    },
    {
      id: 3,
      name: 'Camila Rodríguez',
      role: 'Profesora de tecnología',
      initials: 'CR',
      quote:
        'Ahora puedo acompañar mejor a mis estudiantes, organizar cursos y revisar su progreso desde una sola plataforma.',
    },
  ];

  return (
    <div className="mb-8">
      <section className="bg-background relative grid min-h-[calc(100vh-5rem)] content-center overflow-hidden px-[5vw] py-17.5 max-[1180px]:py-15 max-[720px]:min-h-[calc(100vh-5rem)] max-[720px]:px-5 max-[720px]:py-12.5">
        {/* Glow superior derecho */}
        <div
          aria-hidden="true"
          className="bg-accent/10 pointer-events-none absolute top-[7%] right-[2%] h-117.5 w-117.5 rounded-full blur-[20px] max-[720px]:top-[4%] max-[720px]:-right-45 max-[720px]:h-87.5 max-[720px]:w-87.5"
        />

        {/* Glow inferior izquierdo */}
        <div
          aria-hidden="true"
          className="bg-primary/10 pointer-events-none absolute bottom-[2%] -left-40 h-87.5 w-87.5 rounded-full blur-[20px] max-[720px]:-bottom-25 max-[720px]:-left-37.5"
        />

        {/* Grid de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--accent)_3%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--accent)_3%,transparent)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_75%)] bg-size-[42px_42px]"
        />

        {/* Contenido principal */}
        <div className="relative z-10 mx-auto grid w-full max-w-355 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(45px,5vw,90px)] max-[1180px]:grid-cols-1">
          {/* =========================
            HERO CONTENT
        ========================== */}

          <div className="max-w-165 max-[1180px]:mx-auto max-[1180px]:max-w-200 max-[1180px]:text-center">
            {/* Eyebrow */}{' '}
            {/* TODO: Crear componente reutilizable para badges */}
            <span className="border-accent/25 bg-accent/10 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-2.75 py-1.75 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase max-[1180px]:mx-auto">
              <Sparkles size={15} />
              Tu ecosistema inteligente de estudio
            </span>
            {/* Título */}
            <h1 className="font-heading text-foreground mt-5.25 max-w-190 text-[clamp(3.5rem,5.5vw,6rem)] leading-[0.94] font-bold tracking-[-0.075em] max-[1180px]:mx-auto max-[720px]:text-[clamp(2.8rem,13vw,4.2rem)]">
              Estudia mejor.
              <span className="from-info to-primary block bg-linear-to-r bg-clip-text text-transparent">
                Avanza con propósito.
              </span>
            </h1>
            {/* Descripción */}
            <p className="text-muted-foreground mt-6.25 max-w-155 text-[0.94rem] leading-[1.8] max-[1180px]:mx-auto max-[520px]:text-[0.88rem] max-[520px]:leading-[1.7]">
              Organiza tus cursos, participa en salas colaborativas, mejora tu
              concentración y recibe acompañamiento personalizado desde una sola
              plataforma.
            </p>
            {/* Acciones */}
            <div className="mt-7.5 flex flex-wrap gap-3 max-[1180px]:justify-center max-[520px]:flex-col">
              <Button
                href="/registro"
                variant="secondary"
                size="lg"
                icon="arrowRight"
                iconPosition="right"
                className="max-[520px]:w-full"
              >
                Comenzar gratis
              </Button>

              <Button
                href="/login"
                variant="ghost"
                size="lg"
                icon="play"
                className="max-[520px]:w-full"
              >
                Explorar plataforma
              </Button>
            </div>
            {/* Beneficios - lista semántica */}
            <ul className="mt-6.75 flex flex-wrap gap-4.5 max-[1180px]:justify-center max-[520px]:flex-col max-[520px]:items-start">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="text-muted-foreground inline-flex items-center gap-1.75 text-[0.66rem]"
                >
                  <CheckCircle size={16} className="text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* =========================
            DASHBOARD PREVIEW
        ========================== */}

          <div className="border-border bg-card relative min-h-130 transform-[perspective(1300px)_rotateY(-4deg)_rotateX(1deg)] overflow-visible rounded-[26px] border shadow-[0_40px_100px_rgba(0,0,0,0.75)] max-[1180px]:mx-auto max-[1180px]:w-full max-[1180px]:max-w-200 max-[1180px]:transform-none max-[720px]:min-h-0 max-[720px]:rounded-[20px]">
            {/* Header */}
            <div className="border-border flex min-h-12.5 items-center justify-between border-b px-4.25">
              <div className="flex gap-1.5">
                <span className="bg-border h-2 w-2 rounded-full" />
                <span className="bg-border h-2 w-2 rounded-full" />
                <span className="bg-border h-2 w-2 rounded-full" />
              </div>

              <span className="text-muted-foreground flex items-center gap-1.75 text-[0.57rem]">
                <span className="bg-success h-1.75 w-1.75 rounded-full shadow-[0_0_9px_color-mix(in_oklch,var(--success)_55%,transparent)]" />
                Plataforma activa
              </span>
            </div>

            {/* Dashboard body */}
            <div className="grid min-h-117 grid-cols-[65px_minmax(0,1fr)] max-[720px]:min-h-0 max-[720px]:grid-cols-1">
              {/* Sidebar */}
              <aside className="border-border bg-background/40 flex flex-col items-center gap-5 border-r px-0 py-4.5 max-[720px]:hidden">
                <div className="bg-primary text-primary-foreground mb-2 grid h-8.75 w-8.75 place-items-center rounded-[10px]">
                  <GraduationCap size={19} />
                </div>

                {dashboardItems.map((item) => (
                  <span
                    key={item}
                    className={`h-1.5 w-6 rounded-full ${
                      item === 1
                        ? 'bg-accent shadow-[0_0_12px_color-mix(in_oklch,var(--accent)_55%,transparent)]'
                        : 'bg-secondary'
                    }`}
                  />
                ))}
              </aside>

              {/* Dashboard content */}
              <div className="min-w-0 p-5.75 max-[720px]:p-4.25">
                {/* Heading - h2 */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <small className="text-muted-foreground block text-[0.63rem]">
                      Bienvenido de nuevo
                    </small>

                    <h2 className="font-heading text-card-foreground mt-1.25 block text-base">
                      Tu progreso académico
                    </h2>
                  </div>

                  <span className="border-accent/30 bg-primary text-primary-foreground grid h-9.25 w-9.25 shrink-0 place-items-center rounded-[11px] border text-[0.62rem] font-extrabold">
                    RV
                  </span>
                </div>

                {/* Statistics */}
                <div className="mt-5.75 grid grid-cols-3 gap-2.5 max-[720px]:grid-cols-1">
                  {stats.map((stat) => {
                    const StatIcon = stat.icon;

                    return (
                      <article
                        key={stat.title}
                        className="border-border bg-background/80 flex min-w-0 items-center gap-2.25 rounded-[13px] border p-3.25"
                      >
                        <span className="bg-accent/10 text-accent grid h-8.75 w-8.75 shrink-0 place-items-center rounded-[10px]">
                          <StatIcon size={18} />
                        </span>

                        <div className="min-w-0">
                          <small className="text-muted-foreground block truncate text-[0.52rem]">
                            {stat.title}
                          </small>

                          <strong className="text-card-foreground mt-1 block text-[0.78rem]">
                            {stat.value}
                          </strong>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Lower content */}
                <div className="mt-3 grid grid-cols-[minmax(0,1.3fr)_minmax(190px,0.7fr)] gap-2.75 max-[900px]:grid-cols-1">
                  {/* Progress - con role y aria-label */}
                  <article
                    className="border-border bg-background/80 min-h-59.5 rounded-[14px] border p-4 max-[720px]:min-h-55"
                    role="img"
                    aria-label="Gráfico de barras del progreso semanal. La altura de las barras representa las horas estudiadas cada día, totalizando 18 horas de 22."
                  >
                    <div className="flex justify-between gap-3.75">
                      <h3 className="text-muted-foreground text-[0.6rem]">
                        Progreso semanal
                      </h3>

                      <strong className="text-card-foreground text-[0.65rem]">
                        18 horas de 22
                      </strong>
                    </div>

                    <div className="border-border mt-6 flex h-38.75 items-end justify-between gap-2 border-b px-1">
                      {chartHeights.map((height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="from-primary to-info w-[10%] rounded-t-[5px] bg-linear-to-t shadow-[0_0_14px_color-mix(in_oklch,var(--info)_18%,transparent)]"
                          style={{ height: `${height}%` }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </article>

                  {/* Próxima sesión */}
                  <article className="border-border bg-background/80 flex min-h-59.5 flex-col rounded-[14px] border p-4.25 max-[720px]:min-h-55">
                    <span className="bg-accent/10 text-accent grid h-10.5 w-10.5 place-items-center rounded-xl">
                      <Video size={20} />
                    </span>

                    <div className="mt-4.5">
                      <small className="text-muted-foreground block text-[0.57rem]">
                        Próxima sesión
                      </small>
                      <h3 className="text-card-foreground mt-1.25 block text-[0.75rem]">
                        React avanzado
                      </h3>
                      <span className="text-muted-foreground mt-1.75 block text-[0.57rem]">
                        Hoy · 4:30 p. m.
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon="arrowRight"
                      className="mt-auto self-end"
                      aria-label="Entrar a sesión"
                    />
                  </article>
                </div>
              </div>
            </div>

            {/* Floating card izquierda */}
            <div className="border-accent/20 bg-card absolute bottom-15.75 -left-9.5 z-20 flex items-center gap-2.5 rounded-[13px] border px-3.25 py-2.75 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl max-[720px]:hidden">
              <span className="bg-accent/10 text-accent grid h-8.5 w-8.5 place-items-center rounded-[10px]">
                <Zap size={17} />
              </span>

              <div>
                <small className="text-muted-foreground block text-[0.53rem]">
                  Racha actual
                </small>
                <strong className="text-card-foreground mt-0.75 block text-[0.68rem]">
                  12 días
                </strong>
              </div>
            </div>

            {/* Floating card derecha */}
            <div className="border-accent/20 bg-card absolute top-23.5 -right-8.5 z-20 flex items-center gap-2.5 rounded-[13px] border px-3.25 py-2.75 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl max-[720px]:hidden">
              <span className="bg-accent/10 text-accent grid h-8.5 w-8.5 place-items-center rounded-[10px]">
                <Bot size={18} />
              </span>

              <div>
                <small className="text-muted-foreground block text-[0.53rem]">
                  IA Coach
                </small>
                <strong className="text-card-foreground mt-0.75 block text-[0.68rem]">
                  Plan actualizado
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
          TRUSTED - lista semántica
      ========================== */}

        <div className="border-border relative z-10 mx-auto mt-11.25 flex w-full max-w-355 items-center justify-between gap-6.25 border-t pt-6.25 max-[720px]:flex-col max-[720px]:items-start">
          <span className="text-muted-foreground text-[0.63rem] tracking-widest uppercase">
            Una plataforma diseñada para potenciar
          </span>

          <ul className="flex flex-wrap justify-end gap-8.5 max-[720px]:justify-start max-[720px]:gap-4.5">
            {['Concentración', 'Colaboración', 'Organización', 'Progreso'].map(
              (item) => (
                <li
                  key={item}
                  className="text-muted-foreground text-[0.7rem] font-bold tracking-wider"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-10vw)] max-w-355 py-20 md:py-14">
        <header className="mx-auto max-w-170 text-center">
          <span className="border-accent/25 bg-accent/10 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase">
            <BrainCircuit size={15} aria-hidden="true" />
            Aprendizaje con propósito
          </span>

          <h2 className="text-foreground mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em]">
            Todo lo que necesitas para estudiar mejor
          </h2>

          <p className="text-muted-foreground mx-auto mt-4 max-w-170 text-[0.82rem] leading-[1.75]">
            StudySync combina organización, colaboración y tecnología para
            convertir cada sesión de estudio en progreso real.
          </p>
        </header>

        <div className="mx-auto mt-12 grid max-w-170 grid-cols-1 gap-4 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.id}
                className="group border-border/50 bg-card hover:border-accent/40 relative min-h-61.25 overflow-hidden rounded-[21px] border p-6.5 shadow-[0_25px_55px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-1 lg:min-h-72.5"
              >
                <span
                  className="text-accent/15 absolute top-5 right-5 text-[2.4rem] leading-none font-black"
                  aria-hidden="true"
                >
                  0{feature.id}
                </span>

                <div className="border-accent/25 bg-accent/10 text-accent grid size-13.25 place-items-center rounded-[15px] border">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <h3 className="text-card-foreground mt-7 text-[1.05rem] font-semibold">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground mt-3 text-[0.73rem] leading-[1.7]">
                  {feature.description}
                </p>

                <span
                  className="from-accent to-accent/0 absolute right-6 bottom-6 left-6 h-0.5 rounded-full bg-linear-to-r"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="salas"
        className="border-accent/12 mx-auto my-8 w-[calc(100%-10vw)] scroll-mt-22 rounded-4xl border bg-[radial-gradient(circle_at_85%_25%,rgba(14,165,233,0.08),transparent_27%),linear-gradient(145deg,rgba(5,10,18,0.98),rgba(1,3,7,0.99))] px-[5%] py-20 shadow-[0_35px_75px_rgba(0,0,0,0.53),inset_0_1px_0_rgba(255,255,255,0.025)]"
      >
        <div className="max-w-170">
          <span className="border-accent/25 bg-accent/7 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase">
            <Video size={15} aria-hidden="true" />
            Salas de estudio
          </span>

          <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em] text-white">
            Aprender acompañado cambia los resultados
          </h2>

          <p className="mt-4 text-[0.82rem] leading-[1.75] text-[#718096]">
            Únete a sesiones colaborativas, comparte recursos y mantén el ritmo
            junto a personas con tus mismos objetivos.
          </p>
        </div>

        <div className="mt-11 grid grid-cols-[minmax(0,1.25fr)_minmax(290px,0.75fr)] items-stretch gap-4.5">
          <div className="grid grid-cols-3 gap-3.25">
            {studyRooms.map((room) => {
              const isActive = room.status === 'Activa';

              return (
                <article
                  key={room.id}
                  className="border-border/12 min-w-0 rounded-[18px] border bg-[rgba(2,6,12,0.88)] p-5"
                >
                  <div className="flex items-center justify-between gap-2.75">
                    <div className="bg-accent/8 text-accent grid size-10.75 place-items-center rounded-[13px]">
                      <Video size={21} aria-hidden="true" />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[0.54rem] font-bold ${isActive ? 'border-green-500/22 bg-green-500/7 text-green-300' : 'border-amber-500/22 bg-amber-500/6 text-amber-300'}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-amber-500'}`}
                        aria-hidden="true"
                      />
                      {room.status}
                    </span>
                  </div>

                  <span className="text-accent mt-6 block text-[0.58rem] font-bold tracking-[0.07em] uppercase">
                    {room.subject}
                  </span>

                  <h3 className="mt-1.75 text-[0.89rem] font-semibold text-white">
                    {room.title}
                  </h3>

                  <div className="mt-7 flex justify-between gap-2.5 text-[0.57rem] text-[#526174]">
                    <span>Progreso de la sesión</span>
                    <strong className="text-sky-300">{room.progress}%</strong>
                  </div>

                  <div className="mt-2.25 h-1.5 overflow-hidden rounded-full bg-[#111827]">
                    <span
                      className="block h-full rounded-[inherit] bg-linear-to-r from-sky-500 to-blue-600 shadow-[0_0_12px_rgba(14,165,233,0.35)]"
                      style={{ width: `${room.progress}%` }}
                    />
                  </div>

                  <footer className="border-border/9 mt-5 flex items-center justify-between gap-3 border-t pt-3.75">
                    <span className="flex items-center gap-1.5 text-[0.58rem] text-[#64748b]">
                      <Users size={16} aria-hidden="true" />
                      {room.members} participantes
                    </span>

                    <button
                      type="button"
                      className="border-accent/22 bg-accent/7 text-accent grid size-8 place-items-center rounded-[9px] border"
                      aria-label={`Abrir ${room.title}`}
                    >
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>

          <aside className="border-accent/18 flex min-h-97.5 flex-col items-start rounded-[20px] border bg-linear-to-br from-[rgba(3,30,51,0.8)] to-[rgba(3,8,18,0.92)] p-7">
            <span className="border-accent/25 bg-accent/7 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase">
              <Sparkles size={15} aria-hidden="true" />
              Sesiones en tiempo real
            </span>

            <h3 className="mt-5.5 text-[1.55rem] leading-[1.2] font-bold tracking-[-0.04em] text-white">
              Convierte el estudio en una experiencia compartida
            </h3>

            <p className="mt-3.5 text-[0.72rem] leading-[1.7] text-[#718096]">
              Crea salas públicas o privadas, activa sesiones de Pomodoro,
              conversa con tu equipo y consulta materiales sin abandonar la
              sesión.
            </p>

            <div className="mt-5.5 grid gap-3">
              <span className="flex items-center gap-2.25 text-[0.68rem] text-[#94a3b8]">
                <CheckCircle2
                  size={18}
                  className="text-accent"
                  aria-hidden="true"
                />
                Chat y colaboración en vivo
              </span>

              <span className="flex items-center gap-2.25 text-[0.68rem] text-[#94a3b8]">
                <CheckCircle2
                  size={18}
                  className="text-accent"
                  aria-hidden="true"
                />
                Temporizador Pomodoro compartido
              </span>

              <span className="flex items-center gap-2.25 text-[0.68rem] text-[#94a3b8]">
                <CheckCircle2
                  size={18}
                  className="text-accent"
                  aria-hidden="true"
                />
                Gestión de recursos y participantes
              </span>
            </div>

            <CustomLink
              href="/salas"
              className="border-accent/46 mt-auto inline-flex min-h-11.25 w-full items-center justify-center gap-2.25 rounded-[13px] border bg-linear-to-br from-sky-600 to-blue-700 px-4 text-[0.75rem] font-extrabold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(37,99,235,0.32),0_0_25px_rgba(14,165,233,0.13)]"
            >
              Explorar salas
              <ArrowRight size={18} aria-hidden="true" />
            </CustomLink>
          </aside>
        </div>
      </section>

      <section
        id="beneficios"
        className="mx-auto grid w-[calc(100%-10vw)] grid-cols-[minmax(0,1.3fr)_minmax(330px,0.7fr)] items-center gap-18.75 py-30 max-[1180px]:grid-cols-1 max-[720px]:w-[calc(100%-40px)] max-[720px]:py-21.25"
      >
        <div>
          <div className="max-w-170">
            <span className="border-accent/25 bg-accent/7 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase">
              <Zap size={15} aria-hidden="true" />
              Una experiencia completa
            </span>

            <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em] text-white">
              Menos herramientas. Más concentración.
            </h2>

            <p className="mt-4 text-[0.82rem] leading-[1.75] text-[#718096]">
              StudySync reúne las funciones esenciales para que puedas
              organizar, estudiar, colaborar y medir tu evolución.
            </p>
          </div>

          <div className="mt-9.5 grid grid-cols-2 gap-3.25 max-[720px]:grid-cols-1">
            <article className="border-border/10 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border bg-[rgba(4,8,15,0.75)] p-4.25">
              <span className="bg-accent/7 text-accent grid size-10.75 place-items-center rounded-xl">
                <CalendarDays size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="m-0 text-[0.8rem] font-semibold text-slate-200">
                  Organización académica
                </h3>

                <p className="mt-1.75 text-[0.64rem] leading-[1.55] text-[#64748b]">
                  Planifica cursos, sesiones, tareas y eventos desde un
                  calendario centralizado.
                </p>
              </div>
            </article>

            <article className="border-border/10 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border bg-[rgba(4,8,15,0.75)] p-4.25">
              <span className="bg-accent/7 text-accent grid size-10.75 place-items-center rounded-xl">
                <Clock3 size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="m-0 text-[0.8rem] font-semibold text-slate-200">
                  Pomodoro integrado
                </h3>

                <p className="mt-1.75 text-[0.64rem] leading-[1.55] text-[#64748b]">
                  Gestiona periodos de concentración y descanso con métricas
                  claras.
                </p>
              </div>
            </article>

            <article className="border-border/10 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border bg-[rgba(4,8,15,0.75)] p-4.25">
              <span className="bg-accent/7 text-accent grid size-10.75 place-items-center rounded-xl">
                <Bot size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="m-0 text-[0.8rem] font-semibold text-slate-200">
                  Coach académico con IA
                </h3>

                <p className="mt-1.75 text-[0.64rem] leading-[1.55] text-[#64748b]">
                  Recibe recomendaciones basadas en tus metas, actividad y
                  progreso.
                </p>
              </div>
            </article>

            <article className="border-border/10 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border bg-[rgba(4,8,15,0.75)] p-4.25">
              <span className="bg-accent/7 text-accent grid size-10.75 place-items-center rounded-xl">
                <MessageCircle size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="m-0 text-[0.8rem] font-semibold text-slate-200">
                  Comunicación directa
                </h3>

                <p className="mt-1.75 text-[0.64rem] leading-[1.55] text-[#64748b]">
                  Mantén conversaciones con profesores, compañeros y grupos de
                  estudio.
                </p>
              </div>
            </article>
          </div>
        </div>

        <div className="border-accent/20 relative overflow-hidden rounded-[25px] border bg-[radial-gradient(circle_at_90%_5%,rgba(14,165,233,0.15),transparent_32%),linear-gradient(145deg,rgba(5,18,34,0.98),rgba(1,5,12,0.99))] p-8.75 shadow-[0_30px_65px_rgba(0,0,0,0.55),0_0_35px_rgba(14,165,233,0.07)] max-[1180px]:max-w-155 max-[720px]:p-6.25">
          <span className="border-accent/30 bg-accent/9 grid size-16.25 place-items-center rounded-[19px] border text-sky-300">
            <ShieldCheck size={30} aria-hidden="true" />
          </span>

          <span className="text-accent mt-7 block text-[0.62rem] font-extrabold tracking-[0.08em] uppercase">
            Plataforma confiable
          </span>

          <h3 className="mt-2.5 text-[1.65rem] leading-[1.2] font-bold tracking-[-0.045em] text-white">
            Tu información y tu progreso siempre protegidos
          </h3>

          <p className="mt-3.75 text-[0.72rem] leading-[1.7] text-[#718096]">
            StudySync integra controles de privacidad, seguridad de cuenta y
            configuraciones personalizadas para cada usuario.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2.5 max-[720px]:grid-cols-1">
            <article className="border-border/10 rounded-[14px] border bg-black/24 p-4">
              <strong className="block text-[1.35rem] text-white">24/7</strong>

              <span className="mt-1.25 block text-[0.59rem] text-[#526174]">
                Disponibilidad
              </span>
            </article>

            <article className="border-border/10 rounded-[14px] border bg-black/24 p-4">
              <strong className="block text-[1.35rem] text-white">100%</strong>

              <span className="mt-1.25 block text-[0.59rem] text-[#526174]">
                Control de privacidad
              </span>
            </article>
          </div>
        </div>
      </section>

      <section
        id="testimonios"
        className="border-border/9 mx-auto w-[calc(100%-10vw)] scroll-mt-22 border-t py-27.5 max-[720px]:w-[calc(100%-40px)] max-[720px]:py-20"
      >
        <div className="mx-auto max-w-170 text-center">
          <span className="border-accent/25 bg-accent/7 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            Historias de progreso
          </span>

          <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em] text-white">
            Personas que ya estudian de otra manera
          </h2>

          <p className="mx-auto mt-4 max-w-170 text-[0.82rem] leading-[1.75] text-[#718096]">
            Experiencias de estudiantes y profesores que encontraron una forma
            más organizada de avanzar.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-3.75 max-[960px]:grid-cols-1">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="border-border/11 rounded-[20px] border bg-linear-to-br from-[rgba(7,12,21,0.95)] to-[rgba(2,4,9,0.98)] p-6.25"
            >
              <div className="text-accent flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="mt-5.5 min-h-28.75 text-[0.77rem] leading-[1.8] text-slate-300">
                “{testimonial.quote}”
              </blockquote>

              <footer className="border-border/9 mt-6 flex items-center gap-2.75 border-t pt-4.5">
                <span className="grid size-10.5 place-items-center rounded-xl bg-linear-to-br from-sky-500 to-blue-700 text-[0.64rem] font-extrabold text-white">
                  {testimonial.initials}
                </span>

                <div>
                  <strong className="block text-[0.7rem] font-semibold text-slate-200">
                    {testimonial.name}
                  </strong>

                  <small className="mt-1 block text-[0.58rem] text-[#526174]">
                    {testimonial.role}
                  </small>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section
        id="contacto"
        className="border-accent/20 relative mx-auto w-[calc(100%-10vw)] scroll-mt-22 overflow-hidden rounded-[30px] border bg-linear-to-br from-[rgba(3,28,48,0.97)] to-[rgba(3,8,18,0.99)] px-[7%] py-20 text-center shadow-[0_35px_75px_rgba(0,0,0,0.55),0_0_45px_rgba(14,165,233,0.08)] max-[720px]:w-[calc(100%-28px)] max-[720px]:px-5 max-[720px]:py-16.25"
      >
        <div
          className="pointer-events-none absolute -top-77.5 left-1/2 size-125 -translate-x-1/2 rounded-full bg-[rgba(14,165,233,0.19)] blur-[20px]"
          aria-hidden="true"
        />

        <div className="relative z-2 mx-auto max-w-187.5">
          <span className="border-accent/25 bg-accent/7 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-[0.65rem] font-extrabold tracking-[0.09em] uppercase">
            <Sparkles size={15} aria-hidden="true" />
            Tu siguiente sesión comienza aquí
          </span>

          <h2 className="mt-4.75 text-[clamp(2.4rem,4vw,4.2rem)] leading-[1.05] font-bold tracking-[-0.06em] text-white">
            Construye hoy una mejor forma de aprender
          </h2>

          <p className="mx-auto mt-4.75 max-w-155 text-[0.8rem] leading-[1.7] text-[#8492a6]">
            Crea tu cuenta y empieza a organizar tus cursos, salas, sesiones de
            concentración y objetivos académicos.
          </p>

          <div className="mt-7.25 flex flex-wrap justify-center gap-3 max-[520px]:flex-col">
            <CustomLink
              href="/registro"
              className="border-accent/46 inline-flex min-h-12.5 items-center justify-center gap-2.25 rounded-[13px] border bg-linear-to-br from-sky-600 to-blue-700 px-5.25 text-[0.75rem] font-extrabold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(37,99,235,0.32),0_0_25px_rgba(14,165,233,0.13)] max-[520px]:w-full"
            >
              Crear cuenta gratis
              <ArrowRight size={18} aria-hidden="true" />
            </CustomLink>

            <CustomLink
              href="/login"
              className="hover:border-accent/46 inline-flex min-h-12.5 items-center justify-center gap-2.25 rounded-[13px] border border-slate-400/20 bg-[rgba(7,12,22,0.82)] px-5.25 text-[0.75rem] font-extrabold text-[#dbe7f5] transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-300 max-[520px]:w-full"
            >
              Ya tengo una cuenta
            </CustomLink>
          </div>
        </div>
      </section>
    </div>
  );
}
