import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SUPERVISOR' | 'CONTROL_AGENT' | 'PARK_AGENT' | 'WEIGHING_AGENT' | 'ADMIN' | 'PUBLIC_TV';

interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'gfa-auth-storage',
        }
    )
);
