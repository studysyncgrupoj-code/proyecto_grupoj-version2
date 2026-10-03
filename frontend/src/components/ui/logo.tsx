'use client';

import Link from 'next/link';
import { FaGraduationCap } from 'react-icons/fa';

export type LogoVariant = 'full' | 'compact';

export interface LogoProps {
  variant?: LogoVariant;
  href?: string;
  iconSize?: number;
  asChild?: boolean;
  className?: string;
  showTagline?: boolean;
  ariaLabel?: string;
}

const DEFAULT_ARIA_LABEL = 'StudySync - Ir al inicio';

export default function Logo({
  variant = 'full',
  href = '/',
  iconSize = 32,
  className = '',
  showTagline = true,
  ariaLabel = DEFAULT_ARIA_LABEL,
}: LogoProps) {
  const isCompact = variant === 'compact';

  return (
    <Link
      href={href}
      className={`inline-flex w-fit items-center gap-3 ${className}`}
      aria-label={ariaLabel}
    >
      <span
        className="border-primary from-primary to-primary-hover text-primary-foreground grid h-10 w-10 place-items-center rounded-xl border bg-linear-to-br"
        aria-hidden="true"
      >
        <FaGraduationCap size={iconSize} strokeWidth={2} />
      </span>

      {!isCompact && (
        <span className="leading-none">
          <span className="text-foreground block text-base font-bold tracking-tight">
            StudySync
          </span>

          {showTagline && (
            <span className="text-foreground-muted mt-1 hidden text-[0.6rem] tracking-wide sm:block">
              Aprende. Conecta. Avanza.
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
