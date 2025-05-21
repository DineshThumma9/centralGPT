// src/api/auth.ts

import axios from "axios";
// Add this once to automatically attach token from Zustand
import {getAuthState} from "../store/authStore";


export const API = axios.create({
  baseURL: "http://localhost:8001/auth",
  withCredentials: true,
});

// LOGIN: Correct endpoint and return the promise
export const login = (data: { email: string; password: string }) => {
  return API.post("/login", data); // ✅ Use login here, not register
};

// REGISTER: Correct endpoint and return the promise
export const register = (data: { username: string; email: string; password: string }) => {
  return API.post("/register", data); // ✅ Use register here
};

API.interceptors.request.use((config) => {
  const token =getAuthState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
