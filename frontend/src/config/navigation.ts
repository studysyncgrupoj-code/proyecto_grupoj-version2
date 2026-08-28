export const INTERNAL_ROUTES = [
  "/",
  "/rooms",
  "/benefits",
  "/testimonials",
  "/contact",
  "/register",
  "/login",
] as const;

export type InternalHref = (typeof INTERNAL_ROUTES)[number];

export type NavigationLabelKey =
  | "Inicio"
  | "Habitaciones"
  | "Beneficios"
  | "Testimonios"
  | "Contacto"
  | "Registrarse"
  | "Iniciar sesión";

interface BaseNavLink {
  labelKey: NavigationLabelKey;
  hideInHeader?: boolean;
  /** Determina si la coincidencia de la ruta debe ser exacta */
  exact?: boolean;
}

export type NavLink = BaseNavLink & {
  href: InternalHref | `#${string}` | `http${string}` | (string & {});
};

export const NAVIGATION_MAP = [
  { href: "/", labelKey: "Inicio", exact: true },
  { href: "/rooms", labelKey: "Habitaciones" },
  { href: "/benefits", labelKey: "Beneficios" },
  { href: "/testimonials", labelKey: "Testimonios" },
  { href: "/contact", labelKey: "Contacto" },
  { href: "/register", labelKey: "Registrarse", hideInHeader: true },
  { href: "/login", labelKey: "Iniciar sesión", hideInHeader: true },
] satisfies NavLink[];

export const HEADER_LINKS = NAVIGATION_MAP.filter((link) => !link.hideInHeader);

export type MapHref = (typeof NAVIGATION_MAP)[number]["href"];

/**
 * Determina si una ruta de navegación está activa basándose en el pathname actual.
 * Maneja coincidencia exacta, parcial por sub-rutas y descarta enlaces externos o hashes.
 */
export function isNavLinkActive(pathname: string, link: NavLink): boolean {
  const { href, exact } = link;

  if (href === "#" || href.startsWith("http") || href.startsWith("#"))
    return false;
  if (exact) return pathname === href;
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}
