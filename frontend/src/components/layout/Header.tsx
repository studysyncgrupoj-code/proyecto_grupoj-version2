"use client";

import { HEADER_LINKS, isNavLinkActive } from "@/config/navigation";
import { IconMap } from "@/lib/iconMap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const GraduationCap = IconMap.ui.graduationCap;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between min-h-20 px-6 sm:px-12 border-b border-border bg-black/76 backdrop-blur-md">
      {/* Brand / Logo */}
      <Link
        href="/"
        className="inline-flex items-center gap-3 w-fit"
        aria-label="StudySync - Ir al inicio"
      >
        <span className="w-10 h-10 grid place-items-center border border-accent-foreground rounded-xl text-primary-foreground bg-linear-to-br from-primary to-blue-900 shadow-lg">
          <GraduationCap size={32} strokeWidth={2} />
        </span>
        <span className="leading-none">
          <span className="block text-foreground text-base font-bold tracking-tight">
            StudySync
          </span>
          <span className="mt-1 text-muted-foreground text-[0.6rem] tracking-wide hidden sm:block">
            Aprende. Conecta. Avanza.
          </span>
        </span>
      </Link>

      {/* Navigation Menu - Desktop */}
      <nav
        className="hidden lg:flex items-center gap-6 lg:gap-8"
        aria-label="Navegación principal"
      >
        {HEADER_LINKS.map((link) => {
          const isActive = isNavLinkActive(pathname, link);
          const isExternal = link.href.startsWith("http");

          if (isExternal) {
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative py-7 px-0 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.labelKey}
                <span
                  className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary shadow-md transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0"
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
              className={`relative py-7 px-0 text-xs font-bold transition-colors duration-200 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.labelKey}
              <span
                className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary shadow-md transition-transform duration-200 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>

      {/* Navigation Menu - Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 right-4 left-4 flex flex-col items-stretch gap-1 p-4 border border-border rounded-2xl bg-background shadow-2xl z-50">
          {HEADER_LINKS.map((link) => {
            const isActive = isNavLinkActive(pathname, link);
            const isExternal = link.href.startsWith("http");

            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative py-2 px-3 text-xs font-bold transition-colors duration-200 rounded-lg ${
                    isActive
                      ? "text-foreground bg-active"
                      : "text-muted-foreground hover:text-foreground"
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
                className={`relative py-2 px-3 text-xs font-bold transition-colors duration-200 rounded-lg ${
                  isActive
                    ? "text-foreground bg-active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.labelKey}
              </Link>
            );
          })}

          {/* Separador */}
          <hr className="my-3 border-border" />

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
          icon={mobileMenuOpen ? "close" : "menu"}
          className="lg:hidden text-foreground"
          aria-label={
            mobileMenuOpen
              ? "Cerrar menú de navegación"
              : "Abrir menú de navegación"
          }
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        />
      </div>
    </header>
  );
}
