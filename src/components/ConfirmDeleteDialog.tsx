import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmDeleteDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
        {title}
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
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ display: "flex", justifyContent: "flex-end", p: 0, mt: "16px" }}
      >
        <Button
          variant="text"
          onClick={onCancel}
          sx={{
            borderRadius: "12px",
            textTransform: "capitalize",
            fontSize: "14px",
            fontWeight: 600,
            color: "black",
          }}
        >
          {cancelLabel}
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
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
