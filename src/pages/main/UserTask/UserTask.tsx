/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { fetchTasks } from "../../../store/slice/taskSlice";
import { FilterModal } from "../../../components/FilterModal";
import { SearchActionBar } from "../../../components/SearchActionBar";
import { TableComponent } from "../../../components/TableComponent";
import Layout from "../../../layout/Layout";
import { UserTaskInforDrawer } from "../../../components/UserTask/UserTaskInforDrawer";
import { taskApi } from "../../../api";
import { toast } from "react-toastify";
import { ConfirmStatusModal } from "../../../components/UserTask/ConfirmStatusModal";

export function UserTask() {
  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.task);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);
  const [updateStatusTaskId, setUpdateStatusTaskId] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadTasks(1, rowsPerPage);
  }, []);

  const loadTasks = (page = 1, limit = 10) => {
    dispatch(
      fetchTasks({
        page,
        limit,
        query: searchQuery,
        status: statusFilter,
      })
    );
  };

  const handleUpdateStatus = () => {
    loadTasks(currentPage, rowsPerPage);
  };

  const handleRowActionClick = (id: string, action: string) => {
    if (action === "view") {
      setViewTaskId(id);
    } else if (action === "update-status") {
      setUpdateStatusTaskId(id);
    }
  };

  const handleDeleteClick = (id: string) => {
    console.log("Delete not implemented yet for id:", id);
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      await taskApi.patch(`/task/${updateStatusTaskId}/status`, {
        status: "Done",
      });
      toast.success("Task status updated to Done.");
      loadTasks(currentPage, rowsPerPage);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status.");
    } finally {
      setUpdateStatusTaskId(null);
    }
  };

  const columns = [
    "No",
    "Task ID",
    "Title",
    "Description",
    "Status",
    "Project",
    "Created At",
    "Actions",
  ];

  const tableData = tasks.map((task, index) => ({
    id: task._id,
    No: (currentPage - 1) * rowsPerPage + index + 1,
    "Task ID": task._id,
    Title: task.title,
    Description: task.description,
    Status: task.status,
    Project:
      task.projectTitles && task.projectTitles.length > 0
        ? task.projectTitles.join(", ")
        : "No project",
    "Created At": new Date(task.createdAt).toLocaleString(),
    Actions: "",
  }));

  return (
    <Layout
      title="Todo tasks"
      subtitle="List of to-do tasks"
      onFilterClick={() => setShowFilterModal(true)}
    >
      {/* Filter Modal */}
      <FilterModal
        open={showFilterModal}
        title="Task Filter"
        onCancel={() => setShowFilterModal(false)}
        onApply={() => {
          setCurrentPage(1);
          loadTasks(1, rowsPerPage);
          setShowFilterModal(false);
        }}
      >
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
      </FilterModal>

      {/* Search */}
      <SearchActionBar
        searchQuery={searchQuery}
        placeholder="Search for task Id, title, or description"
        onSearchQueryChange={setSearchQuery}
        onSearch={() => {
          setCurrentPage(1);
          loadTasks(1, rowsPerPage);
        }}
      />

      {/* Table */}
      <TableComponent
        loading={loading}
        columns={columns}
        data={tableData}
        onDeleteClick={handleDeleteClick}
        onRowActionClick={handleRowActionClick}
        variant="userTask"
        renderActions={(row: any) => (
          <>
            <IconButton
              onClick={() => handleRowActionClick(row.id, "view")}
              color="primary"
              title="View task details"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => handleRowActionClick(row.id, "update-status")}
              color="success"
              title="Mark as Done"
              disabled={row.Status === "Done"}
            >
              <CheckIcon />
            </IconButton>
          </>
        )}
      />

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={currentPage - 1}
        onPageChange={(_, newPage) => {
          setCurrentPage(newPage + 1);
          loadTasks(newPage + 1, rowsPerPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          setRowsPerPage(newLimit);
          setCurrentPage(1);
          loadTasks(1, newLimit);
        }}
        rowsPerPageOptions={[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]}
      />

      {/* Task Detail Drawer */}
      <UserTaskInforDrawer
        open={!!viewTaskId}
        taskId={viewTaskId as string}
        onClose={() => setViewTaskId(null)}
        onUpdated={handleUpdateStatus}
      />

      <ConfirmStatusModal
        open={!!updateStatusTaskId}
        onClose={() => setUpdateStatusTaskId(null)}
        onConfirm={handleConfirmStatusUpdate}
      />
    </Layout>
  );
}
