/* eslint-disable react-hooks/exhaustive-deps */
import { Searchbar } from "../components/common/Searchbar";
import styles from "./TaskManagement.module.css";
import Button from "@mui/material/Button";
import AddIcon from "../../../assets/images/main/icon-add.png";
import ListIcon from "../../../assets/images/main/icon-filter-list.png";
import MagnifyingGlass from "../../../assets/images/main/Icon-magnifying-glass.png";
import IconBack from "../../../assets/images/main/icon-back.png";
import IconDown from "../../../assets/images/main/icon-down.png";
import { useEffect, useState } from "react";
import TaskRow from "../components/Task/TaskRow";
import { ConfirmDeleteTask } from "../components/Task/ConfirmDeleteTask";
import { AddTask } from "../components/Task/AddTask";
import { TaskInfor } from "../components/Task/TaskInfor";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchTasks } from "../../store/slice/taskSlice";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";

export function TaskManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [taskDialog, setTaskDialog] = useState({
    open: false,
    taskId: null as string | null,
    mode: "view" as "view" | "edit",
  });

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

  const handleAddTaskClick = () => {
    setShowAddDialog(true);
  };

  return (
    <div className={styles.container}>
      <Searchbar />
      <div className={styles.main}>
        <h1 className={styles.main_title}>
          <span>Task Management</span>
        </h1>
        <div className={styles.main_form}>
          <div className={styles.header}>
            <p>List of Tasks</p>
            <div className={styles.buttons}>
              <Button
                variant="contained"
                className={styles.button}
                onClick={() => setShowFilterModal(true)}
              >
                <img src={ListIcon} alt="" />
                <span>Filters</span>
              </Button>
              <Modal
                open={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                aria-labelledby="filter-modal-title"
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
                    Task Filter
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 3 }} size="small">
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

                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button
                      onClick={() => setShowFilterModal(false)}
                      sx={{
                        bgcolor: "#e0e0e0",
                        color: "black",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        borderRadius: "12px",
                        px: 2,
                        "&:hover": { bgcolor: "#d5d5d5" },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentPage(1);
                        loadTasks(1, rowsPerPage);
                        setShowFilterModal(false);
                      }}
                      sx={{
                        bgcolor: "#635bff",
                        color: "white",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        borderRadius: "12px",
                        px: 2,
                        "&:hover": { bgcolor: "#564ee9" },
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Modal>
              <Button
                variant="contained"
                className={styles.button}
                onClick={handleAddTaskClick}
              >
                <img src={AddIcon} alt="" />
                <span>Add new task</span>
              </Button>
            </div>
          </div>
          <div className={styles.search_bar}>
            <div className={styles.search}>
              <img src={MagnifyingGlass} alt="" />
              <input
                type="text"
                placeholder="Search for task title, ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    loadTasks(1, rowsPerPage);
                  }
                }}
              />
            </div>
            <Button
              variant="contained"
              className={styles.button}
              onClick={() => {
                setCurrentPage(1);
                loadTasks(1, rowsPerPage);
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
                  <th>Task ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Project</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
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
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.fallback}>
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task, index) => (
                    <TaskRow
                      key={task._id}
                      no={(currentPage - 1) * rowsPerPage + index + 1}
                      taskId={task._id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      projectTitle={
                        task.projectIds && task.projectIds.length > 0
                          ? task.projectTitles.join(", ")
                          : "No project"
                      }
                      onDeleteClick={openDeleteDialog}
                      onTaskActionClick={(id, action) =>
                        setTaskDialog({
                          open: true,
                          taskId: id,
                          mode: action as "view" | "edit",
                        })
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.dialog_container}>
            {deleteDialogOpen && selectedTaskId && (
              <ConfirmDeleteTask
                taskId={selectedTaskId}
                onClose={closeDeleteDialog}
                onDeleted={() => loadTasks()}
              />
            )}
            {showAddDialog && (
              <AddTask
                onClose={() => setShowAddDialog(false)}
                onAdded={() => loadTasks(1, rowsPerPage)}
              />
            )}
            {taskDialog.open && taskDialog.taskId && (
              <TaskInfor
                open={taskDialog.open}
                onClose={() =>
                  setTaskDialog({ open: false, taskId: null, mode: "view" })
                }
                taskId={taskDialog.taskId}
                isEdit={taskDialog.mode === "edit"}
                onUpdated={() => loadTasks()}
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
                  loadTasks(1, newLimit);
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
                    loadTasks(newPage, rowsPerPage);
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
                    loadTasks(newPage, rowsPerPage);
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
  );
}
