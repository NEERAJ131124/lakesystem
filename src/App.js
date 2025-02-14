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
import AboutUs from "./pages/AboutUs.jsx";
import { Toaster } from "react-hot-toast";
import LakesPage from "./pages/LakesPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import UserProfile from "./components/dashboards/Profile.jsx";
import ManageLakes from "./components/dashboards/manageLakes.jsx";
import EditLake from "./components/dashboards/ManageLakes/EditLake.jsx";
import CreateLake from "./components/dashboards/ManageLakes/CreateLake.jsx";
import AddFishStock from "./components/dashboards/ManageFishStock/AddFishStock.jsx";
import ManageFishStock from "./components/dashboards/ManageFishStock/ManageFishStock.jsx";
import ViewNewLakes from "./pages/ViewNewLakes.jsx";
import ManageFishStockUser from "./components/dashboards/ManageFishStock/ManageFishStockUser.jsx";

const PrivateRoute = ({ children, allowedUserTypes }) => {
  const { user } = useAuth();

  // console.log("User:", user);
  // console.log("Allowed User Types:", allowedUserTypes);
  // console.log(
  //   "User Type Check:",
  //   user ? allowedUserTypes.includes(user.userType) : false
  // );

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
              <Route path="/about" element={<AboutUs />} />
              <Route path="/lakes" element={<LakesPage />} />
              <Route path="/contact" element={<ContactUs />} />
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
                path="/new-lakes"
                element={
                  <PrivateRoute allowedUserTypes={["angler"]}>
                    <ViewNewLakes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fish-stock/:id"
                element={
                  <PrivateRoute allowedUserTypes={["angler"]}>
                    <ManageFishStockUser />
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
              >
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="manage-lakes" element={<ManageLakes />} />
                <Route path="create-lake" element={<CreateLake />} />
                <Route path="edit-lake/:lakeId" element={<EditLake />} />
                <Route path="add-fish-stock/:id" element={<AddFishStock />} />
                <Route path="edit-fish-stock/:id" element={<AddFishStock />} />
                <Route
                  path="manage-fish-stock/:id"
                  element={<ManageFishStock />}
                />
              </Route>
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
