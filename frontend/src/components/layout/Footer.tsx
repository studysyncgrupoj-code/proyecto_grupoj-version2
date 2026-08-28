import { IconMap } from "@/lib/iconMap";
import { CustomLink } from "../ui/Link";

const FOOTER_LINKS = [
  {
    title: "Plataforma",
    links: [
      { name: "Cursos", href: "#" },
      { name: "Rutas de Aprendizaje", href: "#" },
      { name: "Precios", href: "#" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { name: "Acerca de", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Foro", href: "#" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { name: "Centro de Ayuda", href: "#" },
      { name: "Contacto", href: "#" },
      { name: "Estado", href: "#" },
    ],
  },
];

const LEGAL_LINKS = [
  { name: "Privacidad", href: "#" },
  { name: "Términos", href: "#" },
];

export default function Footer() {
  const GraduationCap = IconMap.ui.graduationCap;

  return (
    <footer className="mt-auto w-full bg-background border-t border-border py-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <section className="md:col-span-1">
            <CustomLink
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
            </CustomLink>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Plataforma educativa moderna construida para potenciar el
              aprendizaje y la colaboración en línea.
            </p>
          </section>

          {FOOTER_LINKS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="font-heading font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <CustomLink
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 StudySync. Todos los derechos reservados.
          </p>
          <nav aria-label="Legal">
            <ul className="flex space-x-6 text-sm text-muted-foreground">
              {LEGAL_LINKS.map((link) => (
                <li key={link.name}>
                  <CustomLink
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
