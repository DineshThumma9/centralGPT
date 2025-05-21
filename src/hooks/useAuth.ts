import { login, register } from "../service/auth-api.ts";
import {getAuthState, useAuthStore} from "../store/authStore";

export const useAuth = () => {




  const setAuth = getAuthState().setAuth


  const logout = getAuthState().logout

  const loginUser = async (username: string, password: string) => {
    const res = await login({ username, password });
    const { token, username: returnedUser } = res.data;
    setAuth(token, returnedUser); // token now auto-attached in future requests
  };

  const registerUser = async (username: string, email: string, password: string) => {
    const res = await register( username, email, password );
    const { token, username: returnedUser } = res.data;
    setAuth(token, returnedUser);
  };

  return { login: loginUser, register: registerUser, logout };
};
