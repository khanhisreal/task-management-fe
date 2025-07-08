import styles from "./Searchbar.module.css";
import MagnifyingGlass from "../../../../assets/images/main/Icon-magnifying-glass.png";
import UserAvatar from "../../../../assets/images/main/user-avatar.png";
import DropDownMenu from "../../../../assets/images/main/icon-drop-down-menu.png";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { clearUser } from "../../../store/slice/loginSlice";

const style = {
  position: "absolute",
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openAccount, setOpenAccount] = useState(false);

  const user = useAppSelector((state) => state.login.user);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAccount = () => setOpenAccount(true);

  const handleCloseAccount = () => setOpenAccount(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearUser());
    handleClose();
    navigate("/auth");
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <IconButton aria-label="delete" className={styles.icon}>
          <img src={MagnifyingGlass} alt="" />
        </IconButton>
      </div>
      <div className={styles.right}>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ borderRadius: "25px" }}
          className={styles.button}
        >
          <img src={UserAvatar} alt="" />
          <img src={DropDownMenu} alt="" />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          <MenuItem sx={{ fontSize: "16px" }} onClick={handleClose}>
            Profile
          </MenuItem>
          <MenuItem sx={{ fontSize: "16px" }} onClick={handleOpenAccount}>
            My account
          </MenuItem>
          <MenuItem sx={{ fontSize: "16px" }} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
        <Modal
          open={openAccount}
          onClose={handleCloseAccount}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontSize: "18px" }}
            >
              Account Info
            </Typography>
            {user ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {[
                  { label: "Fullname", value: user.fullname },
                  { label: "Email", value: user.email },
                  { label: "Role", value: user.role },
                  { label: "Status", value: user.status },
                  { label: "Account Type", value: user.accountType },
                  {
                    label: "Created At",
                    value: new Date(user.createdAt).toLocaleString(),
                    isTimestamp: true,
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "16px",
                      color: item.isTimestamp ? "#888" : "#333",
                      borderBottom: "1px solid #e5e5e5",
                      py: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                      {item.label}:
                    </Typography>
                    <Typography
                      sx={{
                        ml: 2,
                        color: item.isTimestamp ? "#888" : "#000",
                        textAlign: "right",
                        fontSize: "16px",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ mt: 2, color: "#888", fontSize: "16px" }}>
                No user data found.
              </Typography>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
