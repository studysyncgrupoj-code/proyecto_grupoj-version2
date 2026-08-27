"use client";

import { ArrowRight, GraduationCap, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HEADER_LINKS, isNavLinkActive } from "@/config/navigation"; // Ajusta la ruta

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

      {/* Navigation Menu */}
      <nav
        className={`items-center gap-6 lg:gap-8 ${
          mobileMenuOpen
            ? "absolute top-20 right-4 left-4 flex flex-col items-stretch gap-1 p-4 border border-border rounded-2xl bg-background shadow-2xl"
            : "hidden lg:flex"
        }`}
        aria-label="Navegación principal"
      >
        {HEADER_LINKS.map((link) => {
          const isActive = isNavLinkActive(pathname, link);
          const isExternal = link.href.startsWith("http");

          // Enlaces externos
          if (isExternal) {
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative py-2 lg:py-7 px-3 lg:px-0 text-xs font-bold transition-colors duration-200 rounded-lg lg:rounded-none ${
                  isActive
                    ? "text-foreground lg:text-foreground bg-active lg:bg-transparent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.labelKey}
                <span
                  className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary shadow-md transition-transform duration-200 hidden lg:block ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </a>
            );
          }

          // Enlaces internos (Next.js Link)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 lg:py-7 px-3 lg:px-0 text-xs font-bold transition-colors duration-200 rounded-lg lg:rounded-none ${
                isActive
                  ? "text-foreground lg:text-foreground bg-active lg:bg-transparent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.labelKey}
              <span
                className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary shadow-md transition-transform duration-200 hidden lg:block ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
      
       {/* TODO: Migrar boton a un sistema reutilizable */}
      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-muted-foreground text-xs font-semibold transition-colors duration-200 hover:text-foreground hidden lg:inline-block"
        >
          Iniciar sesión
        </Link>

        <Link
          href="/registro"
          className="min-h-11 hidden lg:inline-flex items-center justify-center gap-2 px-4 border border-sky-400/40 rounded-xl text-primary-foreground text-xs font-bold bg-linear-to-br from-primary to-blue-900 shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Crear cuenta
          <ArrowRight size={16} />
        </Link>

       
        <button
          type="button"
          className="w-10 h-10 grid place-items-center border border-border rounded-xl text-foreground bg-background cursor-pointer lg:hidden"
          aria-label={
            mobileMenuOpen
              ? "Cerrar menú de navegación"
              : "Abrir menú de navegación"
          }
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}