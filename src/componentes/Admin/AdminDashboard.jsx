/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import Navbar from "./blogs/Navbar";
import Sidebar from "./blogs/Sidebar";
import { AppContext } from "../../context/AppContext";

function AdminDashboard() {
  const { fetchPosts } = useContext(AppContext);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Check for mobile view on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main content with Sidebar + Page content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-4 md:ml-0">
          <main className="pt-4 pb-12">
            <Outlet />
          </main>

          <footer className="bg-white py-6 border-t border-gray-200 mt-8">
            <div className="container mx-auto px-4 text-center text-gray-500">
              &copy; {new Date().getFullYear()} SKYWINGS Blog - Built with
              React, Express, MongoDB & Node.js
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;