import { login, register } from "../api/auth-api.ts";
import useValidationStore from "../store/validationStore.ts";
import useAuthStore from "../store/authStore.ts";
import useInitStore from "../store/initStore.ts";

export const useAuth = () => {



  const logout = useAuthStore.getState().clearAuth
  const {clearAllFields} = useValidationStore();

  const {setAccessToken,setRefreshToken} = useAuthStore()
  const {clearInit} = useInitStore()

  const loginUser = async (username: string, password: string) => {
    try {
      const res = await login({ username, password });
      if (!res || !res.data) {
        throw new Error("No response data from login API");
      }

      const { access, refresh } = res.data;



      setAccessToken(access)
      setRefreshToken(refresh)


      // Update auth store
      // setAuth(access, username);

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

            setAccessToken(access)
      setRefreshToken(refresh)


      // Update auth store
      // setAuth(access, username);

      console.log("Registration successful, tokens stored");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logoutUser=()=>{
        clearAllFields()
        clearInit()
        logout()
  }

  return { login: loginUser, register: registerUser, logout:logoutUser };
};