import { useEffect } from 'react';
import { useDataStore } from '../stores/useDataStore';
import { KPICube } from '../components/dashboard/KPICube';
import { VolumeChart, ProductDistributionChart, WaitTimeChart } from '../components/dashboard/Charts';
import { Truck, Package, Clock, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Dashboard() {
    const { metrics, fetchMetrics } = useDataStore();

    useEffect(() => {
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Tableau de Bord</h2>
                <div className="flex gap-2">
                    <Button variant="outline">Télécharger Rapport</Button>
                    <Button onClick={() => fetchMetrics()}>Actualiser</Button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICube
                    title="Camions Entrants"
                    value={metrics.incomingTrucks}
                    icon={Truck}
                    color="primary"
                    trend={{ value: 12, isPositive: true }}
                />
                <KPICube
                    title="Chargés Aujourd'hui"
                    value={metrics.loadedTrucks}
                    icon={Package}
                    color="success"
                    trend={{ value: 8, isPositive: true }}
                />
                <KPICube
                    title="Temps d'Attente Moy."
                    value={`${metrics.avgWaitTime} min`}
                    icon={Clock}
                    color="warning"
                    trend={{ value: 5, isPositive: false }}
                />
                <KPICube
                    title="Débit Horaire"
                    value={`${Math.floor(metrics.loadedTrucks / 8)} /h`}
                    icon={Activity}
                    color="info"
                    trend={{ value: 2, isPositive: true }}
                />
            </div>

            {/* Charts & Details Section (Placeholder for now) */}
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
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex items-center gap-4 pb-2 border-b border-border last:border-0 last:pb-0">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                        {i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-main">Camion #{200 + i} Enregistré</p>
                                        <p className="text-xs text-text-muted">Il y a {i * 2} min • Zone A</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
