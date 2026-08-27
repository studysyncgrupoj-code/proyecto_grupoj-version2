import { ArrowRight, GraduationCap, Menu, X, GlobeCheck } from "lucide-react";

export const IconMap = {
  ui: {
    arrowRight: ArrowRight,
    graduationCap: GraduationCap,
    menu: Menu,
    close: X,
  },
  social: {
    globecheck: GlobeCheck // TODO: temporal para evitar errores de TS en Button
  },
} as const;

export type IconCategory = keyof typeof IconMap;

/** Tipados específicos por categoría para evitar errores de índice cruzado */
export type UiIconName = keyof (typeof IconMap)["ui"];
export type SocialIconName = keyof (typeof IconMap)["social"];

/** Unión global de nombres para compatibilidad general si es requerida */
export type IconName = UiIconName | SocialIconName;
