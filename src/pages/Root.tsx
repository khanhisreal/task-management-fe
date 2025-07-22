import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAppSelector } from "../store/hook";
import user_icon from "../assets/images/main/icon-user-management.png";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import { Box } from "@mui/material";

export function Root() {
  const user = useAppSelector((state) => state.login.user);

  const navItems =
    user?.role !== "Employee"
      ? [
          {
            label: "Overview",
            icon: <OtherHousesOutlinedIcon sx={{ color: "white" }} />,
            to: "overview",
          },
          {
            label: "User Management",
            icon: (
              <img
                src={user_icon}
                alt="user management"
                style={{ width: 20 }}
              />
            ),
            to: "user-management",
          },
          {
            label: "Project Management",
            icon: <AccountTreeIcon sx={{ color: "white" }} />,
            to: "project-management",
          },
          {
            label: "Task Management",
            icon: <AssignmentIcon sx={{ color: "white" }} />,
            to: "task-management",
          },
        ]
      : [
          {
            label: "Todo Tasks",
            icon: <ListAltIcon sx={{ color: "white" }} />,
            to: "user-task",
          },
        ];

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar navItems={navItems} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          background: "#f3f4f6",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
