import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
    Users, 
    Plus, 
    Search,
    Edit,
    Trash2,
    Shield,
    UserCheck,
    UserX,
    X,
    Save,
    Key,
    Mail,
    User
} from 'lucide-react';
import { toast } from '../components/ui/toast';
import { cn } from '../lib/utils';

const mockUsers = [
    { id: 1, name: 'Koné Ibrahim', email: 'kone.ibrahim@gfa.ci', role: 'SUPERVISOR', status: 'active', lastLogin: '2024-01-15 09:30' },
    { id: 2, name: 'Diallo Moussa', email: 'diallo.moussa@gfa.ci', role: 'CONTROL_AGENT', status: 'active', lastLogin: '2024-01-15 08:15' },
    { id: 3, name: 'Touré Amadou', email: 'toure.amadou@gfa.ci', role: 'PARK_AGENT', status: 'active', lastLogin: '2024-01-15 07:45' },
    { id: 4, name: 'Coulibaly Seydou', email: 'coulibaly.seydou@gfa.ci', role: 'WEIGHING_AGENT', status: 'inactive', lastLogin: '2024-01-10 16:20' },
    { id: 5, name: 'Admin System', email: 'admin@gfa.ci', role: 'ADMIN', status: 'active', lastLogin: '2024-01-15 10:00' },
];

const roleLabels = {
    ADMIN: { label: 'Administrateur', color: 'bg-danger/10 text-danger' },
    SUPERVISOR: { label: 'Superviseur', color: 'bg-primary/10 text-primary' },
    CONTROL_AGENT: { label: 'Agent Contrôle', color: 'bg-warning/10 text-warning' },
    PARK_AGENT: { label: 'Agent Parc', color: 'bg-success/10 text-success' },
    WEIGHING_AGENT: { label: 'Agent Pesée', color: 'bg-blue-500/10 text-blue-500' },
    PUBLIC_TV: { label: 'TV Public', color: 'bg-secondary/10 text-secondary' },
} as const;

export default function Admin() {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'CONTROL_AGENT',
        password: ''
    });

    const handleEdit = (user: typeof mockUsers[0]) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: ''
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'CONTROL_AGENT', password: '' });
        setShowModal(true);
    };

    const handleSave = () => {
        toast(editingUser ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès', 'success');
        setShowModal(false);
    };

    const filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">Administration</h2>
                <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Utilisateur
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Total Utilisateurs</p>
                                <p className="text-3xl font-bold">{mockUsers.length}</p>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Actifs</p>
                                <p className="text-3xl font-bold text-success">
                                    {mockUsers.filter(u => u.status === 'active').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Inactifs</p>
                                <p className="text-3xl font-bold text-text-muted">
                                    {mockUsers.filter(u => u.status === 'inactive').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-text-muted/10 rounded-xl flex items-center justify-center">
                                <UserX className="h-6 w-6 text-text-muted" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Administrateurs</p>
                                <p className="text-3xl font-bold text-danger">
                                    {mockUsers.filter(u => u.role === 'ADMIN').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-danger/10 rounded-xl flex items-center justify-center">
                                <Shield className="h-6 w-6 text-danger" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Gestion des Utilisateurs
                    </CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                        <Input 
                            placeholder="Rechercher..." 
                            className="pl-9 h-9"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Dernière Connexion</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-text-muted">{user.email}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            roleLabels[user.role as keyof typeof roleLabels].color
                                        )}>
                                            {roleLabels[user.role as keyof typeof roleLabels].label}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-text-muted text-sm">{user.lastLogin}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="text-danger hover:text-danger"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>
                                {editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Nom complet</label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                    <Input 
                                        className="pl-9"
                                        placeholder="Nom Prénom"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                    <Input 
                                        className="pl-9"
                                        type="email"
                                        placeholder="email@gfa.ci"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Rôle</label>
                                <select 
                                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="CONTROL_AGENT">Agent Contrôle</option>
                                    <option value="PARK_AGENT">Agent Parc</option>
                                    <option value="WEIGHING_AGENT">Agent Pesée</option>
                                    <option value="SUPERVISOR">Superviseur</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">
                                    {editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                                    <Input 
                                        className="pl-9"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setShowModal(false)}
                                >
                                    Annuler
                                </Button>
                                <Button className="flex-1" onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {editingUser ? 'Enregistrer' : 'Créer'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
