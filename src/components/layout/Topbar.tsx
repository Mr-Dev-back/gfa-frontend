import { useAuthStore } from '../../stores/useAuthStore';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export function Topbar() {
    const { user } = useAuthStore();

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-border shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                    <Input placeholder="Rechercher..." className="pl-9 bg-background/50 border-transparent focus:bg-background" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-text-muted">Système Connecté</span>
                </div>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-text-muted" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger border border-surface" />
                </Button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-text-main">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-text-muted capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Invité'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </div>
        </header>
    );
}
