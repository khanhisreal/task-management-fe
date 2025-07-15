/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
  TableContainer,
} from "@mui/material";
import { TableRowItem } from "./TableRowItem";

type TableAction = {
  label: string;
  icon: React.ReactNode;
  onClick: (id: string) => void;
  hidden?: (data: any) => boolean;
  disabled?: (data: any) => boolean;
};

type TableComponentProps = {
  loading: boolean;
  columns: string[];
  data: Record<string, any>[];
  onDeleteClick: (id: string) => void;
  onRowActionClick: (id: string, action: string) => void;
  variant?: string;
  actions?: TableAction[];
};

export function TableComponent({
  loading,
  columns,
  data,
  actions,
  onDeleteClick,
  onRowActionClick,
  variant,
}: TableComponentProps) {
  return (
    <TableContainer
      sx={{
        maxHeight: "320px",
        overflowY: "auto",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  borderBottom: "1px solid #ccc",
                  textTransform: "uppercase",
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: "center", padding: "20px" }}
              >
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: "center", padding: "20px" }}
              >
                <Typography>No records found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRowItem
                key={idx}
                columns={columns}
                data={row}
                onDeleteClick={onDeleteClick}
                onRowActionClick={onRowActionClick}
                variant={variant}
                actions={actions}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
