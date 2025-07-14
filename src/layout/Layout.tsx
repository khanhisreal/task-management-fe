import { Box, Button, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Searchbar } from "../components/Searchbar";
import AddIcon from "../assets/images/main/icon-add.png";
import FilterIcon from "../assets/images/main/icon-filter-list.png";

type LayoutProps = {
  title: string;
  subtitle?: string;
  onAddClick?: () => void;
  addButtonLabel?: string;
  onFilterClick?: () => void;
  children: ReactNode;
};

export default function Layout({
  title,
  subtitle,
  onAddClick,
  addButtonLabel,
  onFilterClick,
  children,
}: LayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6" }}>
      {/* Global Top Nav */}
      <Searchbar />

      {/* Page content container */}
      <Box sx={{ px: { xs: 2, md: 15 } }}>
        {/* Page Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ fontSize: "20px", py: 0, marginBottom: "16px" }}
        >
          {title}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            mb: 3,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography fontWeight={700}>{subtitle}</Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {onFilterClick && (
                <Button
                  onClick={onFilterClick}
                  startIcon={
                    <Box
                      component="img"
                      src={FilterIcon}
                      alt="Filter"
                      sx={{ width: 20 }}
                    />
                  }
                  sx={{
                    borderRadius: "12px",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    bgcolor: "#e0e0e0",
                    color: "black",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    padding: "6px 16px",
                    minWidth: "auto",
                    "&:hover": { bgcolor: "#d5d5d5" },
                  }}
                >
                  Filters
                </Button>
              )}

              {onAddClick && addButtonLabel && (
                <Button
                  onClick={onAddClick}
                  startIcon={
                    <Box
                      component="img"
                      src={AddIcon}
                      alt="Add"
                      sx={{ width: 20 }}
                    />
                  }
                  sx={{
                    borderRadius: "12px",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    bgcolor: "#635bff",
                    color: "white",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    padding: "6px 16px",
                    minWidth: "auto",
                    ml: "8px",
                    "&:hover": { bgcolor: "#5047d4" },
                  }}
                >
                  {addButtonLabel}
                </Button>
              )}
            </Box>
          </Box>

          {/* Page Body */}
          <Box>{children}</Box>
        </Paper>
      </Box>
    </Box>
  );
}
