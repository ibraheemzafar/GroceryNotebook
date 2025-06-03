import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Import Firestore
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
   const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // After login, check the role of the user
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // If the user has 'admin' role, redirect to admin panel
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          // If the user is not an admin, navigate to orders page
          navigate("/orders");
        }
      }
      } catch (err) {
      const code = err.code;
      if (code === "auth/user-not-found") setError("User not found");
      else if (code === "auth/wrong-password") setError("Wrong password");
      else setError("Login failed. Try again.");
    }
  };
  return (
     <Box
      sx={{
        minHeight: "50vh",
        backgroundImage: "url('/bg.jpg')", // Make sure this path is correct
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={6}
          sx={{
            borderRadius: 3,
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>

              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account?
              </Typography>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 1,
                    "&:hover": {
                      backgroundColor: "transparent", // keep background same
                      color: "primary.main", // keep text color same
                      borderColor: "primary.main", // prevent hover border change
                      cursor: "pointer", // optional: remove pointer cursor
                    },
                  }}
                >
                  Create Account
                </Button>
              </Link>
            </Box>
            {error && (
              <Typography
                color="error"
                sx={{ fontSize: "0.875rem", mt: 2 }}
                align="center"
              >
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
