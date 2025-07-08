import { Outlet } from "react-router-dom";
import { Sidebar } from "./main/components/common/Sidebar";
import styles from "./Root.module.css";

export function Root() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}
