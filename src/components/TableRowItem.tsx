/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  TableRow,
  TableCell,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CopyIcon from "../assets/images/main/icon-content-copy.png";

type TableAction = {
  label: string;
  icon: React.ReactNode | ((data: any) => React.ReactNode);
  onClick: (id: string, data?: any) => void;
  hidden?: (data: any) => boolean;
  disabled?: (data: any) => boolean;
};

type TableRowItemProps = {
  columns: string[];
  data: Record<string, any>;
  onDeleteClick: (id: string) => void;
  onRowActionClick: (id: string, action: string) => void;
  actions?: TableAction[];
  variant?: string;
};

export function TableRowItem({
  columns,
  data,
  onDeleteClick,
  onRowActionClick,
  actions,
  variant,
}: TableRowItemProps) {
  const [open, setOpen] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => setOpen(true));
  };

  const handleClose = (_?: any, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <>
      <TableRow>
        {columns.map((col, idx) => {
          const value = data[col];

          if (col === "Actions") {
            return (
              <TableCell key={idx} sx={{ padding: "10px", width: "120px" }}>
                <Box display="flex" alignItems="center" gap="4px">
                  {actions && actions.length > 0 ? (
                    actions
                      .filter((action) => !action.hidden?.(data))
                      .map((action, i) => (
                        <IconButton
                          key={i}
                          onClick={() => action.onClick(data.id, data)}
                          disabled={action.disabled?.(data)}
                          title={action.label}
                        >
                          {typeof action.icon === "function"
                            ? action.icon(data)
                            : action.icon}
                        </IconButton>
                      ))
                  ) : (
                    <>
                      <IconButton
                        onClick={() => onRowActionClick(data.id, "view")}
                      >
                        <RemoveRedEyeIcon
                          sx={{ fontSize: 18, color: "#333" }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => onRowActionClick(data.id, "update")}
                      >
                        {variant === "userTask" ? (
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 18, color: "#333" }}
                          />
                        ) : (
                          <CreateIcon sx={{ fontSize: 18, color: "#333" }} />
                        )}
                      </IconButton>
                      {variant !== "userTask" && (
                        <IconButton onClick={() => onDeleteClick(data.id)}>
                          <DeleteIcon sx={{ fontSize: 18, color: "#333" }} />
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
              </TableCell>
            );
          }

          if (
            typeof value === "string" &&
            value.length === 24 &&
            /^[a-f0-9]{24}$/.test(value)
          ) {
            return (
              <TableCell key={idx} sx={{ padding: "10px", width: "120px" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 400, mr: 1 }}>
                    {value.slice(0, 6) + "..."}
                  </Typography>
                  <IconButton
                    onClick={() => handleCopy(value)}
                    sx={{ padding: "6px" }}
                  >
                    <img src={CopyIcon} alt="Copy" width="17px" />
                  </IconButton>
                </Box>
              </TableCell>
            );
          }

          if (col === "Role") {
            let bgColor = "#38425014";
            let textColor = "#384250";

            if (value === "Manager") {
              bgColor = "#6222AB33";
              textColor = "#6222AB";
            } else if (value === "Leader") {
              bgColor = "#0A53A833";
              textColor = "#0A53A8";
            }

            return (
              <TableCell key={idx} sx={{ padding: "10px" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    padding: "4px 8px",
                    backgroundColor: bgColor,
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: textColor,
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              </TableCell>
            );
          }

          if (col === "Status") {
            let bgColor = "#F790091F";
            let textColor = "#B54708";

            if (value === "Activated" || value === "Done") {
              bgColor = "#15B79E1F";
              textColor = "#107569";
            }

            return (
              <TableCell key={idx} sx={{ padding: "10px" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    padding: "4px 12px",
                    backgroundColor: bgColor,
                    borderRadius: "100px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: textColor,
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              </TableCell>
            );
          }

          return (
            <TableCell
              key={idx}
              sx={{ fontSize: 14, fontWeight: 400, padding: "10px" }}
            >
              {value}
            </TableCell>
          );
        })}
      </TableRow>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
