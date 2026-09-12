import { auth } from '@/auth';
import { getRoleNavigation } from '@/config/dashboard-navigation';
import SidebarBrand from './SidebarBrand';
import SidebarNav from './SidebarNav';
import SidebarUserMenu from './SidebarUserMenu';

export default async function SideBar() {
  // 1. Obtenemos la sesión del servidor usando Auth.js
  const session = await auth();

  // 2. Extraemos el rol del usuario (ajusta según la estructura de tu objeto user, ej: session?.user?.role)
  const role = session?.user?.role;

  // 3. Obtenemos la configuración del menú correspondiente al rol
  const navConfig = getRoleNavigation(role);

  // Datos del usuario para el menú inferior
  const userData = {
    name: session?.user?.name || 'Usuario',
    email: session?.user?.email || 'correo@studysync.com',
    image: session?.user?.image,
    roleLabel: navConfig.roleLabel,
  };

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-200">
      {/* Sección Superior: Marca / Logo y enlace al Dashboard */}
      <div>
        <SidebarBrand
          dashboardPath={navConfig.dashboardPath}
          panelTitle={navConfig.panelTitle}
        />

        {/* Sección Central: Navegación dinámica basada en el rol */}
        <SidebarNav items={navConfig.menu} />
      </div>

      {/* Sección Inferior: Avatar, información y submenú (Perfil, Config, Logout) */}
      <SidebarUserMenu user={userData} />
    </aside>
  );
}
