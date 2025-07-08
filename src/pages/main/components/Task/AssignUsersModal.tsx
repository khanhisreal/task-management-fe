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
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import userClient from "../../../../clients/userService";

interface UserType {
  _id: string;
  fullname: string;
}

interface AssignUsersModalProps {
  open: boolean;
  onClose: () => void;
  assigned: string[];
  onConfirm: (selectedUserIds: string[]) => void;
}

const PAGE_SIZE = 5;

export function AssignUsersModal({
  open,
  onClose,
  assigned,
  onConfirm,
}: AssignUsersModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageUsers, setPageUsers] = useState<UserType[]>([]);

  const fetchUsers = useCallback(async (page: number) => {
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const res = await userClient.get(`/user?skip=${skip}&limit=${PAGE_SIZE}`);
      setPageUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users.");
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(assigned);
      setCurrentPage(1);
      fetchUsers(1);
    }
  }, [open, assigned, fetchUsers]);

  const handlePageChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    fetchUsers(value);
  };

  const handleToggle = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select Users</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "400px", p: 0 }}>
        {pageUsers.length === 0 ? (
          <Typography sx={{ fontSize: "14px", color: "#999", p: 2 }}>
            No users available.
          </Typography>
        ) : (
          <List dense>
            {pageUsers.map((user) => (
              <ListItem
                key={user._id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleToggle(user._id)}
                    checked={selected.includes(user._id)}
                  />
                }
              >
                <ListItemText primary={user.fullname} />
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
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
