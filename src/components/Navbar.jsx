import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { iconComponents, MOVIE_LISTS, TOP_LISTS } from "../../constants.js";
import MovieIcon from "@mui/icons-material/Movie";
import { Widgets } from "@mui/icons-material";
import { Heart } from "lucide-react";
import Search from "./Search.jsx";

const Icon = ({ iconName }) => {
  const IconComponent = iconComponents[iconName];
  return <IconComponent />;
};

export default function Navbar() {
  const [isOpen, setOpen] = useState(false);

  const trigger = useScrollTrigger({
    target: window,
  });

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar>
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Drawer open={isOpen} onClose={handleDrawerToggle}>
              <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
                <List>
                  {TOP_LISTS.map((item) => (
                    <Link key={item.title} component={RouterLink} to={item.url}>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <Icon iconName={item.icon} />
                          </ListItemIcon>
                          <ListItemText primary={item.title} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
                </List>
                <Divider />
                <div className="px-4 py-2">
                  <RouterLink to="/favorites" onClick={handleDrawerToggle}>
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-gray-700" />
                      <span className="text-gray-800 font-medium">Обрані</span>
                    </div>
                  </RouterLink>
                </div>
                <List>
                  {MOVIE_LISTS.map((item) => (
                    <Link key={item.title} component={RouterLink} to={item.url}>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <Icon iconName={item.icon} />
                          </ListItemIcon>
                          <ListItemText primary={item.title} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Box>
            </Drawer>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
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
              <Search />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
}
