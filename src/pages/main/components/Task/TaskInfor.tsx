/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import taskClient from "../../../../clients/taskService";
import userClient from "../../../../clients/userService";
import { toast } from "react-toastify";
import { AssignUsersModal } from "./AssignUsersModal";

interface TaskInforProps {
  open: boolean;
  onClose: () => void;
  taskId: string;
  isEdit: boolean;
  onUpdated: () => void;
}

interface TaskType {
  _id: string;
  title: string;
  description: string;
  status: "In Progress" | "Done";
  projectIds: string[];
  assignedTo: {
    _id: string;
    fullname: string;
  }[];
}

interface ProjectType {
  _id: string;
  title: string;
}

export function TaskInfor({
  open,
  onClose,
  taskId,
  isEdit,
  onUpdated,
}: TaskInforProps) {
  const [task, setTask] = useState<TaskType | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [users, setUsers] = useState<{ _id: string; fullname: string }[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [tab, setTab] = useState("overview");
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
      fetchUsers();
    }
  }, [open, taskId]);

  const fetchUsers = async () => {
    try {
      const res = await userClient.get("/user");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users.");
    }
  };

  const fetchData = async () => {
    try {
      const t = await taskClient.get(`/task/${taskId}`);
      setTask(t.data);
      setProjects(
        t.data.projectTitles.map((title: string, index: number) => ({
          _id: t.data.projectIds[index],
          title,
        }))
      );
      const assignedIds = t.data.assignedTo;

      const userPromises = assignedIds.map((userId: string) =>
        userClient.get(`/user/${userId}`).then((res) => res.data.fullname)
      );
      const names = await Promise.all(userPromises);
      setUserNames(names);
      setAssigned(assignedIds);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task info.");
    }
  };

  const handleSave = async () => {
    try {
      await taskClient.patch(`/task/${taskId}`, {
        title: task!.title,
        description: task!.description,
        assignedTo: assigned,
        status: task!.status,
      });
      toast.success("Task updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update task.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {task?.title || "Task Info"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered
        TabIndicatorProps={{
          style: { backgroundColor: "#635BFF", height: "2px" },
        }}
        sx={{ minHeight: "38px" }}
      >
        <Tab
          label="Overview"
          sx={{
            textTransform: "capitalize",
            fontSize: "14px",
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
          value="overview"
        />
        <Tab
          label="Assign Users"
          sx={{
            textTransform: "capitalize",
            fontSize: "14px",
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
          value="assignUsers"
        />
      </Tabs>
      <DialogContent dividers sx={{ minHeight: 250 }}>
        {tab === "overview" && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Task ID"
              value={task?._id || ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Title"
              value={task?.title || ""}
              fullWidth
              onChange={(e) =>
                isEdit && task && setTask({ ...task, title: e.target.value })
              }
              InputProps={{ readOnly: !isEdit }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={task?.status || "In Progress"}
                label="Status"
                onChange={(e) =>
                  isEdit &&
                  task &&
                  setTask({
                    ...task,
                    status: e.target.value as "In Progress" | "Done",
                  })
                }
                disabled={!isEdit}
              >
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={task?.description || ""}
              fullWidth
              multiline
              minRows={2}
              onChange={(e) =>
                isEdit &&
                task &&
                setTask({ ...task, description: e.target.value })
              }
              InputProps={{ readOnly: !isEdit }}
            />
            <TextField
              label="Projects"
              value={projects.map((p) => p.title).join("\n")}
              multiline
              fullWidth
              minRows={1}
              maxRows={6}
              InputProps={{
                readOnly: true,
                sx: { overflowY: "auto" },
              }}
            />
          </Box>
        )}
        {tab === "assignUsers" && (
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "50vh" }}
          >
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {userNames.length === 0 ? (
                <Typography sx={{ fontSize: "14px", color: "#999" }}>
                  No users assigned to this task.
                </Typography>
              ) : (
                userNames.map((name, index) => (
                  <Box
                    key={assigned[index]}
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      mb: 1,
                      backgroundColor: "#f0f4ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{name}</Typography>
                    {isEdit && (
                      <IconButton
                        onClick={() => {
                          const removedUserId = assigned[index];
                          setAssigned((prev) =>
                            prev.filter((id) => id !== removedUserId)
                          );
                          setUserNames((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))
              )}
            </Box>
            {isEdit && (
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={() => setAssignUserModalOpen(true)}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#635BFF",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    fontSize: "14px",
                    "&:hover": { backgroundColor: "#4c47d1" },
                  }}
                >
                  Add Users
                </Button>
              </Box>
            )}
          </Box>
        )}
        <AssignUsersModal
          open={assignUserModalOpen}
          onClose={() => setAssignUserModalOpen(false)}
          assigned={assigned}
          onConfirm={(selectedUserIds) => {
            setAssigned(selectedUserIds);
            const selectedNames = users
              .filter((u) => selectedUserIds.includes(u._id))
              .map((u) => u.fullname);
            setUserNames(selectedNames);
          }}
        />
      </DialogContent>
      {isEdit && (
        <DialogActions>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              borderRadius: "12px",
              backgroundColor: "#635BFF",
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: "14px",
              "&:hover": { backgroundColor: "#4c47d1" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
