'use client';

import type { NavItem } from '@/config/dashboard-navigation';
import { IconMap } from '@/lib/iconMap';
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
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            title={collapsed ? item.label : undefined}
            className={`text-muted-foreground hover:border-accent/30 hover:bg-accent/[7.5%] hover:text-foreground flex min-h-11.5 items-center gap-3 overflow-hidden rounded-[13px] border border-transparent px-3.5 text-sm leading-tight font-bold whitespace-nowrap transition-all duration-200 hover:translate-x-0.75 hover:shadow-[inset_3px_0_0_var(--accent),0_10px_24px_rgba(0,0,0,0.22)] ${
              collapsed ? 'justify-center px-0' : ''
            } ${
              isActive
                ? 'border-accent/40 from-accent/15 to-primary/5 text-foreground bg-linear-to-r shadow-[inset_3px_0_0_var(--accent),0_12px_28px_rgba(0,0,0,0.24),0_0_22px_rgba(14,165,233,0.08)]'
                : ''
            }`}
          >
            {IconComponent && (
              <IconComponent className="shrink-0" size={19} strokeWidth={2} />
            )}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
