import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmStatusModalProps {
  open: boolean;
  status: "In Progress" | "Done";
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmStatusModal({
  open,
  status,
  onClose,
  onConfirm,
}: ConfirmStatusModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          width: "444px",
          p: "16px 24px",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#111927",
          fontSize: "18px",
          fontWeight: 700,
          mt: "13px",
          p: 0,
        }}
      >
        Confirm Status Update
      </DialogTitle>

      <DialogContent sx={{ p: 0, mt: "16px" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#6C737F",
            mb: "16px",
          }}
        >
          Are you sure you want to mark this task as <strong>{status}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ display: "flex", justifyContent: "flex-end", p: 0, mt: "16px" }}
      >
        <Button
          variant="text"
          onClick={onClose}
          sx={{
            borderRadius: "12px",
            textTransform: "capitalize",
            fontSize: "14px",
            fontWeight: 600,
            color: "black",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            borderRadius: "12px",
            textTransform: "capitalize",
            fontSize: "14px",
            fontWeight: 600,
            ml: "5px",
            backgroundColor: "#635BFF",
            "&:hover": {
              backgroundColor: "#564FF0",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
