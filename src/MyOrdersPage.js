import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Container,
  Grid,
} from "@mui/material";
import { auth, db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const statusColors = {
  pending: "warning",
  packing: "info",
  packed: "primary",
  delivered: "success",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "orders"),
    //   where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        📜 My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order, idx) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Order #{idx + 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {order.id.slice(0, 8)}...
                </Typography>

                <Divider sx={{ my: 1 }} />

                <ul style={{ paddingLeft: 20 }}>
                  {order.products?.map((p, i) => (
                    <li key={i}>
                      {p.name} × <strong>{p.quantity}</strong>
                    </li>
                  ))}
                </ul>

                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">Status:</Typography>
                <Chip
                  label={order.status}
                  color={statusColors[order.status] || "default"}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {orders.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You haven't placed any orders yet.
        </Typography>
      )}
    </Container>
  );
};

export default MyOrdersPage;
