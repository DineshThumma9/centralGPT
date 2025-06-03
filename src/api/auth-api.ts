import axios, { AxiosError } from "axios";





export const API = axios.create({
  baseURL: "http://localhost:8000/auth",
  withCredentials: true,
});

export const login = (
                   data:
                      {
                        username: string;
                        password: string;
                      }) => {


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
  try {
    console.log(
      "Sending registration data:",
      JSON.stringify({ username, email, password }, null, 2)
    );



   console.log("Sending request")
    const response = await API.post(
      "/register",
      { username, email, password },
      { headers: { "Content-Type": "application/json" } }
    );
   console.log("Response collected")



    console.log("Registration response:", response.data);
    return response.data;



  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Registration error status:", error.response?.status);
      console.error("Registration error details:", error.response?.data);
      if (error.response?.data?.detail) {
        console.error(
          "Validation errors:",
          JSON.stringify(error.response.data.detail, null, 2)
        );
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};




import useAuthStore from "../store/authStore";

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
