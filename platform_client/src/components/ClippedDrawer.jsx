import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Person2Icon from "@mui/icons-material/Person2";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BookIcon from "@mui/icons-material/Book";
import SearchIcon from "@mui/icons-material/Search";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../slice/authSlice";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme, useMediaQuery } from "@mui/material";

const drawerWidth = 240;

export default function ClippedDrawer({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(false);
  const userData = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
              {
                name: "Profile",
                ico: <Person2Icon />,
                link: `/user/${userData.username}`,
              },
              { name: "List Books", ico: <BookIcon />, link: "/books/list" },
              {
                name: "Discover Books",
                ico: <SearchIcon />,
                link: "/books/discover",
              },
              {
                name: "Exchange Books",
                ico: <CollectionsBookmarkIcon />,
                link: "/books/exchange",
              },
              { name: "Log Out", ico: <LogoutIcon />, link: "/" },
            ].map((data, index) => (
              <ListItem key={data.name} disablePadding>
                <Link
                  to={data.link}
                  component={RouterLink}
                  underline="none"
                  width={`100%`}
                  onClick={() => {
                    if (data.link === "/") dispatch(clearCredentials());
                    if (isMobile) setOpen(false);
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>{data.ico}</ListItemIcon>
                    <ListItemText primary={data.name} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        {children}
      </Box>
    </Box>
  );
}
