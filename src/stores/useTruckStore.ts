import { create } from 'zustand';

export type TruckStatus = 'WAITING' | 'CALLED' | 'LOADING' | 'WEIGHING_ENTRY' | 'WEIGHING_EXIT' | 'COMPLETED';
export type TruckPriority = 'normal' | 'urgent' | 'critical';

export interface Truck {
    id: number;
    plate: string;
    driver: string;
    client: string;
    product: string;
    time: string;
    priority: TruckPriority;
    status: TruckStatus;
    zone?: string;
    entryWeight?: number;
    exitWeight?: number;
    netWeight?: number;
    loadedProducts?: { id: number; name: string; quantity: string }[];
}

interface TruckStore {
    trucks: Truck[];
    nextId: number;
    addTruck: (truck: Omit<Truck, 'id' | 'time' | 'status' | 'priority'>) => void;
    callTruck: (id: number, zone: string) => void;
    startLoading: (id: number) => void;
    finishLoading: (id: number, products: { id: number; name: string; quantity: string }[]) => void;
    setEntryWeight: (id: number, weight: number) => void;
    setExitWeight: (id: number, weight: number) => void;
    setPriority: (id: number, priority: TruckPriority) => void;
    completeTruck: (id: number) => void;
    getQueuedTrucks: () => Truck[];
    getCalledTrucks: () => Truck[];
    getLoadingTrucks: () => Truck[];
    getPendingWeighing: () => Truck[];
    getCompletedTrucks: () => Truck[];
}

const initialTrucks: Truck[] = [
    { id: 1, plate: 'AB-123-CD', driver: 'Koné Ibrahim', client: 'BTP Construction', product: 'Ciment', time: '08:15', priority: 'critical', status: 'CALLED', zone: 'A1' },
    { id: 2, plate: 'XY-987-ZZ', driver: 'Diallo Moussa', client: 'Route Express', product: 'Sable', time: '08:20', priority: 'normal', status: 'WAITING' },
    { id: 3, plate: 'CI-456-AA', driver: 'Touré Amadou', client: 'Batimat', product: 'Gravier', time: '08:35', priority: 'urgent', status: 'CALLED', zone: 'B2' },
    { id: 4, plate: 'HG-111-FD', driver: 'Coulibaly Seydou', client: 'Infraroute', product: 'Ciment', time: '08:42', priority: 'normal', status: 'WAITING' },
    { id: 5, plate: 'JK-222-LM', driver: 'Bamba Lacina', client: 'Particulier', product: 'Sable', time: '09:00', priority: 'normal', status: 'WAITING' },
    { id: 6, plate: 'MN-333-OP', driver: 'Ouattara Yves', client: 'BTP Plus', product: 'Gravier', time: '09:15', priority: 'normal', status: 'WEIGHING_EXIT', entryWeight: 13200, zone: 'A2', loadedProducts: [{ id: 1, name: 'Gravier 0/20', quantity: '28 T' }] },
    { id: 7, plate: 'QR-444-ST', driver: 'Sanogo Paul', client: 'Construction CI', product: 'Ciment', time: '09:30', priority: 'urgent', status: 'LOADING', zone: 'A3' },
];

export const useTruckStore = create<TruckStore>((set, get) => ({
    trucks: initialTrucks,
    nextId: 8,

    addTruck: (truckData) => {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        set((state) => ({
            trucks: [
                ...state.trucks,
                {
                    ...truckData,
                    id: state.nextId,
                    time,
                    status: 'WAITING',
                    priority: 'normal',
                }
            ],
            nextId: state.nextId + 1,
        }));
    },

    callTruck: (id, zone) => {
        set((state) => ({
            trucks: state.trucks.map(t => 
                t.id === id ? { ...t, status: 'CALLED', zone } : t
            ),
        }));
    },

    startLoading: (id) => {
        set((state) => ({
            trucks: state.trucks.map(t => 
                t.id === id ? { ...t, status: 'LOADING' } : t
            ),
        }));
    },

    finishLoading: (id, products) => {
        set((state) => ({
            trucks: state.trucks.map(t => 
                t.id === id ? { ...t, status: 'WEIGHING_ENTRY', loadedProducts: products } : t
            ),
        }));
    },

    setEntryWeight: (id, weight) => {
        set((state) => ({
            trucks: state.trucks.map(t => 
                t.id === id ? { ...t, entryWeight: weight, status: 'WEIGHING_EXIT' } : t
            ),
        }));
    },

    setExitWeight: (id, weight) => {
        set((state) => ({
            trucks: state.trucks.map(t => {
                if (t.id === id) {
                    const netWeight = weight - (t.entryWeight || 0);
                    return { ...t, exitWeight: weight, netWeight, status: 'COMPLETED' };
                }
                return t;
            }),
        }));
    },

    setPriority: (id, priority) => {
        set((state) => ({
            trucks: state.trucks.map(t => 
                t.id === id ? { ...t, priority } : t
            ),
        }));
    },

    completeTruck: (id) => {
        set((state) => ({
            trucks: state.trucks.map(t => 
                t.id === id ? { ...t, status: 'COMPLETED' } : t
            ),
        }));
    },

    getQueuedTrucks: () => get().trucks.filter(t => t.status === 'WAITING'),
    getCalledTrucks: () => get().trucks.filter(t => t.status === 'CALLED' || t.status === 'LOADING'),
    getLoadingTrucks: () => get().trucks.filter(t => t.status === 'LOADING'),
    getPendingWeighing: () => get().trucks.filter(t => t.status === 'WEIGHING_ENTRY' || t.status === 'WEIGHING_EXIT'),
    getCompletedTrucks: () => get().trucks.filter(t => t.status === 'COMPLETED'),
}));
