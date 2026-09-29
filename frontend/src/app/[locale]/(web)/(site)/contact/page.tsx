import { AppIcon, type UiIconName } from '@/lib/iconMap';
import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escríbenos: resolvemos tus dudas sobre StudySync, tus planes y las soluciones para instituciones.',
};

/* ====================================================
   Canales de contacto
   ==================================================== */

interface ContactChannel {
  icon: UiIconName;
  title: string;
  description: string;
  href?: string;
}

// TODO: reemplazar estos datos de ejemplo por los canales reales de StudySync.
const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    icon: 'mail',
    title: 'Soporte por correo',
    description: 'soporte@studysync.co',
    href: 'mailto:soporte@studysync.co',
  },
  {
    icon: 'clock',
    title: 'Horario de atención',
    description:
      'Lunes a viernes, de 8:00 a. m. a 6:00 p. m. (hora de Colombia)',
  },
  {
    icon: 'mapPin',
    title: 'Ubicación',
    description:
      'Colombia · atención en línea para estudiantes e instituciones',
  },
];

function ContactInfoCard({ channel }: { channel: ContactChannel }) {
  return (
    <li className="border-border bg-surface/60 hover:bg-surface-hover flex items-start gap-4 rounded-2xl border p-4 backdrop-blur-sm transition-colors">
      <span
        aria-hidden="true"
        className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl"
      >
        <AppIcon category="ui" name={channel.icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-foreground font-serif text-base font-semibold">
          {channel.title}
        </h3>
        <p className="text-foreground-muted mt-1 font-sans text-sm">
          {channel.href ? (
            <a
              href={channel.href}
              className="hover:text-foreground focus-visible:ring-border-focus rounded-sm underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {channel.description}
            </a>
          ) : (
            channel.description
          )}
        </p>
      </div>
    </li>
  );
}

/* ====================================================
   Página
   ==================================================== */

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
      {/* Columna izquierda: showcase / información de contacto */}
      <section
        aria-labelledby="contact-title"
        className="relative isolate overflow-hidden px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
      >
        {/* Decoración: grilla y resplandores (ocultos para tecnologías de asistencia) */}
        <svg
          aria-hidden="true"
          className="text-border/60 absolute inset-0 -z-10 size-full mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
        >
          <defs>
            <pattern
              id="contact-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M48 0H0V48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>
        <div
          aria-hidden="true"
          className="bg-primary/10 pointer-events-none absolute -top-24 -left-24 -z-10 size-96 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-accent/10 pointer-events-none absolute -right-24 -bottom-24 -z-10 size-96 rounded-full blur-3xl"
        />

        <div className="mx-auto max-w-2xl lg:mx-0">
          <p className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans text-sm font-medium">
            <AppIcon category="ui" name="message" className="size-4" />
            Contacto
          </p>

          <h1
            id="contact-title"
            className="text-foreground mt-6 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Hablemos de{' '}
            <span className="text-primary">tu experiencia de estudio</span>
          </h1>

          <p className="text-foreground-muted mt-5 max-w-xl font-sans text-base text-pretty sm:text-lg">
            ¿Tienes dudas sobre StudySync, sobre nuestros planes o quieres
            llevarlo a tu institución? Escríbenos y el equipo te acompañará en
            cada paso.
          </p>

          <ul role="list" className="mt-10 space-y-4">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactInfoCard key={channel.title} channel={channel} />
            ))}
          </ul>
        </div>
      </section>

      {/* Columna derecha: formulario */}
      <section className="flex items-center justify-center px-4 pb-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="border-border bg-surface w-full max-w-xl rounded-3xl border p-7 shadow-xl">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
