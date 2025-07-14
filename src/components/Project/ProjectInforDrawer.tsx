import {
  Box,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useCallback } from "react";
import { projectApi, taskApi, userApi } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Project = {
  _id: string;
  title: string;
  description: string;
  owner?: { fullname: string };
};

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  projectIds: string[];
};

type Props = {
  projectId: string;
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  onUpdated: () => void;
};

const PAGE_SIZE = 5;

export function ProjectInforDrawer({
  projectId,
  open,
  onClose,
  isEdit,
  onUpdated,
}: Props) {
  const [currentTab, setCurrentTab] = useState<"overview" | "tasks">(
    "overview"
  );
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProject = async () => {
    try {
      const res = await projectApi.get(`/project/${projectId}`);
      const ownerRes = await userApi.get(`/user/${res.data.ownerId}`);
      setProject({ ...res.data, owner: ownerRes.data });
    } catch {
      toast.error("Failed to fetch project");
    }
  };

  const fetchProjectTasks = async () => {
    try {
      const res = await taskApi.get(`/task/project/${projectId}`);
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch project tasks");
    }
  };

  const fetchAllTasks = useCallback(
    async (page: number) => {
      try {
        const skip = (page - 1) * PAGE_SIZE;
        const res = await taskApi.get(`/task?skip=${skip}&limit=${PAGE_SIZE}`);
        setAllTasks(res.data.tasks);
        setTotalTasks(res.data.total);
        const preSelected = res.data.tasks
          .filter((t: Task) => t.projectIds.includes(projectId))
          .map((t: Task) => t._id);
        setSelectedTasks((prev) => [...new Set([...prev, ...preSelected])]);
      } catch {
        toast.error("Failed to fetch tasks");
      }
    },
    [projectId]
  );

  const handleSave = async () => {
    if (!project) return;
    try {
      await projectApi.patch(`/project/${project._id}`, {
        title: project.title,
        description: project.description,
      });
      await Promise.all(
        selectedTasks.map((id) =>
          taskApi.patch(`/task/${id}/assign-to-project/${project._id}`)
        )
      );
      toast.success("Project updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    if (open) {
      fetchProject();
      setCurrentTab("overview");
      setTasks([]);
      setSelectedTasks([]);
      setCurrentPage(1);
    }
  }, [open]);

  useEffect(() => {
    if (!open || currentTab !== "tasks") return;
    if (isEdit) {
      fetchAllTasks(currentPage);
    } else {
      fetchProjectTasks();
    }
  }, [open, currentTab, currentPage, isEdit, fetchAllTasks]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 600 } }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: "30px 24px 0px 24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 18 }}>
            {project?.title || "Project Info"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{ borderBottom: "1px solid #e5e7eb" }}
        >
          {["overview", "tasks"].map((tab) => (
            <Tab
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              value={tab}
              sx={{
                minWidth: "auto",
                px: 1.5,
                fontSize: 14,
                textTransform: "capitalize",
                ml: tab === "overview" ? 3 : 1,
                color: currentTab === tab ? "#635bff" : "rgba(0,0,0,0.6)",
                fontWeight: currentTab === tab ? 500 : 400,
                borderBottom:
                  currentTab === tab
                    ? "4px solid #635bff"
                    : "4px solid transparent",
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
          {currentTab === "overview" && project && (
            <Box sx={{ mt: 3 }}>
              <TextField
                value={project._id}
                size="small"
                label="Project ID"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                value={project.owner?.fullname || ""}
                size="small"
                label="Owner"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                value={project.title}
                size="small"
                label="Title"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: !isEdit }}
                onChange={(e) =>
                  isEdit &&
                  setProject(
                    (prev) => prev && { ...prev, title: e.target.value }
                  )
                }
              />
              <TextField
                value={project.description}
                size="small"
                label="Description"
                fullWidth
                multiline
                minRows={3}
                margin="normal"
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
            <Box sx={{ mt: 2 }}>
              {(isEdit ? allTasks : tasks).length === 0 ? (
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#999",
                    textAlign: "center",
                    mt: 3,
                  }}
                >
                  No tasks available.
                </Typography>
              ) : (
                <Box
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    pr: 0.5,
                  }}
                >
                  {(isEdit ? allTasks : tasks).map((task) => (
                    <Box
                      key={task._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid #e5e7eb",
                        borderRadius: 1,
                        p: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography fontSize={14} fontWeight={500}>
                          {task.title}
                        </Typography>
                        <Typography fontSize={13} color="#777">
                          {task.description}
                        </Typography>
                      </Box>
                      {isEdit && (
                        <Checkbox
                          edge="end"
                          checked={selectedTasks.includes(task._id)}
                          onChange={() =>
                            setSelectedTasks((prev) =>
                              prev.includes(task._id)
                                ? prev.filter((id) => id !== task._id)
                                : [...prev, task._id]
                            )
                          }
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {isEdit && Math.ceil(totalTasks / PAGE_SIZE) > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={Math.ceil(totalTasks / PAGE_SIZE)}
                    page={currentPage}
                    onChange={(_, val) => setCurrentPage(val)}
                    color="primary"
                    size="small"
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>

        {isEdit && (
          <Box display="flex" justifyContent="flex-end" p={3} pt={0}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                borderRadius: "12px",
                backgroundColor: "#635BFF",
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: "14px",
                px: 3,
              }}
            >
              Confirm
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
