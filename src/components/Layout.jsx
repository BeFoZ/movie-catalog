import { Box, Container } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./ui/Navbar/Navbar";
import Footer from "./ui/Footer/Footer";

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
