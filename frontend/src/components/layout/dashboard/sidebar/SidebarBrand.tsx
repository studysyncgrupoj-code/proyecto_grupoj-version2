'use client';

import Logo from '@/components/ui/logo';
import { useSidebar } from './SidebarContext';

export default function SidebarBrand() {
  const { collapsed } = useSidebar();

  return (
    <div className="flex items-center overflow-hidden p-4">
      {/* Usamos 'variant' basándonos en si está contraído o no */}
      <Logo variant={collapsed ? 'compact' : 'full'} />
    </div>
  );
}
