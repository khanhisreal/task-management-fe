import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Modal,
} from "@mui/material";
import MagnifyingGlass from "../assets/images/main/Icon-magnifying-glass.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { clearUser } from "../store/slice/loginSlice";
import UserAvatar from "../assets/images/main/user-avatar.png";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 12,
  p: 4,
  borderRadius: 1,
};

export function Searchbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAccount, setOpenAccount] = useState(false);

  const user = useAppSelector((state) => state.login.user);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenAccount = () => {
    setOpenAccount(true);
    handleMenuClose();
  };

  const handleCloseAccount = () => setOpenAccount(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearUser());
    navigate("/auth");
  };

  const isMenuOpen = Boolean(anchorEl);
  const isArrowClicked = anchorEl?.dataset.type === "arrow";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        bgcolor: "#f3f4f6",
      }}
    >
      {/* Left: search icon */}
      <IconButton
        aria-label="search"
        sx={{
          width: 40,
          height: 40,
          "&:hover": { bgcolor: "#f1f1f1" },
        }}
      >
        <Box
          component="img"
          src={MagnifyingGlass}
          alt="Search"
          sx={{ width: 20, height: 20 }}
        />
      </IconButton>

      {/* Right: Avatar and ArrowDropDown as separate buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
        <IconButton>
          <Avatar
            alt={user?.fullname || "User"}
            src={UserAvatar}
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>

        <IconButton
          onClick={handleMenuOpen}
          data-type="arrow"
          sx={{
            transition: "transform 0.3s ease",
            transform: isArrowClicked && isMenuOpen ? "rotate(180deg)" : "none",
          }}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        slotProps={{
          list: { "aria-labelledby": "user-menu-button" },
        }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleOpenAccount}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Modal */}
      <Modal
        open={openAccount}
        onClose={handleCloseAccount}
        aria-labelledby="account-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="account-modal-title"
            variant="h6"
            sx={{ mb: 2, fontSize: "18px" }}
          >
            Account Info
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Fullname", value: user.fullname },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role },
                { label: "Status", value: user.status },
                { label: "Account Type", value: user.accountType },
                {
                  label: "Created At",
                  value: new Date(user.createdAt).toLocaleString(),
                },
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e0e0e0",
                    py: 1,
                  }}
                >
                  <Typography fontWeight={500}>{item.label}</Typography>
                  <Typography>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No user data found.</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
