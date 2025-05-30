import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const unsubscribeOrders = onSnapshot(
          q,
          (snapshot) => {
            const userOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setOrders(userOrders);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeOrders();
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="order-list">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <span>Order ID: {order.id}</span>
            <span className={`order-status ${order.status}`}>{order.status}</span>
          </div>
          <ul className="order-products">
            {order.products?.map((p, i) => (
              <li key={i}>
                <strong>{p.name}</strong> — {p.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
