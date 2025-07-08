import { Button } from "@mui/material";
import taskClient from "../../../../clients/taskService";
import styles from "./ConfirmStatusUpdateTask.module.css";

type ConfirmStatusUpdateTaskProps = {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onUpdated: () => void;
};

export function ConfirmStatusUpdateTask({
  open,
  taskId,
  onClose,
  onUpdated,
}: ConfirmStatusUpdateTaskProps) {
  if (!open) return null;

  const handleUpdate = async () => {
    try {
      await taskClient.patch(`/task/${taskId}/status`, {
        status: "Done",
      });
      onUpdated();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred during status update.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialog}>
        <h1>Confirm status update</h1>
        <p>
          Are you sure you want to mark this task as <strong>Done</strong>?{" "}
          <br />
          Only Manager or Leader can change this later.
        </p>
        <div className={styles.buttons}>
          <Button variant="text" className={styles.button} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            className={styles.button}
            onClick={handleUpdate}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
