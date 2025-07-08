import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import taskClient from "../../../../clients/taskService";
import { toast } from "react-toastify";

interface TaskType {
  _id: string;
  title: string;
  description: string;
  status: string;
  projectIds: string[];
}

interface AddTasksToProjectModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onConfirm: (selectedTaskIds: string[]) => void;
}

const PAGE_SIZE = 5;

export function AddTasksToProjectModal({
  open,
  onClose,
  projectId,
  onConfirm,
}: AddTasksToProjectModalProps) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTasks = useCallback(
    async (page: number) => {
      try {
        const skip = (page - 1) * PAGE_SIZE;
        const res = await taskClient.get(
          `/task?skip=${skip}&limit=${PAGE_SIZE}`
        );
        const fetchedTasks: TaskType[] = res.data.tasks;
        setTasks(fetchedTasks);
        setTotal(res.data.total);

        // Automatically select tasks already assigned to this project
        const preSelectedTaskIds = fetchedTasks
          .filter((task) => task.projectIds.includes(projectId))
          .map((task) => task._id);

        setSelected((prev) => [...new Set([...prev, ...preSelectedTaskIds])]); // avoid duplicates
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tasks.");
      }
    },
    [projectId]
  );

  useEffect(() => {
    if (open) {
      setSelected([]);
      setCurrentPage(1);
      fetchTasks(1);
    }
  }, [open, fetchTasks]);

  const handlePageChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    fetchTasks(value);
  };

  const handleToggle = (taskId: string) => {
    setSelected((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleConfirm = async () => {
    try {
      await Promise.all(
        selected.map((taskId) =>
          taskClient.patch(`/task/${taskId}/assign-to-project/${projectId}`)
        )
      );
      toast.success("Tasks added to project.");
      onConfirm(selected);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign tasks.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Add Tasks to Project
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "400px", p: 0 }}>
        {tasks.length === 0 ? (
          <Typography sx={{ fontSize: "14px", color: "#999", p: 2 }}>
            No tasks available.
          </Typography>
        ) : (
          <List dense>
            {tasks.map((task) => (
              <ListItem
                key={task._id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleToggle(task._id)}
                    checked={selected.includes(task._id)}
                  />
                }
              >
                <ListItemText
                  primary={task.title}
                  secondary={task.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Pagination
            count={Math.ceil(total / PAGE_SIZE)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Box>
      )}

      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "capitalize" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            borderRadius: "12px",
            backgroundColor: "#635BFF",
            textTransform: "capitalize",
            fontWeight: 600,
            fontSize: "14px",
            "&:hover": { backgroundColor: "#4c47d1" },
          }}
        >
          Add Selected Tasks
        </Button>
      </DialogActions>
    </Dialog>
  );
}
