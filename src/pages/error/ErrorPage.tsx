import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import StarackLogo from "../../assets/images/main/starack-logo.png";

export function ErrorPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
    >
      <Box component="main">
        <Box mb={2}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={48}
              height={48}
              borderRadius="50%"
              overflow="hidden"
            >
              <Box
                component="img"
                src={StarackLogo}
                alt="Starack Logo"
                sx={{ width: 40 }}
              />
            </Box>
            <Box mt={1}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: 1 }}
              >
                STARACK
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: 13 }}
              >
                Version V1.2
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="h4" fontWeight={700} mb={1}>
          An error occurred!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ width: 440 }}>
          When this happens, it's usually because this page doesn't exist or you
          are not permitted to access it.
        </Typography>

        <Box mt={3}>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              textTransform: "capitalize",
              fontWeight: 600,
              px: 2.5,
              py: 1.2,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20, mr: 1 }} />
            Comeback
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
