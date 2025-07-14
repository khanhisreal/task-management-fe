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
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmStatusModal({
  open,
  onClose,
  onConfirm,
}: ConfirmStatusModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Status Update</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to mark this task as <strong>Done</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ backgroundColor: "#635BFF", textTransform: "none" }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
