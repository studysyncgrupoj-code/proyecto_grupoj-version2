// dashboard-navigation.ts
import { DashboardIconName } from '@/lib/iconMap';
import type { UserRole } from '@/types/next-auth';

export interface NavItem {
  label: string;
  path: string;
  icon: DashboardIconName;
}

/* =========================================================
   1. MENÚ ESTUDIANTE
   ========================================================= */
export const studentMenu: NavItem[] = [
  {
    label: 'Courses',
    path: '/courses',
    icon: 'bookOpen',
  },
  {
    label: 'Study Rooms',
    path: '/rooms',
    icon: 'video',
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: 'calendar',
  },
  {
    label: 'Messages',
    path: '/messages',
    icon: 'message',
  },
  {
    label: 'Academic Management',
    path: '/academic-management',
    icon: 'clipboard',
  },
  {
    label: 'Pomodoro',
    path: '/pomodoro',
    icon: 'timer',
  },
];

/* =========================================================
   2. MENÚ PROFESOR
   ========================================================= */
export const professorMenu: NavItem[] = [
  {
    label: 'Courses',
    path: '/courses',
    icon: 'bookOpen',
  },
  {
    label: 'Study Rooms',
    path: '/rooms',
    icon: 'video',
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: 'calendar',
  },
  {
    label: 'Messages',
    path: '/messages',
    icon: 'message',
  },
  {
    label: 'Academic Management',
    path: '/academic-management',
    icon: 'clipboard',
  },
  {
    label: 'Students',
    path: '/students',
    icon: 'users',
  },
];

/* =========================================================
   3. MENÚ ADMINISTRADOR
   ========================================================= */
export const adminMenu: NavItem[] = [
  {
    label: 'Users',
    path: '/users',
    icon: 'users',
  },
  {
    label: 'Professors',
    path: '/professors',
    icon: 'graduationCap',
  },
  {
    label: 'Students',
    path: '/students-admin',
    icon: 'userCog',
  },
  {
    label: 'Courses',
    path: '/courses-admin',
    icon: 'bookOpen',
  },
  {
    label: 'Academic Center',
    path: '/academic-center',
    icon: 'clipboard',
  },
  {
    label: 'Rooms',
    path: '/rooms',
    icon: 'video',
  },
  {
    label: 'Reports & Audit',
    path: '/reports',
    icon: 'barChart',
  },
];

/* =========================================================
   UTILIDAD DE CONFIGURACIÓN POR ROL
   ========================================================= */
export function getRoleNavigation(role: UserRole | string | null | undefined) {
  const normalized = String(role ?? '')
    .trim()
    .toLowerCase();

  if (normalized === 'admin') {
    return {
      type: 'admin' as const,
      menu: adminMenu,
      dashboardPath: '/dashboard-admin',
      panelTitle: 'Panel del administrador',
      roleLabel: 'Administrador',
    };
  }

  if (normalized === 'teacher') {
    return {
      type: 'professor' as const,
      menu: professorMenu,
      dashboardPath: '/dashboard',
      panelTitle: 'Panel del profesor',
      roleLabel: 'Profesor',
    };
  }

  // 'student' o cualquier valor no reconocido → estudiante por defecto
  return {
    type: 'student' as const,
    menu: studentMenu,
    dashboardPath: '/dashboard-estudiante',
    panelTitle: 'Panel del estudiante',
    roleLabel: 'Estudiante',
  };
}
