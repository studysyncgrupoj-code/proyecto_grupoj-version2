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
        className={`border-border bg-background text-foreground flex h-screen flex-col justify-between border-r transition-[width] duration-200 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <Button
          variant="ghost"
          size="sm"
          icon={collapsed ? 'chevronRight' : 'chevronLeft'}
          aria-label={collapsed ? 'Mostrar menú' : 'Ocultar menú'}
          onClick={toggleCollapsed}
          className="mt-2 mr-2 self-end"
        />

        {children}
      </aside>
    </SidebarContext.Provider>
  );
}
