import { login, register } from "../service/auth-api.ts";
import {getAuthState} from "../store/authStore";

export const useAuth = () => {




  const setAuth = getAuthState().setAuth


  const logout = getAuthState().logout

  const loginUser = async (username: string, password: string) => {
    try {
      const res = await login({ username, password });
        if (!res || !res.data) {
      throw new Error("No response data from register API");
    }

      const { access ,refresh} = res.data;
       localStorage.setItem("access:",access)
       localStorage.setItem("refresh" ,refresh)
      setAuth(access, username); // token now auto-attached in future requests
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const registerUser = async (username: string, email: string, password: string) => {
  try {
    console.log("IN useAuth");
    const res = await register(username, email, password);
    console.log("Registration response:", res);

    if (!res || !res.access || !res.refresh) {
      throw new Error("Missing tokens in register API response");
    }

    const { access, refresh } = res;
    setAuth(access, username);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("access", access);
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
m
};


  return { login: loginUser, register: registerUser, logout };
};
