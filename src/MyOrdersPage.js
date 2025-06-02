import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // Your firebase config file
import {
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

export default function MyOrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      // No user, reset orders and loading
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribeOrders = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load orders: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribeOrders();
  }, [user]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );

  if (!user)
    return (
      <Typography variant="h6" align="center" sx={{ mt: 5 }}>
        Please login to see your orders.
      </Typography>
    );

  if (orders.length === 0)
    return (
      <Typography variant="h6" align="center" sx={{ mt: 5 }}>
        No orders found.
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Orders
      </Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item   xs={12} sx={{ width: "100%", maxWidth: 900, mx: "auto", px: 2}} key={order.id}>
            <Card elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: "#fff" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order ID: <strong>{order.id.slice(0, 8).toUpperCase()}</strong>
                </Typography>

                {/* Products Grid */}
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      fontWeight: "bold",
                      bgcolor: "#f5f5f5",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography>Name</Typography>
                    <Typography>Quantity</Typography>
                  </Box>

                  {order.products?.map((product, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        p: 1,
                        borderBottom: "1px solid #eee",
                        bgcolor: idx % 2 === 0 ? "#fafafa" : "#ffffff",
                      }}
                    >
                      <Typography>{product.name}</Typography>
                      <Typography>{product.quantity}</Typography>

                    </Box>
                  ))}
                </Box>

                {/* Optional: Add order metadata */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Placed on:{" "}
                    {order.timestamp?.toDate
                      ? order.timestamp.toDate().toLocaleString()
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {order.contact}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {order.address}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
}
