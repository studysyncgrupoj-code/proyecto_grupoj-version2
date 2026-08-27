"use client";

import { ArrowRight, GraduationCap, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "home", label: "Inicio" },
  { id: "salas", label: "Salas" },
  { id: "beneficios", label: "Beneficios" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

interface HeaderProps {
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function Header({
  activeSection: propActiveSection,
  setActiveSection: propSetActiveSection,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Estados de respaldo por si no se reciben props desde el componente padre
  const [internalActiveSection, setInternalActiveSection] =
    useState<string>("home");

  const activeSection = propActiveSection ?? internalActiveSection;
  const setActiveSection = propSetActiveSection ?? setInternalActiveSection;

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

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
        {sections.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`relative py-2 lg:py-7 px-3 lg:px-0 text-xs font-bold transition-colors duration-200 rounded-lg lg:rounded-none ${
              activeSection === item.id
                ? "text-foreground lg:text-foreground bg-active lg:bg-transparent"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
            <span
              className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary shadow-md transition-transform duration-200 hidden lg:block ${
                activeSection === item.id ? "scale-x-100" : "scale-x-0"
              }`}
              aria-hidden="true"
            />
          </a>
        ))}
      </nav>

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

        {/* TODO: Migrar boton a un sistema reutilizable */}
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
