import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const mockQueue = [
    { id: 1, plate: 'AB-123-CD', client: 'BTP Construction', product: 'Ciment', time: '08:15', priority: 'critical', status: 'WAITING' },
    { id: 2, plate: 'XY-987-ZZ', client: 'Route Express', product: 'Sable', time: '08:20', priority: 'normal', status: 'WAITING' },
    { id: 3, plate: 'CI-456-AA', client: 'Batimat', product: 'Gravier', time: '08:35', priority: 'urgent', status: 'CALLED' },
    { id: 4, plate: 'HG-111-FD', client: 'Infraroute', product: 'Ciment', time: '08:42', priority: 'normal', status: 'WAITING' },
    { id: 5, plate: 'JK-222-LM', client: 'Particulier', product: 'Sable', time: '09:00', priority: 'normal', status: 'WAITING' },
];

const priorityMap = {
    critical: { label: 'Critique', variant: 'destructive' },
    urgent: { label: 'Urgent', variant: 'warning' },
    normal: { label: 'Normal', variant: 'secondary' },
} as const;

export default function Queue() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">File d'Attente</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><RefreshCcw className="mr-2 h-4 w-4" />Rafraîchir</Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Camions en Attente</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                            <Input placeholder="Rechercher matricule..." className="pl-9 h-9" />
                        </div>
                        <Button variant="outline" size="sm" className="h-9"><Filter className="mr-2 h-4 w-4" /> Filtres</Button>
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
                            {mockQueue.map((truck) => (
                                <TableRow key={truck.id}>
                                    <TableCell className="font-medium text-center bg-secondary/5 rounded-l-md">{truck.id}</TableCell>
                                    <TableCell className="font-mono font-bold">{truck.plate}</TableCell>
                                    <TableCell>{truck.client}</TableCell>
                                    <TableCell>{truck.product}</TableCell>
                                    <TableCell>{truck.time}</TableCell>
                                    <TableCell>
                                        <Badge variant={priorityMap[truck.priority as keyof typeof priorityMap].variant}>
                                            {priorityMap[truck.priority as keyof typeof priorityMap].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                            truck.status === 'CALLED' ? "bg-success/10 text-success ring-success/20" : "bg-primary/10 text-primary ring-primary/20"
                                        )}>
                                            {truck.status === 'CALLED' ? 'Appelé' : 'En Attente'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost">Détails</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
