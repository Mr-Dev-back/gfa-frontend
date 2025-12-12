import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, RefreshCcw, Megaphone, ArrowUp, MoreHorizontal, Clock, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from '../components/ui/toast';
import { useTruckStore, type TruckPriority } from '../stores/useTruckStore';

const priorityMap = {
    critical: { label: 'Critique', variant: 'destructive' as const },
    urgent: { label: 'Urgent', variant: 'warning' as const },
    normal: { label: 'Normal', variant: 'secondary' as const },
};

const zones = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];

export default function Queue() {
    const { trucks, callTruck, setPriority } = useTruckStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<string | null>(null);

    const queueTrucks = trucks.filter(t => t.status === 'WAITING' || t.status === 'CALLED');

    const handleCall = (id: number) => {
        const zone = zones[Math.floor(Math.random() * zones.length)];
        callTruck(id, zone);
        const truck = trucks.find(t => t.id === id);
        toast(`Camion ${truck?.plate} appelé - Zone ${zone}`, 'success');
    };

    const handlePriorityUp = (id: number) => {
        const truck = trucks.find(t => t.id === id);
        if (!truck) return;
        
        const newPriority: TruckPriority = truck.priority === 'normal' ? 'urgent' : 'critical';
        setPriority(id, newPriority);
        toast(`Priorité ${newPriority === 'critical' ? 'critique' : 'urgente'} appliquée`, 'warning');
    };

    const filteredQueue = queueTrucks
        .filter(t => 
            t.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.client.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(t => !filterPriority || t.priority === filterPriority)
        .sort((a, b) => {
            const priorityOrder = { critical: 0, urgent: 1, normal: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.id - b.id;
        });

    const stats = {
        total: queueTrucks.length,
        waiting: trucks.filter(t => t.status === 'WAITING').length,
        called: trucks.filter(t => t.status === 'CALLED').length,
        critical: queueTrucks.filter(t => t.priority === 'critical').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">File d'Attente</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast('Données actualisées', 'info')}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Rafraîchir
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Total en File</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Truck className="h-8 w-8 text-primary/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">En Attente</p>
                                <p className="text-2xl font-bold text-warning">{stats.waiting}</p>
                            </div>
                            <Clock className="h-8 w-8 text-warning/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Appelés</p>
                                <p className="text-2xl font-bold text-success">{stats.called}</p>
                            </div>
                            <Megaphone className="h-8 w-8 text-success/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-danger/5 border-danger/20">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Critiques</p>
                                <p className="text-2xl font-bold text-danger">{stats.critical}</p>
                            </div>
                            <ArrowUp className="h-8 w-8 text-danger/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Camions en Attente</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                            <Input 
                                placeholder="Rechercher matricule, client..." 
                                className="pl-9 h-9"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setFilterPriority(null)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium transition-colors",
                                    !filterPriority ? "bg-primary text-white" : "bg-surface hover:bg-background"
                                )}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() => setFilterPriority('critical')}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium transition-colors border-l",
                                    filterPriority === 'critical' ? "bg-danger text-white" : "bg-surface hover:bg-background"
                                )}
                            >
                                Critique
                            </button>
                            <button
                                onClick={() => setFilterPriority('urgent')}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium transition-colors border-l",
                                    filterPriority === 'urgent' ? "bg-warning text-black" : "bg-surface hover:bg-background"
                                )}
                            >
                                Urgent
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Ordre</TableHead>
                                <TableHead>Matricule</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Produit</TableHead>
                                <TableHead>Heure Arrivée</TableHead>
                                <TableHead>Priorité</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQueue.map((truck, idx) => (
                                <TableRow 
                                    key={truck.id}
                                    className={cn(
                                        truck.priority === 'critical' && "bg-danger/5",
                                        truck.status === 'CALLED' && "bg-success/5"
                                    )}
                                >
                                    <TableCell className="font-bold text-center">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center mx-auto",
                                            truck.priority === 'critical' ? "bg-danger text-white" :
                                            truck.priority === 'urgent' ? "bg-warning text-black" :
                                            "bg-secondary/10 text-secondary"
                                        )}>
                                            {idx + 1}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono font-bold">{truck.plate}</TableCell>
                                    <TableCell>{truck.client}</TableCell>
                                    <TableCell>{truck.product}</TableCell>
                                    <TableCell>{truck.time}</TableCell>
                                    <TableCell>
                                        <Badge variant={priorityMap[truck.priority].variant}>
                                            {priorityMap[truck.priority].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                                            truck.status === 'CALLED' 
                                                ? "bg-success/10 text-success ring-success/20" 
                                                : "bg-primary/10 text-primary ring-primary/20"
                                        )}>
                                            {truck.status === 'CALLED' ? `Appelé - ${truck.zone}` : 'En Attente'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {truck.status === 'WAITING' && (
                                                <>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost"
                                                        className="text-success hover:text-success hover:bg-success/10"
                                                        onClick={() => handleCall(truck.id)}
                                                    >
                                                        <Megaphone className="h-4 w-4 mr-1" />
                                                        Appeler
                                                    </Button>
                                                    {truck.priority !== 'critical' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost"
                                                            className="text-warning hover:text-warning hover:bg-warning/10"
                                                            onClick={() => handlePriorityUp(truck.id)}
                                                        >
                                                            <ArrowUp className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                            <Button size="sm" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    {filteredQueue.length === 0 && (
                        <div className="text-center py-12">
                            <Truck className="h-12 w-12 text-text-muted/30 mx-auto mb-4" />
                            <p className="text-text-muted">Aucun camion trouvé</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
