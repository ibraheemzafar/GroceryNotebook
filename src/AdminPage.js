import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel,
  Grid, Box, Divider, Chip, Stack
} from "@mui/material";
import { LocalShipping, Inventory, CheckCircle } from "@mui/icons-material";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const statusColors = {
  Pending: "warning",
  Packed: "info",
  Delivered: "success",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Order ID: {order.id.slice(0, 8)}...</Typography>
                  <Chip
                    label={order.status || "Pending"}
                    color={statusColors[order.status] || "default"}
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  User: {order.userId || "Unknown"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" alignItems="center" mb={1} spacing={1}>
                  <Inventory fontSize="small" color="action" />
                  <Typography variant="subtitle2">Products:</Typography>
                </Stack>

                <ul style={{ paddingLeft: "1rem" }}>
                  {order.products?.map((product, index) => (
                    <li key={index}>
                      {product.name} – {product.quantity}
                    </li>
                  )) || <li>No products</li>}
                </ul>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={order.status || "Pending"}
                    label="Status"
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <MenuItem value="Pending">
                      <LocalShipping fontSize="small" sx={{ mr: 1 }} /> Pending
                    </MenuItem>
                    <MenuItem value="Packed">
                      <Inventory fontSize="small" sx={{ mr: 1 }} /> Packed
                    </MenuItem>
                    <MenuItem value="Delivered">
                      <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Delivered
                    </MenuItem>
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

export default AdminOrders;
