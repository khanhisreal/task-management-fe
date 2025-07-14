/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  IconButton,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  CircularProgress,
  Drawer,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { userApi } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultAvatar from "../../assets/images/main/user-avatar-infor.png";

type UserInforProps = {
  open: boolean;
  userId: string;
  onClose: () => void;
  isEdit: boolean;
  onUpdated: () => void;
};

const roleOptions = ["Manager", "Leader", "Employee"];
const accountTypeOptions = ["Basic", "Premium"];
const statusOptions = ["Activated", "Inactivated"];

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

export function UserInforDrawer({
  open,
  userId,
  onClose,
  isEdit,
  onUpdated,
}: UserInforProps) {
  const [currentTab, setCurrentTab] = useState<"overview" | "logs">("overview");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await userApi.get(`/user/${userId}`);
      setUser(res.data);
    } catch {
      toast.error("Failed to fetch user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!open) setUser(null);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { _id, __v, createdAt, updatedAt, ...updateData } = user;
      const res = await userApi.patch(`/user/${_id}`, updateData);
      if (res.status === 200) {
        toast.success("User updated successfully!");
        onClose();
        onUpdated();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message?.[0] || "An error occurred");
    }
  };

  // shared styles for text inputs and select display
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#1119270A",
      fontSize: "14px",
      boxShadow: "0px 1px 2px 0px #00000014",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
    },
    "& .MuiSelect-select": {
      fontSize: "14px",
    },
  };

  const labelStyle = {
    width: "120px",
    height: "42px",
    fontSize: "12px",
    color: "#6c737f",
    display: "flex",
    alignItems: "center" as const,
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 600 } }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: "41px 24px 0px 24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 18 }}>
            {user ? user.fullname : "Loading..."}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val as any)}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{ borderBottom: "1px solid #e5e7eb" }}
        >
          {["overview", "logs"].map((tab) => (
            <Tab
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              value={tab}
              sx={{
                minWidth: "auto",
                px: 1.5,
                fontSize: 14,
                textTransform: "capitalize",
                ml: tab === "overview" ? 3 : 1,
                color: currentTab === tab ? "#635bff" : "rgba(0,0,0,0.6)",
                fontWeight: currentTab === tab ? 500 : 400,
                borderBottom:
                  currentTab === tab
                    ? "4px solid #635bff"
                    : "4px solid transparent",
              }}
            />
          ))}
        </Tabs>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress />
            </Box>
          ) : currentTab === "overview" && user ? (
            <Box component="form" onSubmit={handleSubmit}>
              {/* User ID */}
              <Box display="flex" alignItems="center" mb={2} mt={2}>
                <Typography sx={labelStyle}>User ID</Typography>
                <TextField
                  value={user._id}
                  size="small"
                  InputProps={{ readOnly: true }}
                  sx={inputStyle}
                  fullWidth
                />
              </Box>

              {/* Avatar */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography
                  sx={{
                    width: "100px",
                    height: "42px",
                    fontSize: "12px",
                    color: "#6c737f",
                    display: "flex",
                    alignItems: "center" as const,
                  }}
                >
                  Avatar
                </Typography>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    p: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 1px 2px 0px #00000014",
                  }}
                >
                  <Avatar
                    src={DefaultAvatar}
                    variant="square"
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              </Box>

              {/* Email */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Email</Typography>
                <TextField
                  value={user.email}
                  size="small"
                  required
                  InputProps={{ readOnly: !isEdit }}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, email: e.target.value })
                  }
                  sx={inputStyle}
                  fullWidth
                />
              </Box>

              {/* Full Name */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Full Name</Typography>
                <TextField
                  value={user.fullname}
                  size="small"
                  required
                  InputProps={{ readOnly: !isEdit }}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, fullname: e.target.value })
                  }
                  sx={inputStyle}
                  fullWidth
                />
              </Box>

              {/* Phone */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Phone</Typography>
                <TextField
                  value={user.phone}
                  size="small"
                  inputProps={{ pattern: "^[0-9]{8,15}$" }}
                  InputProps={{ readOnly: !isEdit }}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, phone: e.target.value })
                  }
                  sx={inputStyle}
                  fullWidth
                />
              </Box>

              {/* Role */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Role</Typography>
                <Select
                  value={user.role}
                  size="small"
                  disabled={!isEdit}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, role: e.target.value })
                  }
                  sx={{ ...inputStyle, height: 40 }}
                  fullWidth
                >
                  {roleOptions.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Account Type */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Account Type</Typography>
                <Select
                  value={user.accountType}
                  size="small"
                  disabled={!isEdit}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, accountType: e.target.value })
                  }
                  sx={{ ...inputStyle, height: 40 }}
                  fullWidth
                >
                  {accountTypeOptions.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Nationality */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Nationality</Typography>
                <TextField
                  value={user.nationality}
                  size="small"
                  InputProps={{ readOnly: !isEdit }}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, nationality: e.target.value })
                  }
                  sx={inputStyle}
                  fullWidth
                />
              </Box>

              {/* Status */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Status</Typography>
                <Select
                  value={user.status}
                  size="small"
                  disabled={!isEdit}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, status: e.target.value })
                  }
                  sx={{ ...inputStyle, height: 40 }}
                  fullWidth
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Language */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={labelStyle}>Language</Typography>
                <TextField
                  value={user.language}
                  size="small"
                  InputProps={{ readOnly: !isEdit }}
                  onChange={(e) =>
                    isEdit && setUser({ ...user, language: e.target.value })
                  }
                  sx={inputStyle}
                  fullWidth
                />
              </Box>

              {/* Confirm Button */}
              {isEdit && (
                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "#635bff",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      fontSize: 14,
                      px: 3,
                      mb: 2,
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            currentTab === "logs" && (
              <Typography sx={{ fontSize: 14, mt: 2 }}>Logs content</Typography>
            )
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
