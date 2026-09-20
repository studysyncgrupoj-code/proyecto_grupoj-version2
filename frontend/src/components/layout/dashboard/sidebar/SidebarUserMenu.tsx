'use client';

import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/utilities/cn';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSidebar } from './SidebarContext';

interface SidebarUserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    roleLabel: string;
  };
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function SidebarUserMenu({ user }: SidebarUserMenuProps) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        'border-border flex flex-col gap-3 overflow-hidden border-t p-3',
        collapsed && 'items-center px-0',
      )}
    >
      {/* Avatar + datos */}
      <Link
        href="/settings"
        className={cn('flex items-center gap-3', collapsed && 'justify-center')}
        title={collapsed ? `${user.name} · ${user.roleLabel}` : undefined}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={40}
            height={40}
            unoptimized
            referrerPolicy="no-referrer"
            className="border-border h-10 w-10 shrink-0 rounded-full border object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          >
            {getInitials(user.name)}
          </span>
        )}

        {!collapsed && (
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm leading-tight font-bold">
              {user.name}
            </p>
            <p className="text-foreground-subtle truncate text-xs">
              {user.email}
            </p>
            <p className="text-foreground-muted truncate text-xs font-medium">
              {user.roleLabel}
            </p>
          </div>
        )}
      </Link>

      {/* Tema + cierre de sesión */}
      <div
        className={cn(
          'flex items-center gap-2',
          collapsed ? 'flex-col' : 'justify-between',
        )}
      >
        <ThemeToggle size="sm" />
        <Button
          variant="ghost"
          size="md"
          icon="arrowRightOnRectangle"
          aria-label="Cerrar sesión"
          title={collapsed ? 'Cerrar sesión' : undefined}
          fullWidth={!collapsed}
          onClick={() => signOut()}
          className={cn(
            collapsed ? 'w-10 px-0' : 'flex-1 justify-start px-3',
            'hover:text-danger',
          )}
        >
          {!collapsed && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );
}
