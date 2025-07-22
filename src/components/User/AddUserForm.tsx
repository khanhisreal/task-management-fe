/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userApi } from "../../api";

type AddUserFormProps = {
  onClose: () => void;
  onAdded: () => void;
};

const roleOptions = ["Manager", "Leader", "Employee"];

export function AddUserForm({ onClose, onAdded }: AddUserFormProps) {
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Fullname is required")
        .max(75, "Fullname must be at most 75 characters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      role: Yup.string().required("Role is required"),
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
        if (!toast.isActive("form-validation-errors")) {
          toast.error(message, { toastId: "form-validation-errors" });
        }
        setSubmitting(false);
        return;
      }

      try {
        const response = await userApi.post("/user", values);
        if (response.status === 201) {
          toast.success("User added successfully!", {
            toastId: "add-user-success",
            autoClose: 3000,
          });
          onClose();
          onAdded();
          resetForm();
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("Email has already existed, try a new one.");
        } else {
          toast.error(
            error.response?.data?.message ?? "An unknown error occurred."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Fullname */}
        <Box>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Fullname
          </Typography>
          <TextField
            name="fullname"
            placeholder="Fullname"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="small"
            fullWidth
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
          />
        </Box>

        {/* Email */}
        <Box>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Email
          </Typography>
          <TextField
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="small"
            fullWidth
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Box>

        {/* Password */}
        <Box>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Password
          </Typography>
          <TextField
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="small"
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Box>

        {/* Role */}
        <Box>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Role
          </Typography>
          <Select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            displayEmpty
            size="small"
            fullWidth
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <MenuItem value="" disabled>
              Select role
            </MenuItem>
            {roleOptions.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.role && formik.errors.role && (
            <Typography color="error" fontSize={12} mt={0.5}>
              {formik.errors.role}
            </Typography>
          )}
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
          {formik.isSubmitting ? "Adding..." : "Add User"}
        </Button>
      </Box>
    </Box>
  );
}
