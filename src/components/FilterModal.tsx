import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

type FilterModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onApply: () => void;
};

export function FilterModal({
  open,
  title,
  children,
  onCancel,
  onApply,
}: FilterModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          {title}
        </Typography>

        {children}

        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button
            onClick={onCancel}
            sx={{
              bgcolor: "#e0e0e0",
              color: "black",
              textTransform: "capitalize",
              fontWeight: 600,
              borderRadius: "12px",
              px: 2,
              "&:hover": { bgcolor: "#d5d5d5" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onApply}
            sx={{
              bgcolor: "#635bff",
              color: "white",
              textTransform: "capitalize",
              fontWeight: 600,
              borderRadius: "12px",
              px: 2,
              "&:hover": { bgcolor: "#564ee9" },
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
