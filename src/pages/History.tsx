import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
    History as HistoryIcon, 
    Search, 
    Filter, 
    Download,
    Truck,
    Clock,
    Package,
    Scale,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    ChevronRight,
    X
} from 'lucide-react';
import { cn } from '../lib/utils';

const mockHistory = [
    { 
        id: 1, 
        plate: 'AB-123-CD', 
        client: 'BTP Construction', 
        driver: 'Koné Ibrahim',
        product: 'Ciment CPA 45',
        entryTime: '08:15',
        exitTime: '10:45',
        entryWeight: 12500,
        exitWeight: 38200,
        netWeight: 25700,
        status: 'completed',
        date: '2024-01-15'
    },
    { 
        id: 2, 
        plate: 'XY-987-ZZ', 
        client: 'Route Express', 
        driver: 'Diallo Moussa',
        product: 'Sable fin',
        entryTime: '08:45',
        exitTime: '11:20',
        entryWeight: 11800,
        exitWeight: 36500,
        netWeight: 24700,
        status: 'completed',
        date: '2024-01-15'
    },
    { 
        id: 3, 
        plate: 'CI-456-AA', 
        client: 'Batimat', 
        driver: 'Touré Amadou',
        product: 'Gravier',
        entryTime: '09:00',
        exitTime: '-',
        entryWeight: 13200,
        exitWeight: null,
        netWeight: null,
        status: 'in_progress',
        date: '2024-01-15'
    },
    { 
        id: 4, 
        plate: 'HG-111-FD', 
        client: 'Infraroute', 
        driver: 'Coulibaly Seydou',
        product: 'Ciment',
        entryTime: '07:30',
        exitTime: '09:15',
        entryWeight: 12000,
        exitWeight: 37500,
        netWeight: 25500,
        status: 'anomaly',
        date: '2024-01-15'
    },
];

const timelineSteps = [
    { key: 'arrival', label: 'Arrivée', icon: Truck, time: '08:15', agent: 'Agent Contrôle', done: true },
    { key: 'called', label: 'Appel', icon: Clock, time: '09:30', agent: 'Agent Parc', done: true },
    { key: 'loading', label: 'Chargement', icon: Package, time: '09:45', agent: 'Agent Parc', done: true },
    { key: 'entry_weight', label: 'Pesée Entrée', icon: Scale, time: '08:20', agent: 'Agent Pesée', done: true },
    { key: 'exit_weight', label: 'Pesée Sortie', icon: Scale, time: '10:40', agent: 'Agent Pesée', done: true },
    { key: 'exit', label: 'Sortie Site', icon: CheckCircle2, time: '10:45', agent: 'Système', done: true },
];

export default function History() {
    const [selectedTruck, setSelectedTruck] = useState<typeof mockHistory[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const statusMap = {
        completed: { label: 'Terminé', variant: 'success', icon: CheckCircle2 },
        in_progress: { label: 'En cours', variant: 'warning', icon: Clock },
        anomaly: { label: 'Anomalie', variant: 'destructive', icon: AlertTriangle },
    } as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Historique & Traçabilité</h2>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className={cn("space-y-4", selectedTruck ? "lg:col-span-2" : "lg:col-span-3")}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-lg font-medium">Parcours des Camions</CardTitle>
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
                                <Button variant="outline" size="sm" className="h-9">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Date
                                </Button>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtres
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Matricule</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Chauffeur</TableHead>
                                        <TableHead>Produit</TableHead>
                                        <TableHead>Entrée</TableHead>
                                        <TableHead>Sortie</TableHead>
                                        <TableHead className="text-right">Poids Net</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockHistory.map(record => (
                                        <TableRow 
                                            key={record.id}
                                            className={cn(
                                                "cursor-pointer transition-colors",
                                                selectedTruck?.id === record.id && "bg-primary/5"
                                            )}
                                            onClick={() => setSelectedTruck(record)}
                                        >
                                            <TableCell className="font-mono font-bold">{record.plate}</TableCell>
                                            <TableCell>{record.client}</TableCell>
                                            <TableCell className="text-text-muted">{record.driver}</TableCell>
                                            <TableCell>{record.product}</TableCell>
                                            <TableCell>{record.entryTime}</TableCell>
                                            <TableCell>{record.exitTime}</TableCell>
                                            <TableCell className="text-right font-mono">
                                                {record.netWeight ? `${record.netWeight.toLocaleString('fr-FR')} kg` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusMap[record.status as keyof typeof statusMap].variant}>
                                                    {statusMap[record.status as keyof typeof statusMap].label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <ChevronRight className="h-4 w-4 text-text-muted" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {selectedTruck && (
                    <Card className="lg:col-span-1 h-fit sticky top-6">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <HistoryIcon className="h-5 w-5 text-primary" />
                                    Parcours Détaillé
                                </CardTitle>
                                <p className="text-2xl font-mono font-bold mt-2">{selectedTruck.plate}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedTruck(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-text-muted">Client</p>
                                    <p className="font-medium">{selectedTruck.client}</p>
                                </div>
                                <div>
                                    <p className="text-text-muted">Chauffeur</p>
                                    <p className="font-medium">{selectedTruck.driver}</p>
                                </div>
                                <div>
                                    <p className="text-text-muted">Produit</p>
                                    <p className="font-medium">{selectedTruck.product}</p>
                                </div>
                                <div>
                                    <p className="text-text-muted">Poids Net</p>
                                    <p className="font-bold text-success">
                                        {selectedTruck.netWeight ? `${selectedTruck.netWeight.toLocaleString('fr-FR')} kg` : '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-text-muted mb-4">Timeline</p>
                                <div className="space-y-0">
                                    {timelineSteps.map((step, index) => (
                                        <div key={step.key} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center",
                                                    step.done ? "bg-success/10 text-success" : "bg-text-muted/10 text-text-muted"
                                                )}>
                                                    <step.icon className="h-5 w-5" />
                                                </div>
                                                {index < timelineSteps.length - 1 && (
                                                    <div className={cn(
                                                        "w-0.5 h-8",
                                                        step.done ? "bg-success/30" : "bg-text-muted/20"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="pb-6">
                                                <p className="font-medium">{step.label}</p>
                                                <p className="text-sm text-text-muted">{step.time} • {step.agent}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedTruck.status === 'anomaly' && (
                                <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-danger mb-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="font-medium">Anomalie détectée</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Écart de poids supérieur à la tolérance. Vérification requise.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
