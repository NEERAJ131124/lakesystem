import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import LakeOwnerDashboard from "./components/dashboards/LakeOwnerDashboard.jsx";
import AnglerDashboard from "./components/dashboards/AnglerDashboard.jsx";
import AdminDashboard from "./components/dashboards/AdminDashboard.jsx";
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js";
import AboutUs from "./pages/AboutUs";
import { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children, allowedUserTypes }) => {
  const { user } = useAuth();

  console.log("User:", user);
  console.log("Allowed User Types:", allowedUserTypes);
  console.log(
    "User Type Check:",
    user ? allowedUserTypes.includes(user.userType) : false
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Toaster />
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about-us" element={<AboutUs />} />

              <Route
                path="/admin-dashboard"
                element={
                  <PrivateRoute allowedUserTypes={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/angler-dashboard"
                element={
                  <PrivateRoute allowedUserTypes={["angler"]}>
                    <AnglerDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/lake-owner-dashboard"
                element={
                  <PrivateRoute allowedUserTypes={["lakeOwner"]}>
                    <LakeOwnerDashboard />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
