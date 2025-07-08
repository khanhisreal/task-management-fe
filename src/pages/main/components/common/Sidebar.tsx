import styles from "./Sidebar.module.css";
import Starack_logo from "../../../../assets/images/main/starack-logo.png";
import Overview from "../../../../assets/images/main/icon-overview.png";
import User from "../../../../assets/images/main/icon-user-management.png";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Button from "@mui/material/Button";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.login.user);

  function handleClick(route: string): void {
    if (route === "overview") {
      navigate("overview");
    } else if (route === "user-management") {
      navigate("user-management");
    } else if (route === "project-management") {
      navigate("project-management");
    } else if (route === "task-management") {
      navigate("task-management");
    } else if (route === "user-task") {
      navigate("user-task");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo_lume}>
        <div className={styles.frame}>
          <img src={Starack_logo} alt="" />
        </div>
        <div className={styles.content}>
          <h3>STARACK</h3>
          <p>Version V1.2</p>
        </div>
      </div>
      <div className={styles.buttons}>
        {user?.role !== "Employee" ? (
          <>
            <Button
              variant="contained"
              className={clsx(styles.button, {
                [styles.active]: location.pathname === "/overview",
              })}
              onClick={() => handleClick("overview")}
            >
              <img src={Overview} alt="" />
              <span>Overview</span>
            </Button>
            <Button
              variant="contained"
              className={clsx(styles.button, {
                [styles.active]: location.pathname === "/user-management",
              })}
              onClick={() => handleClick("user-management")}
            >
              <img src={User} alt="" />
              <span>User Management</span>
            </Button>
            <Button
              variant="contained"
              className={clsx(styles.button, {
                [styles.active]: location.pathname === "/project-management",
              })}
              onClick={() => handleClick("project-management")}
            >
              <AccountTreeIcon className={styles.icon} />
              <span>Project Management</span>
            </Button>
            <Button
              variant="contained"
              className={clsx(styles.button, {
                [styles.active]: location.pathname === "/task-management",
              })}
              onClick={() => handleClick("task-management")}
            >
              <AssignmentIcon className={styles.icon} />
              <span>Task Management</span>
            </Button>
          </>
        ) : (
          <>
            {" "}
            <Button
              variant="contained"
              className={clsx(styles.button, {
                [styles.active]: location.pathname === "/user-task",
              })}
              onClick={() => handleClick("user-task")}
            >
              <ListAltIcon className={styles.icon} />
              <span>Todo tasks</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
