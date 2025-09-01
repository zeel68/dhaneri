import { STORE_ID } from '@/data/Consts';
import ApiClient from '@/utils/apiCalling';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface iUser {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string
    refreshToken: string
}

interface UserState {
    user: iUser | null;
    authToken: string | null;
    isUserVerified: boolean;
    isEmailVerified: boolean;
    isUserLoggedIn: boolean;
    isLoginDilogOpen: boolean;
    sessionId: string | null;
    hasHydrated: boolean; // ✅ Added
}

type UserActions = {
    setUser: (user: iUser, token: string) => void;
    clearUser: () => void;
    setIsUserVerified: (isUserVerified: boolean) => void;
    setIsEmailVerified: (isEmailVerified: boolean) => void;
    setIsLoginDilogOpen: (isLoginDilogOpen: boolean) => void;
    authStatus: () => void;
    startSession: () => Promise<void | string>;
    destorySession: () => Promise<void | string>;
    setHasHydrated: (value: boolean) => void; // ✅ Added
};

const initialState: UserState = {
    user: null,
    authToken: null,
    isUserVerified: false,
    isEmailVerified: false,
    isUserLoggedIn: false,
    isLoginDilogOpen: false,
    sessionId: null,
    hasHydrated: false // ✅ Added
};

const apiClient = new ApiClient();

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            setUser: (user, token) =>
                set(() => ({
                    user,
                    authToken: token,
                    isUserLoggedIn: true,
                })),

            clearUser: () => set(() => initialState),

            setIsUserVerified: (isUserVerified) => set(() => ({ isUserVerified })),

            setIsEmailVerified: (isEmailVerified) => set(() => ({ isEmailVerified })),

            setIsLoginDilogOpen: (isLoginDilogOpen) => set(() => ({ isLoginDilogOpen })),

            authStatus: () => set(() => ({ isUserLoggedIn: true })),

            startSession: async () => {
                const res = await apiClient.post(`storefront/store/${STORE_ID}/session`, {}) as any;
                if (!res.success) {
                    return res.error;
                } else {
                    localStorage.setItem("sessionId", res.data.data.session_id);
                    set(() => ({ sessionId: res.data.data.session_id }));
                }
            },

            destorySession: async () => {
                const sessionId = get().sessionId;
                if (!sessionId) return;

                const res = await apiClient.post(`storefront/store/${STORE_ID}/session/${sessionId}/end`, {});
                if (!res.success) {
                    return res.error;
                } else {
                    set(() => ({ sessionId: null }));
                }
            },

            setHasHydrated: (value: boolean) => set(() => ({ hasHydrated: value })) // ✅ Added
        }),
        {
            name: "user-store",

            onRehydrateStorage: () => (state) => {
                // ✅ Set hydration flag
                state?.setHasHydrated?.(true);
            }
        }
    )
);
