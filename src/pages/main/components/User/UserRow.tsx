import { useState } from "react";
import styles from "./UserRow.module.css";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CopyIcon from "../../../../assets/images/main/icon-content-copy.png";

type UserActionButtonProps = {
  no: number;
  userId: string;
  fullname: string;
  email: string;
  role: string;
  joindate: string;
  status: string;
  onDeleteClick: (userId: string) => void;
  onUserInforClick: (userId: string, action: string) => void;
};

export default function UserRow({
  no,
  userId,
  fullname,
  email,
  role,
  joindate,
  status,
  onDeleteClick,
  onUserInforClick,
}: UserActionButtonProps) {
  const [open, setOpen] = useState(false);

  function handleCopy() {
    navigator.clipboard
      .writeText(userId)
      .then(() => {
        setOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy!", err);
      });
  }

  function handleClose(_event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <tr>
        <td>{no}</td>
        <td className={styles.userIdCell}>
          <div className={styles.userIdWrapper}>
            {userId.slice(0, 6) + "..."}
            <IconButton
              color="primary"
              className={styles.copyButton}
              onClick={handleCopy}
            >
              <img src={CopyIcon} alt="Copy User ID" />
            </IconButton>
          </div>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MuiAlert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Copied to clipboard!
            </MuiAlert>
          </Snackbar>
        </td>
        <td>{fullname}</td>
        <td>{email}</td>
        <td>
          <span className={styles.role_admin}>{role}</span>
        </td>
        <td>{joindate}</td>
        <td>
          <span className={styles.status_activated}>{status}</span>
        </td>
        <td className={styles.action_buttons}>
          <IconButton
            aria-label="delete"
            className={styles.button}
            onClick={() => onUserInforClick(userId, "view")}
          >
            <RemoveRedEyeIcon className={styles.icon} />
          </IconButton>
          <IconButton
            aria-label="delete"
            className={styles.button}
            onClick={() => onUserInforClick(userId, "update")}
          >
            <CreateIcon className={styles.icon} />
          </IconButton>
          <IconButton
            aria-label="delete"
            className={styles.button}
            onClick={() => onDeleteClick(userId)}
          >
            <DeleteIcon className={styles.icon} />
          </IconButton>
        </td>
      </tr>
    </>
  );
}
