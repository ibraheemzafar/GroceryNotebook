import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import "./PlaceOrderPage.css";
import { db, auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

const PlaceOrderPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([{ name: "", quantity: "" }]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: "" }]);
  };

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

const removeProduct = (indexToRemove) => {
  setProducts((prev) => prev.filter((_, idx) => idx !== indexToRemove));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "orders"), {
        userId,
        ...contactInfo,
        products,
        status: "pending",
        createdAt: new Date(),
        timestamp: serverTimestamp(), // ✅ this is the fix
      });
      
      setProducts([{ name: "", quantity: "" }]);
      setContactInfo({ name: "", contact: "", address: "" });
      navigate("/my-orders");
    } catch (err) {
      alert("❌ Error placing order: " + err.message);
    }
  };

  return (
    <div className="place-order-wrapper">
      <h2 className="form-title">🛒 Place Your Order</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-section">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            required
            value={contactInfo.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <label>Contact Number</label>
          <input
            type="text"
            name="contact"
            placeholder="e.g. +123456789"
            required
            value={contactInfo.contact}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <label>Delivery Address</label>
          <textarea
            name="address"
            placeholder="Street, City, ZIP"
            required
            value={contactInfo.address}
            onChange={handleChange}
          />
        </div>

        <h3 className="product-header">🧾 Order Items</h3>
        {products.map((product, idx) => (
          <div key={idx} className="product-row">
            <input
              type="text"
              placeholder="Product Name"
              required
              value={product.name}
              onChange={(e) => handleProductChange(idx, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              required
              value={product.quantity}
              onChange={(e) =>
                handleProductChange(idx, "quantity", e.target.value)
              }
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeProduct(idx)}
            >
              ❌
            </button>
          </div>
        ))}

        <button type="button" className="btn-secondary" onClick={addProduct}>
          ➕ Add Product
        </button>

        <button type="submit" className="btn-primary">
          ✅ Submit Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrderPage;
