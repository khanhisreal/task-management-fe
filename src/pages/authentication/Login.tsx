/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api";
import { useAppDispatch } from "../../store/hook";
import { setUser } from "../../store/slice/loginSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import backgroundImage from "../../assets/images/authentication/hero-illustration.png";

export default function Authentication() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values, { setStatus }) => {
      setLoading(true);
      try {
        const url = "/auth/login";
        const response = await userApi.post(url, values);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        const payload = JSON.parse(
          atob(response.data.accessToken.split(".")[1])
        );
        dispatch(setUser(payload));

        if (payload.role === "Manager" || payload.role === "Leader") {
          navigate("/overview");
        } else if (payload.role === "Employee") {
          navigate("/user-task");
        } else {
          // fallback for unexpected role
          navigate("/auth");
        }
      } catch (error: any) {
        const error_message =
          error.response?.data?.message || "Something went wrong.";
        setStatus(error_message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: 444 }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0px 5px 22px 0px rgba(0,0,0,0.04)",
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            {/* Top */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingY: "8px",
                paddingBottom: "16px",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontSize="18px" fontWeight={700}>
                  Log in
                </Typography>
                <Typography fontSize="14px" color="#6C737F" sx={{ mt: "4px" }}>
                  Hi there, please log in
                </Typography>
              </Box>
            </Box>

            {/* Inputs */}
            <Box sx={{ mb: 2 }}>
              <TextField
                id="email-input"
                label="Email address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.email && formik.errors.email)}
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                id="password-input"
                label="Password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ""
                }
                fullWidth
                size="small"
              />
            </Box>

            {/* Error Message */}
            {formik.status && (
              <Typography
                sx={{
                  color: "#FF0F0F",
                  textAlign: "center",
                  fontSize: "14px",
                  mb: "10px",
                }}
              >
                {formik.status}
              </Typography>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  height: "42px",
                  backgroundColor: "#635BFF",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#564FF0",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Log in"
                )}
              </Button>

              <Link
                href="#"
                underline="hover"
                sx={{
                  alignSelf: "center",
                  color: "#635BFF",
                  fontSize: "14px",
                  mt: "16px",
                  mb: "16px",
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
