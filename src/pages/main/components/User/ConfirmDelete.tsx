import userClient from "../../../../clients/userService";
import styles from "./ConfirmDelete.module.css";
import Button from "@mui/material/Button";

type ConfirmDeleteProps = {
  userId: string;
  onClose: () => void;
  onDeleted: () => void;
};

export function ConfirmDelete({
  userId,
  onClose,
  onDeleted,
}: ConfirmDeleteProps) {
  const handleDelete = async () => {
    try {
      await userClient.delete(`/user/${userId}`);
      onClose();
      onDeleted();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred during deletion.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialog}>
        <h1>Confirm delete</h1>
        <p>
          Are you sure you want to delete this user? This action cannot be
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
