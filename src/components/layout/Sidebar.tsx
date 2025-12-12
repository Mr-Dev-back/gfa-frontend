import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
    LayoutDashboard,
    Truck,
    ListOrdered,
    Package,
    Scale,
    History,
    Settings,
    ChevronLeft,
    Menu,
    LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../stores/useAuthStore';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['SUPERVISOR', 'ADMIN'] },
    { label: 'Entrée Camion', icon: Truck, path: '/entry', roles: ['CONTROL_AGENT', 'SUPERVISOR', 'ADMIN'] },
    { label: 'File d\'Attente', icon: ListOrdered, path: '/queue', roles: ['SUPERVISOR', 'CONTROL_AGENT', 'PARK_AGENT', 'ADMIN'] },
    { label: 'Parc Expédition', icon: Package, path: '/shipping', roles: ['PARK_AGENT', 'SUPERVISOR', 'ADMIN'] },
    { label: 'Pesée', icon: Scale, path: '/weighing', roles: ['WEIGHING_AGENT', 'SUPERVISOR', 'ADMIN'] },
    { label: 'Historique', icon: History, path: '/history', roles: ['SUPERVISOR', 'ADMIN'] },
    { label: 'Administration', icon: Settings, path: '/admin', roles: ['ADMIN'] },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-40 h-screen bg-secondary text-secondary-foreground transition-all duration-300 flex flex-col shadow-xl",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-foreground/10">
                {!collapsed && <span className="text-xl font-bold tracking-tight text-white">GFA App</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-secondary-foreground hover:bg-secondary-foreground/10"
                >
                    {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>

            <nav className="flex-1 space-y-1 p-2 py-4">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group",
                            isActive
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-2 border-t border-secondary-foreground/10">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-danger hover:bg-danger/10 hover:text-danger",
                        collapsed && "justify-center px-0"
                    )}
                    onClick={logout}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="ml-3">Déconnexion</span>}
                </Button>
            </div>
        </aside>
    );
}
