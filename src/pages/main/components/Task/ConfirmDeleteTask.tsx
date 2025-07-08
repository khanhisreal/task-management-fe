import taskClient from "../../../../clients/taskService";
import styles from "./ConfirmDeleteTask.module.css";
import Button from "@mui/material/Button";

type ConfirmDeleteTaskProps = {
  taskId: string;
  onClose: () => void;
  onDeleted: () => void;
};

export function ConfirmDeleteTask({
  taskId,
  onClose,
  onDeleted,
}: ConfirmDeleteTaskProps) {
  const handleDelete = async () => {
    try {
      await taskClient.delete(`/task/${taskId}`);
      onDeleted();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred during task deletion.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialog}>
        <h1>Confirm delete</h1>
        <p>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className={styles.buttons}>
          <Button variant="text" className={styles.button} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            className={styles.button}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
