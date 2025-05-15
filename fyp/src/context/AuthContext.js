import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // NEW: loading state

  // Rehydrate auth state from localStorage
  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");

    if (storedAuthState) {
      const { isAuthenticated, userInfo } = JSON.parse(storedAuthState);
      setIsAuthenticated(isAuthenticated);
      setUserInfo(userInfo);
    }

    setLoading(false); // Finished loading
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true },
      );

      if (res.status === 200) {
        const { user } = res.data;
        setIsAuthenticated(true);
        setUserInfo(user);

        localStorage.setItem(
          "authState",
          JSON.stringify({ isAuthenticated: true, userInfo: user }),
        );

        return { success: true, user };
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
        return { success: false };
      }
    } catch (err) {
      setIsAuthenticated(false);
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem("authState");
  };

  // Don't render children until auth is rehydrated
  if (loading) return null; // or <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
