'use client';

import { Button } from '@/components/ui/Button';
import { IconMap, type UiIconName } from '@/lib/iconMap';
import type { SubscriptionType } from '@/types/next-auth';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { useSidebar } from './SidebarContext';

interface PlanCardProps {
  subscription: SubscriptionType;
}

interface PlanConfig {
  name: string;
  description: string;
  icon: UiIconName;
  card: string;
  tile: string;
  cta?: { text: string; href: string };
}

const PLANS: Record<SubscriptionType, PlanConfig> = {
  free: {
    name: 'Plan Free',
    description: 'Accede a las funciones básicas de la plataforma.',
    icon: 'sparkles',
    card: 'border-border bg-surface',
    tile: 'bg-secondary text-secondary-foreground',
    cta: {
      text: 'Mejorar plan',
      href: '/suscripcion' /* TODO: Ruta sin gestionar */,
    },
  },
  premium: {
    name: 'Plan Premium',
    description: 'Disfrutas de todas las funciones avanzadas.',
    icon: 'crown',
    card: 'border-warning/30 bg-warning/10',
    tile: 'bg-warning text-warning-foreground',
    cta: { text: 'Gestionar plan', href: '/suscripcion' },
  },
  enterprise: {
    name: 'Plan Enterprise',
    description: 'Acceso completo con soporte prioritario.',
    icon: 'gem',
    card: 'border-primary/30 bg-primary/10',
    tile: 'bg-primary text-primary-foreground',
  },
};

export default function PlanCard({ subscription }: PlanCardProps) {
  const { collapsed } = useSidebar();
  const plan = PLANS[subscription] ?? PLANS.free;
  const Icon = IconMap.ui[plan.icon];

  // Versión colapsada: solo el icono
  if (collapsed) {
    const tile = (
      <div
        className={cn(
          'flex size-11 items-center justify-center rounded-xl',
          plan.tile,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
    );

    return (
      <div className="flex justify-center px-3">
        {plan.cta ? (
          <Link
            href={plan.cta.href}
            aria-label={`${plan.name}: ${plan.cta.text}`}
            title={`${plan.name}: ${plan.cta.text}`}
            className="focus-visible:outline-border-focus rounded-xl transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {tile}
          </Link>
        ) : (
          <div role="img" aria-label={plan.name} title={plan.name}>
            {tile}
          </div>
        )}
      </div>
    );
  }

  // Versión expandida: tarjeta completa
  return (
    <div className="px-3">
      <div className={cn('rounded-2xl border p-4', plan.card)}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl',
              plan.tile,
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-foreground-subtle text-xs">Plan actual</p>
            <p className="text-foreground truncate text-sm font-semibold">
              {plan.name}
            </p>
          </div>
        </div>

        <p className="text-foreground-muted mt-3 text-xs">{plan.description}</p>

        {plan.cta && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            href={plan.cta.href}
            icon="arrowRight"
            iconPosition="right"
            className="mt-3"
          >
            {plan.cta.text}
          </Button>
        )}
      </div>
    </div>
  );
}
