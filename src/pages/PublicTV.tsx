import { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Megaphone, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTruckStore } from '../stores/useTruckStore';

const mockAlerts = [
    { id: 2, message: "Pause déjeuner de 12h00 à 14h00", type: 'warning' },
];

export default function PublicTV() {
    const { getCalledTrucks, getQueuedTrucks } = useTruckStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeIndex, setActiveIndex] = useState(0);

    const calledTrucks = getCalledTrucks();
    const queuedTrucks = getQueuedTrucks();

    const alerts = [
        ...calledTrucks.slice(0, 1).map(t => ({
            id: t.id,
            message: `Camion ${t.plate} → Zone ${t.zone} - ${t.status === 'LOADING' ? 'Chargement en cours' : 'Veuillez vous présenter'}`,
            type: 'info' as const
        })),
        ...mockAlerts
    ];

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const rotateInterval = setInterval(() => {
            if (calledTrucks.length > 0) {
                setActiveIndex(prev => (prev + 1) % calledTrucks.length);
            }
        }, 5000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(rotateInterval);
        };
    }, [calledTrucks.length]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-secondary p-6 text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                        <Truck className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">GFA Logistics</h1>
                        <p className="text-secondary-foreground/60 text-sm">Gestion de Flux Camions</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-mono font-bold text-primary">{formatTime(currentTime)}</p>
                    <p className="text-secondary-foreground/60 capitalize">{formatDate(currentTime)}</p>
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="mb-6 space-y-2">
                    {alerts.map(alert => (
                        <div 
                            key={alert.id}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl animate-pulse",
                                alert.type === 'warning' ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                            )}
                        >
                            {alert.type === 'warning' ? 
                                <AlertTriangle className="h-6 w-6 shrink-0" /> : 
                                <Megaphone className="h-6 w-6 shrink-0" />
                            }
                            <p className="text-lg font-medium">{alert.message}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Megaphone className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold uppercase tracking-wider text-secondary-foreground/60">
                            Camions Appelés ({calledTrucks.length})
                        </h2>
                    </div>

                    {calledTrucks.length === 0 ? (
                        <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
                            <Truck className="h-16 w-16 text-secondary-foreground/30 mx-auto mb-4" />
                            <p className="text-secondary-foreground/50 text-lg">Aucun camion appelé</p>
                        </div>
                    ) : (
                        calledTrucks.map((truck, index) => (
                            <div 
                                key={truck.id}
                                className={cn(
                                    "p-6 rounded-2xl transition-all duration-500",
                                    index === activeIndex 
                                        ? "bg-primary scale-105 shadow-2xl shadow-primary/30" 
                                        : truck.status === 'LOADING' 
                                            ? "bg-success/20 border border-success/30"
                                            : "bg-white/5 border border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "h-20 w-20 rounded-2xl flex items-center justify-center",
                                            index === activeIndex ? "bg-white/20" : "bg-white/10"
                                        )}>
                                            <Truck className={cn(
                                                "h-10 w-10",
                                                index === activeIndex ? "text-white" : "text-primary"
                                            )} />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "text-4xl font-mono font-bold tracking-wider",
                                                index === activeIndex ? "text-white" : "text-white/90"
                                            )}>
                                                {truck.plate}
                                            </p>
                                            <p className={cn(
                                                "text-lg mt-1",
                                                index === activeIndex ? "text-white/80" : "text-secondary-foreground/60"
                                            )}>
                                                {truck.client}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold",
                                            index === activeIndex 
                                                ? "bg-white/20 text-white" 
                                                : truck.status === 'LOADING'
                                                    ? "bg-success text-white"
                                                    : "bg-warning text-secondary"
                                        )}>
                                            <MapPin className="h-5 w-5" />
                                            Zone {truck.zone || 'A1'}
                                        </div>
                                        <p className={cn(
                                            "text-sm mt-2",
                                            index === activeIndex ? "text-white/60" : "text-secondary-foreground/40"
                                        )}>
                                            {truck.status === 'LOADING' ? 'En cours de chargement' : 'Veuillez vous présenter'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-text-muted" />
                        <h2 className="text-lg font-semibold uppercase tracking-wider text-secondary-foreground/60">
                            Prochains Camions ({queuedTrucks.length})
                        </h2>
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        {queuedTrucks.slice(0, 8).map((truck, index) => (
                            <div 
                                key={truck.id}
                                className={cn(
                                    "flex items-center gap-4 p-4 border-b border-white/5 last:border-0",
                                    index === 0 && "bg-primary/10"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xl",
                                    truck.priority === 'critical' ? "bg-danger text-white" :
                                    truck.priority === 'urgent' ? "bg-warning text-black" :
                                    index === 0 ? "bg-primary text-white" : "bg-white/10 text-secondary-foreground/60"
                                )}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-mono font-bold text-lg">{truck.plate}</p>
                                    <p className="text-sm text-secondary-foreground/50">{truck.client}</p>
                                </div>
                            </div>
                        ))}
                        {queuedTrucks.length === 0 && (
                            <div className="p-8 text-center text-secondary-foreground/50">
                                Aucun camion en attente
                            </div>
                        )}
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                        <p className="text-5xl font-bold text-primary">{queuedTrucks.length + calledTrucks.length}</p>
                        <p className="text-secondary-foreground/60 mt-2">Camions en attente</p>
                    </div>
                </div>
            </div>

            {calledTrucks.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {calledTrucks.map((_, index) => (
                        <div 
                            key={index}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                index === activeIndex ? "w-8 bg-primary" : "w-2 bg-white/20"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
