import styles from "./ErrorPage.module.css";
import Starack_logo from "../../assets/images/main/starack-logo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <main>
        <div className={styles.logo_lume}>
          <div className={styles.frame}>
            <img src={Starack_logo} alt="" />
          </div>
          <div className={styles.content}>
            <h3>STARACK</h3>
            <p>Version V1.2</p>
          </div>
        </div>
        <h1>An error occured!</h1>
        <p>Could not find this page!</p>
        <div className={styles.back}>
          <Button
            variant="contained"
            className={styles.button}
            onClick={handleClick}
          >
            <ArrowBackIcon className={styles.icon} />
            Comeback
          </Button>
        </div>
      </main>
    </div>
  );
}
