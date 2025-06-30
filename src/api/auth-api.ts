import axios, { AxiosError } from "axios";



const API_BASE_URL = import.meta.env.VITE_API_URI;

export const API = axios.create({
     baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});





export const login = (
                   data:
                      {
                        username: string;
                        password: string;
                      }) => {


    const API_BASE_URL = import.meta.env.VITE_API_URI;
if (!API_BASE_URL) {
  throw new Error("❌ Missing VITE_API_URI. Check your .env or Vercel env settings.");
}

  const form = new URLSearchParams();
  form.append("username", data.username);
  form.append("password", data.password);


  return API.post("/login", form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};


export const register = async (username: string, email: string, password: string) => {

    const API_BASE_URL = import.meta.env.VITE_API_URI;
if (!API_BASE_URL) {
  throw new Error("❌ Missing VITE_API_URI. Check your .env or Vercel env settings.");
}

    const response = await API.post("/register",
    { username, email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};





import useAuthStore from "../store/authStore";

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


API.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response) {
          console.error(`API Response Error : ${error.response.status}`, error.response.data);
      } else if (error.request) {
          // error.response might be undefined here, so don't access it
          console.error(`API Request Error`, error.request, error.message);
      } else {
          console.error(`Some Error has occurred`, error.message);
      }
      return Promise.reject(error);
  }
);
