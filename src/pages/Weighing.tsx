import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
    Scale, 
    Check, 
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Clock,
    RefreshCcw,
    Wifi,
    WifiOff
} from 'lucide-react';
import { toast } from '../components/ui/toast';
import { cn } from '../lib/utils';
import { useTruckStore } from '../stores/useTruckStore';

export default function Weighing() {
    const { trucks, setEntryWeight, setExitWeight, getPendingWeighing, getCompletedTrucks } = useTruckStore();
    
    const [currentWeight, setCurrentWeight] = useState(0);
    const [isStable, setIsStable] = useState(false);
    const [isConnected] = useState(true);
    const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);

    const pendingWeighing = getPendingWeighing();
    const completedTrucks = getCompletedTrucks();
    const selectedTruck = selectedTruckId ? trucks.find(t => t.id === selectedTruckId) : null;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!selectedTruck) {
                setCurrentWeight(0);
                return;
            }
            
            const base = selectedTruck.status === 'WEIGHING_ENTRY' ? 12000 : 38000;
            const variation = Math.floor(Math.random() * 100) - 50;
            setCurrentWeight(base + variation);
            setIsStable(Math.random() > 0.3);
        }, 500);

        return () => clearInterval(interval);
    }, [selectedTruck]);

    const handleValidateWeight = () => {
        if (!selectedTruck) return;
        
        if (selectedTruck.status === 'WEIGHING_ENTRY') {
            setEntryWeight(selectedTruck.id, currentWeight);
            toast(`Poids d'entrée validé: ${currentWeight.toLocaleString('fr-FR')} kg`, 'success');
        } else {
            setExitWeight(selectedTruck.id, currentWeight);
            toast(`Poids de sortie validé: ${currentWeight.toLocaleString('fr-FR')} kg - Camion terminé`, 'success');
        }
        setSelectedTruckId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Pont Bascule - Pesée</h2>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                        isConnected ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}>
                        {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        {isConnected ? "Pont Bascule Connecté" : "Déconnecté"}
                    </div>
                    <Button variant="outline" size="sm">
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Actualiser
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            Lecture Poids
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-secondary rounded-2xl p-8 text-center">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Badge 
                                    variant={isStable ? "success" : "warning"}
                                    className="text-sm px-3 py-1"
                                >
                                    {isStable ? "Stable" : "Instable"}
                                </Badge>
                            </div>
                            <div className="font-mono text-6xl font-bold text-white tracking-wider">
                                {currentWeight.toLocaleString('fr-FR')}
                                <span className="text-2xl ml-2 text-white/60">kg</span>
                            </div>
                            <p className="text-secondary-foreground/60 mt-4 text-sm">
                                Dernière mise à jour: maintenant
                            </p>
                        </div>

                        {selectedTruck ? (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-12 w-12 rounded-lg flex items-center justify-center",
                                            selectedTruck.status === 'WEIGHING_ENTRY' ? "bg-warning/10" : "bg-success/10"
                                        )}>
                                            {selectedTruck.status === 'WEIGHING_ENTRY' ? 
                                                <ArrowDown className="h-6 w-6 text-warning" /> : 
                                                <ArrowUp className="h-6 w-6 text-success" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm text-text-muted">
                                                {selectedTruck.status === 'WEIGHING_ENTRY' ? 'Pesée Entrée' : 'Pesée Sortie'}
                                            </p>
                                            <p className="text-xl font-bold font-mono">{selectedTruck.plate}</p>
                                            <p className="text-sm text-text-muted">{selectedTruck.client}</p>
                                            {selectedTruck.entryWeight && (
                                                <p className="text-xs text-text-muted mt-1">
                                                    Poids entrée: {selectedTruck.entryWeight.toLocaleString('fr-FR')} kg
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Button 
                                            size="lg"
                                            className="bg-success hover:bg-success/90"
                                            onClick={handleValidateWeight}
                                            disabled={!isStable}
                                        >
                                            <Check className="h-5 w-5 mr-2" />
                                            Valider Poids
                                        </Button>
                                        {!isStable && (
                                            <p className="text-xs text-warning mt-2 flex items-center justify-end gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                Attendez la stabilisation
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                                <Scale className="h-12 w-12 text-text-muted/30 mx-auto mb-3" />
                                <p className="text-text-muted">Sélectionnez un ticket pour commencer la pesée</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-text-muted uppercase">
                            Tickets en Attente ({pendingWeighing.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {pendingWeighing.length === 0 ? (
                            <p className="text-center text-text-muted py-4 text-sm">Aucun ticket en attente</p>
                        ) : (
                            pendingWeighing.map(truck => (
                                <button
                                    key={truck.id}
                                    onClick={() => setSelectedTruckId(truck.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all",
                                        selectedTruckId === truck.id 
                                            ? "bg-primary/10 border-primary" 
                                            : "bg-surface border-border hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center",
                                            truck.status === 'WEIGHING_ENTRY' ? "bg-warning/10" : "bg-success/10"
                                        )}>
                                            {truck.status === 'WEIGHING_ENTRY' ? 
                                                <ArrowDown className="h-5 w-5 text-warning" /> : 
                                                <ArrowUp className="h-5 w-5 text-success" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-mono font-bold">{truck.plate}</p>
                                            <p className="text-xs text-text-muted">{truck.client}</p>
                                        </div>
                                        <Badge variant={truck.status === 'WEIGHING_ENTRY' ? 'warning' : 'success'}>
                                            {truck.status === 'WEIGHING_ENTRY' ? 'Entrée' : 'Sortie'}
                                        </Badge>
                                    </div>
                                </button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-text-muted" />
                        Historique du Jour ({completedTrucks.length} terminés)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Heure</TableHead>
                                <TableHead>Matricule</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead className="text-right">Poids Entrée</TableHead>
                                <TableHead className="text-right">Poids Sortie</TableHead>
                                <TableHead className="text-right">Poids Net</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {completedTrucks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-text-muted">
                                        Aucun camion terminé aujourd'hui
                                    </TableCell>
                                </TableRow>
                            ) : (
                                completedTrucks.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell className="text-text-muted">{record.time}</TableCell>
                                        <TableCell className="font-mono font-bold">{record.plate}</TableCell>
                                        <TableCell>{record.client}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {record.entryWeight?.toLocaleString('fr-FR') || '-'} kg
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {record.exitWeight?.toLocaleString('fr-FR') || '-'} kg
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-success">
                                            {record.netWeight?.toLocaleString('fr-FR') || '-'} kg
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
