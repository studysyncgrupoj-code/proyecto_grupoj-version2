'use client';

import { Button } from '@/components/ui/Button';
import { IconMap, type UiIconName } from '@/lib/iconMap';
import type { SubscriptionType } from '@/types/next-auth';
import { cn } from '@/utilities/cn';
import { Link } from '@/i18n/navigation';
import { useSidebar } from './SidebarContext';

interface PlanCardProps {
  subscription: SubscriptionType;
  messages: {
    current: string;
    free: { name: string; description: string };
    premium: { name: string; description: string };
    enterprise: { name: string; description: string };
    upgrade: string;
    manage: string;
  };
}

interface PlanConfig {
  icon: UiIconName;
  card: string;
  tile: string;
  cta?: { href: string };
}

const PLANS: Record<SubscriptionType, PlanConfig> = {
  free: {
    icon: 'sparkles',
    card: 'border-border bg-surface',
    tile: 'bg-secondary text-secondary-foreground',
    cta: {
      href: '/dashboard/checkout?plan=premium' /* TODO: Ruta sin gestionar */,
    },
  },
  premium: {
    icon: 'crown',
    card: 'border-warning/30 bg-warning/10',
    tile: 'bg-warning text-warning-foreground',
    cta: {
      href: '/dashboard/billing' /* TODO: Implementar ruta de gestión de facturación/métodos de pago */,
    },
  },
  enterprise: {
    icon: 'gem',
    card: 'border-primary/30 bg-primary/10',
    tile: 'bg-primary text-primary-foreground',
  },
};

export default function PlanCard({ subscription, messages }: PlanCardProps) {
  const { collapsed } = useSidebar();
  const plan = PLANS[subscription] ?? PLANS.free;
  const planMessages = messages[subscription] ?? messages.free;
  const ctaLabel = subscription === 'free' ? messages.upgrade : messages.manage;
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
            aria-label={`${planMessages.name}: ${ctaLabel}`}
            title={`${planMessages.name}: ${ctaLabel}`}
            className="focus-visible:outline-border-focus rounded-xl transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {tile}
          </Link>
        ) : (
          <div
            role="img"
            aria-label={planMessages.name}
            title={planMessages.name}
          >
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
            <p className="text-foreground-subtle text-xs">{messages.current}</p>
            <p className="text-foreground truncate text-sm font-semibold">
              {planMessages.name}
            </p>
          </div>
        </div>

        <p className="text-foreground-muted mt-3 text-xs">
          {planMessages.description}
        </p>

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
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
