// components/SidebarUserMenu.tsx
interface SidebarUserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    roleLabel: string;
  };
}

export default function SidebarUserMenu({ user }: SidebarUserMenuProps) {
  return <div>{/* user.name, user.email, ... */}</div>;
}