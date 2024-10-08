import React from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Background from "./components/Background.jsx";
import ListBooks from "./pages/ListBooks.jsx";
import DiscoverBooks from "./pages/DiscoverBooks.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ClippedDrawer from "./components/ClippedDrawer.jsx";
import ExchangeBooks from "./pages/ExchangeBooks.jsx";
const theme = createTheme({
  palette: {
    mode: 'light', // Use 'dark' if you prefer a dark theme
    primary: {
      main: '#000000', // Black for primary color
    },
    secondary: {
      main: '#ffffff', // White for secondary color
    },
    background: {
      default: '#ffffff', // White background for light mode
      paper: '#f5f5f5', // Slightly gray for paper elements
    },
    text: {
      primary: '#000000', // Black text for readability
      secondary: '#757575', // Gray for secondary text
    },
    divider: '#e0e0e0', // Light gray for dividers
  },
})
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Background><Login /></Background>,
  },
  {
    path: "/sign-up",
    element: <Background><Signup /></Background>,
  },
  {
    path:"/user/:username",
    element: <ClippedDrawer><UserProfile /></ClippedDrawer>
  },
  {
    path:"/books/list",
    element: <ClippedDrawer><ListBooks /></ClippedDrawer>
  },
  {
    path:"/books/discover",
    element: <ClippedDrawer><DiscoverBooks /></ClippedDrawer>
  },
  {
    path:"/books/exchange",
    element: <ClippedDrawer><ExchangeBooks /></ClippedDrawer>
  }
]);
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
