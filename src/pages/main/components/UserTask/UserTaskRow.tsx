import { useState } from "react";
import styles from "./UserTaskRow.module.css";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import TaskIcon from "@mui/icons-material/Task";
import CopyIcon from "../../../../assets/images/main/icon-content-copy.png";
import { ViewTaskDialog } from "./ViewTaskDialog";
import { ConfirmStatusUpdateTask } from "./ConfirmStatusUpdateTask";

type UserTaskRowProps = {
  no: number;
  taskId: string;
  title: string;
  status: string;
  projectTitle: string;
  onUpdateStatus: (taskId: string) => void;
};

export default function UserTaskRow({
  no,
  taskId,
  title,
  status,
  projectTitle,
  onUpdateStatus,
}: UserTaskRowProps) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  function handleCopy() {
    navigator.clipboard
      .writeText(taskId)
      .then(() => setOpenSnackbar(true))
      .catch((err) => console.error("Failed to copy!", err));
  }

  function handleCloseSnackbar(
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
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
        </td>
        <td>{title}</td>
        <td>{status}</td>
        <td>{projectTitle}</td>
        <td className={styles.action_buttons}>
          <IconButton
            aria-label="view-task"
            className={styles.button}
            onClick={() => setOpenDialog(true)}
          >
            <RemoveRedEyeIcon className={styles.icon} />
          </IconButton>
          <IconButton
            aria-label="update-status"
            className={styles.button}
            onClick={() => setOpenStatusDialog(true)}
            disabled={status === "Done"}
          >
            <TaskIcon className={styles.icon} />
          </IconButton>
        </td>
      </tr>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Copied to clipboard!
        </MuiAlert>
      </Snackbar>
      <ViewTaskDialog
        open={openDialog}
        taskId={taskId}
        onClose={() => setOpenDialog(false)}
      />
      <ConfirmStatusUpdateTask
        open={openStatusDialog}
        taskId={taskId}
        onClose={() => setOpenStatusDialog(false)}
        onUpdated={() => {
          onUpdateStatus(taskId);
          setOpenStatusDialog(false);
        }}
      />
    </>
  );
}
