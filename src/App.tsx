import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/authentication/Login";
import { Overview } from "./pages/main/Overview/Overview";
import { UserManagement } from "./pages/main/User/UserManagement";
import { Root } from "./pages/Root";
import ProtectedRoute from "./pages/authentication/resource-protection/ProtectedRouteProps";
import { RootRedirect } from "./pages/authentication/resource-protection/RootRedirect";
import { ProjectManagement } from "./pages/main/Project/ProjectManagement";
import { TaskManagement } from "./pages/main/Task/TaskManagement";
import { CatchAllRedirect } from "./pages/authentication/resource-protection/CatchAllRedirect";
import { useAppDispatch } from "./pages/store/hook";
import { useEffect, useState } from "react";
import { clearUser, setUser } from "./pages/store/slice/loginSlice";
import { UserTask } from "./pages/main/UserTask/UserTask";
import logo from "./assets/images/main/starack-logo.png";

const router = createBrowserRouter([
  { path: "auth", element: <Login /> },
  { path: "/", element: <RootRedirect /> },
  {
    path: "",
    element: <Root />,
    children: [
      {
        path: "overview",
        element: (
          <ProtectedRoute allowedRoles={["Manager", "Leader"]}>
            <Overview />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <ProtectedRoute allowedRoles={["Manager", "Leader"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-management",
        element: (
          <ProtectedRoute allowedRoles={["Manager", "Leader"]}>
            <ProjectManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "task-management",
        element: (
          <ProtectedRoute allowedRoles={["Manager", "Leader"]}>
            <TaskManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-task",
        element: (
          <ProtectedRoute allowedRoles={["Employee"]}>
            <UserTask />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <CatchAllRedirect />,
      },
    ],
  },
]);

function App() {
  const dispatch = useAppDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        dispatch(setUser(payload));
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(clearUser());
      }
    }
    setIsAuthChecked(true);
  }, [dispatch]);

  if (!isAuthChecked) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={logo}
          alt="Starack Logo"
          style={{ width: "40px", marginBottom: "12px" }}
        />
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Starack
        </h1>
        <p>Version V1.2</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
