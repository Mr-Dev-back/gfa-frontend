import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
    Truck, 
    Megaphone, 
    Package, 
    Plus, 
    Check, 
    ArrowRight,
    Clock,
    MapPin,
    Trash2
} from 'lucide-react';
import { toast } from '../components/ui/toast';
import { cn } from '../lib/utils';
import { useTruckStore } from '../stores/useTruckStore';

export default function Shipping() {
    const { trucks, callTruck, startLoading, finishLoading, getQueuedTrucks, getCalledTrucks } = useTruckStore();
    
    const [currentTruckId, setCurrentTruckId] = useState<number | null>(null);
    const [loadingProducts, setLoadingProducts] = useState<{ id: number; name: string; quantity: string }[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', quantity: '' });
    const zone = 'A1';

    const currentTruck = currentTruckId ? trucks.find(t => t.id === currentTruckId) : null;
    const queuedTrucks = getQueuedTrucks();
    const calledTrucks = getCalledTrucks();

    const handleCallTruck = (id: number) => {
        callTruck(id, zone);
        setCurrentTruckId(id);
        setLoadingProducts([]);
        const truck = trucks.find(t => t.id === id);
        toast(`Camion ${truck?.plate} appelé - Zone ${zone}`, 'success');
    };

    const handleStartLoading = () => {
        if (currentTruckId) {
            startLoading(currentTruckId);
            toast('Chargement démarré', 'info');
        }
    };

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.quantity) {
            setLoadingProducts([...loadingProducts, { id: Date.now(), ...newProduct }]);
            setNewProduct({ name: '', quantity: '' });
        }
    };

    const handleRemoveProduct = (id: number) => {
        setLoadingProducts(loadingProducts.filter(p => p.id !== id));
    };

    const handleValidateLoading = () => {
        if (!currentTruckId || loadingProducts.length === 0) return;
        
        finishLoading(currentTruckId, loadingProducts);
        toast(`Chargement validé pour ${currentTruck?.plate}. Envoyé vers la pesée.`, 'success');
        setCurrentTruckId(null);
        setLoadingProducts([]);
    };

    const waitingTrucks = [...queuedTrucks, ...calledTrucks.filter(t => t.id !== currentTruckId)];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Parc Expédition</h2>
                <Badge variant="outline" className="text-sm px-3 py-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    Zone: {zone}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5 text-primary" />
                                Appel Camion
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currentTruck ? (
                                <div className={cn(
                                    "rounded-lg p-4 border",
                                    currentTruck.status === 'LOADING' 
                                        ? "bg-success/10 border-success/20" 
                                        : "bg-primary/10 border-primary/20"
                                )}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn(
                                            "text-sm font-medium",
                                            currentTruck.status === 'LOADING' ? "text-success" : "text-primary"
                                        )}>
                                            {currentTruck.status === 'LOADING' ? 'Camion en cours de chargement' : 'Camion appelé - En attente'}
                                        </span>
                                        <Badge variant={currentTruck.status === 'LOADING' ? "success" : "secondary"}>
                                            {currentTruck.status === 'LOADING' ? 'Chargement' : 'Appelé'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-secondary rounded-lg flex items-center justify-center">
                                                <Truck className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold font-mono">{currentTruck.plate}</p>
                                                <p className="text-sm text-text-muted">{currentTruck.client}</p>
                                                <p className="text-sm text-text-muted">{currentTruck.product}</p>
                                            </div>
                                        </div>
                                        {currentTruck.status === 'CALLED' && (
                                            <Button onClick={handleStartLoading} className="bg-success hover:bg-success/90">
                                                <Package className="h-4 w-4 mr-2" />
                                                Démarrer Chargement
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-background border-2 border-dashed border-border rounded-lg p-6 text-center">
                                    <Truck className="h-12 w-12 text-text-muted mx-auto mb-3" />
                                    <p className="text-text-muted">Aucun camion en cours</p>
                                    <p className="text-sm text-text-muted">Appelez un camion depuis la liste</p>
                                </div>
                            )}

                            {queuedTrucks.length > 0 && !currentTruck && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-text-muted">Prochain camion conseillé</p>
                                    {queuedTrucks.slice(0, 1).map(truck => (
                                        <div key={truck.id} className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-warning/20 rounded-full flex items-center justify-center">
                                                    <span className="font-bold text-warning">1</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold font-mono">{truck.plate}</p>
                                                    <p className="text-sm text-text-muted flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> Depuis {truck.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button onClick={() => handleCallTruck(truck.id)} disabled={!!currentTruck}>
                                                <Megaphone className="h-4 w-4 mr-2" />
                                                Appeler
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-text-muted uppercase">File d'attente ({waitingTrucks.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {waitingTrucks.map((truck, idx) => (
                                    <div 
                                        key={truck.id} 
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border transition-colors",
                                            idx === 0 && !currentTruck ? "bg-primary/5 border-primary/20" : "bg-surface border-border"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold",
                                                truck.priority === 'critical' ? "bg-danger/10 text-danger" :
                                                truck.priority === 'urgent' ? "bg-warning/10 text-warning" :
                                                "bg-secondary/10 text-secondary"
                                            )}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-mono font-bold text-sm">{truck.plate}</p>
                                                <p className="text-xs text-text-muted">{truck.client}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => handleCallTruck(truck.id)}
                                            disabled={!!currentTruck}
                                        >
                                            Appeler
                                        </Button>
                                    </div>
                                ))}
                                {waitingTrucks.length === 0 && (
                                    <p className="text-center text-text-muted py-4 text-sm">Aucun camion en attente</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-t-4 border-t-success">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-success" />
                            Chargement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentTruck && currentTruck.status === 'LOADING' ? (
                            <>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Produit</label>
                                        <Input 
                                            placeholder="Nom du produit"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">Quantité</label>
                                        <Input 
                                            placeholder="Ex: 25 T"
                                            value={newProduct.quantity}
                                            onChange={e => setNewProduct({...newProduct, quantity: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-muted">&nbsp;</label>
                                        <Button onClick={handleAddProduct} className="w-full">
                                            <Plus className="h-4 w-4 mr-1" /> Ajouter
                                        </Button>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produit</TableHead>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead className="w-[80px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingProducts.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-text-muted">
                                                        Aucun produit ajouté
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                loadingProducts.map(product => (
                                                    <TableRow key={product.id}>
                                                        <TableCell className="font-medium">{product.name}</TableCell>
                                                        <TableCell>{product.quantity}</TableCell>
                                                        <TableCell>
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                className="text-danger hover:text-danger"
                                                                onClick={() => handleRemoveProduct(product.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => {
                                            setCurrentTruckId(null);
                                            setLoadingProducts([]);
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                    <Button 
                                        className="flex-1 bg-success hover:bg-success/90"
                                        onClick={handleValidateLoading}
                                        disabled={loadingProducts.length === 0}
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Valider & Envoyer Pesée
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </>
                        ) : currentTruck && currentTruck.status === 'CALLED' ? (
                            <div className="text-center py-12 bg-primary/5 rounded-lg border border-primary/20">
                                <Package className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                                <p className="text-primary font-medium">Camion {currentTruck.plate} appelé</p>
                                <p className="text-text-muted text-sm mt-1">Cliquez sur "Démarrer Chargement" pour commencer</p>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-text-muted/30 mx-auto mb-4" />
                                <p className="text-text-muted">Appelez un camion pour commencer le chargement</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
