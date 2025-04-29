import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

function OrderPage() {
  const [products, setProducts] = useState([{ name: "", quantity: "" }]);
  const [loading, setLoading] = useState(false);

  const handleProductChange = (index, event) => {
    const updatedProducts = [...products];
    updatedProducts[index][event.target.name] = event.target.value;
    setProducts(updatedProducts);
  };

  const addProductField = () => {
    setProducts([...products, { name: "", quantity: "" }]);
  };

  const removeProductField = (index) => {
    if (products.length > 1) {
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        products,
        createdAt: Timestamp.now(),
        status: "pending",
      });
      alert("Order placed successfully!");
      setProducts([{ name: "", quantity: "" }]); // Reset form
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Error placing order!");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Place an Order
          </Typography>

          <form onSubmit={handleSubmit}>
            {products.map((product, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={5}>
                  <TextField
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => removeProductField(index)} color="error">
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addProductField}
              fullWidth
              sx={{ mb: 2 }}
            >
              Add More Products
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Submit Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default OrderPage;
