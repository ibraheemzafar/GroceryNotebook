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
    <AppBar position="static" sx={{
        bgcolor: "#b1d5be",
        color: "#333",
        py: 1,
        px: { xs: 1, sm: 3 },
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }} >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            color: "#2e7d32",
            textDecoration: "none",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Grocery<span style={{ color: "#66bb6a" }}>Store</span>
        </Typography>


        <Stack direction="row" spacing={2}>
          {!user && (
            <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
              <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 500,
                    bgcolor: "#2e7d32",
                    "&:hover": {
                      bgcolor: "#1b5e20",
                    },
                  }}
                >
                  Sign Up
                </Button>
            </>
          )}

          {user && isAdmin && (
            <Button component={Link} to="/admin" variant="outlined"
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 500,
                  }}>
              Admin Panel
            </Button>
          )}

          {user && !isAdmin && (
            <div>
              <Button component={Link} to="/orders" variant="outlined"
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 500,
                    mr:1
                  }}>
                Place Order
              </Button>
              <Button component={Link} to="/my-orders" variant="outlined"
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 500,
                  }}>
                My Orders
              </Button>
            </div>
          )}

          {user && (
            <Button onClick={handleLogout} variant="contained"
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 500,
                    bgcolor: "#2e7d32",
                    "&:hover": {
                      bgcolor: "#1b5e20",
                    },
                  }}>
              Logout
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
