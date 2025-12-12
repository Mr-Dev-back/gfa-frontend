import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuthStore } from '../../stores/useAuthStore';
import { cn } from '../../lib/utils';

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore();

    // Protect routes
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 min-h-screen",
                collapsed ? "pl-16" : "pl-64"
            )}>
                <Topbar />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
