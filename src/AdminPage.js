import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
} from "@mui/material";

function AdminPage() {
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

  const markAsPacked = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "packed" });
  };

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Manage Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.length === 0 ? (
          <Typography variant="body1">No orders found.</Typography>
        ) : (
          orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card
                sx={{
                  minHeight: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: order.status === "packed" ? "2px solid green" : "1px solid gray",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order ID: {order.id}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    Products:
                  </Typography>
                  {order.products && order.products.length > 0 ? (
                    <ul>
                      {order.products.map((product, idx) => (
                        <li key={idx}>
                          {product.name} — {product.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No products available for this order.
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: "10px" }}>
                    Status: {order.status ? order.status : "pending"}
                  </Typography>
                </CardContent>

                {order.status !== "packed" && (
                  <Button
                    onClick={() => markAsPacked(order.id)}
                    variant="contained"
                    color="success"
                    sx={{ margin: "10px" }}
                  >
                    Mark as Packed
                  </Button>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default AdminPage;
