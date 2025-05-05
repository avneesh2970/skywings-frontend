/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// 1️⃣ Create a context
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

// 2️⃣ Create a provider component
export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/blog/posts`
      );
      console.log("Posts fetched:", response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
      setLoading(false);
    }
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedInUser = sessionStorage.getItem("user");
      if (loggedInUser) {
        try {
          const userData = JSON.parse(loggedInUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Error parsing user data from sessionStorage", e);
          sessionStorage.removeItem("user");
        }
      }
    };

    checkAuth();
  }, []);

  // Login function
  // Login function
  // const login = (email, password) => {
  //   // In a real app, you would validate credentials against your backend
  //   // This is a simplified example
  //   if (email === "career@assuredjob.com" && password === "admin123") {
  //     const userData = { email, role: "admin" };
  //     sessionStorage.setItem("user", JSON.stringify(userData));
  //     setUser(userData);
  //     setIsAuthenticated(true);
  //     return true;
  //   }
  //   return false;
  // };
  const login = async (email, password) => {
    try {
      // Get stored password from localStorage or use default
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login-admin`,
        { email, password }
      );
      console.log("response", response.data);
      if (response.data.success) {
        const userData = { email, role: "admin" };
        sessionStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error.response.data.message || "Error logging in. Please try again."
      );
    }
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/admin/login");
  };
  return (
    <AppContext.Provider
      value={{
        posts,
        setPosts,
        loading,
        setLoading,
        error,
        setError,
        fetchPosts,
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
      <Toaster/>
    </AppContext.Provider>
  );
};
