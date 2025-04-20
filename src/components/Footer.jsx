import { AppBar, Container, Toolbar, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <AppBar
      position="static"
      component="footer"
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: "rgba(10, 25, 47, 0.95)",
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(100, 149, 237, 0.1) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(100, 149, 237, 0.1) 1px,
            transparent 1px
          )`,
        backgroundSize: "25px 25px",
        backdropFilter: "blur(6px)",
        borderTop: "1px solid rgba(65, 105, 225, 0.3)",
        boxShadow: "0 -4px 20px rgba(10, 25, 47, 0.5)",
        py: 2,
        color: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                letterSpacing: "0.5px",
                color: "rgba(173, 216, 230, 0.8)",
              }}
            >
              Copyright © {new Date().getFullYear()} Team 8. All rights
              reserved.
            </Typography>

            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              sx={{
                textDecoration: "none",
                color: "rgba(100, 149, 237, 0.9)",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                textShadow: "0 0 10px rgba(100, 149, 237, 0.5)",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "rgba(30, 144, 255, 1)",
                  textShadow: "0 0 15px rgba(30, 144, 255, 0.7)",
                },
              }}
            >
              CINEPOST
            </Typography>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
