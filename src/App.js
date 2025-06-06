import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Import Firebase config
import MyOrdersPage from "./MyOrdersPage";
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage";
import SignUpPage from "./SignUpPage";
import OrderPage from "./OrderPage"; // Import the PlaceOrderPage component
import Header from './Header'
import { Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            setIsAdmin(true); // User is an admin
          } else {
            setIsAdmin(false); // User is not an admin
          }
        }
        setUser(currentUser); // Set user info
      } else {
        setUser(null); // No user, clear state
        setIsAdmin(false); // Reset admin role
      }
      setLoading(false); // Set loading to false once the auth check is complete
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking auth state
  }

  return (
    <>
      <div id="bg-blur" /> {/* This stays behind everything */}

      <Router>
        <Header user={user} isAdmin={isAdmin} />
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/orders" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={user ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/orders" replace />) : <LoginPage />}
          />
          <Route
            path="/signup"
            element={user ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/orders" replace />) : <SignUpPage />}
          />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/admin" element={isAdmin ? <AdminPage /> : <LoginPage />} />
          <Route path="/orders" element={user ? <OrderPage /> : <LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
