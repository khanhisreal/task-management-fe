import type React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";
import { ErrorPage } from "../../error/ErrorPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const accessToken = localStorage.getItem("accessToken");
  const user = useAppSelector((state) => state.login.user);
  const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

  if (!isAuthChecked) return null;

  if (!accessToken || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <ErrorPage />;
  }

  return <>{children}</>;
}
