// src/components/Logo.tsx
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export type LogoVariant = 'full' | 'compact';

export interface LogoProps {
  /** Variante visual: completa (icono + texto) o compacta (solo icono) */
  variant?: LogoVariant;
  /** Ruta a la que navega al hacer click. Por defecto '/' */
  href?: string;
  /** Tamaño del icono en píxeles */
  iconSize?: number;
  /** Si se pasa, sustituye al componente Link por un CustomLink u otro wrapper */
  asChild?: boolean;
  /** Clases extra para el contenedor raíz */
  className?: string;
  /** Oculta el tagline "Aprende. Conecta. Avanza." */
  showTagline?: boolean;
  /** Etiqueta accesible del enlace */
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
        className="border-accent-foreground text-primary-foreground from-primary grid h-10 w-10 place-items-center rounded-xl border bg-linear-to-br to-blue-900 shadow-lg"
        aria-hidden="true"
      >
        <GraduationCap size={iconSize} strokeWidth={2} />
      </span>

      {!isCompact && (
        <span className="leading-none">
          <span className="text-foreground block text-base font-bold tracking-tight">
            StudySync
          </span>
          {showTagline && (
            <span className="text-muted-foreground mt-1 hidden text-[0.6rem] tracking-wide sm:block">
              Aprende. Conecta. Avanza.
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
