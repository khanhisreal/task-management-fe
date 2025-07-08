import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Modal,
  Pagination,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./AddTask.module.css";
import { useEffect, useState } from "react";
import taskClient from "../../../../clients/taskService";
import projectClient from "../../../../clients/projectService";

type AddTaskProps = {
  onClose: () => void;
  onAdded: () => void;
};

export function AddTask({ onClose, onAdded }: AddTaskProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectIds: [] as string[],
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const PROJECT_PAGE_SIZE = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>();

  const [loading, setLoading] = useState(false);

  function openProjectModal() {
    setTempSelectedIds(formData.projectIds);
    setModalOpen(true);
  }

  function closeProjectModal() {
    setModalOpen(false);
  }

  function confirmProjectSelection() {
    setFormData((prev) => ({
      ...prev,
      projectIds: tempSelectedIds ?? [],
    }));
    setModalOpen(false);
  }

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const fetchProjects = async (page: number) => {
    try {
      const skip = (page - 1) * PROJECT_PAGE_SIZE;
      const response = await projectClient.get(
        `/project?skip=${skip}&limit=${PROJECT_PAGE_SIZE}`
      );
      setProjects(response.data.projects);
      setTotalProjects(response.data.total);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const handleProjectPageChange = (_: any, value: number) => {
    setCurrentProjectPage(value);
    fetchProjects(value);
  };

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

    const createTask = async () => {
      try {
        setLoading(true);
        const response = await taskClient.post("/task", formData);
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

    createTask();
  }

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.wrapper}>
            <h1>Add New Task</h1>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              name="title"
              placeholder="Task title"
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
                placeholder="Task description (optional)"
                value={formData.description}
                maxLength={500}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>
            <div className={styles.form_wrapper}>
              <label htmlFor="projects">Parent Project</label>
              <div className={styles.projectInput} onClick={openProjectModal}>
                {formData.projectIds.length > 0
                  ? projects
                      .filter((p) => formData.projectIds.includes(p._id))
                      .map((p) => p.title)
                      .join(", ")
                  : "Click to choose project(s)"}
              </div>
              <Modal
                open={modalOpen}
                onClose={closeProjectModal}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  mt: "200px",
                }}
              >
                <div
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    minWidth: "420px",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Select Project(s)
                  </Typography>
                  <div style={{ marginBottom: "16px" }}>
                    <Box
                      sx={{
                        maxHeight: "240px",
                        overflowY: "auto",
                        mb: 2,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {projects.map((project) => (
                        <Box
                          key={project._id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 1,
                            py: 0.5,
                          }}
                        >
                          <Checkbox
                            checked={
                              tempSelectedIds?.includes(project._id) ?? false
                            }
                            onChange={() => {
                              setTempSelectedIds((prev = []) =>
                                prev.includes(project._id)
                                  ? prev.filter((id) => id !== project._id)
                                  : [...prev, project._id]
                              );
                            }}
                            sx={{ p: "4px" }}
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {project.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    {Math.ceil(totalProjects / PROJECT_PAGE_SIZE) > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 1,
                        }}
                      >
                        <Pagination
                          count={Math.ceil(totalProjects / PROJECT_PAGE_SIZE)}
                          page={currentProjectPage}
                          onChange={handleProjectPageChange}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <Button
                      onClick={closeProjectModal}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={confirmProjectSelection}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "#635bff",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        fontWeight: 600,
                        lineHeight: "24px",
                        boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.08)",
                        "&:hover": {
                          backgroundColor: "#564ff0",
                        },
                      }}
                    >
                      Assign to projects
                    </Button>
                  </div>
                </div>
              </Modal>
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
                {loading ? "Adding..." : "Add Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
