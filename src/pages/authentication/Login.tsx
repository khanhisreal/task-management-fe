/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./Login.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api";
import { useAppDispatch } from "../../store/hook";
import { setUser } from "../../store/slice/loginSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

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

        navigate("/overview");
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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.input_form}>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.top}>
              <div className={styles.left}>
                <h3>Log in</h3>
                <p>Hi there, please log in</p>
              </div>
            </div>

            <div className={styles.content}>
              <TextField
                id="email-input"
                label="Email address"
                className={styles.input}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                error={!!(formik.touched.email && formik.errors.email)}
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""
                }
              />

              <TextField
                id="password-input"
                label="Password"
                type="password"
                className={styles.input}
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
              />
            </div>

            <div className={styles.message}>
              {formik.status && <p className={styles.error}>{formik.status}</p>}
            </div>

            <div className={styles.action_button}>
              <Button
                variant="contained"
                className={styles.login_button}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Log in"
                )}
              </Button>
              <a href="#">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
