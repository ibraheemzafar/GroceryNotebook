import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

const Header = ({ user, isAdmin }) => {
  const navigate = useNavigate()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };


  const navItems = (
    <>
      {!user && (
        <>
          <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
            Login
          </MenuItem>
          <MenuItem component={Link} to="/signup" onClick={handleMenuClose}>
            Signup
          </MenuItem>
        </>
      )}
      {user && isAdmin && (
        <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
          Admin Panel
        </MenuItem>
      )}
      {user && !isAdmin && (
        <>
          <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
            Place Order
          </MenuItem>
          <MenuItem component={Link} to="/my-orders" onClick={handleMenuClose}>
            My Orders
          </MenuItem>
        </>
      )}
      {user && (
        <MenuItem
          onClick={() => {
            handleLogout();
            handleMenuClose();
          }}
        >
          Logout
        </MenuItem>
      )}
    </>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#fff", color: "#333", boxShadow: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "#2e7d32", fontWeight: "bold" }}
        >
          Grocery<span style={{ color: "#66bb6a" }}>Notebook</span>
        </Typography>

        {/* Navigation */}
        {isMobile ? (
          <>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {navItems}
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={2}>
            {!user && (
              <>
                <Button component={Link} to="/login" variant="text" color="inherit">
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="contained" sx={{ borderRadius: "20px", textTransform: "none", bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}>
                  Sign Up
                </Button>
              </>
            )}
            {user && isAdmin && (
              <Button component={Link} to="/admin" color="inherit">
                Admin Panel
              </Button>
            )}
            {user && !isAdmin && (
              <>
                <Button component={Link} to="/orders" color="inherit">
                  Place Order
                </Button>
                <Button component={Link} to="/my-orders" color="inherit">
                  My Orders
                </Button>
              </>
            )}
            {user && (
              <Button onClick={handleLogout} sx={{ borderRadius: "20px", textTransform: "none", color: "white", bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }} >
                Logout
              </Button>
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
