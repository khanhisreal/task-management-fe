import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/Login";
import { RootRedirect } from "./pages/authentication/resource-protection/RootRedirect";
import { Root } from "./pages/Root";
import ProtectedRoute from "./pages/authentication/resource-protection/ProtectedRouteProps";
import Overview from "./pages/main/Overview";
import { UserManagement } from "./pages/main/UserManagement";
import { ProjectManagement } from "./pages/main/ProjectManagement";
import { TaskManagement } from "./pages/main/TaskManagement";
import { UserTask } from "./pages/main/UserTask";
import { CatchAllRedirect } from "./pages/authentication/resource-protection/CatchAllRedirect";

export const router = createBrowserRouter([
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
