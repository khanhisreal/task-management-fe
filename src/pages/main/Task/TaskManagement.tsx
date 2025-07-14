import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { fetchTasks } from "../../../store/slice/taskSlice";
import { FilterModal } from "../../../components/FilterModal";
import { SearchActionBar } from "../../../components/SearchActionBar";
import { TableComponent } from "../../../components/TableComponent";
import Layout from "../../../layout/Layout";
import { ConfirmDeleteDialog } from "../../../components/ConfirmDeleteDialog";
import { taskApi } from "../../../api";
import { AddDrawer } from "../../../components/AddDrawer";
import { AddTaskForm } from "../../../components/Task/AddTaskForm";
import { TaskInforDrawer } from "../../../components/Task/TaskInforDrawer";

export function TaskManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.task);

  const loadTasks = (page = currentPage, limit = rowsPerPage) => {
    dispatch(
      fetchTasks({
        page,
        limit,
        query: searchQuery,
        status: statusFilter,
      })
    );
  };

  useEffect(() => {
    loadTasks(1, rowsPerPage);
  }, []);

  const openDeleteDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedTaskId(null);
  };

  const handleAfterDelete = () => {
    const newTotal = total - 1;
    const maxPage = Math.ceil(newTotal / rowsPerPage) || 1;
    const newPage = currentPage > maxPage ? maxPage : currentPage;

    setCurrentPage(newPage);
    loadTasks(newPage, rowsPerPage);
  };

  const columns = [
    "No",
    "Task ID",
    "Title",
    "Description",
    "Status",
    "Project",
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
      task.projectIds && task.projectIds.length > 0
        ? task.projectTitles.join(", ")
        : "No project",
    Actions: "",
  }));

  return (
    <Layout
      title="Task Management"
      subtitle="List of Tasks"
      onFilterClick={() => setShowFilterModal(true)}
      onAddClick={() => setShowAddDialog(true)}
      addButtonLabel="Add new task"
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

      {/* Search Bar */}
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
        onDeleteClick={openDeleteDialog}
        onRowActionClick={(id, action) => {
          setSelectedTaskId(id);
          setIsEditTask(action === "update");
          setShowTaskDialog(true);
        }}
      />

      {/* Dialogs */}
      {deleteDialogOpen && selectedTaskId && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          title="Confirm task deletion"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onCancel={closeDeleteDialog}
          onConfirm={async () => {
            try {
              await taskApi.delete(`/task/${selectedTaskId}`);
              handleAfterDelete();
              closeDeleteDialog();
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}

      <AddDrawer
        open={showAddDialog}
        title="Add New Task"
        onClose={() => setShowAddDialog(false)}
      >
        <AddTaskForm
          onClose={() => setShowAddDialog(false)}
          onAdded={() => {
            setCurrentPage(1);
            loadTasks(1, rowsPerPage);
          }}
        />
      </AddDrawer>

      {showTaskDialog && selectedTaskId && (
        <TaskInforDrawer
          open={showTaskDialog}
          taskId={selectedTaskId}
          isEdit={isEditTask}
          onClose={() => {
            setShowTaskDialog(false);
            setSelectedTaskId(null);
          }}
          onUpdated={() => loadTasks(currentPage, rowsPerPage)}
        />
      )}

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
    </Layout>
  );
}
