import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../slice/authSlice";
import { login } from "../api/authApi";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { hasTokenExpired } from "../utils/utils";
import { useSelector } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();

  const credentials = useSelector((state) => state.auth);
  const tokenHasExpired = hasTokenExpired(credentials.creation_time);

  // validate token existence and expiry
  if (credentials.token && credentials.token !== " " && !tokenHasExpired)
    {
      return <Navigate to="/Home" replace />
    }
  else if(tokenHasExpired){
    toast.warn("Session Token has Expired, Logging out")
    dispatch(clearCredentials());
  }

  // Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const tokenData = await login(username, password);
      dispatch(
        setCredentials({
          username,
          token: tokenData.token,
          creation_time: tokenData.creation_time,
        })
      );
      toast.success("Login successful!");
    } catch (error) {
      toast.error(`An error ocurred: ${error.message}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "background.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default Login;
