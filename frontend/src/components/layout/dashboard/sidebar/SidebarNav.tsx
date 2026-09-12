import type { NavItem } from '@/config/dashboard-navigation';

interface SidebarNavProps {
  items: NavItem[];
}

export default function SidebarNav({ items }: SidebarNavProps) {
  return <div>{/* items.map(...) */}</div>;
}
