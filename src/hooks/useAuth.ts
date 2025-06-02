import { login, register } from "../api/auth-api.ts";
import {getAuthState, useAuthStore} from "../store/authStore";
import useValidationStore from "../store/validationStore.ts";

export const useAuth = () => {
  const setAuth = getAuthState().setAuth;
  const logout = useAuthStore(s=>s.logout)
  const {clearAllFields} = useValidationStore();
  const loginUser = async (username: string, password: string) => {
    try {
      const res = await login({ username, password });
      if (!res || !res.data) {
        throw new Error("No response data from login API");
      }

      const { access, refresh } = res.data;

      // Store tokens in localStorage
      localStorage.setItem("access", access); // Fixed: removed extra colon
      localStorage.setItem("refresh", refresh);

      // Update auth store
      setAuth(access, username);

      console.log("Login successful, tokens stored");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const registerUser = async (username: string, email: string, password: string) => {
    try {
      console.log("IN useAuth - registering user");
      const res = await register(username, email, password);
      console.log("Registration response:", res);

      // Fixed: check the correct response structure
      if (!res || !res.access || !res.refresh) {
        throw new Error("Missing tokens in register API response");
      }

      const { access, refresh } = res;

      // Store tokens in localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Update auth store
      setAuth(access, username);

      console.log("Registration successful, tokens stored");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logoutUser=()=>{
        clearAllFields()
        logout()
  }

  return { login: loginUser, register: registerUser, logout:logoutUser };
};