import {
  HiAcademicCap,
  HiArrowRight,
  HiBars3,
  HiBolt,
  HiBookOpen,
  HiCalendar,
  HiChartBar,
  HiChatBubbleLeft,
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
  HiClipboardDocumentList,
  HiClock,
  HiCpuChip,
  HiEnvelope,
  HiEye,
  HiEyeSlash,
  HiFlag,
  HiGlobeAlt,
  HiLockClosed,
  HiPlay,
  HiShieldCheck,
  HiSparkles,
  HiStar,
  HiUser,
  HiUsers,
  HiVideoCamera,
  HiXMark,
} from 'react-icons/hi2';

export const IconMap = {
  ui: {
    arrowRight: HiArrowRight,
    menu: HiBars3,
    close: HiXMark,
    play: HiPlay,
    zap: HiBolt,
    graduationCap: HiAcademicCap,
    brain: HiCpuChip,
    target: HiFlag,
    checkCircle: HiCheckCircle,
    shield: HiShieldCheck,
    star: HiStar,
    message: HiChatBubbleLeft,
    video: HiVideoCamera,
    calendar: HiCalendar,
    clock: HiClock,
    bot: HiCpuChip,
    sparkles: HiSparkles,
    users: HiUsers,
    eye: HiEye,
    eyeOff: HiEyeSlash,
    lock: HiLockClosed,
    mail: HiEnvelope,
    user: HiUser,
    chevronLeft: HiChevronLeft,
    chevronRight: HiChevronRight,
  },
  social: {
    globecheck: HiGlobeAlt, // TODO: temporal para evitar errores de TS en Button
  },
  dashboard: {
    bookOpen: HiBookOpen,
    video: HiVideoCamera,
    calendar: HiCalendar,
    message: HiChatBubbleLeft,
    clipboard: HiClipboardDocumentList,
    timer: HiClock,
    users: HiUsers,
    graduationCap: HiAcademicCap,
    userCog: HiUser, // Equivalente de configuración de usuario
    barChart: HiChartBar,
  },
} as const;

export type IconCategory = keyof typeof IconMap;

/** Tipados específicos por categoría para evitar errores de índice cruzado */
export type UiIconName = keyof (typeof IconMap)['ui'];
export type SocialIconName = keyof (typeof IconMap)['social'];
export type DashboardIconName = keyof (typeof IconMap)['dashboard'];

/** Unión global de nombres para compatibilidad general si es requerida */
export type IconName = UiIconName | SocialIconName | DashboardIconName;
