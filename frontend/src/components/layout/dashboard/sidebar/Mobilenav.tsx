'use client';

import type { NavItem } from '@/config/dashboard-navigation';
import { IconMap } from '@/lib/iconMap';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import MoreSheet from './Moresheet';

interface MobileNavProps {
  items: NavItem[];
  user: {
    name: string;
    email: string;
    image?: string | null;
    roleLabel: string;
  };
}

// Cantidad total de accesos directos visibles (incluye "Inicio") antes de agrupar en "Más"
const MAX_PRIMARY_ITEMS = 4;

// En escritorio el logo enlaza a la raíz del dashboard; en mobile no hay logo
// visible en la barra, así que reservamos el primer slot para ese acceso.
const HOME_ITEM: NavItem = {
  label: 'Inicio',
  path: '/dashboard',
  icon: 'graduationCap',
};

type IconComponentType = React.ComponentType<{
  size?: number;
  className?: string;
}>;

// Misma estrategia de búsqueda de icono que SidebarNav.tsx
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

export default function MobileNav({ items, user }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Evita un duplicado si algún día el propio menú del rol define '/dashboard'
  const roleItems = items.filter((item) => item.path !== HOME_ITEM.path);
  const maxRoleItems = MAX_PRIMARY_ITEMS - 1; // 1 slot reservado para "Inicio"

  const primaryItems = [HOME_ITEM, ...roleItems.slice(0, maxRoleItems)];
  const moreItems = roleItems.slice(maxRoleItems);

  // Cierra el panel "Más" al navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquea el scroll de fondo mientras el panel está abierto
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isItemActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {primaryItems.map((item) => {
          const Icon = getIconComponent(item.icon);
          const active = isItemActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={active ? 'page' : undefined}
              className="flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-1"
            >
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-xl transition-colors duration-200',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground-muted',
                )}
              >
                {Icon && <Icon size={20} />}
              </span>
              <span
                className={cn(
                  'max-w-16 truncate text-[10px] leading-none font-semibold',
                  active ? 'text-primary' : 'text-foreground-muted',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {moreItems.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-1"
          >
            <span
              className={cn(
                'grid size-9 place-items-center rounded-xl transition-colors duration-200',
                open ? 'bg-primary/10 text-primary' : 'text-foreground-muted',
              )}
            >
              <HiEllipsisHorizontal size={22} />
            </span>
            <span
              className={cn(
                'text-[10px] leading-none font-semibold',
                open ? 'text-primary' : 'text-foreground-muted',
              )}
            >
              Más
            </span>
          </button>
        )}
      </nav>

      <MoreSheet
        open={open}
        onClose={() => setOpen(false)}
        items={moreItems}
        user={user}
        isItemActive={isItemActive}
      />
    </>
  );
}
