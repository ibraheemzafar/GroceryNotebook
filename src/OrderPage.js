import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


const OrderPage = () => {
  const [products, setProducts] = useState([{ name: "", quantity: 1 }]);
  const [message, setMessage] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = field === "quantity" ? parseInt(value) : value;
    setProducts(updated);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: "", quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }
  
    const cleanProducts = products.filter(p => p.name.trim() !== "");
  
    if (cleanProducts.length === 0) {
      alert("Please add at least one product.");
      return;
    }
  
    await addDoc(collection(db, "orders"), {
      userId: user.uid,             // ✅ Attach user
      products: cleanProducts,
      status: "pending",            // default order status
      createdAt: serverTimestamp(), // for sorting
    });
  
    // Optional: success feedback
    setMessage("Order placed successfully!");
    setProducts([{ name: "", quantity: 1 }]);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          🛒 Place Your Order
        </Typography>

        {products.map((product, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={product.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                fullWidth
                label="Quantity"
                value={product.quantity}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
              />
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="error"
                onClick={() => handleRemoveProduct(index)}
                disabled={products.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{ mb: 2 }}
        >
          Add Product
        </Button>

        <Box>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Order
          </Button>
        </Box>

        {message && (
          <Typography variant="subtitle1" color="success.main" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default OrderPage;
