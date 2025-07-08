/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AddProject.module.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import projectClient from "../../../../clients/projectService";

type AddProjectProps = {
  onClose: () => void;
  onAdded: () => void;
};

export function AddProject({ onClose, onAdded }: AddProjectProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const createProject = async () => {
      try {
        setLoading(true);
        const response = await projectClient.post("/project", formData);
        if (response.status === 201) {
          onClose();
          onAdded();
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    createProject();
  }

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.wrapper}>
            <h1>Add New Project</h1>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={formData.title}
              required
              minLength={3}
              maxLength={100}
              onChange={handleChange}
            />
            <div className={styles.form_wrapper}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                placeholder="Project description (optional)"
                value={formData.description}
                maxLength={500}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>
            <div className={styles.button_wrapper}>
              <Button
                variant="contained"
                className={styles.add_button}
                type="submit"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {loading ? "Adding..." : "Add Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
