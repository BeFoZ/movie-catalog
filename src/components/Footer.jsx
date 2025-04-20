import { AppBar, Container, Toolbar, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <AppBar
      position="static"
      component="footer"
      sx={{
        top: "auto",
        backgroundColor: "background.paper",
        color: "text.primary",
        mt: "auto",
        py: 1,
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
            <Typography variant="body2">
              Copyright © {new Date().getFullYear()} Team 8. All rights
              reserved.
            </Typography>

            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
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
