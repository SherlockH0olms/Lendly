import { create } from "zustand";
import { KOBIData, ScoreResult } from "../scoring-engine";
import { BOKT } from "../matching-engine";

interface User {
    id: string;
    token: string;
    data: KOBIData;
}

interface ApplicationState {
    id: string;
    boktId: string;
    productId: string;
    amount: number;
    term: number;
    status: "pending" | "submitted" | "approved" | "rejected";
    timestamp: string;
}

interface AppState {
    // User state
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;

    // Score state
    scoreData: ScoreResult | null;
    scoreLoading: boolean;
    scoreError: string | null;
    setScoreData: (data: ScoreResult | null) => void;
    setScoreLoading: (loading: boolean) => void;
    setScoreError: (error: string | null) => void;

    // BOKT state
    bokts: BOKT[];
    boktsLoading: boolean;
    setBokts: (bokts: BOKT[]) => void;
    setBoktsLoading: (loading: boolean) => void;

    // Application state
    applications: ApplicationState[];
    addApplication: (application: ApplicationState) => void;

    // UI state
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
    // User state
    user: null,
    isAuthenticated: false,
    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
        }),
    logout: () => {
        localStorage.removeItem("kobi_user_token");
        localStorage.removeItem("kobi_user_id");
        set({
            user: null,
            isAuthenticated: false,
            scoreData: null,
        });
    },

    // Score state
    scoreData: null,
    scoreLoading: false,
    scoreError: null,
    setScoreData: (data) => set({ scoreData: data, scoreError: null }),
    setScoreLoading: (loading) => set({ scoreLoading: loading }),
    setScoreError: (error) => set({ scoreError: error, scoreLoading: false }),

    // BOKT state
    bokts: [],
    boktsLoading: false,
    setBokts: (bokts) => set({ bokts }),
    setBoktsLoading: (loading) => set({ boktsLoading: loading }),

    // Application state
    applications: [],
    addApplication: (application) =>
        set((state) => ({
            applications: [...state.applications, application],
        })),

    // UI state
    sidebarOpen: false,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Selectors for better performance
export const selectUser = (state: AppState) => state.user;
export const selectScoreData = (state: AppState) => state.scoreData;
export const selectBokts = (state: AppState) => state.bokts;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;
