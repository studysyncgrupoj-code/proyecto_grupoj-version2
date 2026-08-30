import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
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
  User,
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
  },
  social: {
    globecheck: GlobeCheck, // TODO: temporal para evitar errores de TS en Button
  },
} as const;

export type IconCategory = keyof typeof IconMap;

/** Tipados específicos por categoría para evitar errores de índice cruzado */
export type UiIconName = keyof (typeof IconMap)['ui'];
export type SocialIconName = keyof (typeof IconMap)['social'];

/** Unión global de nombres para compatibilidad general si es requerida */
export type IconName = UiIconName | SocialIconName;
