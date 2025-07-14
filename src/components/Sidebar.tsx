import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import starack_logo from "../assets/images/main/starack-logo.png";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: { xs: 100, xl: 250 },
        flexShrink: 0,
        bgcolor: "#121621",
        color: "white",
        p: "24px 16px",
        borderRight: "none",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
      }}
    >
      {/* Logo area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          justifyContent: { xs: "center", xl: "flex-start" },
        }}
      >
        <Box
          sx={{
            width: { xs: 32, xl: 45 },
            height: { xs: 32, xl: 45 },
            p: "4px",
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: { xs: 0, xl: 2 },
          }}
        >
          <img
            src={starack_logo}
            alt="logo"
            style={{ width: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Text content: hidden on small screens */}
        <Box sx={{ display: { xs: "none", xl: "block" } }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            STARACK
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#b5bcc4" }}>
            Version V1.2
          </Typography>
        </Box>
      </Box>

      {/* Navigation buttons */}
      <List>
        {navItems.map(({ label, icon, to }) => (
          <ListItemButton
            key={to}
            selected={location.pathname === `/${to}`}
            onClick={() => navigate(`/${to}`)}
            sx={{
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "12px",
              mb: 0.5,
              bgcolor: "#121621",
              color: "white",
              display: "flex",
              justifyContent: { xs: "center", xl: "flex-start" },
              "&.Mui-selected": {
                bgcolor: "#635bff",
                "&:hover": {
                  bgcolor: "#635bff",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: { xs: 0, xl: 1 },
                "& img, & svg": {
                  width: 20,
                  height: 20,
                },
              }}
            >
              {icon}
            </ListItemIcon>

            {/* Label text: hidden on small screens */}
            <ListItemText
              primary={label}
              sx={{
                display: { xs: "none", xl: "block" },
              }}
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "Inter",
                color: "inherit",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
