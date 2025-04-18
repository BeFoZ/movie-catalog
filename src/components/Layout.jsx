import { Box, Container } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <Container fixed>
      <Box sx={{ p: 4 }} />
      <Navbar />
      <Outlet />
      <Footer />
    </Container>
  );
}
