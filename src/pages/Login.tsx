import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../stores/useAuthStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Truck } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = (role: UserRole) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({
                id: '1',
                name: 'Demo User',
                email: email || `${role.toLowerCase()}@gfa.com`,
                role: role
            }, 'fake-jwt-token');

            setIsLoading(false);

            // Redirect based on role
            switch (role) {
                case 'CONTROL_AGENT': navigate('/entry'); break;
                case 'PARK_AGENT': navigate('/shipping'); break;
                case 'WEIGHING_AGENT': navigate('/weighing'); break;
                case 'SUPERVISOR': navigate('/dashboard'); break;
                case 'ADMIN': navigate('/admin'); break;
                default: navigate('/dashboard');
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-success/10 rounded-full blur-3xl" />

            <Card className="w-full max-w-md shadow-lg border-border/50 relative z-10">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-2">
                        <Truck className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">GFA Logistics</CardTitle>
                    <CardDescription>Système de Gestion de Flux Camions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Identifiant</label>
                        <Input
                            placeholder="nom@entreprise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mot de passe</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-surface px-2 text-text-muted">Connexion Rapide (Demo)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full text-xs" onClick={() => handleLogin('SUPERVISOR')} disabled={isLoading}>
                            Supervisor
                        </Button>
                        <Button variant="outline" className="w-full text-xs" onClick={() => handleLogin('CONTROL_AGENT')} disabled={isLoading}>
                            Contrôle (Entrée)
                        </Button>
                        <Button variant="outline" className="w-full text-xs" onClick={() => handleLogin('PARK_AGENT')} disabled={isLoading}>
                            Parc (Expédition)
                        </Button>
                        <Button variant="outline" className="w-full text-xs" onClick={() => handleLogin('WEIGHING_AGENT')} disabled={isLoading}>
                            Pesée
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => handleLogin('SUPERVISOR')} isLoading={isLoading} disabled={isLoading}>
                        Connexion Sécurisée
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
