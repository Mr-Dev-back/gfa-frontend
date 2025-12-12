import { create } from 'zustand';

interface DashboardMetrics {
    incomingTrucks: number;
    loadedTrucks: number;
    avgWaitTime: number; // minutes
    avgLoadTime: number; // minutes
}

interface DataState {
    metrics: DashboardMetrics;
    queue: any[]; // define types properly later
    recentActivity: any[];
    fetchMetrics: () => void;
}

export const useDataStore = create<DataState>((set) => ({
    metrics: {
        incomingTrucks: 45,
        loadedTrucks: 32,
        avgWaitTime: 24,
        avgLoadTime: 18,
    },
    queue: [],
    recentActivity: [],
    fetchMetrics: () => {
        // Mock update
        set((state) => ({
            metrics: {
                incomingTrucks: state.metrics.incomingTrucks + Math.floor(Math.random() * 2),
                loadedTrucks: state.metrics.loadedTrucks + Math.floor(Math.random() * 2),
                avgWaitTime: 20 + Math.floor(Math.random() * 10),
                avgLoadTime: 15 + Math.floor(Math.random() * 5),
            }
        }));
    },
}));
