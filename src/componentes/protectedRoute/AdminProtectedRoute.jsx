import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a small delay to ensure authentication state is loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show nothing while checking authentication
  if (isChecking) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the children
  return children;
};

export default AdminProtectedRoute;