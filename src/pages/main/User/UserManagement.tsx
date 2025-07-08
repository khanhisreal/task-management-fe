/* eslint-disable react-hooks/exhaustive-deps */
import { Searchbar } from "../components/common/Searchbar";
import Add from "../../../assets/images/main/icon-add.png";
import List from "../../../assets/images/main/icon-filter-list.png";
import MagnifyingGlass from "../../../assets/images/main/Icon-magnifying-glass.png";
import IconBack from "../../../assets/images/main/icon-back.png";
import IconDown from "../../../assets/images/main/icon-down.png";
import styles from "./UserManagement.module.css";
import Button from "@mui/material/Button";
import UserRow from "../components/User/UserRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { ConfirmDelete } from "../components/User/ConfirmDelete";
import { UserInfor } from "../components/User/UserInfor";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AddUser } from "../components/User/AddUser";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchUsers as fetchUsersThunk } from "../../store/slice/userSlice";

type User = {
  _id: string;
  fullname: string;
  email: string;
  status: string;
  accountType: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  iat: number;
  exp: number;
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useAppDispatch();
  const { users, loading, total } = useAppSelector((state) => state.user);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  const handleUserInforClick = (userId: string, action: string) => {
    setSelectedUserId(userId);
    setIsEdit(action === "update");
    setShowEditDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedUserId(null);
  };

  const handleCloseUserInfor = () => {
    setShowEditDialog(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    loadUsers(1, rowsPerPage);
  }, []);

  const loadUsers = (page = currentPage, limit = rowsPerPage) => {
    dispatch(
      fetchUsersThunk({
        page,
        limit,
        query: searchQuery,
        role: roleFilter,
        status: statusFilter,
      })
    );
  };

  return (
    <div className={styles.container}>
      <Searchbar />
      <div className={styles.main}>
        <h1 className={styles.main_title}>
          <span>User Management</span>
        </h1>
        <div className={styles.main_form}>
          <div className={styles.form}>
            <div className={styles.header}>
              <p>List of Users</p>
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={handleOpen}
                >
                  <img src={List} alt="" />
                  <span>Filters</span>
                </Button>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={() => setShowAddUser(true)}
                >
                  <img src={Add} alt="" />
                  <span>Add new member</span>
                </Button>
              </div>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="filter-modal-title"
              aria-describedby="filter-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  borderRadius: "12px",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography
                  id="filter-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  User Filter
                </Typography>

                {/* Role Select */}
                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel id="role-filter-label">Role</InputLabel>
                  <Select
                    labelId="role-filter-label"
                    label="Role"
                    defaultValue=""
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Leader">Leader</MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                  </Select>
                </FormControl>

                {/* Status Select */}
                <FormControl fullWidth sx={{ mb: 3 }} size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    label="Status"
                    defaultValue=""
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Activated">Activated</MenuItem>
                    <MenuItem value="Inactivated">Inactivated</MenuItem>
                  </Select>
                </FormControl>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    onClick={handleClose}
                    sx={{
                      bgcolor: "#e0e0e0",
                      color: "black",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      borderRadius: "12px",
                      px: 2,
                      "&:hover": {
                        bgcolor: "#d5d5d5",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentPage(1);
                      loadUsers(1, rowsPerPage);
                      handleClose();
                    }}
                    sx={{
                      bgcolor: "#635bff",
                      color: "white",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      borderRadius: "12px",
                      px: 2,
                      "&:hover": {
                        bgcolor: "#564ee9",
                      },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Modal>
            <div className={styles.search_bar}>
              <div className={styles.search}>
                <img src={MagnifyingGlass} alt="" />
                <input
                  type="text"
                  placeholder="Search for user ID, name, email, or role"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(1);
                      loadUsers(1, rowsPerPage);
                    }
                  }}
                />
              </div>
              <Button
                variant="contained"
                className={styles.button}
                onClick={() => {
                  setCurrentPage(1);
                  loadUsers(1, rowsPerPage);
                }}
              >
                Search
              </Button>
            </div>
            <div className={styles.table_container}>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="150px"
                        >
                          <CircularProgress />
                        </Box>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={styles.fallback}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user: User, index: number) => (
                      <UserRow
                        key={user._id}
                        no={index + 1}
                        userId={user._id}
                        fullname={user.fullname}
                        email={user.email}
                        role={user.role}
                        joindate={new Date(user.createdAt).toLocaleString()}
                        status={user.status}
                        onDeleteClick={handleDeleteClick}
                        onUserInforClick={handleUserInforClick}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.dialog_container}>
              {showAddUser && (
                <AddUser
                  onClose={() => setShowAddUser(false)}
                  onAdded={() => loadUsers(1, rowsPerPage)}
                />
              )}
              {showDeleteDialog && (
                <ConfirmDelete
                  userId={selectedUserId!}
                  onClose={handleCloseDeleteDialog}
                  onDeleted={() => loadUsers(1, rowsPerPage)}
                />
              )}
              {showEditDialog && selectedUserId && (
                <UserInfor
                  userId={selectedUserId}
                  onClose={handleCloseUserInfor}
                  isEdit={isEdit}
                  onUpdated={() => loadUsers(1, rowsPerPage)}
                />
              )}
            </div>
            <div className={styles.pagination}>
              <div className={styles.items_per_page}>
                <label htmlFor="items_per_page">Rows per page:</label>
                <select
                  id={styles.items_per_page}
                  value={rowsPerPage}
                  onChange={(e) => {
                    const newLimit = parseInt(e.target.value);
                    setRowsPerPage(newLimit);
                    setCurrentPage(1);
                    loadUsers(1, newLimit);
                  }}
                >
                  <option value="10">10</option>
                  <option value="9">9</option>
                  <option value="8">8</option>
                  <option value="7">7</option>
                  <option value="6">6</option>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </div>
              <div className={styles.page_info}>
                <span>
                  {currentPage} of {Math.ceil(total / rowsPerPage) || 1}
                </span>
              </div>
              <div className={styles.navigation_buttons}>
                <Button
                  variant="text"
                  className={styles.button}
                  onClick={() => {
                    if (currentPage > 1) {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      loadUsers(newPage, rowsPerPage);
                    }
                  }}
                >
                  <img src={IconBack} alt="" />
                </Button>
                <Button
                  variant="text"
                  className={styles.button}
                  onClick={() => {
                    const totalPages = Math.ceil(total / rowsPerPage);
                    if (currentPage < totalPages) {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      loadUsers(newPage, rowsPerPage);
                    }
                  }}
                >
                  <img src={IconDown} alt="" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
