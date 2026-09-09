import { Button } from '@/components/ui/Button';
import { IconMap } from '@/lib/iconMap';

export default function Home() {
  const {
    bot: Bot,
    checkCircle: CheckCircle2,
    clock: Clock3,
    graduationCap: GraduationCap,
    sparkles: Sparkles,
    target: Target,
    users: Users,
    video: Video,
    zap: Zap,
    brain: BrainCircuit,
    arrowRight: ArrowRight,
    calendar: CalendarDays,
    message: MessageCircle,
    shield: ShieldCheck,
    star: Star,
  } = IconMap.ui;

  const stats = [
    {
      icon: Clock3,
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
      {/* ==================== HERO ==================== */}
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
          {/* HERO CONTENT */}
          <div className="max-w-165 max-[1180px]:mx-auto max-[1180px]:max-w-200 max-[1180px]:text-center">
            {/* Eyebrow */}
            <span className="border-accent/25 bg-accent/10 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-2.75 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase max-[1180px]:mx-auto">
              <Sparkles size={15} />
              Tu ecosistema inteligente de estudio
            </span>

            <h1 className="font-heading text-foreground mt-5.25 max-w-190 text-[clamp(3.5rem,5.5vw,6rem)] leading-[0.94] font-bold tracking-[-0.075em] max-[1180px]:mx-auto max-[720px]:text-[clamp(2.8rem,13vw,4.2rem)]">
              Estudia mejor.
              <span className="from-info to-primary block bg-linear-to-r bg-clip-text text-transparent">
                Avanza con propósito.
              </span>
            </h1>

            <p className="text-muted-foreground mt-6.25 max-w-155 text-sm leading-[1.8] max-[1180px]:mx-auto max-[520px]:text-xs max-[520px]:leading-[1.7]">
              Organiza tus cursos, participa en salas colaborativas, mejora tu
              concentración y recibe acompañamiento personalizado desde una sola
              plataforma.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 max-[1180px]:justify-center max-[520px]:flex-col">
              <Button
                href="/registro"
                variant="secondary"
                size="lg"
                icon="arrowRight"
                iconPosition="right"
              >
                Comenzar gratis
              </Button>

              <Button href="/login" variant="ghost" size="lg" icon="play">
                Explorar plataforma
              </Button>
            </div>

            <ul className="mt-6.75 flex flex-wrap gap-4.5 max-[1180px]:justify-center max-[520px]:flex-col max-[520px]:items-start">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="text-muted-foreground inline-flex items-center gap-1.75 text-xs"
                >
                  <CheckCircle2 size={16} className="text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="border-border bg-card relative min-h-130 transform-[perspective(1300px)_rotateY(-4deg)_rotateX(1deg)] overflow-visible rounded-3xl border shadow-xl max-[1180px]:mx-auto max-[1180px]:w-full max-[1180px]:max-w-200 max-[1180px]:transform-none max-[720px]:min-h-0 max-[720px]:rounded-2xl">
            {/* Header */}
            <div className="border-border flex min-h-12.5 items-center justify-between border-b px-4.25">
              <div className="flex gap-1.5">
                <span className="bg-border h-2 w-2 rounded-full" />
                <span className="bg-border h-2 w-2 rounded-full" />
                <span className="bg-border h-2 w-2 rounded-full" />
              </div>

              <span className="text-muted-foreground flex items-center gap-1.75 text-xs">
                <span className="bg-success h-1.75 w-1.75 rounded-full shadow-[0_0_9px_color-mix(in_oklch,var(--success)_55%,transparent)]" />
                Plataforma activa
              </span>
            </div>

            {/* Dashboard body */}
            <div className="grid min-h-117 grid-cols-[65px_minmax(0,1fr)] max-[720px]:min-h-0 max-[720px]:grid-cols-1">
              {/* Sidebar */}
              <aside className="border-border bg-background/40 flex flex-col items-center gap-5 border-r px-0 py-4.5 max-[720px]:hidden">
                <div className="bg-primary text-primary-foreground mb-2 grid h-8.75 w-8.75 place-items-center rounded-xl">
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
                {/* Heading */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <small className="text-muted-foreground block text-xs">
                      Bienvenido de nuevo
                    </small>

                    <h2 className="font-heading text-card-foreground mt-1.25 block text-base">
                      Tu progreso académico
                    </h2>
                  </div>

                  <span className="border-accent/30 bg-primary text-primary-foreground grid h-9.25 w-9.25 shrink-0 place-items-center rounded-xl border text-xs font-extrabold">
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
                        className="border-border bg-background/80 flex min-w-0 items-center gap-2.25 rounded-xl border p-3.25"
                      >
                        <span className="bg-accent/10 text-accent grid h-8.75 w-8.75 shrink-0 place-items-center rounded-xl">
                          <StatIcon size={18} />
                        </span>

                        <div className="min-w-0">
                          <small className="text-muted-foreground block truncate text-xs">
                            {stat.title}
                          </small>

                          <strong className="text-card-foreground mt-1 block text-sm">
                            {stat.value}
                          </strong>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Lower content */}
                <div className="mt-3 grid grid-cols-[minmax(0,1.3fr)_minmax(190px,0.7fr)] gap-2.75 max-[900px]:grid-cols-1">
                  {/* Progress */}
                  <article
                    className="border-border bg-background/80 min-h-59.5 rounded-2xl border p-4 max-[720px]:min-h-55"
                    role="img"
                    aria-label="Gráfico de barras del progreso semanal. La altura de las barras representa las horas estudiadas cada día, totalizando 18 horas de 22."
                  >
                    <div className="flex justify-between gap-3.75">
                      <h3 className="text-muted-foreground text-xs">
                        Progreso semanal
                      </h3>

                      <strong className="text-card-foreground text-xs">
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
                  <article className="border-border bg-background/80 flex min-h-59.5 flex-col rounded-2xl border p-4.25 max-[720px]:min-h-55">
                    <span className="bg-accent/10 text-accent grid h-10.5 w-10.5 place-items-center rounded-xl">
                      <Video size={20} />
                    </span>

                    <div className="mt-4.5">
                      <small className="text-muted-foreground block text-xs">
                        Próxima sesión
                      </small>
                      <h3 className="text-card-foreground mt-1.25 block text-sm">
                        React avanzado
                      </h3>
                      <span className="text-muted-foreground mt-1.75 block text-xs">
                        Hoy · 4:30 p. m.
                      </span>
                    </div>

                    <div className="mt-auto flex w-full justify-end">
                      <ArrowRight
                        size={17}
                        aria-hidden="true"
                        className="text-muted-foreground"
                      />
                    </div>
                  </article>
                </div>
              </div>
            </div>

            {/* Floating card izquierda */}
            <div className="border-accent/20 bg-card absolute bottom-15.75 -left-9.5 z-20 flex items-center gap-2.5 rounded-xl border px-3.25 py-2.75 shadow-xl backdrop-blur-xl max-[720px]:hidden">
              <span className="bg-accent/10 text-accent grid h-8.5 w-8.5 place-items-center rounded-xl">
                <Zap size={17} />
              </span>

              <div>
                <small className="text-muted-foreground block text-xs">
                  Racha actual
                </small>
                <strong className="text-card-foreground mt-0.75 block text-sm">
                  12 días
                </strong>
              </div>
            </div>

            {/* Floating card derecha */}
            <div className="border-accent/20 bg-card absolute top-23.5 -right-8.5 z-20 flex items-center gap-2.5 rounded-xl border px-3.25 py-2.75 shadow-xl backdrop-blur-xl max-[720px]:hidden">
              <span className="bg-accent/10 text-accent grid h-8.5 w-8.5 place-items-center rounded-xl">
                <Bot size={18} />
              </span>

              <div>
                <small className="text-muted-foreground block text-xs">
                  IA Coach
                </small>
                <strong className="text-card-foreground mt-0.75 block text-sm">
                  Plan actualizado
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* TRUSTED */}
        <div className="border-border relative z-10 mx-auto mt-11.25 flex w-full max-w-355 items-center justify-between gap-6.25 border-t pt-6.25 max-[720px]:flex-col max-[720px]:items-start">
          <span className="text-muted-foreground text-xs tracking-widest uppercase">
            Una plataforma diseñada para potenciar
          </span>

          <ul className="flex flex-wrap justify-end gap-8.5 max-[720px]:justify-start max-[720px]:gap-4.5">
            {['Concentración', 'Colaboración', 'Organización', 'Progreso'].map(
              (item) => (
                <li
                  key={item}
                  className="text-muted-foreground text-sm font-bold tracking-wider"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="mx-auto w-[calc(100%-10vw)] max-w-355 py-20 md:py-14">
        <header className="mx-auto max-w-170 text-center">
          <span className="border-accent/25 bg-accent/10 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold tracking-[0.09em] uppercase">
            <BrainCircuit size={15} aria-hidden="true" />
            Aprendizaje con propósito
          </span>

          <h2 className="text-foreground mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em]">
            Todo lo que necesitas para estudiar mejor
          </h2>

          <p className="text-muted-foreground mx-auto mt-4 max-w-170 text-sm leading-[1.75]">
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
                className="group border-border/50 bg-card hover:border-accent/40 relative min-h-61.25 overflow-hidden rounded-2xl border p-6.5 shadow-xl transition-all duration-200 hover:-translate-y-1 lg:min-h-72.5"
              >
                <span
                  className="text-accent/15 absolute top-5 right-5 text-[2.4rem] leading-none font-black"
                  aria-hidden="true"
                >
                  0{feature.id}
                </span>

                <div className="border-accent/25 bg-accent/10 text-accent grid size-13.25 place-items-center rounded-xl border">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <h3 className="text-card-foreground mt-7 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground mt-3 text-xs leading-[1.7]">
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

      {/* ==================== SALAS ==================== */}
      <section
        id="salas"
        className="border-border bg-card mx-auto my-8 w-[calc(100%-10vw)] scroll-mt-22 rounded-3xl border px-[5%] py-20 shadow-xl max-[720px]:w-[calc(100%-40px)] max-[720px]:rounded-2xl max-[720px]:px-4 max-[720px]:py-12"
      >
        <div className="max-w-170">
          <span className="border-accent/25 bg-accent/10 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase">
            <Video size={15} aria-hidden="true" />
            Salas de estudio
          </span>

          <h2 className="text-card-foreground mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em] max-[720px]:text-[clamp(1.8rem,8vw,2.5rem)]">
            Aprender acompañado cambia los resultados
          </h2>

          <p className="text-muted-foreground mt-4 text-sm leading-[1.75] max-[720px]:text-xs">
            Únete a sesiones colaborativas, comparte recursos y mantén el ritmo
            junto a personas con tus mismos objetivos.
          </p>
        </div>

        <div className="mt-11 grid grid-cols-[minmax(0,1.25fr)_minmax(290px,0.75fr)] items-stretch gap-4.5 max-[1180px]:grid-cols-1">
          {/* Grid de salas */}
          <div className="grid grid-cols-3 gap-3.25 max-[960px]:grid-cols-2 max-[720px]:grid-cols-1">
            {studyRooms.map((room) => {
              const isActive = room.status === 'Activa';
              return (
                <article
                  key={room.id}
                  className="border-border/20 bg-card/80 min-w-0 rounded-xl border p-5 max-[720px]:p-4"
                >
                  <div className="flex items-center justify-between gap-2.75">
                    <div className="bg-accent/10 text-accent grid size-10.75 place-items-center rounded-xl max-[720px]:size-9">
                      <Video
                        size={21}
                        aria-hidden="true"
                        className="max-[720px]:size-4"
                      />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-bold ${
                        isActive
                          ? 'border-success/20 bg-success/10 text-success'
                          : 'border-warning/20 bg-warning/10 text-warning'
                      } max-[720px]:text-[10px]`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isActive ? 'bg-success' : 'bg-warning'
                        }`}
                        aria-hidden="true"
                      />
                      {room.status}
                    </span>
                  </div>

                  <span className="text-accent mt-6 block text-xs font-bold tracking-[0.07em] uppercase max-[720px]:mt-4 max-[720px]:text-[10px]">
                    {room.subject}
                  </span>

                  <h3 className="text-card-foreground mt-1.75 text-sm font-semibold max-[720px]:text-xs">
                    {room.title}
                  </h3>

                  <div className="text-muted-foreground mt-7 flex justify-between gap-2.5 text-xs max-[720px]:mt-4 max-[720px]:text-[10px]">
                    <span>Progreso de la sesión</span>
                    <strong className="text-accent">{room.progress}%</strong>
                  </div>

                  <div className="bg-secondary mt-2.25 h-1.5 overflow-hidden rounded-full max-[720px]:mt-1.5">
                    <span
                      className="from-primary to-accent block h-full rounded-[inherit] bg-linear-to-r shadow-[0_0_12px_color-mix(in_oklch,var(--accent)_35%,transparent)]"
                      style={{ width: `${room.progress}%` }}
                    />
                  </div>

                  <div className="border-border/10 mt-5 flex items-center justify-between gap-3 border-t pt-3.75 max-[720px]:mt-3 max-[720px]:pt-2.5">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs max-[720px]:text-[10px]">
                      <Users
                        size={16}
                        aria-hidden="true"
                        className="max-[720px]:size-3.5"
                      />
                      {room.members} participantes
                    </span>

                    <div
                      className="border-accent/20 bg-accent/10 text-accent grid size-8 place-items-center rounded-lg border max-[720px]:size-6"
                      aria-hidden="true"
                    >
                      <ArrowRight
                        size={17}
                        aria-hidden="true"
                        className="max-[720px]:size-3.5"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Aside */}
          <aside className="border-accent/20 bg-card/90 flex min-h-97.5 flex-col items-start rounded-xl border p-7 max-[720px]:min-h-0 max-[720px]:p-5">
            <span className="border-accent/25 bg-accent/10 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase max-[720px]:text-[10px]">
              <Sparkles
                size={15}
                aria-hidden="true"
                className="max-[720px]:size-3"
              />
              Sesiones en tiempo real
            </span>

            <h3 className="text-card-foreground mt-5.5 text-2xl leading-[1.2] font-bold tracking-[-0.04em] max-[720px]:mt-4 max-[720px]:text-xl">
              Convierte el estudio en una experiencia compartida
            </h3>

            <p className="text-muted-foreground mt-3.5 text-sm leading-[1.7] max-[720px]:mt-2.5 max-[720px]:text-xs">
              Crea salas públicas o privadas, activa sesiones de Pomodoro,
              conversa con tu equipo y consulta materiales sin abandonar la
              sesión.
            </p>

            <div className="mt-5.5 grid gap-3 max-[720px]:mt-4 max-[720px]:gap-2">
              <span className="text-muted-foreground flex items-center gap-2.25 text-sm max-[720px]:text-xs">
                <CheckCircle2
                  size={18}
                  className="text-accent shrink-0 max-[720px]:size-4"
                  aria-hidden="true"
                />
                Chat y colaboración en vivo
              </span>

              <span className="text-muted-foreground flex items-center gap-2.25 text-sm max-[720px]:text-xs">
                <CheckCircle2
                  size={18}
                  className="text-accent shrink-0 max-[720px]:size-4"
                  aria-hidden="true"
                />
                Temporizador Pomodoro compartido
              </span>

              <span className="text-muted-foreground flex items-center gap-2.25 text-sm max-[720px]:text-xs">
                <CheckCircle2
                  size={18}
                  className="text-accent shrink-0 max-[720px]:size-4"
                  aria-hidden="true"
                />
                Gestión de recursos y participantes
              </span>
            </div>

            <Button
              href="/registro"
              variant="primary"
              fullWidth
              className="mt-6 max-[720px]:mt-4"
            >
              Explorar salas
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="max-[720px]:size-4"
              />
            </Button>
          </aside>
        </div>
      </section>

      {/* ==================== BENEFICIOS ==================== */}
      <section
        id="beneficios"
        className="mx-auto grid w-[calc(100%-10vw)] grid-cols-[minmax(0,1.3fr)_minmax(330px,0.7fr)] items-center gap-18.75 py-30 max-[1180px]:grid-cols-1 max-[720px]:w-[calc(100%-40px)] max-[720px]:py-21.25"
      >
        <div>
          <div className="max-w-170">
            <span className="border-accent/25 bg-accent/10 text-accent inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase">
              <Zap size={15} aria-hidden="true" />
              Una experiencia completa
            </span>

            <h2 className="text-foreground mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em]">
              Menos herramientas. Más concentración.
            </h2>

            <p className="text-muted-foreground mt-4 text-sm leading-[1.75]">
              StudySync reúne las funciones esenciales para que puedas
              organizar, estudiar, colaborar y medir tu evolución.
            </p>
          </div>

          <div className="mt-9.5 grid grid-cols-2 gap-3.25 max-[720px]:grid-cols-1">
            <article className="border-border/20 bg-card/80 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border p-4.25">
              <span className="bg-accent/10 text-accent grid size-10.75 place-items-center rounded-xl">
                <CalendarDays size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-card-foreground m-0 text-sm font-semibold">
                  Organización académica
                </h3>

                <p className="text-muted-foreground mt-1.75 text-xs leading-[1.55]">
                  Planifica cursos, sesiones, tareas y eventos desde un
                  calendario centralizado.
                </p>
              </div>
            </article>

            <article className="border-border/20 bg-card/80 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border p-4.25">
              <span className="bg-accent/10 text-accent grid size-10.75 place-items-center rounded-xl">
                <Clock3 size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-card-foreground m-0 text-sm font-semibold">
                  Pomodoro integrado
                </h3>

                <p className="text-muted-foreground mt-1.75 text-xs leading-[1.55]">
                  Gestiona periodos de concentración y descanso con métricas
                  claras.
                </p>
              </div>
            </article>

            <article className="border-border/20 bg-card/80 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border p-4.25">
              <span className="bg-accent/10 text-accent grid size-10.75 place-items-center rounded-xl">
                <Bot size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-card-foreground m-0 text-sm font-semibold">
                  Coach académico con IA
                </h3>

                <p className="text-muted-foreground mt-1.75 text-xs leading-[1.55]">
                  Recibe recomendaciones basadas en tus metas, actividad y
                  progreso.
                </p>
              </div>
            </article>

            <article className="border-border/20 bg-card/80 grid grid-cols-[43px_minmax(0,1fr)] gap-3 rounded-2xl border p-4.25">
              <span className="bg-accent/10 text-accent grid size-10.75 place-items-center rounded-xl">
                <MessageCircle size={20} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-card-foreground m-0 text-sm font-semibold">
                  Comunicación directa
                </h3>

                <p className="text-muted-foreground mt-1.75 text-xs leading-[1.55]">
                  Mantén conversaciones con profesores, compañeros y grupos de
                  estudio.
                </p>
              </div>
            </article>
          </div>
        </div>

        <div className="border-accent/20 bg-card relative overflow-hidden rounded-2xl border p-8.75 shadow-xl max-[1180px]:max-w-155 max-[720px]:p-6.25">
          <span className="border-accent/30 bg-accent/10 text-accent grid size-16.25 place-items-center rounded-2xl border">
            <ShieldCheck size={30} aria-hidden="true" />
          </span>

          <span className="text-accent mt-7 block text-xs font-extrabold tracking-[0.08em] uppercase">
            Plataforma confiable
          </span>

          <h3 className="text-card-foreground mt-2.5 text-2xl leading-[1.2] font-bold tracking-[-0.045em]">
            Tu información y tu progreso siempre protegidos
          </h3>

          <p className="text-muted-foreground mt-3.75 text-sm leading-[1.7]">
            StudySync integra controles de privacidad, seguridad de cuenta y
            configuraciones personalizadas para cada usuario.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2.5 max-[720px]:grid-cols-1">
            <article className="border-border/20 bg-background/50 rounded-xl border p-4">
              <strong className="text-foreground block text-2xl">24/7</strong>

              <span className="text-muted-foreground mt-1.25 block text-xs">
                Disponibilidad
              </span>
            </article>

            <article className="border-border/20 bg-background/50 rounded-xl border p-4">
              <strong className="text-foreground block text-2xl">100%</strong>

              <span className="text-muted-foreground mt-1.25 block text-xs">
                Control de privacidad
              </span>
            </article>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section
        id="testimonios"
        className="border-border/20 mx-auto w-[calc(100%-10vw)] scroll-mt-22 border-t py-27.5 max-[720px]:w-[calc(100%-40px)] max-[720px]:py-20"
      >
        <div className="mx-auto max-w-170 text-center">
          <span className="border-accent/25 bg-accent/10 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            Historias de progreso
          </span>

          <h2 className="text-foreground mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em]">
            Personas que ya estudian de otra manera
          </h2>

          <p className="text-muted-foreground mx-auto mt-4 max-w-170 text-sm leading-[1.75]">
            Experiencias de estudiantes y profesores que encontraron una forma
            más organizada de avanzar.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-3.75 max-[960px]:grid-cols-1">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="border-border/20 bg-card rounded-2xl border p-6.25"
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

              <blockquote className="text-card-foreground mt-5.5 min-h-28.75 text-sm leading-[1.8]">
                “{testimonial.quote}”
              </blockquote>

              <footer className="border-border/20 mt-6 flex items-center gap-2.75 border-t pt-4.5">
                <span className="from-primary to-accent text-primary-foreground grid size-10.5 place-items-center rounded-xl bg-linear-to-br text-xs font-extrabold">
                  {testimonial.initials}
                </span>

                <div>
                  <strong className="text-card-foreground block text-sm font-semibold">
                    {testimonial.name}
                  </strong>

                  <small className="text-muted-foreground mt-1 block text-xs">
                    {testimonial.role}
                  </small>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        id="contacto"
        className="border-accent/20 bg-card relative mx-auto w-[calc(100%-10vw)] scroll-mt-22 overflow-hidden rounded-3xl border px-[7%] py-20 text-center shadow-xl max-[720px]:w-[calc(100%-28px)] max-[720px]:px-5 max-[720px]:py-16.25"
      >
        <div
          className="bg-accent/20 pointer-events-none absolute -top-77.5 left-1/2 size-125 -translate-x-1/2 rounded-full blur-[20px]"
          aria-hidden="true"
        />

        <div className="relative z-2 mx-auto max-w-187.5">
          <span className="border-accent/25 bg-accent/10 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase">
            <Sparkles size={15} aria-hidden="true" />
            Tu siguiente sesión comienza aquí
          </span>

          <h2 className="text-card-foreground mt-4.75 text-[clamp(2.4rem,4vw,4.2rem)] leading-[1.05] font-bold tracking-[-0.06em]">
            Construye hoy una mejor forma de aprender
          </h2>

          <p className="text-muted-foreground mx-auto mt-4.75 max-w-155 text-sm leading-[1.7]">
            Crea tu cuenta y empieza a organizar tus cursos, salas, sesiones de
            concentración y objetivos académicos.
          </p>

          <div className="mt-7.25 flex flex-wrap justify-center gap-3 max-[520px]:flex-col">
            <Button
              href="/registro"
              variant="primary"
              icon="arrowRight"
              iconPosition="right"
            >
              Crear cuenta gratis
            </Button>

            <Button href="/login" variant="ghost">
              Ya tengo una cuenta
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
