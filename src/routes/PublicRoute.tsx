// src/routes/PublicRoute.tsx
import {Navigate} from "react-router-dom";
import {getAuthState} from "../store/authStore";
import type {JSX} from "react";

export default function PublicRoute({children}: { children: JSX.Element }) {
    const token = getAuthState().token;

    return token ? <Navigate to="/app"/> : children;
}
