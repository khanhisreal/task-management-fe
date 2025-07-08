/* eslint-disable react-hooks/exhaustive-deps */
import { Searchbar } from "../components/common/Searchbar";
import styles from "./ProjectManagement.module.css";
import Button from "@mui/material/Button";
import AddIcon from "../../../assets/images/main/icon-add.png";
import ListIcon from "../../../assets/images/main/icon-filter-list.png";
import MagnifyingGlass from "../../../assets/images/main/Icon-magnifying-glass.png";
import IconBack from "../../../assets/images/main/icon-back.png";
import IconDown from "../../../assets/images/main/icon-down.png";
import { useEffect, useState } from "react";
import ProjectRow from "../components/Project/ProjectRow";
import { ConfirmDeleteProject } from "../components/Project/ConfirmDeleteProject";
import { AddProject } from "../components/Project/AddProject";
import { ProjectInfor } from "../components/Project/ProjectInfor";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchProjects } from "../../store/slice/projectSlice";
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

export function ProjectManagement() {
  //Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [ownedByFilter, setOwnedByFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //Dialog control states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  //Selected project states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isEditProject, setIsEditProject] = useState(false);

  //Redux
  const dispatch = useAppDispatch();
  const { projects, total, loading } = useAppSelector((state) => state.project);

  //Data fetching
  const loadProjects = (page = currentPage, limit = rowsPerPage) => {
    dispatch(
      fetchProjects({ page, limit, query: searchQuery, ownedBy: ownedByFilter })
    );
  };

  useEffect(() => {
    loadProjects(1, rowsPerPage);
  }, []);

  const handleAddProjectClick = () => {
    setShowAddDialog(true);
  };

  const openDeleteDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProjectId(null);
  };

  return (
    <div className={styles.container}>
      <Searchbar />
      <div className={styles.main}>
        <h1 className={styles.main_title}>
          <span>Project Management</span>
        </h1>
        <div className={styles.main_form}>
          <div className={styles.header}>
            <p>List of Projects</p>
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
                    Project Filter
                  </Typography>

                  {/* Owned By Filter */}
                  <FormControl fullWidth sx={{ mb: 3 }} size="small">
                    <InputLabel id="owned-by-filter-label">Owned By</InputLabel>
                    <Select
                      labelId="owned-by-filter-label"
                      label="Owned By"
                      value={ownedByFilter}
                      onChange={(e) => setOwnedByFilter(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="you">You</MenuItem>
                      <MenuItem value="otherManagers">Other Managers</MenuItem>
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
                        loadProjects(1, rowsPerPage);
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
                onClick={handleAddProjectClick}
              >
                <img src={AddIcon} alt="" />
                <span>Add new project</span>
              </Button>
            </div>
          </div>
          <div className={styles.search_bar}>
            <div className={styles.search}>
              <img src={MagnifyingGlass} alt="" />
              <input
                type="text"
                placeholder="Search for project title, ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    loadProjects(1, rowsPerPage);
                  }
                }}
              />
            </div>
            <Button
              variant="contained"
              className={styles.button}
              onClick={() => {
                setCurrentPage(1);
                loadProjects(1, rowsPerPage);
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
                  <th>Project ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created Date</th>
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
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.fallback}>
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <ProjectRow
                      key={project._id}
                      no={(currentPage - 1) * rowsPerPage + index + 1}
                      projectId={project._id}
                      title={project.title}
                      description={project.description}
                      createdAt={new Date(project.createdAt).toLocaleString()}
                      onDeleteClick={openDeleteDialog}
                      onProjectActionClick={(id, action) => {
                        setSelectedProjectId(id);
                        setIsEditProject(action === "edit");
                        setShowProjectDialog(true);
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.dialog_container}>
            {deleteDialogOpen && selectedProjectId && (
              <ConfirmDeleteProject
                projectId={selectedProjectId}
                onClose={closeDeleteDialog}
                onDeleted={() => loadProjects()}
              />
            )}
            {showAddDialog && (
              <AddProject
                onClose={() => setShowAddDialog(false)}
                onAdded={() => loadProjects(1, rowsPerPage)} //reset to page 1 on add
              />
            )}
            {showProjectDialog && selectedProjectId && (
              <ProjectInfor
                projectId={selectedProjectId}
                open={showProjectDialog}
                isEdit={isEditProject}
                onClose={() => {
                  setShowProjectDialog(false);
                  setSelectedProjectId(null);
                }}
                onUpdated={() => loadProjects()}
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
                  loadProjects(1, newLimit);
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
                    loadProjects(newPage, rowsPerPage);
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
                    loadProjects(newPage, rowsPerPage);
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
