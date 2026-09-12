import { auth } from '@/auth';
import { getRoleNavigation } from '@/config/dashboard-navigation';
import SidebarBrand from './SidebarBrand';
import SidebarNav from './SidebarNav';
import SidebarShell from './SidebarShell';
import SidebarUserMenu from './SidebarUserMenu';

export default async function SideBar() {
  const session = await auth();
  const role = session?.user?.role;
  const navConfig = getRoleNavigation(role);

  const userData = {
    name: session?.user?.name || 'Usuario',
    email: session?.user?.email || 'correo@studysync.com',
    image: session?.user?.image,
    roleLabel: navConfig.roleLabel,
  };

  return (
    <SidebarShell>
      <div>
        <SidebarBrand
          dashboardPath={navConfig.dashboardPath}
          panelTitle={navConfig.panelTitle}
        />
        <SidebarNav items={navConfig.menu} />
      </div>

      <SidebarUserMenu user={userData} />
    </SidebarShell>
  );
}
