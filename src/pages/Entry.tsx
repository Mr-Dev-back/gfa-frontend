import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Truck, User, Building2, Package, Save } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export default function Entry() {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    // Form state
    const [formData, setFormData] = useState({
        plate: '',
        driver: '',
        client: '',
        product: '',
        obs: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API
        setTimeout(() => {
            setIsLoading(false);
            setFormData({ plate: '', driver: '', client: '', product: '', obs: '' });
            alert('Camion enregistré et ajouté à la file !');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-text-main">Enregistrement Entrée</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-t-4 border-t-primary shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            Nouveau Camion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Matricule</label>
                                <div className="relative">
                                    <Truck className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                    <Input
                                        className="pl-9 font-mono uppercase"
                                        placeholder="AA-123-BB"
                                        value={formData.plate}
                                        onChange={e => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Chauffeur</label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                        <Input
                                            className="pl-9"
                                            placeholder="Nom Prénom"
                                            value={formData.driver}
                                            onChange={e => setFormData({ ...formData, driver: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted">Client</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                        <Input
                                            className="pl-9"
                                            placeholder="Entreprise"
                                            value={formData.client}
                                            onChange={e => setFormData({ ...formData, client: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Type Marchandise</label>
                                <div className="relative">
                                    <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Ciment, Agrégats..."
                                        value={formData.product}
                                        onChange={e => setFormData({ ...formData, product: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Observations</label>
                                <Input
                                    placeholder="Notes optionnelles..."
                                    value={formData.obs}
                                    onChange={e => setFormData({ ...formData, obs: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer Entrée
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Queue Preview Widget */}
                <Card className="bg-secondary/5 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-text-muted uppercase">File d'Attente en cours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-surface p-3 rounded-lg border border-border shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-secondary text-secondary-foreground h-8 w-8 rounded flex items-center justify-center font-bold text-xs">
                                            {i}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main text-sm">1234-AB-CI</p>
                                            <p className="text-xs text-text-muted">Cim Ivoire</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">En Attente</span>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-center text-text-muted py-2">Total: 12 camions en attente</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
