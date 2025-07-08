/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./UserInfor.module.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "../../../../assets/images/main/user-avatar-infor.png";
import clsx from "clsx";
import userClient from "../../../../clients/userService";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserInforProps = {
  userId: string;
  onClose: () => void;
  isEdit: boolean;
  onUpdated: () => void;
};

const roleOptions = ["Manager", "Leader", "Employee"];
const accountTypeOptions = ["Basic", "Premium"];
const statusOptions = ["Activated", "Inactivated"];

export function UserInfor({
  userId,
  onClose,
  isEdit,
  onUpdated,
}: UserInforProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);

  type User = {
    _id: string;
    email: string;
    fullname: string;
    phone: string;
    role: string;
    accountType: string;
    nationality: string;
    status: string;
    language: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const response = await userClient.get(`/user/${userId}`);
        setUser(response.data);
      };

      fetchUser();
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const fetchUser = async () => {
      try {
        const { _id, __v, createdAt, updatedAt, ...updateData } = user;
        const response = await userClient.patch(`/user/${_id}`, updateData);
        if (response.status === 200) {
          onClose();
          onUpdated();
        }
      } catch (error: any) {
        if (error) {
          toast.error(error.response.data.message[0]);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    fetchUser();
  }

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.wrapper}>
            <h1>{user?.fullname}</h1>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            variant="text"
            sx={{
              minWidth: 0,
              padding: 0,
              width: "auto",
            }}
            className={clsx(styles.button, {
              [styles.active]: currentTab === "overview",
            })}
            onClick={() => setCurrentTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant="text"
            sx={{
              minWidth: 0,
              padding: 0,
              width: "auto",
            }}
            className={clsx(styles.button, {
              [styles.active]: currentTab === "logs",
            })}
            onClick={() => setCurrentTab("logs")}
          >
            Logs
          </Button>
        </div>
        <div className={styles.content}>
          {currentTab === "overview" && (
            <div className={styles.overview}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="">User ID</label>
                <input
                  type="text"
                  name="_id"
                  placeholder="User Id"
                  value={user ? user._id : ""}
                  readOnly={true}
                />
                <br />
                <div className={styles.avatar_wrapper}>
                  <label htmlFor="">Avatar</label>
                  <div className={styles.image}>
                    <img src={Avatar} alt="" />
                  </div>
                </div>
                <br />
                <label htmlFor="">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={user?.email ?? ""}
                  readOnly={!isEdit}
                  required
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                />
                <br />
                <label htmlFor="">Fullname</label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Fullname"
                  value={user?.fullname ?? ""}
                  readOnly={!isEdit}
                  required
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, fullname: e.target.value } : prev
                    )
                  }
                />
                <br />
                <label htmlFor="">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={user?.phone ?? ""}
                  readOnly={!isEdit}
                  pattern="^[0-9]{8,15}$"
                  title="Phone number must be 8-15 digits"
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, phone: e.target.value } : prev
                    )
                  }
                />
                <br />
                <label htmlFor="">Role</label>
                <select
                  value={user?.role ?? ""}
                  name="role"
                  disabled={!isEdit}
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, role: e.target.value } : prev
                    )
                  }
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <br />
                <label htmlFor="">Account type</label>
                <select
                  value={user?.accountType ?? ""}
                  name="accountType"
                  disabled={!isEdit}
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, accountType: e.target.value } : prev
                    )
                  }
                >
                  <option value="" disabled>
                    Select Account Type
                  </option>
                  {accountTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <br />
                <label htmlFor="">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Nationality"
                  value={user?.nationality ?? ""}
                  readOnly={!isEdit}
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, nationality: e.target.value } : prev
                    )
                  }
                />
                <br />
                <label htmlFor="">Status</label>
                <select
                  value={user?.status ?? ""}
                  name="status"
                  disabled={!isEdit}
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, status: e.target.value } : prev
                    )
                  }
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <br />
                <label htmlFor="">Language</label>
                <input
                  type="text"
                  name="language"
                  placeholder="Language"
                  value={user?.language ?? ""}
                  readOnly={!isEdit}
                  onChange={(e) =>
                    isEdit &&
                    setUser((prev) =>
                      prev ? { ...prev, language: e.target.value } : prev
                    )
                  }
                />
                {isEdit && (
                  <div className={styles.button_wrapper}>
                    <Button
                      variant="contained"
                      className={styles.update_button}
                      type="submit"
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}
          {currentTab === "logs" && <div className={styles.logs}>logs</div>}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
