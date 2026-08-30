import { IconMap } from '@/lib/iconMap';
import { CustomLink } from '../ui/Link';

const FOOTER_LINKS = [
  {
    title: 'Plataforma',
    links: [
      { name: 'Cursos', href: '#' },
      { name: 'Rutas de Aprendizaje', href: '#' },
      { name: 'Precios', href: '#' },
    ],
  },
  {
    title: 'Comunidad',
    links: [
      { name: 'Acerca de', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Foro', href: '#' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { name: 'Centro de Ayuda', href: '#' },
      { name: 'Contacto', href: '#' },
      { name: 'Estado', href: '#' },
    ],
  },
];

const LEGAL_LINKS = [
  { name: 'Privacidad', href: '#' },
  { name: 'Términos', href: '#' },
];

export default function Footer() {
  const GraduationCap = IconMap.ui.graduationCap;

  return (
    <footer className="bg-background border-border mt-auto w-full border-t px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <section className="md:col-span-1">
            <CustomLink
              href="/"
              className="inline-flex w-fit items-center gap-3"
              aria-label="StudySync - Ir al inicio"
            >
              <span className="border-accent-foreground text-primary-foreground from-primary grid h-10 w-10 place-items-center rounded-xl border bg-linear-to-br to-blue-900 shadow-lg">
                <GraduationCap size={32} strokeWidth={2} />
              </span>
              <span className="leading-none">
                <span className="text-foreground block text-base font-bold tracking-tight">
                  StudySync
                </span>
                <span className="text-muted-foreground mt-1 hidden text-[0.6rem] tracking-wide sm:block">
                  Aprende. Conecta. Avanza.
                </span>
              </span>
            </CustomLink>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              Plataforma educativa moderna construida para potenciar el
              aprendizaje y la colaboración en línea.
            </p>
          </section>

          {FOOTER_LINKS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="font-heading text-foreground mb-4 font-semibold">
                {section.title}
              </h2>
              <ul className="text-muted-foreground space-y-3 text-sm">
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

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2026 StudySync. Todos los derechos reservados.
          </p>
          <nav aria-label="Legal">
            <ul className="text-muted-foreground flex space-x-6 text-sm">
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
