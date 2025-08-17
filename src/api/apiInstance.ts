// src/api/base-api.ts
import axios, {type AxiosInstance, AxiosError } from "axios";
import useAuthStore from "../store/authStore";
import useSessionStore from "../store/sessionStore";
import useInitStore from "../store/initStore";
import useValidationStore from "../store/validationStore";

export const API_BASE_URL =  import.meta.env.VITE_API_URI

// Centralized auth error handler
const handleAuthError = () => {
    console.log("Authentication failed - clearing user data");

    useAuthStore.getState().clearAuth();
    useSessionStore.getState().clearAllSessions();
    useInitStore.getState().clearInit();
    useValidationStore.getState().clearAllFields();

    window.location.href = '/login';
};

// Request interceptor function
const addAuthInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use((config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

// Response interceptor function
const addErrorInterceptor = (instance: AxiosInstance, apiName: string = "API", requiresAuth: boolean = true) => {
    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            // Only handle auth errors for authenticated endpoints
            if (error.response?.status === 401 && requiresAuth) {
                console.error("Authentication error - token expired or invalid");
                handleAuthError();
                return Promise.reject(new Error("Authentication failed"));
            }

            if (error.response) {
                console.error(`${apiName} Response Error: ${error.response.status}`, error.response.data);
            } else if (error.request) {
                console.error(`${apiName} Request Error:`, error.request, error.message);
            } else {
                console.error(`${apiName} Error:`, error.message);
            }

            return Promise.reject(error);
        }
    );
};

// Factory function to create configured axios instances
export const createApiInstance = (
    endpoint: string,
    options: {
        withCredentials?: boolean;
        validateStatus?: (status: number) => boolean;
        apiName?: string;
        requiresAuth?: boolean;
    } = {}
): AxiosInstance => {
    const {
        withCredentials = true,
        validateStatus = (status) => status >= 200 && status < 300,
        apiName = "API",
        requiresAuth = true
    } = options;

    if (!API_BASE_URL) {
        throw new Error("❌ Missing VITE_API_URI. Check your .env or Vercel env settings.");
    }

    const instance = axios.create({
        baseURL: `${API_BASE_URL}${endpoint}`,
        withCredentials,
        validateStatus,
    });

    // Only add auth interceptor if authentication is required
    if (requiresAuth) {
        addAuthInterceptor(instance);
    }

    // Always add error interceptor, but handle auth errors differently
    addErrorInterceptor(instance, apiName, requiresAuth);

    return instance;
};

// Pre-configured instances
export const authAPI = createApiInstance("/auth", {
    apiName: "Auth API",
    requiresAuth: false // Auth endpoints don't need tokens
});

export const sessionAPI = createApiInstance("/sessions", {
    apiName: "Session API",
    requiresAuth: true
});

export const setupAPI = createApiInstance("/setup", {
    apiName: "Setup API",
    requiresAuth: true
});

// Future RAG API (ready to use)
export const ragAPI = createApiInstance("/rag", {
    apiName: "RAG API",
    requiresAuth: true
});
