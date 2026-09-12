'use client';

import Logo from '@/components/ui/logo';
import { HEADER_LINKS, isNavLinkActive } from '@/config/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../ui/Button';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="border-border fixed top-0 left-0 z-50 flex min-h-20 w-full items-center justify-between border-b bg-black/76 px-6 backdrop-blur-md sm:px-12">
      {/* Brand / Logo */}
      <Logo />

      {/* Navigation Menu - Desktop */}
      <nav
        className="hidden items-center gap-6 lg:flex lg:gap-8"
        aria-label="Navegación principal"
      >
        {HEADER_LINKS.map((link) => {
          const isActive = isNavLinkActive(pathname, link);
          const isExternal = link.href.startsWith('http');

          if (isExternal) {
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative px-0 py-7 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.labelKey}
                <span
                  className={`bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full shadow-md transition-transform duration-200 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden="true"
                />
              </a>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-0 py-7 text-xs font-bold transition-colors duration-200 ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.labelKey}
              <span
                className={`bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full shadow-md transition-transform duration-200 ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>

      {/* Navigation Menu - Mobile */}
      {mobileMenuOpen && (
        <div className="border-border bg-background absolute top-20 right-4 left-4 z-50 flex flex-col items-stretch gap-1 rounded-2xl border p-4 shadow-2xl lg:hidden">
          {HEADER_LINKS.map((link) => {
            const isActive = isNavLinkActive(pathname, link);
            const isExternal = link.href.startsWith('http');

            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-foreground bg-active'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.labelKey}
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-foreground bg-active'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.labelKey}
              </Link>
            );
          })}

          {/* Separador */}
          <hr className="border-border my-3" />

          {/* Login */}
          <Button
            href="/login"
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setMobileMenuOpen(false)}
          >
            Iniciar sesión
          </Button>

          {/* Registro */}
          <Button
            href="/register"
            variant="primary"
            size="sm"
            icon="arrowRight"
            iconPosition="right"
            fullWidth
            onClick={() => setMobileMenuOpen(false)}
          >
            Crear cuenta
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Iniciar sesión - Desktop */}
        <Button
          href="/login"
          variant="ghost"
          size="sm"
          className="hidden lg:inline-flex"
        >
          Iniciar sesión
        </Button>

        {/* Crear cuenta - Desktop */}
        <Button
          href="/register"
          variant="primary"
          size="sm"
          icon="arrowRight"
          iconPosition="right"
          className="hidden lg:inline-flex"
        >
          Crear cuenta
        </Button>

        {/* Menú móvil */}
        <Button
          variant="ghost"
          size="lg"
          icon={mobileMenuOpen ? 'close' : 'menu'}
          className="text-foreground lg:hidden"
          aria-label={
            mobileMenuOpen
              ? 'Cerrar menú de navegación'
              : 'Abrir menú de navegación'
          }
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        />
      </div>
    </header>
  );
}
