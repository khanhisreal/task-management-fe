/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { projectApi } from "../../api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

type AddProjectProps = {
  onClose: () => void;
  onAdded: () => void;
};

export function AddProjectForm({ onClose, onAdded }: AddProjectProps) {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Project title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),
      description: Yup.string().max(
        500,
        "Description must be at most 500 characters"
      ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, validateForm }) => {
      const errors = await validateForm();
      if (Object.keys(errors).length > 0) {
        const message = (
          <div>
            {Object.values(errors).map((err, idx) => (
              <div key={idx}>- {err}</div>
            ))}
          </div>
        );
        if (!toast.isActive("form-validation-errors-project")) {
          toast.error(message, { toastId: "form-validation-errors-project" });
        }
        setSubmitting(false);
        return;
      }

      try {
        const response = await projectApi.post("/project", values);
        if (response.status === 201) {
          toast.success("Project added successfully!", {
            toastId: "add-project-success",
            autoClose: 3000,
          });
          onClose();
          onAdded();
          resetForm();
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ?? "An unknown error occurred.",
          { toastId: "add-project-failure" }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Project Title
          </Typography>
          <TextField
            name="title"
            placeholder="Enter project title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="small"
            fullWidth
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Box>

        <Box>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Description
          </Typography>
          <TextField
            name="description"
            placeholder="Optional description"
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
            helperText={formik.touched.description && formik.errors.description}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting}
          startIcon={
            formik.isSubmitting ? (
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
            "&:hover": {
              backgroundColor: "#5147e8",
            },
          }}
        >
          {formik.isSubmitting ? "Adding..." : "Add Project"}
        </Button>
      </Box>
    </Box>
  );
}
