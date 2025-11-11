import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  BookOpen,
  Folder,
  LayoutDashboard,
  Users,
  PawPrint,
  CalendarCheck2,
  Clock,
  Stethoscope,
  Stamp,
  ShieldCheck,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutDashboard,
    permission: 'access.dashboard',
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    permission: 'access.users',
  },
  {
    title: 'Roles',
    href: '/roles',
    icon: Stamp,
    permission: 'access.roles',

  },
  {
    title: 'Pets',
    href: '/pets',
    icon: PawPrint,
     permission: 'access.pets',
  },
  {
    title: 'Appointments',
    href: '/appointments',
    icon: Clock,
     permission: 'access.appointments',
    
  },
  {
    title: 'Services',
    href: '/services',
    icon: Stethoscope,
     permission: 'access.services',
  },
  {
    title: 'Schedules',
    href: '/schedules',
    icon: CalendarCheck2,
    permission: 'access.schedules',
  },
  {
    title: 'Permissions',
    href: '/permissions',
    icon: ShieldCheck,
    permission: 'access.permissions',
  },
  {
    title: 'History',
    href: '/history',
    icon: Clock,
     permission: 'access.history',
    
  },
];

const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/SirJmss/Capstone-FureverHealth.git',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  // ✅ read the permissions from backend
  const userPermissions = user?.permissions || [];

  //  filter the items based on user's permission
 const filteredNavItems = mainNavItems.filter(
  (item) =>
    !item.permission || userPermissions.includes(item.permission)
);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* ✅ use filteredNavItems instead of mainNavItems */}
        <NavMain items={filteredNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
