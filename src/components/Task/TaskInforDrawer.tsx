import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { taskApi, userApi } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  projectTitles: string[];
  assignedTo: string[];
};

type User = {
  _id: string;
  fullname: string;
};

type Props = {
  taskId: string;
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  onUpdated: () => void;
};

const PAGE_SIZE = 5;

export function TaskInforDrawer({
  taskId,
  open,
  onClose,
  isEdit,
  onUpdated,
}: Props) {
  const [currentTab, setCurrentTab] = useState<"overview" | "users">(
    "overview"
  );
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loadingTask, setLoadingTask] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  const fetchTask = async () => {
    setLoadingTask(true);
    try {
      const res = await taskApi.get(`/task/${taskId}`);
      setTask(res.data);
      setSelectedUserIds(res.data.assignedTo);
      if (res.data.assignedTo.length > 0) {
        await fetchAssignedUsers(res.data.assignedTo);
      } else {
        setAssignedUsers([]);
      }
    } catch {
      toast.error("Failed to fetch task");
    } finally {
      setLoadingTask(false);
    }
  };

  const fetchUsers = useCallback(async (page: number) => {
    setLoadingUsers(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const res = await userApi.get(`/user?skip=${skip}&limit=${PAGE_SIZE}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.total);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchAssignedUsers = async (userIds: string[]) => {
    try {
      const promises = userIds.map((id) => userApi.get(`/user/${id}`));
      const responses = await Promise.all(promises);
      const users = responses.map((res) => res.data);
      setAssignedUsers(users);
    } catch {
      toast.error("Failed to fetch assigned users");
    }
  };

  const handleSave = async () => {
    if (!task) return;
    try {
      await taskApi.patch(`/task/${task._id}`, {
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: selectedUserIds,
      });
      toast.success("Task updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    if (open) {
      fetchTask();
      setCurrentTab("overview");
      setCurrentPage(1);
    }
  }, [open]);

  useEffect(() => {
    if (open && currentTab === "users" && isEdit) {
      fetchUsers(currentPage);
    }
  }, [open, currentTab, currentPage, isEdit, fetchUsers]);

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
            {task?.title || "Task Info"}
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
          {["overview", "users"].map((tab) => (
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
          {currentTab === "overview" && (
            <Box sx={{ mt: 3 }}>
              {loadingTask ? (
                <Box display="flex" justifyContent="center" mt={5}>
                  <CircularProgress />
                </Box>
              ) : task ? (
                <>
                  <TextField
                    value={task._id}
                    size="small"
                    label="Task ID"
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    value={task.title}
                    size="small"
                    label="Title"
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: !isEdit }}
                    onChange={(e) =>
                      isEdit &&
                      setTask(
                        (prev) => prev && { ...prev, title: e.target.value }
                      )
                    }
                  />
                  <TextField
                    value={task.description}
                    size="small"
                    label="Description"
                    fullWidth
                    multiline
                    minRows={3}
                    margin="normal"
                    InputProps={{ readOnly: !isEdit }}
                    onChange={(e) =>
                      isEdit &&
                      setTask(
                        (prev) =>
                          prev && { ...prev, description: e.target.value }
                      )
                    }
                  />
                  <TextField
                    value={task.status}
                    size="small"
                    label="Status"
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    value={task.projectTitles?.join(", ") || "No project"}
                    size="small"
                    label="Projects"
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </>
              ) : (
                <Typography fontSize={14} color="#999">
                  No task data.
                </Typography>
              )}
            </Box>
          )}

          {currentTab === "users" && (
            <Box sx={{ mt: 2 }}>
              {!isEdit ? (
                task?.assignedTo.length === 0 ? (
                  <Typography fontSize={14} color="#999">
                    No users assigned to this task.
                  </Typography>
                ) : (
                  assignedUsers.map((user) => (
                    <Typography
                      key={user._id}
                      fontSize={14}
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 1,
                        p: 1.5,
                        mb: 1,
                        backgroundColor: "#f0f4ff",
                      }}
                    >
                      {user.fullname}
                    </Typography>
                  ))
                )
              ) : loadingUsers ? (
                <Box display="flex" justifyContent="center" mt={5}>
                  <CircularProgress />
                </Box>
              ) : users.length === 0 ? (
                <Typography fontSize={14} color="#999">
                  No users available.
                </Typography>
              ) : (
                <>
                  {users.map((user) => (
                    <Box
                      key={user._id}
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
                      <Typography fontSize={14}>{user.fullname}</Typography>
                      <Checkbox
                        edge="end"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() =>
                          setSelectedUserIds((prev) =>
                            prev.includes(user._id)
                              ? prev.filter((id) => id !== user._id)
                              : [...prev, user._id]
                          )
                        }
                      />
                    </Box>
                  ))}
                  {Math.ceil(totalUsers / PAGE_SIZE) > 1 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Pagination
                        count={Math.ceil(totalUsers / PAGE_SIZE)}
                        page={currentPage}
                        onChange={(_, val) => setCurrentPage(val)}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  )}
                </>
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
