import React from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

function Header({ user, isAdmin }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Grocery Notebook
        </Typography>

        <Stack direction="row" spacing={2}>
          {!user && (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/signup" color="inherit">
                Signup
              </Button>
            </>
          )}

          {user && isAdmin && (
            <Button component={Link} to="/admin" color="inherit">
              Admin Panel
            </Button>
          )}

          {user && !isAdmin && (
            <div>
              <Button component={Link} to="/orders" color="inherit">
                Place Order
              </Button>
              <Button component={Link} to="/my-orders" color="inherit">
                My Orders
              </Button>
            </div>
          )}

          {user && (
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
