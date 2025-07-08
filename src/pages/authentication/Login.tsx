/* eslint-disable @typescript-eslint/no-explicit-any */
import userClient from "../../clients/userService";
import styles from "./Authentication.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hook";
import { setUser } from "../store/slice/loginSlice";

export default function Authentication() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const data = { email, password };

    try {
      const url = "/auth/login";
      const response = await userClient.post(url, data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      const payload = JSON.parse(atob(response.data.accessToken.split(".")[1]));
      dispatch(setUser(payload));

      navigate("/overview");
    } catch (error: any) {
      const error_message =
        error.response?.data?.message || "Something went wrong.";
      setMessage(error_message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.input_form}>
          <form onSubmit={handleFormSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
              <TextField
                id="password-input"
                label="Password"
                type="password"
                className={styles.input}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                inputProps={{ minLength: 6 }}
              />
            </div>
            <div className={styles.action_button}>
              {message && (
                <p
                  className={
                    messageType === "success" ? styles.success : styles.error
                  }
                >
                  {message}
                </p>
              )}
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
