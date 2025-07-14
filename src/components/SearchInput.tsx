import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "../assets/images/main/Icon-magnifying-glass.png";

type SearchInputProps = {
  placeholder: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchInput({
  placeholder,
  searchQuery,
  onSearchQueryChange,
  onSearch,
}: SearchInputProps) {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => onSearchQueryChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch();
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ marginRight: "8px" }}>
            <img
              src={SearchIcon}
              alt="search"
              style={{
                width: 24,
                height: 24,
                padding: "3.5px",
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        flex: 1,
        minWidth: "300px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          padding: "0px 12px",
          border: "1px solid #d2d6db",
          "&:hover": {
            borderColor: "#d2d6db",
          },
          "&.Mui-focused": {
            borderColor: "#d2d6db",
          },
          "& input": {
            padding: "6.5px 0px",
            fontSize: "14px",
            "&::placeholder": {
              color: "#6c737f",
              opacity: 1,
              fontSize: "13px",
            },
          },
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    />
  );
}
