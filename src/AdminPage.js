import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Chip,
  Divider,
  CardHeader,
  Avatar,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const statusColors = {
  pending: "warning",
  packing: "info",
  packed: "primary",
  delivered: "success",
};

const AdminPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        📦 Admin Dashboard – Manage Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order, idx) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card elevation={3}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    <AssignmentTurnedInIcon />
                  </Avatar>
                }
                title={`Order #${idx + 1}`}
                subheader={`ID: ${order.id.slice(0, 6)}...`}
              />
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Products:
                </Typography>
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  {order.products?.map((p, i) => (
                    <li key={i}>
                      {p.name} × <strong>{p.quantity}</strong>
                    </li>
                  ))}
                </ul>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Current Status:
                </Typography>
                <Chip
                  label={order.status || "pending"}
                  color={statusColors[order.status] || "default"}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth>
                  <InputLabel>Update Status</InputLabel>
                  <Select
                    value={order.status || "pending"}
                    label="Update Status"
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="packing">Packing</MenuItem>
                    <MenuItem value="packed">Packed</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPage;
