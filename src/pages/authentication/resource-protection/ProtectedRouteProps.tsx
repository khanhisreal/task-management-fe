import type React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";

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

  if (!accessToken || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "Employee") {
      return <Navigate to="/user-task" replace />;
    } else {
      return <Navigate to="/overview" replace />;
    }
  }

  return <>{children}</>;
}
