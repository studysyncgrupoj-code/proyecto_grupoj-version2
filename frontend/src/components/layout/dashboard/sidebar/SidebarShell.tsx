'use client';

import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { SidebarContext } from './SidebarContext';

export default function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem('studysync-sidebar-collapsed') === 'true';
    // eslint-disable-next-line -- sincroniza estado con localStorage (sistema externo) en el montaje inicial, caso válido según react.dev
    setCollapsed(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('studysync-sidebar-collapsed', String(collapsed));
    document.documentElement.style.setProperty(
      '--ss-sidebar-current-width',
      collapsed ? '82px' : '270px',
    );
  }, [collapsed, hydrated]);

  const toggleCollapsed = () => setCollapsed((c) => !c);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      <aside
        className={`border-border bg-background text-foreground relative flex h-screen flex-col justify-between border-r shadow-[18px_0_45px_color-mix(in_oklch,var(--foreground)_12%,transparent)] transition-[width] duration-200 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <Button
          variant="primary"
          size="sm"
          icon={collapsed ? 'chevronRight' : 'chevronLeft'}
          aria-label={collapsed ? 'Mostrar menú' : 'Ocultar menú'}
          onClick={toggleCollapsed}
          className="absolute top-6 -right-3.5 z-20 h-7 w-7 rounded-full p-0 shadow-md"
        />

        {children}
      </aside>
    </SidebarContext.Provider>
  );
}
