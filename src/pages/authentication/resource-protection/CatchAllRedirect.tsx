import { Navigate } from "react-router-dom";
import { ErrorPage } from "../../error/ErrorPage";

export function CatchAllRedirect() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to={"/auth"} replace />;
  }

  return <ErrorPage />;
}
