import { IconMap } from '@/lib/iconMap';
import type { Metadata } from 'next';
import ResetPasswordForm from './Resetpasswordform';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description:
    'Crea una nueva contraseña para tu cuenta de StudySync a partir del enlace enviado a tu correo.',
};

interface ResetPasswordPageProps {
  // A partir de Next.js 15, los `params` de una página se entregan como
  // una Promise y deben resolverse con `await` antes de usarlos.
  params: Promise<{ token: string }>;
}

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
  <article className="group border-border bg-surface hover:border-primary-hover hover:bg-surface-hover flex items-center gap-3.5 rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1">
    <div className="border-primary/30 bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl border">
      {icon}
    </div>
    <span>
      <strong className="text-foreground block text-sm">{title}</strong>
      <small className="text-foreground-muted mt-1 block text-xs leading-relaxed">
        {description}
      </small>
    </span>
  </article>
);

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;
  const { shield: ShieldCheck, sparkles: Sparkles, lock: Lock } = IconMap.ui;

  return (
    <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
      {/* Sección de showcase - izquierda */}
      <section className="border-border bg-background relative flex flex-col items-center overflow-hidden border-r p-8">
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
            Un último paso
          </span>

          {/* Título principal */}
          <h1 className="text-foreground mt-6 mb-4 max-w-xl text-5xl font-extrabold tracking-tight lg:text-7xl">
            Asegura tu cuenta.{' '}
            <span className="text-primary">Elige una nueva llave.</span>
          </h1>

          {/* Descripción */}
          <p className="text-foreground-muted max-w-lg text-lg leading-relaxed">
            Define una contraseña nueva para volver a tus salas de estudio,
            cursos y progreso en StudySync.
          </p>

          {/* Tarjetas */}
          <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
            <BenefitCard
              icon={<Lock size={21} />}
              title="Enlace de un solo uso"
              description="Este enlace deja de funcionar una vez que actualices tu contraseña."
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
      <ResetPasswordForm token={token} />
    </div>
  );
}
