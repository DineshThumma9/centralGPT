// src/routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import {getAuthState, useAuthStore} from "../store/authStore";

export default function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = getAuthState().token

  return token ? children : <Navigate to="/login" />;
}