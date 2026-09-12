import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Eye,
  EyeOff,
  GlobeCheck,
  GraduationCap,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  User,
  UserCog,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';

export const IconMap = {
  ui: {
    arrowRight: ArrowRight,
    menu: Menu,
    close: X,
    play: Play,
    zap: Zap,
    graduationCap: GraduationCap,
    brain: BrainCircuit,
    target: Target,
    checkCircle: CheckCircle2,
    shield: ShieldCheck,
    star: Star,
    message: MessageCircle,
    video: Video,
    calendar: CalendarDays,
    clock: Clock3,
    bot: Bot,
    sparkles: Sparkles,
    users: Users,
    eye: Eye,
    eyeOff: EyeOff,
    lock: LockKeyhole,
    mail: Mail,
    user: User,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
  },
  social: {
    globecheck: GlobeCheck, // TODO: temporal para evitar errores de TS en Button
  },
  dashboard: {
    bookOpen: BookOpen,
    video: Video,
    calendar: CalendarDays,
    message: MessageCircle,
    clipboard: ClipboardList,
    timer: Timer,
    users: Users,
    graduationCap: GraduationCap,
    userCog: UserCog,
    barChart: BarChart3,
  },
} as const;

export type IconCategory = keyof typeof IconMap;

/** Tipados específicos por categoría para evitar errores de índice cruzado */
export type UiIconName = keyof (typeof IconMap)['ui'];
export type SocialIconName = keyof (typeof IconMap)['social'];
export type DashboardIconName = keyof (typeof IconMap)['dashboard'];

/** Unión global de nombres para compatibilidad general si es requerida */
export type IconName = UiIconName | SocialIconName | DashboardIconName;
