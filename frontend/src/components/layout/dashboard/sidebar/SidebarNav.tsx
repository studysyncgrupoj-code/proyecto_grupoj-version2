'use client';

import type { NavItem } from '@/config/dashboard-navigation';
import { IconMap } from '@/lib/iconMap';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';

interface SidebarNavProps {
  items: NavItem[];
  panelTitle?: string;
}

type IconComponentType = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

// Función auxiliar para buscar el icono de forma segura sin usar 'any'
function getIconComponent(iconName: NavItem['icon']): IconComponentType | null {
  for (const group of Object.values(IconMap)) {
    if (group && typeof group === 'object' && iconName in group) {
      const found = (group as Record<string, unknown>)[iconName];
      if (
        typeof found === 'function' ||
        (typeof found === 'object' && found !== null)
      ) {
        return found as IconComponentType;
      }
    }
  }
  return null;
}

export default function SidebarNav({ items, panelTitle }: SidebarNavProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <nav className="grid gap-1.5 px-3" aria-label={panelTitle}>
      {items.map((item) => {
        const IconComponent = getIconComponent(item.icon);
        // Prefijo con '/' para que '/students' no active '/students-admin'
        const isActive =
          pathname === item.path || pathname.startsWith(`${item.path}/`);

        return (
          <Link
            key={item.path}
            href={item.path}
            title={collapsed ? item.label : undefined}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'text-foreground-muted hover:border-border hover:bg-surface-hover hover:text-foreground flex min-h-11.5 items-center gap-3 overflow-hidden rounded-[13px] border border-transparent px-3.5 text-sm leading-tight font-bold whitespace-nowrap transition-all duration-200',
              collapsed && 'justify-center px-0',
              isActive &&
                'border-border-focus bg-surface-active text-foreground hover:border-border-focus hover:bg-surface-active',
            )}
          >
            {IconComponent && (
              <IconComponent className="shrink-0 text-foreground" size={19}/>
            )}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
