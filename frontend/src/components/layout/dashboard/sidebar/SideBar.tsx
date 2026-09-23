import { auth } from '@/auth';
import { getRoleNavigation } from '@/config/dashboard-navigation';
import MobileNav from './Mobilenav';
import PlanCard from './PlanCard';
import SidebarBrand from './SidebarBrand';
import SidebarNav from './SidebarNav';
import SidebarShell from './SidebarShell';
import SidebarUserMenu from './SidebarUserMenu';

export default async function SideBar() {
  const session = await auth();
  const role = session?.user?.role;
  const navConfig = getRoleNavigation(role);

  const subscription = session?.user?.subscription;

  const userData = {
    name: session?.user?.name || 'Usuario',
    email: session?.user?.email || 'correo@studysync.com',
    image: session?.user?.image,
    roleLabel: navConfig.roleLabel,
  };

  return (
    <>
      <SidebarShell>
        <div>
          <SidebarBrand />
          <SidebarNav
            items={navConfig.menu}
            panelTitle={navConfig.panelTitle}
          />
        </div>
        {subscription && <PlanCard subscription={subscription} />}
        <SidebarUserMenu user={userData} />
      </SidebarShell>
      <MobileNav items={navConfig.menu} user={userData} />
    </>
  );
}
