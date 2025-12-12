import { useEffect } from 'react';
import { useDataStore } from '../stores/useDataStore';
import { useTruckStore } from '../stores/useTruckStore';
import { KPICube } from '../components/dashboard/KPICube';
import { VolumeChart, ProductDistributionChart, WaitTimeChart } from '../components/dashboard/Charts';
import { Truck, Package, Clock, Activity, Scale, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

export default function Dashboard() {
    const { metrics, fetchMetrics } = useDataStore();
    const { trucks, getQueuedTrucks, getCalledTrucks, getCompletedTrucks } = useTruckStore();

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    const queuedTrucks = getQueuedTrucks();
    const calledTrucks = getCalledTrucks();
    const completedTrucks = getCompletedTrucks();

    const recentActivity = [...trucks]
        .sort((a, b) => b.id - a.id)
        .slice(0, 6)
        .map(t => ({
            id: t.id,
            plate: t.plate,
            status: t.status,
            time: t.time,
            client: t.client,
        }));

    const statusLabels: Record<string, { label: string; color: string }> = {
        WAITING: { label: 'En attente', color: 'text-warning' },
        CALLED: { label: 'Appelé', color: 'text-primary' },
        LOADING: { label: 'Chargement', color: 'text-blue-500' },
        WEIGHING_ENTRY: { label: 'Pesée entrée', color: 'text-purple-500' },
        WEIGHING_EXIT: { label: 'Pesée sortie', color: 'text-indigo-500' },
        COMPLETED: { label: 'Terminé', color: 'text-success' },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Tableau de Bord</h2>
                <div className="flex gap-2">
                    <Button variant="outline">Télécharger Rapport</Button>
                    <Button onClick={() => fetchMetrics()}>Actualiser</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <KPICube
                    title="Camions Entrants"
                    value={trucks.length}
                    icon={Truck}
                    color="primary"
                    trend={{ value: 12, isPositive: true }}
                />
                <KPICube
                    title="En Attente"
                    value={queuedTrucks.length}
                    icon={Clock}
                    color="warning"
                    trend={{ value: queuedTrucks.length > 5 ? 8 : 3, isPositive: queuedTrucks.length <= 5 }}
                />
                <KPICube
                    title="En Cours"
                    value={calledTrucks.length}
                    icon={Package}
                    color="info"
                />
                <KPICube
                    title="Terminés"
                    value={completedTrucks.length}
                    icon={Activity}
                    color="success"
                    trend={{ value: 8, isPositive: true }}
                />
                <KPICube
                    title="Poids Total"
                    value={`${(metrics.totalWeight / 1000).toFixed(1)} T`}
                    icon={Scale}
                    color="secondary"
                />
                <KPICube
                    title="Temps Moy."
                    value={`${metrics.avgWaitTime} min`}
                    icon={Clock}
                    color="danger"
                    trend={{ value: 5, isPositive: false }}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-4">
                    <VolumeChart />
                </div>

                <div className="col-span-3">
                    <ProductDistributionChart />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-4">
                    <WaitTimeChart />
                </div>

                <Card className="col-span-3 h-[400px] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Activité Récente</CardTitle>
                        <Badge variant="outline" className="text-xs">
                            Temps réel
                        </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 pb-2 border-b border-border last:border-0 last:pb-0">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-main font-mono">{activity.plate}</p>
                                        <p className="text-xs text-text-muted">{activity.client}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "text-xs font-medium",
                                            statusLabels[activity.status]?.color || 'text-text-muted'
                                        )}>
                                            {statusLabels[activity.status]?.label || activity.status}
                                        </span>
                                        <p className="text-xs text-text-muted">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-text-muted uppercase">
                            File d'Attente (Top 5)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {queuedTrucks.slice(0, 5).map((truck, idx) => (
                                <div key={truck.id} className="flex items-center gap-3 p-2 rounded-lg bg-background">
                                    <div className={cn(
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                                        truck.priority === 'critical' ? "bg-danger text-white" :
                                        truck.priority === 'urgent' ? "bg-warning text-black" :
                                        "bg-secondary/10 text-secondary"
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-mono font-bold text-sm">{truck.plate}</p>
                                    </div>
                                    <span className="text-xs text-text-muted">{truck.time}</span>
                                </div>
                            ))}
                            {queuedTrucks.length === 0 && (
                                <p className="text-center text-text-muted text-sm py-4">Aucun camion en attente</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-text-muted uppercase">
                            Derniers Chargés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {completedTrucks.slice(0, 5).map((truck) => (
                                <div key={truck.id} className="flex items-center gap-3 p-2 rounded-lg bg-success/5">
                                    <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                                        <Package className="h-3 w-3 text-success" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-mono font-bold text-sm">{truck.plate}</p>
                                    </div>
                                    <span className="text-xs font-medium text-success">
                                        {truck.netWeight ? `${(truck.netWeight / 1000).toFixed(1)} T` : '-'}
                                    </span>
                                </div>
                            ))}
                            {completedTrucks.length === 0 && (
                                <p className="text-center text-text-muted text-sm py-4">Aucun camion terminé</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-text-muted uppercase flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Anomalies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-4xl font-bold text-success">0</p>
                            <p className="text-sm text-text-muted mt-2">Aucune anomalie détectée</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
