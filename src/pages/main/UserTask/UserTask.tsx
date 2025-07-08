/* eslint-disable react-hooks/exhaustive-deps */
import { Searchbar } from "../components/common/Searchbar";
import styles from "./UserTask.module.css";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconBack from "../../../assets/images/main/icon-back.png";
import IconDown from "../../../assets/images/main/icon-down.png";
import FilterIcon from "../../../assets/images/main/icon-filter-list.png";
import SearchIcon from "../../../assets/images/main/Icon-magnifying-glass.png";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchTasks } from "../../store/slice/taskSlice";
import UserTaskRow from "../components/UserTask/UserTaskRow";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";

export function UserTask() {
  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.task);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  return (
    <div className={styles.container}>
      <Searchbar />
      <div className={styles.main}>
        <h1 className={styles.main_title}>
          <span>Todo tasks</span>
        </h1>
        <div className={styles.main_form}>
          <div className={styles.form}>
            <div className={styles.header}>
              <p>List of to-do tasks</p>
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={() => setShowFilterModal(true)}
                >
                  <img src={FilterIcon} alt="Filter" />
                  <span>Filters</span>
                </Button>
              </div>
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
            </div>
            <div className={styles.search_bar}>
              <div className={styles.search}>
                <img src={SearchIcon} alt="Search" />
                <input
                  type="text"
                  placeholder="Search for task title, status, or project"
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
                    <th>Status</th>
                    <th>Project</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6}>
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
                      <td colSpan={6} className={styles.fallback}>
                        No tasks found.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task, index) => (
                      <UserTaskRow
                        key={task._id}
                        no={(currentPage - 1) * rowsPerPage + index + 1}
                        taskId={task._id}
                        title={task.title}
                        status={task.status}
                        projectTitle={
                          task.projectTitles && task.projectTitles.length > 0
                            ? task.projectTitles.join(", ")
                            : "No project"
                        }
                        onUpdateStatus={handleUpdateStatus}
                      />
                    ))
                  )}
                </tbody>
              </table>
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
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  ))}
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
                  <img src={IconBack} alt="Back" />
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
                  <img src={IconDown} alt="Next" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
