import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function UserPage() {
  const [products, setProducts] = useState([{ name: "", quantity: "" }]);
  const [success, setSuccess] = useState(false);

  const handleChange = (index, e) => {
    const values = [...products];
    values[index][e.target.name] = e.target.value;
    setProducts(values);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: "", quantity: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "orders"), {
        products,
        createdAt: Timestamp.now(),
        packed: false,
      });

      setProducts([{ name: "", quantity: "" }]);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h1>Grocery Notebook 🛒</h1>

      <form onSubmit={handleSubmit}>
        {products.map((product, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleChange(index, e)}
              required
              style={{ padding: "10px", width: "45%", marginRight: "5%" }}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) => handleChange(index, e)}
              required
              style={{ padding: "10px", width: "45%" }}
            />
          </div>
        ))}

        <button type="button" onClick={handleAddProduct} style={{ marginBottom: "20px" }}>
          ➕ Add Another Product
        </button>

        <br />

        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit Order
        </button>
      </form>

      {success && <p style={{ color: "green", marginTop: "10px" }}>Order Submitted!</p>}
    </div>
  );
}

export default UserPage;
