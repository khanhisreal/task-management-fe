/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AddUser.module.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import userClient from "../../../../clients/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AddUserProps = {
  onClose: () => void;
  onAdded: () => void;
};

const roleOptions = ["Manager", "Leader", "Employee"];

export function AddUser({ onClose, onAdded }: AddUserProps) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const finalData = {
      ...formData,
      role: formData.role || "Employee",
    };

    const createUser = async () => {
      try {
        setLoading(true);
        const response = await userClient.post("/user", finalData);
        if (response.status === 201) {
          onClose();
          onAdded();
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ?? "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };
    createUser();
  }

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.wrapper}>
            <h1>Add New User</h1>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <label>Fullname</label>
            <input
              type="text"
              name="fullname"
              placeholder="Fullname"
              value={formData.fullname}
              required
              maxLength={75}
              onChange={handleChange}
            />
            <br />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              required
              onChange={handleChange}
            />
            <br />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              required
              minLength={6}
              onChange={handleChange}
            />
            <br />
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select role
              </option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className={styles.button_wrapper}>
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
                  borderRadius: "12px",
                  backgroundColor: "#635bff",
                  boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.08)",
                  fontSize: "14px",
                  lineHeight: "24px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#5147e8",
                  },
                }}
              >
                {loading ? "Adding..." : "Add User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}
