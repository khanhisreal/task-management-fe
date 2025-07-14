/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { projectApi } from "../../api";
import { taskApi } from "../../api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

type AddTaskProps = {
  onClose: () => void;
  onAdded: () => void;
};

export function AddTaskForm({ onClose, onAdded }: AddTaskProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const PROJECT_PAGE_SIZE = 5;

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      projectIds: [] as string[],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Minimum 3 characters")
        .max(100, "Maximum 100 characters")
        .required("Task title is required"),
      description: Yup.string().max(500, "Maximum 500 characters"),
      projectIds: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one project"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await taskApi.post("/task", values);
        if (response.status === 201) {
          toast.success("Task created successfully!");
          onClose();
          onAdded();
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const openProjectModal = () => {
    setTempSelectedIds(formik.values.projectIds);
    setModalOpen(true);
  };

  const closeProjectModal = () => {
    setModalOpen(false);
  };

  const confirmProjectSelection = () => {
    formik.setFieldValue("projectIds", tempSelectedIds);
    setModalOpen(false);
  };

  const fetchProjects = async (page: number) => {
    try {
      const skip = (page - 1) * PROJECT_PAGE_SIZE;
      const response = await projectApi.get(
        `/project?skip=${skip}&limit=${PROJECT_PAGE_SIZE}`
      );
      setProjects(response.data.projects);
      setTotalProjects(response.data.total);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch projects");
    }
  };

  const handleProjectPageChange = (_: any, value: number) => {
    setCurrentProjectPage(value);
    fetchProjects(value);
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "600px",
        height: "100vh",
        bgcolor: "background.paper",
        zIndex: 1300,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography fontSize={18} fontWeight={600}>
          Add New Task
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ p: 3, flex: 1, overflowY: "auto" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Task Title */}
          <Box>
            <Typography fontSize={13} fontWeight={500} mb={0.5}>
              Task Title
            </Typography>
            <TextField
              name="title"
              placeholder="Task title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography fontSize={13} fontWeight={500} mb={0.5}>
              Description
            </Typography>
            <TextField
              name="description"
              placeholder="Task description (optional)"
              multiline
              minRows={3}
              maxRows={6}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Box>

          {/* Project Selection */}
          <Box>
            <Typography fontSize={13} fontWeight={500} mb={0.5}>
              Parent Project
            </Typography>
            <Box
              sx={{
                borderRadius: 1,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                p: 1,
                cursor: "pointer",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                fontSize: 14,
              }}
              onClick={openProjectModal}
            >
              {formik.values.projectIds.length > 0
                ? projects
                    .filter((p) => formik.values.projectIds.includes(p._id))
                    .map((p) => p.title)
                    .join(", ")
                : "Click to choose project(s)"}
            </Box>
            {formik.touched.projectIds && formik.errors.projectIds && (
              <Typography color="error" fontSize={12} mt={0.5}>
                {formik.errors.projectIds}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
            sx={{
              borderRadius: 2,
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: 14,
              px: 3,
              backgroundColor: "#635bff",
              "&:hover": { backgroundColor: "#5147e8" },
            }}
          >
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </Box>
      </Box>

      {/* Project selection modal */}
      <Modal open={modalOpen} onClose={closeProjectModal}>
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 4,
            minWidth: "420px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <Typography fontSize={18} fontWeight={600} mb={2}>
            Select Project(s)
          </Typography>
          {projects.map((project) => (
            <Box
              key={project._id}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Checkbox
                checked={tempSelectedIds.includes(project._id)}
                onChange={() =>
                  setTempSelectedIds((prev) =>
                    prev.includes(project._id)
                      ? prev.filter((id) => id !== project._id)
                      : [...prev, project._id]
                  )
                }
              />
              <Typography fontSize={14}>{project.title}</Typography>
            </Box>
          ))}

          {Math.ceil(totalProjects / PROJECT_PAGE_SIZE) > 1 && (
            <Pagination
              count={Math.ceil(totalProjects / PROJECT_PAGE_SIZE)}
              page={currentProjectPage}
              onChange={handleProjectPageChange}
              color="primary"
              size="small"
              sx={{ mt: 2, mb: 1 }}
            />
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button onClick={closeProjectModal}>Cancel</Button>
            <Button
              variant="contained"
              onClick={confirmProjectSelection}
              sx={{
                backgroundColor: "#635bff",
                "&:hover": { backgroundColor: "#5147e8" },
              }}
            >
              Assign to projects
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
