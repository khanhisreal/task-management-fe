import { useState } from "react";
import styles from "./TaskRow.module.css";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CopyIcon from "../../../../assets/images/main/icon-content-copy.png";

type TaskRowProps = {
  no: number;
  taskId: string;
  title: string;
  description: string;
  status: string;
  projectTitle: string;
  onDeleteClick: (taskId: string) => void;
  onTaskActionClick: (taskId: string, action: string) => void;
};

export default function TaskRow({
  no,
  taskId,
  title,
  description,
  status,
  projectTitle,
  onDeleteClick,
  onTaskActionClick,
}: TaskRowProps) {
  const [open, setOpen] = useState(false);

  function handleCopy() {
    navigator.clipboard
      .writeText(taskId)
      .then(() => setOpen(true))
      .catch((err) => console.error("Failed to copy!", err));
  }

  function handleClose(_event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  return (
    <>
      <tr>
        <td>{no}</td>
        <td className={styles.taskIdCell}>
          <div className={styles.taskIdWrapper}>
            {taskId.slice(0, 6) + "..."}
            <IconButton
              color="primary"
              className={styles.copyButton}
              onClick={handleCopy}
            >
              <img src={CopyIcon} alt="Copy Task ID" />
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
        <td>{title}</td>
        <td>{description}</td>
        <td>{status}</td>
        <td>{projectTitle}</td>
        <td className={styles.action_buttons}>
          <IconButton
            className={styles.button}
            onClick={() => onTaskActionClick(taskId, "view")}
          >
            <RemoveRedEyeIcon className={styles.icon} />
          </IconButton>
          <IconButton
            className={styles.button}
            onClick={() => onTaskActionClick(taskId, "edit")}
          >
            <CreateIcon className={styles.icon} />
          </IconButton>
          <IconButton
            className={styles.button}
            onClick={() => onDeleteClick(taskId)}
          >
            <DeleteIcon className={styles.icon} />
          </IconButton>
        </td>
      </tr>
    </>
  );
}
