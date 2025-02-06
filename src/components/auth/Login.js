import { useAuth } from "../contexts/AuthContext";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, user, successMessage, clearError, clearSuccessMessage } =
    useAuth();

  const redirectBasedOnUserType = useCallback(
    (user) => {
      if (user.userType === "lakeOwner") {
        navigate("/lake-owner-dashboard");
      } else if (user.userType === "angler") {
        navigate("/angler-dashboard");
      } else if (user.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (user) {
      redirectBasedOnUserType(user);
    }
    return () => {
      clearError();
      clearSuccessMessage();
    };
  }, [user, redirectBasedOnUserType, clearError, clearSuccessMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      console.log("Attempting login with email:", email);
      const loggedInUser = await login(email, password);
      console.log("Login successful, user object:", loggedInUser);

      if (!loggedInUser || !loggedInUser.userType) {
        console.error(
          "User object is missing or has no userType:",
          loggedInUser
        );
        setError(
          "Login successful but user data is incomplete. Please contact support."
        );
        setIsLoading(false);
        return;
      }

      // Set success message based on user type
      if (loggedInUser.userType === "admin") {
        setSuccess("Admin login successful! Redirecting to admin dashboard...");
      } else {
        setSuccess(successMessage || "Login successful!");
      }

      setTimeout(() => {
        redirectBasedOnUserType(loggedInUser);
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.message || "Failed to log in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div
              className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  maxLength={20}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
