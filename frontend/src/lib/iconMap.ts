import { ArrowRight, GraduationCap, Menu, X } from "lucide-react";

export const IconMap = {
  ui: {
    arrowRight: ArrowRight,
    graduationCap: GraduationCap,
    menu: Menu,
    close: X,
  },
} as const;

export type IconCategory = keyof typeof IconMap;
export type UiIconName = keyof (typeof IconMap)["ui"];
export type IconName = UiIconName;
