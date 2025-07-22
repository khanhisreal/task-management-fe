/* eslint-disable react-hooks/exhaustive-deps */
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { taskApi } from "../../api/index";

interface UserTaskInforDrawerProps {
  open: boolean;
  onClose: () => void;
  taskId: string;
  onUpdated: () => void;
}

interface TaskType {
  _id: string;
  title: string;
  description: string;
  status: "In Progress" | "Done";
  projectIds: string[];
  projectTitles: string[];
  assignedTo: string[];
  createdAt: string;
}

export function UserTaskInforDrawer({
  open,
  onClose,
  taskId,
  onUpdated,
}: UserTaskInforDrawerProps) {
  const [task, setTask] = useState<TaskType | null>(null);
  const [tab, setTab] = useState("overview");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<"In Progress" | "Done">("In Progress");

  useEffect(() => {
    if (open) {
      fetchTask();
    }
  }, [open, taskId]);

  const fetchTask = async () => {
    try {
      const res = await taskApi.get(`/task/${taskId}/user-view`);
      const t = res.data;
      setTask(t);
      setStatus(t.status);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task details.");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await taskApi.patch(`/task/${taskId}/status`, { status });
      toast.success("Task status updated.");
      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 480 } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6">{task?.title || "Task Details"}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

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
          value="overview"
          sx={{
            textTransform: "capitalize",
            fontSize: "14px",
            minHeight: "38px",
            px: 3,
            mx: 1,
            "&.Mui-selected": { color: "#635BFF" },
          }}
        />
      </Tabs>

      <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
        {tab === "overview" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Task ID"
              value={task?._id || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Title"
              value={task?.title || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Description"
              value={task?.description || ""}
              multiline
              minRows={2}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Projects"
              value={task?.projectTitles?.join(", ") || "No project"}
              multiline
              minRows={1}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Created At"
              value={task ? new Date(task.createdAt).toLocaleString() : ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) =>
                  setStatus(e.target.value as "In Progress" | "Done")
                }
                disabled={task?.status === "Done"}
              >
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>

            {task?.status !== "Done" && (
              <Button
                variant="contained"
                onClick={handleStatusUpdate}
                disabled={updating || status === task?.status}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: "#635BFF",
                  "&:hover": { backgroundColor: "#4b47db" },
                }}
              >
                {updating ? "Updating..." : "Confirm Status Update"}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
