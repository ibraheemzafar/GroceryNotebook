import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user role as "user" in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
      });

      navigate("/orders"); // ✅ redirect to order page
    } catch (err) {
      const code = err.code;
      if (code === "auth/email-already-in-use") setError("Email already in use");
      else if (code === "auth/weak-password") setError("Password too weak");
      else setError("Signup failed. Try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
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
              color="success"
              fullWidth
              sx={{
                mt: 2,
                ":hover": { backgroundColor: "#2e7d32" },
              }}
            >
              Sign Up
            </Button>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  ":hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#1976d2",
                  },
                }}
              >
                Already have an account? Login
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default SignupPage;
