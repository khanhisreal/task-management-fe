import projectClient from "../../../../clients/projectService";
import styles from "./ConfirmDeleteProject.module.css";
import Button from "@mui/material/Button";

type ConfirmDeleteProjectProps = {
  projectId: string;
  onClose: () => void;
  onDeleted: () => void;
};

export function ConfirmDeleteProject({
  projectId,
  onClose,
  onDeleted,
}: ConfirmDeleteProjectProps) {
  const handleDelete = async () => {
    try {
      await projectClient.delete(`/project/${projectId}`);
      onDeleted();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred during project deletion.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialog}>
        <h1>Confirm delete</h1>
        <p>
          Are you sure you want to delete this project? This action cannot be
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
