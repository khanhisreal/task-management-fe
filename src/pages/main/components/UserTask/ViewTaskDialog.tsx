/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import taskClient from "../../../../clients/taskService";
import userClient from "../../../../clients/userService";
import { toast } from "react-toastify";

interface ViewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: string;
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

export function ViewTaskDialog({ open, onClose, taskId }: ViewTaskDialogProps) {
  const [task, setTask] = useState<TaskType | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (open) {
      fetchTask();
    }
  }, [open, taskId]);

  const fetchTask = async () => {
    try {
      const res = await taskClient.get(`/task/${taskId}`);
      const t = res.data;
      setTask(t);
      setProjects(
        t.projectTitles.map((title: string, index: number) => ({
          _id: t.projectIds[index],
          title,
        }))
      );
      const assignedIds = t.assignedTo;
      const userPromises = assignedIds.map((userId: string) =>
        userClient.get(`/user/${userId}`).then((res) => res.data.fullname)
      );
      const names = await Promise.all(userPromises);
      setUserNames(names);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task details.");
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
        {task?.title || "Task Details"}
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
              InputProps={{ readOnly: true }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={task?.status || "In Progress"}
                label="Status"
                disabled
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
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Projects"
              value={projects.map((p) => p.title).join("\n")}
              multiline
              fullWidth
              minRows={1}
              maxRows={6}
              InputProps={{ readOnly: true, sx: { overflowY: "auto" } }}
            />
            <TextField
              label="Assigned Users"
              value={userNames.join("\n")}
              multiline
              fullWidth
              minRows={1}
              maxRows={6}
              InputProps={{ readOnly: true, sx: { overflowY: "auto" } }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
