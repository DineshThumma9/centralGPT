import PublicRoute from "./routes/PublicRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Layout from "./pages/Layout.tsx";
import ChatArea from "./components/ChatArea.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Navigate to="/login" />,
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        ),
      },
      {
        element: (
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        ),
        children: [
          { path: "/app", element: <ChatArea /> },
        ],
      },
    ],
  },
]);

export default router