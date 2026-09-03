import { IconMap } from '@/lib/iconMap';
import LoginForm from './LoginForm';

// Componente para las tarjetas de beneficios (Server)
const BenefitCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <article className="group border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card flex items-center gap-3.5 rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div className="border-primary/30 bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl border">
      {icon}
    </div>
    <span>
      <strong className="text-foreground block text-sm">{title}</strong>
      <small className="text-muted-foreground mt-1 block text-xs leading-relaxed">
        {description}
      </small>
    </span>
  </article>
);

export default function LoginPage() {
  const { shield: ShieldCheck, sparkles: Sparkles, users: Users } = IconMap.ui;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
      {/* Sección de showcase - izquierda */}
      <section className="border-border/20 relative flex flex-col items-center overflow-hidden border-r bg-linear-to-br p-8">
        {/* Patrón de fondo sutil */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--accent)_1px,transparent_1px),linear-gradient(to_bottom,var(--accent)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_82%)] bg-size-[42px_42px] opacity-10" />

        {/* Efectos de brillo (Glow) sincronizados */}
        <div className="bg-accent/10 pointer-events-none absolute -top-45 -right-30 h-102.5 w-102.5 rounded-full blur-2xl" />
        <div className="bg-primary/10 pointer-events-none absolute -bottom-37.5 -left-45 h-90 w-90 rounded-full blur-2xl" />

        {/* Contenido principal */}
        <div className="relative z-10 my-auto w-full max-w-xl">
          {/* Badge */}
          <span className="border-primary/25 bg-primary/10 text-primary inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
            <Sparkles size={15} />
            Bienvenido de nuevo
          </span>

          {/* Título principal */}
          <h1 className="text-foreground mt-6 mb-4 max-w-xl text-5xl font-extrabold tracking-tight lg:text-7xl">
            Continúa tu ruta.{' '}
            <span className="text-primary">Retoma el control.</span>
          </h1>

          {/* Descripción */}
          <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
            Accede a tus salas de estudio, revisa tus cursos pendientes y mantén
            tu rendimiento al día en StudySync.
          </p>

          {/* Tarjetas */}
          <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
            <BenefitCard
              icon={<Users size={21} />}
              title="Salas activas"
              description="Retoma la colaboración con tus compañeros."
            />
            <BenefitCard
              icon={<ShieldCheck size={21} />}
              title="Acceso seguro"
              description="Tus credenciales y datos están protegidos."
            />
          </div>
        </div>
      </section>

      {/* Sección del formulario - derecha */}
      <LoginForm />
    </div>
  );
}
