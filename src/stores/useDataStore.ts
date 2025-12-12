import { create } from 'zustand';
import { useTruckStore } from './useTruckStore';

interface DashboardMetrics {
    incomingTrucks: number;
    loadedTrucks: number;
    avgWaitTime: number;
    avgLoadTime: number;
    totalWeight: number;
    anomalyRate: number;
}

interface DataState {
    metrics: DashboardMetrics;
    fetchMetrics: () => void;
}

export const useDataStore = create<DataState>((set) => ({
    metrics: {
        incomingTrucks: 0,
        loadedTrucks: 0,
        avgWaitTime: 24,
        avgLoadTime: 18,
        totalWeight: 0,
        anomalyRate: 2,
    },
    fetchMetrics: () => {
        const trucks = useTruckStore.getState().trucks;
        const completed = trucks.filter(t => t.status === 'COMPLETED');
        const totalWeight = completed.reduce((acc, t) => acc + (t.netWeight || 0), 0);
        
        set({
            metrics: {
                incomingTrucks: trucks.length,
                loadedTrucks: completed.length,
                avgWaitTime: 20 + Math.floor(Math.random() * 10),
                avgLoadTime: 15 + Math.floor(Math.random() * 5),
                totalWeight,
                anomalyRate: Math.floor(Math.random() * 5),
            }
        });
    },
}));
