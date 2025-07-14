import { Box, Button } from "@mui/material";
import { SearchInput } from "./SearchInput";

type SearchActionBarProps = {
  searchQuery: string;
  placeholder: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchActionBar({
  searchQuery,
  placeholder,
  onSearchQueryChange,
  onSearch,
}: SearchActionBarProps) {
  return (
    <Box display="flex" alignItems="center" px={3} py={2}>
      <SearchInput
        placeholder={placeholder}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearch={onSearch}
      />
      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
          bgcolor: "#635bff",
          color: "white",
          textTransform: "capitalize",
          fontWeight: 600,
          borderRadius: "12px",
          px: "16px",
          fontSize: "14px",
          minHeight: "36px",
          ml: "24px",
          "&:hover": {
            bgcolor: "#564ee9",
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
}
