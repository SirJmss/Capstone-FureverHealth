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
import { BookOpen, Folder, LayoutGrid, Users, CalendarCheck2, Clock,Stamp } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permission: 'Access-dashboard',
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        permission: 'Access-Users',
    },
    {   
         title: 'Roles',
        href: '/roles',
        icon: Stamp,
        permission: 'Access-Roles'
    },
    {
        title: 'Apppointments',
        href: '/appointments',
        icon: Clock,
        permission: 'Access-Appointments'
    },
    {
        title: 'Schedules',
        href: '/schedules',
        icon: CalendarCheck2,
        permission: 'Access-Schedules'
    },
        {
        title: 'Permissions',
        href: '/permissions',
        icon: CalendarCheck2,
        permission: 'Access-Permissions'
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
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
    console.log(auth);
    const permissions = auth.permissions || [];
    const permissionNames = permissions.map(permission=>permission.name);
    const filteredNavItems = mainNavItems.filter((item)=>!item.permission||permissionNames.includes(item.permission));

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
