// src/api/auth.ts

import axios from "axios";
// Add this once to automatically attach token from Zustand
import {getAuthState} from "../store/authStore";


export const API = axios.create({
  baseURL: "http://localhost:8001/",
  withCredentials: true,
});

export const login = (data: { username: string; password: string }) => {
  const form = new URLSearchParams();
  form.append("username", data.username); // 👈 username is the key OAuth2 expects
  form.append("password", data.password);

   return API.post("/auth/login", form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};


// REGISTER: Correct endpoint and return the promise
export const register = async (username:string, email:string, password:string) => {

  // Explicitly construct the object with the exact fields the API expects
  const response = await axios.post('/auth/register', {
    username: username,
    email: email,
    password: password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};




API.interceptors.request.use((config) => {
  const token =getAuthState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
