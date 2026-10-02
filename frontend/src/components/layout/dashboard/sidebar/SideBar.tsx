import { auth } from '@/auth';
import Logo from '@/components/ui/logo';
import { getRoleNavigation } from '@/config/dashboard-navigation';
import { getTranslations } from 'next-intl/server';
import MobileNav from './Mobilenav';
import PlanCard from './PlanCard';
import SidebarBrand from './SidebarBrand';
import SidebarNav from './SidebarNav';
import SidebarShell from './SidebarShell';
import SidebarUserMenu from './SidebarUserMenu';

export default async function SideBar() {
  const [session, t, navT, logoT] = await Promise.all([
    auth(),
    getTranslations('dashboard.sidebar'),
    getTranslations('dashboard.navigation'),
    getTranslations('logo'),
  ]);
  const role = session?.user?.role;
  const navConfig = getRoleNavigation(role);
  const roleLabel = navT(`roles.${navConfig.type}`);
  const panelTitle = navT(`panel.${navConfig.type}`);
  const items = navConfig.menu.map((item) => ({
    ...item,
    label: navT(`items.${item.label}`),
  }));

  const subscription = session?.user?.subscription;

  const userData = {
    name: session?.user?.name || t('guestName'),
    email: session?.user?.email || t('guestEmail'),
    image: session?.user?.image,
    roleLabel,
  };
  const planMessages = {
    current: t('currentPlan'),
    free: {
      name: t('plans.free.name'),
      description: t('plans.free.description'),
    },
    premium: {
      name: t('plans.premium.name'),
      description: t('plans.premium.description'),
    },
    enterprise: {
      name: t('plans.enterprise.name'),
      description: t('plans.enterprise.description'),
    },
    upgrade: t('actions.upgrade'),
    manage: t('actions.manage'),
  };
  const sidebarLabels = {
    showMenu: t('showMenu'),
    hideMenu: t('hideMenu'),
    signOut: t('signOut'),
    navigation: t('navigationLabel'),
    more: t('more'),
    moreOptions: t('moreOptions'),
    theme: t('theme'),
  };

  return (
    <>
      <SidebarShell labels={sidebarLabels}>
        <div>
          <SidebarBrand
            fullLogo={<Logo variant="full" />}
            compactLogo={<Logo variant="compact" />}
          />
          <SidebarNav items={items} panelTitle={panelTitle} />
        </div>
        {subscription && (
          <PlanCard subscription={subscription} messages={planMessages} />
        )}
        <SidebarUserMenu user={userData} signOutLabel={sidebarLabels.signOut} />
      </SidebarShell>
      <MobileNav
        items={items}
        user={userData}
        homePath="/dashboard"
        homeLabel={navT('home')}
        labels={sidebarLabels}
      />
    </>
  );
}
