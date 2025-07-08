import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Box,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { ToastContainer, toast } from "react-toastify";
import projectClient from "../../../../clients/projectService";
import taskClient from "../../../../clients/taskService";
import userClient from "../../../../clients/userService";
import { AddTasksToProjectModal } from "./AddTasksToProjectModal";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
};

type Project = {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    fullname: string;
  };
};

type ProjectInforProps = {
  projectId: string;
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  onUpdated: () => void;
};

export function ProjectInfor({
  projectId,
  open,
  onClose,
  isEdit,
  onUpdated,
}: ProjectInforProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [currentTab, setCurrentTab] = useState("overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTasksOpen, setIsAddTasksOpen] = useState(false);
  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectClient.get(`/project/${projectId}`);
        const ownerResponse = await userClient.get(
          `/user/${response.data.ownerId}`
        );
        setProject({ ...response.data, owner: ownerResponse.data });
      } catch {
        toast.error("Failed to load project details.");
      }
    };

    fetchProject();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await taskClient.get(`/task/project/${projectId}`);
      setTasks(response.data);
    } catch {
      toast.error("Failed to fetch tasks.");
    }
  };

  const handleSave = async () => {
    if (!project) return;
    try {
      await projectClient.patch(`/project/${project._id}`, {
        title: project.title,
        description: project.description,
      });
      toast.success("Project updated successfully!");
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update project.");
    }
  };

  const handleTabChange = (_: unknown, newValue: string) => {
    setCurrentTab(newValue);
    if (newValue === "tasks") fetchTasks();
  };

  const confirmRemoveTask = async () => {
    if (!removeTargetId) return;
    try {
      await taskClient.patch(
        `/task/${removeTargetId}/remove-project/${projectId}`
      );
      await fetchTasks();
      toast.success("Task removed from project.");
    } catch {
      toast.error("Failed to remove task.");
    } finally {
      setRemoveTargetId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {project?.title || "Project Details"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        centered
        TabIndicatorProps={{
          style: { backgroundColor: "#635BFF", height: "2px" },
        }}
        sx={{ minHeight: "38px" }}
      >
        {["overview", "tasks"].map((tab) => (
          <Tab
            key={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            value={tab}
            sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              color: currentTab === tab ? "#635BFF" : "#6c737f",
              minHeight: "38px",
              px: 3,
              mx: 1,
              "&:hover": { backgroundColor: "transparent" },
              "&.Mui-selected": { color: "#635BFF" },
              "&.Mui-focusVisible": {
                outline: "none",
                boxShadow: "0 0 0 4px rgba(99, 91, 255, 0.25)",
                borderRadius: "4px",
              },
            }}
          />
        ))}
      </Tabs>

      <DialogContent dividers sx={{ minHeight: 250 }}>
        {currentTab === "overview" && project && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Project ID"
              value={project?._id || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Owner"
              value={project.owner?.fullname || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Title"
              value={project?.title || ""}
              fullWidth
              InputProps={{ readOnly: !isEdit }}
              onChange={(e) =>
                isEdit &&
                setProject((prev) => prev && { ...prev, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              value={project?.description || ""}
              fullWidth
              multiline
              minRows={3}
              InputProps={{ readOnly: !isEdit }}
              onChange={(e) =>
                isEdit &&
                setProject(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
          </Box>
        )}

        {currentTab === "tasks" && (
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "50vh" }}
          >
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {tasks.length === 0 ? (
                <p>No tasks assigned to this project.</p>
              ) : (
                tasks.map((task) => (
                  <Box
                    key={task._id}
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      mb: 1,
                      backgroundColor: "#fafafa",
                      position: "relative",
                    }}
                  >
                    {/* Remove icon button*/}
                    {isEdit && (
                      <IconButton
                        size="small"
                        onClick={() => setRemoveTargetId(task._id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#999",
                          "&:hover": { color: "#f44336" },
                        }}
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <strong>{task.title}</strong>
                    </Box>
                    <p style={{ margin: "4px 0" }}>{task.description}</p>
                    <p style={{ fontSize: "13px", color: "#666" }}>
                      Status: <b>{task.status}</b>
                    </p>
                    <p style={{ fontSize: "12px", color: "#999" }}>
                      Created at: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </Box>
                ))
              )}
            </Box>

            {isEdit && (
              <Box sx={{ pt: 2, borderTop: "1px solid #ddd" }}>
                <Button
                  variant="contained"
                  onClick={() => setIsAddTasksOpen(true)}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#635BFF",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    fontSize: "14px",
                    boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.08)",
                    "&:hover": { backgroundColor: "#4c47d1" },
                  }}
                  fullWidth
                >
                  Add Task
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      {isEdit && (
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#635BFF",
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.08)",
              "&:hover": { backgroundColor: "#4c47d1" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      )}

      <Dialog
        open={Boolean(removeTargetId)}
        onClose={() => setRemoveTargetId(null)}
      >
        <DialogTitle>Remove Task from Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can add it back at any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRemoveTargetId(null)}
            sx={{
              borderRadius: "12px",
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: "14px",
              color: "#333",
              backgroundColor: "#f5f5f5",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRemoveTask}
            variant="contained"
            sx={{
              borderRadius: "12px",
              backgroundColor: "#635BFF",
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: "14px",
              color: "#fff",
              boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.08)",
              "&:hover": {
                backgroundColor: "#4c47d1",
              },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <AddTasksToProjectModal
        open={isAddTasksOpen}
        onClose={() => setIsAddTasksOpen(false)}
        projectId={projectId}
        onConfirm={() => fetchTasks()}
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </Dialog>
  );
}
