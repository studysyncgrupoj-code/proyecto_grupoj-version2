import { Button, type ButtonVariant } from '@/components/ui/Button';
import { AppIcon, type UiIconName } from '@/lib/iconMap';
import { cn } from '@/utilities/cn';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suscripciones',
  description:
    'Compara los planes de StudySync: Free, Premium y Enterprise. Elige el que mejor se adapte a tu forma de estudiar o a tu institución.',
};

/* ====================================================
   Datos de los planes
   ==================================================== */

type PlanId = 'free' | 'premium' | 'enterprise';

interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: { value: string; suffix?: string };
  features: readonly string[];
  cta: {
    label: string;
    href: string;
    variant: ButtonVariant;
    icon: UiIconName;
  };
  highlighted?: boolean;
  note?: string;
}

const PLANS: readonly Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description:
      'Ideal para estudiantes que quieren empezar o probar StudySync de forma independiente.',
    price: { value: '$0', suffix: 'COP / mes' },
    features: [
      'Acceso a salas de estudio comunitarias',
      'Calendario personal de estudio',
      'Mensajería básica con compañeros',
      'Panel de progreso semanal',
    ],
    cta: {
      label: 'Comenzar gratis',
      href: '/register',
      variant: 'social',
      icon: 'arrowRight',
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description:
      'Para estudiantes avanzados y profesionales independientes que buscan constancia y resultados.',
    price: { value: '$49.900', suffix: 'COP / mes' },
    features: [
      'Todo lo incluido en el plan Free',
      'Salas de estudio privadas y videollamadas sin límite',
      'Asistente de estudio con IA',
      'Estadísticas avanzadas de rendimiento',
      'Planificación inteligente de tareas y recordatorios',
      'Soporte prioritario',
    ],
    cta: {
      label: 'Empezar con Premium',
      href: '/register',
      variant: 'primary',
      icon: 'arrowRight',
    },
    highlighted: true,
    // Premium solo se compra dentro del dashboard: el CTA lleva a crear la cuenta.
    note: 'Activa Premium desde tu panel una vez hayas iniciado sesión.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description:
      'Diseñado para empleados e instituciones que necesitan gestionar el aprendizaje a gran escala.',
    price: { value: 'A medida', suffix: 'Precio corporativo' },
    features: [
      'Todo lo incluido en el plan Premium',
      'Acceso a cursos exclusivos y rutas de aprendizaje corporativas',
      'Gestión de múltiples cursos, profesores y estudiantes',
      'Roles y permisos administrativos',
      'Reportes institucionales de avance',
      'Onboarding e integración personalizados',
      'Soporte dedicado con acuerdo de servicio (SLA)',
    ],
    cta: {
      label: 'Contactar al equipo',
      // TODO: Implementar redirección a ruta de contacto /contacto
      href: '/contact',
      variant: 'secondary',
      icon: 'mail',
    },
  },
];

/* ====================================================
   Tarjeta de plan
   ==================================================== */

function PlanCard({ plan }: { plan: Plan }) {
  const titleId = `plan-${plan.id}-title`;

  return (
    <li className="flex">
      <article
        aria-labelledby={titleId}
        className={cn(
          'border-border bg-surface relative flex w-full flex-col rounded-3xl border p-6 sm:p-8',
          plan.highlighted &&
            'border-primary shadow-primary/15 ring-primary/40 z-10 shadow-xl ring-1 lg:scale-[1.03]',
        )}
      >
        {plan.highlighted && (
          <span className="bg-primary text-primary-foreground shadow-primary/25 absolute top-0 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap shadow-lg">
            <AppIcon category="ui" name="crown" className="size-3.5" />
            Recomendado
          </span>
        )}

        <h2
          id={titleId}
          className="text-foreground font-serif text-2xl font-semibold"
        >
          {plan.name}
        </h2>

        <p className="text-foreground-muted mt-2 font-sans text-sm text-pretty">
          {plan.description}
        </p>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <span className="text-foreground font-serif text-4xl font-semibold tracking-tight">
            {plan.price.value}
          </span>
          {plan.price.suffix && (
            <span className="text-foreground-muted font-sans text-sm">
              {plan.price.suffix}
            </span>
          )}
        </p>

        <ul
          role="list"
          className="border-border mt-8 flex-1 space-y-3 border-t pt-6"
        >
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="text-foreground flex items-start gap-3 font-sans text-sm"
            >
              <AppIcon
                category="ui"
                name="checkCircle"
                className="text-primary mt-0.5 size-5 shrink-0"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button
            href={plan.cta.href}
            variant={plan.cta.variant}
            size="lg"
            fullWidth
            icon={plan.cta.icon}
            iconPosition={plan.cta.icon === 'arrowRight' ? 'right' : 'left'}
          >
            {plan.cta.label}
          </Button>

          {plan.note && (
            <p className="text-foreground-muted mt-3 text-center font-sans text-xs">
              {plan.note}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}

/* ====================================================
   Página
   ==================================================== */

export default function SuscripcionPage() {
  return (
    <main className="bg-background text-foreground relative isolate overflow-hidden">
      {/* Resplandor decorativo, oculto para tecnologías de asistencia */}
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 -z-10 size-144 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />

      <section
        aria-labelledby="pricing-title"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-foreground-muted font-sans text-sm font-medium tracking-widest uppercase">
            Planes y precios
          </p>
          <h1
            id="pricing-title"
            className="text-primary mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Elige el plan que impulsa tu forma de estudiar
          </h1>
          <p className="text-foreground-muted mt-4 font-sans text-base text-pretty sm:text-lg">
            Desde tus primeras sesiones de estudio hasta la gestión de toda una
            institución: StudySync crece contigo.
          </p>
        </header>

        <ul
          role="list"
          className="mt-16 grid gap-8 md:grid-cols-3 md:items-stretch lg:gap-6"
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </ul>

        <p className="text-foreground-muted mt-10 text-center font-sans text-xs">
          Todos los precios están expresados en pesos colombianos (COP).
        </p>
      </section>
    </main>
  );
}
