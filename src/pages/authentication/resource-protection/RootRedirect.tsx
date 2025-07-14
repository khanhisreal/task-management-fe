import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

export function RootRedirect() {
  const user = useAppSelector((state) => state.login.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === "Employee") {
    return <Navigate to="/user-task" replace />;
  }

  return <Navigate to="/overview" replace />;
}
