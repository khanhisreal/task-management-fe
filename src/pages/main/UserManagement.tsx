import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchUsers } from "../../store/slice/userSlice";
import { toast } from "react-toastify";
import { FilterModal } from "../../components/FilterModal";
import { SearchActionBar } from "../../components/SearchActionBar";
import { TableComponent } from "../../components/TableComponent";
import Layout from "../../layout/Layout";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { userApi } from "../../api";
import { AddDrawer } from "../../components/AddDrawer";
import { AddUserForm } from "../../components/User/AddUserForm";
import { UserInforDrawer } from "../../components/User/UserInforDrawer";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useAppDispatch();
  const { users, loading, total } = useAppSelector((state) => state.user);

  const { user: currentUser } = useAppSelector((state) => state.login);

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  const handleUserInforClick = (userId: string, action: string) => {
    setSelectedUserId(userId);
    setIsEdit(action === "update");
    setShowUserDrawer(true);
  };

  const loadUsers = (page: number, limit: number) => {
    setCurrentPage(page);
    dispatch(
      fetchUsers({
        page,
        limit,
        query: searchQuery,
        role: roleFilter,
        status: statusFilter,
      })
    );
  };

  useEffect(() => {
    loadUsers(1, rowsPerPage);
  }, []);

  const columns = [
    "No",
    "User ID",
    "Full Name",
    "Email",
    "Role",
    "Join Date",
    "Status",
    "Actions",
  ];

  const tableData = users.map((user, index) => ({
    No: (currentPage - 1) * rowsPerPage + index + 1,
    "User ID": user._id,
    "Full Name": user.fullname,
    Email: user.email,
    Role: user.role,
    "Join Date": new Date(user.createdAt).toLocaleString(),
    Status: user.status,
    id: user._id,
  }));

  return (
    <Layout
      title="User Management"
      subtitle="List of Users"
      onFilterClick={() => setOpenFilter(true)}
      onAddClick={() => setShowAddUser(true)}
      addButtonLabel="Add new member"
    >
      {/* Filter Modal */}
      <FilterModal
        open={openFilter}
        title="User Filter"
        onCancel={() => setOpenFilter(false)}
        onApply={() => {
          setCurrentPage(1);
          loadUsers(1, rowsPerPage);
          setOpenFilter(false);
        }}
      >
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Leader">Leader</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Activated">Activated</MenuItem>
            <MenuItem value="Inactivated">Inactivated</MenuItem>
          </Select>
        </FormControl>
      </FilterModal>

      {/* Search Bar */}
      <SearchActionBar
        searchQuery={searchQuery}
        placeholder="Search for user Id, name, or email"
        onSearchQueryChange={setSearchQuery}
        onSearch={() => {
          setCurrentPage(1);
          loadUsers(1, rowsPerPage);
        }}
      />

      {/* Table */}
      <TableComponent
        loading={loading}
        columns={columns}
        data={tableData}
        onDeleteClick={handleDeleteClick}
        onRowActionClick={handleUserInforClick}
      />

      {/* Dialogs */}
      <AddDrawer
        open={showAddUser}
        title="Add New User"
        onClose={() => setShowAddUser(false)}
      >
        <AddUserForm
          onClose={() => setShowAddUser(false)}
          onAdded={() => loadUsers(1, rowsPerPage)}
        />
      </AddDrawer>

      {showDeleteDialog && selectedUserId && (
        <ConfirmDeleteDialog
          open={showDeleteDialog}
          title="Confirm user deletion"
          message="Are you sure you want to delete this user? This action cannot be undone."
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedUserId(null);
          }}
          onConfirm={async () => {
            try {
              const userToDelete = users.find(
                (user) => user._id === selectedUserId
              );

              if (!userToDelete) {
                toast.error("User not found.");
                return;
              }

              if (userToDelete.email === "admin@starack.com") {
                toast.error("You cannot delete the default admin account.");
                return;
              }

              if (userToDelete._id === currentUser!._id) {
                toast.error(
                  "You cannot delete your own account while logged in."
                );
                return;
              }

              await userApi.delete(`/user/${selectedUserId}`);
              const newTotal = total - 1;
              const maxPage = Math.ceil(newTotal / rowsPerPage);
              const newPage = currentPage > maxPage ? maxPage : currentPage;
              loadUsers(newPage, rowsPerPage);
              setShowDeleteDialog(false);
              setSelectedUserId(null);
              toast.success("User deleted successfully.");
            } catch (error) {
              console.error(error);
              toast.error("Failed to delete user.");
            }
          }}
        />
      )}

      <UserInforDrawer
        open={showUserDrawer}
        userId={selectedUserId!}
        isEdit={isEdit}
        onClose={() => {
          setShowUserDrawer(false);
          setSelectedUserId(null);
        }}
        onUpdated={() => loadUsers(1, rowsPerPage)}
      />

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={currentPage - 1}
        onPageChange={(_, newPage) => {
          setCurrentPage(newPage + 1);
          loadUsers(newPage + 1, rowsPerPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          setRowsPerPage(newLimit);
          setCurrentPage(1);
          loadUsers(1, newLimit);
        }}
        rowsPerPageOptions={[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]}
      />
    </Layout>
  );
}
