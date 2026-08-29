import { Button } from "@/components/ui/Button";
import { IconMap } from "@/lib/iconMap";

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
  } = IconMap.ui;

  const stats = [
    {
      icon: Clock,
      title: "Tiempo estudiado",
      value: "24.5 h",
    },
    {
      icon: Target,
      title: "Meta semanal",
      value: "82%",
    },
    {
      icon: Users,
      title: "Salas activas",
      value: "12",
    },
  ];

  const chartHeights = [35, 62, 48, 78, 91, 69, 84];

  const benefits = [
    "Sin tarjeta de crédito",
    "Acceso inmediato",
    "Para estudiantes y profesores",
  ];

  const dashboardItems = [1, 2, 3, 4, 5];

  const features = [
    {
      id: 1,
      title: "Enfoque inteligente",
      description:
        "Organiza tus sesiones, reduce distracciones y construye hábitos de estudio consistentes.",
      icon: Target,
    },
    {
      id: 2,
      title: "Aprendizaje colaborativo",
      description:
        "Estudia junto a compañeros, profesores y comunidades académicas en tiempo real.",
      icon: Users,
    },
    {
      id: 3,
      title: "Progreso medible",
      description:
        "Consulta estadísticas, metas, actividad y evolución desde un mismo espacio.",
      icon: BrainCircuit,
    },
  ];

  return (
    <div>
      <section className="relative grid min-h-[calc(100vh-5rem)] content-center overflow-hidden bg-background px-[5vw] py-17.5 max-[1180px]:py-15 max-[720px]:min-h-[calc(100vh-5rem)] max-[720px]:px-5 max-[720px]:py-12.5">
        {/* Glow superior derecho */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] top-[7%] h-117.5 w-117.5 rounded-full bg-accent/10 blur-[20px] max-[720px]:-right-45 max-[720px]:top-[4%] max-[720px]:h-87.5 max-[720px]:w-87.5"
        />

        {/* Glow inferior izquierdo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[2%] -left-40 h-87.5 w-87.5 rounded-full bg-primary/10 blur-[20px] max-[720px]:-bottom-25 max-[720px]:-left-37.5"
        />

        {/* Grid de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_oklch,var(--accent)_3%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--accent)_3%,transparent)_1px,transparent_1px)] bg-size-[42px_42px] mask-[linear-gradient(to_bottom,black,transparent_75%)]"
        />

        {/* Contenido principal */}
        <div className="relative z-10 mx-auto grid w-full max-w-355 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(45px,5vw,90px)] max-[1180px]:grid-cols-1">
          {/* =========================
            HERO CONTENT
        ========================== */}

          <div className="max-w-165 max-[1180px]:mx-auto max-[1180px]:max-w-200 max-[1180px]:text-center">
            {/* Eyebrow */}{" "}
            {/* TODO: Crear componente reutilizable para badges */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.75 py-1.75 text-[0.65rem] font-extrabold uppercase tracking-[0.09em] text-accent max-[1180px]:mx-auto">
              <Sparkles size={15} />
              Tu ecosistema inteligente de estudio
            </span>
            {/* Título */}
            <h1 className="mt-5.25 max-w-190 font-heading text-[clamp(3.5rem,5.5vw,6rem)] font-bold leading-[0.94] tracking-[-0.075em] text-foreground max-[1180px]:mx-auto max-[720px]:text-[clamp(2.8rem,13vw,4.2rem)]">
              Estudia mejor.
              <span className="block bg-linear-to-r from-info to-primary bg-clip-text text-transparent">
                Avanza con propósito.
              </span>
            </h1>
            {/* Descripción */}
            <p className="mt-6.25 max-w-155 text-[0.94rem] leading-[1.8] text-muted-foreground max-[1180px]:mx-auto max-[520px]:text-[0.88rem] max-[520px]:leading-[1.7]">
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
                  className="inline-flex items-center gap-1.75 text-[0.66rem] text-muted-foreground"
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

          <div className="relative min-h-130 overflow-visible rounded-[26px] border border-border bg-card shadow-[0_40px_100px_rgba(0,0,0,0.75)] transform-[perspective(1300px)_rotateY(-4deg)_rotateX(1deg)] max-[1180px]:mx-auto max-[1180px]:w-full max-[1180px]:max-w-200 max-[1180px]:transform-none max-[720px]:min-h-0 max-[720px]:rounded-[20px]">
            {/* Header */}
            <div className="flex min-h-12.5 items-center justify-between border-b border-border px-4.25">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
              </div>

              <span className="flex items-center gap-1.75 text-[0.57rem] text-muted-foreground">
                <span className="h-1.75 w-1.75 rounded-full bg-success shadow-[0_0_9px_color-mix(in_oklch,var(--success)_55%,transparent)]" />
                Plataforma activa
              </span>
            </div>

            {/* Dashboard body */}
            <div className="grid min-h-117 grid-cols-[65px_minmax(0,1fr)] max-[720px]:grid-cols-1 max-[720px]:min-h-0">
              {/* Sidebar */}
              <aside className="flex flex-col items-center gap-5 border-r border-border bg-background/40 px-0 py-4.5 max-[720px]:hidden">
                <div className="mb-2 grid h-8.75 w-8.75 place-items-center rounded-[10px] bg-primary text-primary-foreground">
                  <GraduationCap size={19} />
                </div>

                {dashboardItems.map((item) => (
                  <span
                    key={item}
                    className={`h-1.5 w-6 rounded-full ${
                      item === 1
                        ? "bg-accent shadow-[0_0_12px_color-mix(in_oklch,var(--accent)_55%,transparent)]"
                        : "bg-secondary"
                    }`}
                  />
                ))}
              </aside>

              {/* Dashboard content */}
              <div className="min-w-0 p-5.75 max-[720px]:p-4.25">
                {/* Heading - h2 */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <small className="block text-[0.63rem] text-muted-foreground">
                      Bienvenido de nuevo
                    </small>

                    <h2 className="mt-1.25 block font-heading text-base text-card-foreground">
                      Tu progreso académico
                    </h2>
                  </div>

                  <span className="grid h-9.25 w-9.25 shrink-0 place-items-center rounded-[11px] border border-accent/30 bg-primary text-[0.62rem] font-extrabold text-primary-foreground">
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
                        className="flex min-w-0 items-center gap-2.25 rounded-[13px] border border-border bg-background/80 p-3.25"
                      >
                        <span className="grid h-8.75 w-8.75 shrink-0 place-items-center rounded-[10px] bg-accent/10 text-accent">
                          <StatIcon size={18} />
                        </span>

                        <div className="min-w-0">
                          <small className="block truncate text-[0.52rem] text-muted-foreground">
                            {stat.title}
                          </small>

                          <strong className="mt-1 block text-[0.78rem] text-card-foreground">
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
                    className="min-h-59.5 rounded-[14px] border border-border bg-background/80 p-4 max-[720px]:min-h-55"
                    role="img"
                    aria-label="Gráfico de barras del progreso semanal. La altura de las barras representa las horas estudiadas cada día, totalizando 18 horas de 22."
                  >
                    <div className="flex justify-between gap-3.75">
                      <h3 className="text-[0.6rem] text-muted-foreground">
                        Progreso semanal
                      </h3>

                      <strong className="text-[0.65rem] text-card-foreground">
                        18 horas de 22
                      </strong>
                    </div>

                    <div className="mt-6 flex h-38.75 items-end justify-between gap-2 border-b border-border px-1">
                      {chartHeights.map((height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="w-[10%] rounded-t-[5px] bg-linear-to-t from-primary to-info shadow-[0_0_14px_color-mix(in_oklch,var(--info)_18%,transparent)]"
                          style={{ height: `${height}%` }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </article>

                  {/* Próxima sesión */}
                  <article className="flex min-h-59.5 flex-col rounded-[14px] border border-border bg-background/80 p-4.25 max-[720px]:min-h-55">
                    <span className="grid h-10.5 w-10.5 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Video size={20} />
                    </span>

                    <div className="mt-4.5">
                      <small className="block text-[0.57rem] text-muted-foreground">
                        Próxima sesión
                      </small>
                      <h3 className="mt-1.25 block text-[0.75rem] text-card-foreground">
                        React avanzado
                      </h3>
                      <span className="mt-1.75 block text-[0.57rem] text-muted-foreground">
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
            <div className="absolute bottom-15.75 -left-9.5 z-20 flex items-center gap-2.5 rounded-[13px] border border-accent/20 bg-card px-3.25 py-2.75 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl max-[720px]:hidden">
              <span className="grid h-8.5 w-8.5 place-items-center rounded-[10px] bg-accent/10 text-accent">
                <Zap size={17} />
              </span>

              <div>
                <small className="block text-[0.53rem] text-muted-foreground">
                  Racha actual
                </small>
                <strong className="mt-0.75 block text-[0.68rem] text-card-foreground">
                  12 días
                </strong>
              </div>
            </div>

            {/* Floating card derecha */}
            <div className="absolute -right-8.5 top-23.5 z-20 flex items-center gap-2.5 rounded-[13px] border border-accent/20 bg-card px-3.25 py-2.75 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl max-[720px]:hidden">
              <span className="grid h-8.5 w-8.5 place-items-center rounded-[10px] bg-accent/10 text-accent">
                <Bot size={18} />
              </span>

              <div>
                <small className="block text-[0.53rem] text-muted-foreground">
                  IA Coach
                </small>
                <strong className="mt-0.75 block text-[0.68rem] text-card-foreground">
                  Plan actualizado
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
          TRUSTED - lista semántica
      ========================== */}

        <div className="relative z-10 mx-auto mt-11.25 flex w-full max-w-355 items-center justify-between gap-6.25 border-t border-border pt-6.25 max-[720px]:flex-col max-[720px]:items-start">
          <span className="text-[0.63rem] uppercase tracking-widest text-muted-foreground">
            Una plataforma diseñada para potenciar
          </span>

          <ul className="flex flex-wrap justify-end gap-8.5 max-[720px]:justify-start max-[720px]:gap-4.5">
            {["Concentración", "Colaboración", "Organización", "Progreso"].map(
              (item) => (
                <li
                  key={item}
                  className="text-[0.7rem] font-bold tracking-wider text-muted-foreground"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-10vw)] max-w-355 py-20 md:py-27.5">
        <header className="mx-auto max-w-170 text-center">
          <span className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-2 text-[0.65rem] font-extrabold uppercase tracking-[0.09em] text-accent">
            <BrainCircuit size={15} aria-hidden="true" />
            Aprendizaje con propósito
          </span>

          <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] font-bold leading-[1.06] tracking-[-0.055em] text-foreground">
            Todo lo que necesitas para estudiar mejor
          </h2>

          <p className="mx-auto mt-4 max-w-170 text-[0.82rem] leading-[1.75] text-muted-foreground">
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
                className="group relative min-h-61.25 overflow-hidden rounded-[21px] border border-border/50 bg-card p-6.5 shadow-[0_25px_55px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 lg:min-h-72.5"
              >
                <span
                  className="absolute right-5 top-5 text-[2.4rem] font-black leading-none text-accent/15"
                  aria-hidden="true"
                >
                  0{feature.id}
                </span>

                <div className="grid size-13.25 place-items-center rounded-[15px] border border-accent/25 bg-accent/10 text-accent">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <h3 className="mt-7 text-[1.05rem] font-semibold text-card-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 text-[0.73rem] leading-[1.7] text-muted-foreground">
                  {feature.description}
                </p>

                <span
                  className="absolute bottom-6 left-6 right-6 h-0.5 rounded-full bg-linear-to-r from-accent to-accent/0"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
