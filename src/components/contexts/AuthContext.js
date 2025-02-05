import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setError(null);
    setSuccessMessage(null);
  }, [api.defaults.headers.common]);

  const normalizeUserData = (userData) => {
    if (!userData) return null;

    const normalizedUser = {
      ...userData,
      userType: userData.userType || userData.role,
    };

    delete normalizedUser.role;

    return normalizedUser;
  };

  const fetchUser = useCallback(async () => {
    if (user) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/api/users/me");

      const normalizedUser = normalizeUserData(response.data);

      if (!normalizedUser || !normalizedUser.userType) {
        throw new Error("Invalid user data received");
      }

      setUser(normalizedUser);
      setError(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
      setError("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  }, [user, logout, api]);

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      if (isMounted) {
        await fetchUser();
      }
    };
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      setError(null);
      setSuccessMessage(null);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const loginData = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      console.log("Attempting login for:", loginData.email);

      const response = await api.post("/api/auth/login", loginData);
      const { token, user: userData } = response.data;

      const normalizedUser = normalizeUserData(userData);

      if (!token || !normalizedUser || !normalizedUser.userType) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(normalizedUser);
      setError(null);

      if (normalizedUser.userType === "lakeOwner") {
        setSuccessMessage(
          "Welcome back, Lake Owner! You've been successfully logged in."
        );
      } else if (normalizedUser.userType === "angler") {
        setSuccessMessage(
          "Welcome back, Angler! You've been successfully logged in."
        );
      } else if (normalizedUser.userType === "admin") {
        setSuccessMessage(
          "Welcome back, Admin! You've been successfully logged in."
        );
      } else {
        setSuccessMessage("Login successful");
      }

      console.log("Login successful for user type:", normalizedUser.userType);
      return normalizedUser;
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Failed to log in";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);

      if (
        !userData.email ||
        !userData.password ||
        (!userData.userType && !userData.role)
      ) {
        throw new Error("Missing required fields");
      }

      const registrationData = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        password: userData.password.trim(),
        userType: userData.userType || userData.role,
      };

      const response = await api.post("/api/auth/register", registrationData);
      const { token, user: responseUser } = response.data;

      const normalizedUser = normalizeUserData(responseUser);

      if (!token || !normalizedUser || !normalizedUser.userType) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(normalizedUser);
      setError(null);

      return normalizedUser;
    } catch (error) {
      console.error("Registration error:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Failed to register";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    error,
    successMessage,
    loading,
    login,
    register,
    logout,
    clearError,
    clearSuccessMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
