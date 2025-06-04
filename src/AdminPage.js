import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { db } from "./firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(allOrders);
      },
      (error) => {
        console.error("Admin order snapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>

      <Box sx={{ display: "flex", textAlign: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Typography variant="h5" gutterBottom sx={{ width: "100%"}}>
          Admin - All Orders
        </Typography>
      </Box>  

      <Grid container spacing={2}>
        {orders.map((order) => (
         <Grid item sx={{  width: "100%",  maxWidth: "100%", px: { xs: 1, sm: 2 }, display: "flex", justifyContent: "center" }} key={order.id}>
          <Box
            sx={{width: "100%", maxWidth: "900px", mx: "auto",    px: { xs: 1, sm: 2 } }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Order ID: {order.id}
                </Typography>
                <Typography variant="h6">{order.name}</Typography>
                <Typography>📞 {order.contact}</Typography>
                <Typography>📍 {order.address}</Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Products
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.products?.map((product, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="center">{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <Typography variant="body2" color="text.secondary">
                    Placed at: {new Date(order.timestamp?.toDate()).toLocaleString()}
                  </Typography>

                  <FormControl size="small" sx={{ minWidth: 140, mt: 1 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={order.status || "Pending"}
                      label="Status"
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
             </Card>
            </Box>
          </Grid>
        ))}

        {orders.length === 0 && (
          <Typography variant="body1" sx={{ m: 4 }}>
            No orders found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default AdminOrdersPage;
