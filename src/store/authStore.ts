// src/store/authStore.ts
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

export type AuthState = {
  user: string | null;
  token: string | null;
  setAuth: (token: string, user: string) => void;
  logout: () => void;
};

// Create the vanilla store
const authStore = createStore<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (token: string, user: string) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));

// Create a hook version of the store for use in React components
export const useAuthStore = <T>(selector: (state: AuthState) => T) =>
  useStore(authStore, selector);

// Export getState and other methods for non-React environments
export const getAuthState = authStore.getState;