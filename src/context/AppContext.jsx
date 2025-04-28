/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState } from "react";

// 1️⃣ Create a context
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

// 2️⃣ Create a provider component
export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <AppContext.Provider
      value={{ posts, setPosts, loading, setLoading, error, setError, fetchPosts }}
    >
      {children}
    </AppContext.Provider>
  );
};
