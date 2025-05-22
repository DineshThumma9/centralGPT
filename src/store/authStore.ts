// src/store/authStore.ts
import {createStore} from "zustand/vanilla";
import {useStore} from "zustand";

export type AuthState = {
    user: string | null;
    token: string | null;
    setAuth: (token: string, user: string) => void;
    logout: () => void;
};

// Helper function to get initial state from localStorage
const getInitialState = () => {
    try {
        const token = localStorage.getItem("access");
        const user = localStorage.getItem("user");
        return {token, user};
    } catch {
        return {token: null, user: null};
    }
};

// Create the vanilla store with initial state from localStorage
const authStore = createStore<AuthState>((set) => {
    const initialState = getInitialState();

    return {
        user: initialState.user,
        token: initialState.token,
        setAuth: (token: string, user: string) => {
            // Update both store and localStorage
            localStorage.setItem("access", token);
            localStorage.setItem("user", user);
            set({token, user});
        },
        logout: () => {
            // Clear both store and localStorage
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
            set({token: null, user: null});
        },
    };
});

// Create a hook version of the store for use in React components
export const useAuthStore = <T>(selector: (state: AuthState) => T) =>
    useStore(authStore, selector);

// Export getState and other methods for non-React environments
export const getAuthState = authStore.getState;