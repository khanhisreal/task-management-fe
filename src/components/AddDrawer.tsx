import type { ReactNode } from "react";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type AddDrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function AddDrawer({ open, title, onClose, children }: AddDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "600px",
          backgroundColor: "#fff",
          height: "100vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "41px 24px 25px 24px",
        }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Content */}
      <Box sx={{ padding: "0px 24px" }}>{children}</Box>
    </Drawer>
  );
}
