/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchProjects } from "../../store/slice/projectSlice";
import { FilterModal } from "../../components/FilterModal";
import { SearchActionBar } from "../../components/SearchActionBar";
import { TableComponent } from "../../components/TableComponent";
import { projectApi, userApi } from "../../api";
import Layout from "../../layout/Layout";
import { ConfirmDeleteDialog } from "../../components/ConfirmDeleteDialog";
import { AddDrawer } from "../../components/AddDrawer";
import { AddProjectForm } from "../../components/Project/AddProjectForm";
import { ProjectInforDrawer } from "../../components/Project/ProjectInforDrawer";

export function ProjectManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ownedByFilter, setOwnedByFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isEditProject, setIsEditProject] = useState(false);

  const [ownersMap, setOwnersMap] = useState<{ [key: string]: string }>({});

  const dispatch = useAppDispatch();
  const { projects, total, loading } = useAppSelector((state) => state.project);

  const loadProjects = (page = currentPage, limit = rowsPerPage) => {
    dispatch(
      fetchProjects({ page, limit, query: searchQuery, ownedBy: ownedByFilter })
    );
  };

  useEffect(() => {
    loadProjects(1, rowsPerPage);
  }, []);

  const fetchOwnerName = async (ownerId: string) => {
    if (ownersMap[ownerId]) return; // skip if already cached
    try {
      const res = await userApi.get(`/user/${ownerId}`);
      setOwnersMap((prev) => ({ ...prev, [ownerId]: res.data.fullname }));
    } catch {
      setOwnersMap((prev) => ({ ...prev, [ownerId]: "Unknown" }));
    }
  };

  useEffect(() => {
    projects.forEach((p) => {
      if (!ownersMap[p.ownerId]) fetchOwnerName(p.ownerId);
    });
  }, [projects]);

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

  const handleAfterDelete = () => {
    const newTotal = total - 1;
    const maxPage = Math.ceil(newTotal / rowsPerPage) || 1;
    const newPage = currentPage > maxPage ? maxPage : currentPage;

    setCurrentPage(newPage);
    loadProjects(newPage, rowsPerPage);
  };

  const columns = [
    "No",
    "project id",
    "title",
    "description",
    "created at",
    "owner",
    "Actions",
  ];

  const tableData = projects.map((project, index) => ({
    id: project._id,
    No: (currentPage - 1) * rowsPerPage + index + 1,
    "project id": project._id,
    title: project.title,
    description: project.description,
    "created at": new Date(project.createdAt).toLocaleString(),
    owner: ownersMap[project.ownerId] || "Loading...",
  }));

  return (
    <Layout
      title="Project Management"
      subtitle="List of Projects"
      onFilterClick={() => setShowFilterModal(true)}
      onAddClick={handleAddProjectClick}
      addButtonLabel="Add new project"
    >
      <FilterModal
        open={showFilterModal}
        title="Project Filter"
        onCancel={() => setShowFilterModal(false)}
        onApply={() => {
          setCurrentPage(1);
          loadProjects(1, rowsPerPage);
          setShowFilterModal(false);
        }}
      >
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel id="owned-by-filter-label">Owned By</InputLabel>
          <Select
            labelId="owned-by-filter-label"
            id="owned-by-filter"
            value={ownedByFilter}
            label="Owned By"
            onChange={(e) => setOwnedByFilter(e.target.value)}
            sx={{ borderRadius: "8px" }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="you">You</MenuItem>
            <MenuItem value="otherManagers">Other Managers</MenuItem>
          </Select>
        </FormControl>
      </FilterModal>

      <SearchActionBar
        searchQuery={searchQuery}
        placeholder="Search for project Id, title, or description"
        onSearchQueryChange={setSearchQuery}
        onSearch={() => {
          setCurrentPage(1);
          loadProjects(1, rowsPerPage);
        }}
      />

      <TableComponent
        loading={loading}
        columns={columns}
        data={tableData}
        onDeleteClick={openDeleteDialog}
        onRowActionClick={(id, action) => {
          setSelectedProjectId(id);
          setIsEditProject(action === "update");
          setShowProjectDialog(true);
        }}
      />

      {deleteDialogOpen && selectedProjectId && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          title="Confirm project deletion"
          message="Are you sure you want to delete this project? This action cannot be undone."
          onCancel={closeDeleteDialog}
          onConfirm={async () => {
            try {
              await projectApi.delete(`/project/${selectedProjectId}`);
              handleAfterDelete();
              closeDeleteDialog();
            } catch (error: any) {
              console.error(error);
            }
          }}
        />
      )}

      <AddDrawer
        open={showAddDialog}
        title="Add New Project"
        onClose={() => setShowAddDialog(false)}
      >
        <AddProjectForm
          onClose={() => setShowAddDialog(false)}
          onAdded={() => {
            setCurrentPage(1);
            loadProjects(1, rowsPerPage);
          }}
        />
      </AddDrawer>

      {showProjectDialog && selectedProjectId && (
        <ProjectInforDrawer
          open={showProjectDialog}
          projectId={selectedProjectId}
          isEdit={isEditProject}
          onClose={() => {
            setShowProjectDialog(false);
            setSelectedProjectId(null);
          }}
          onUpdated={() => loadProjects(currentPage, rowsPerPage)}
        />
      )}

      <TablePagination
        component="div"
        count={total}
        page={currentPage - 1}
        onPageChange={(_, newPage) => {
          setCurrentPage(newPage + 1);
          loadProjects(newPage + 1, rowsPerPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          setRowsPerPage(newLimit);
          setCurrentPage(1);
          loadProjects(1, newLimit);
        }}
        rowsPerPageOptions={[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]}
      />
    </Layout>
  );
}
