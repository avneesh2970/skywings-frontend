/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import Navbar from "./blogs/Navbar";
import Sidebar from "./blogs/Sidebar";
import { AppContext } from "../../context/AppContext";

function AdminDashboard() {
  const { fetchPosts, user, logout } = useContext(AppContext);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar user={user} logout={logout} />
      {/* Main content with Sidebar + Page content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main content */}
        <div className="flex-1 p-4 md:ml-0">
          <main className="pt-4 pb-12">
            <Outlet />
          </main>

          <footer>
            <div className="flex flex-col items-center justify-center text-center  py-4 ">
              <hr className="w-[85%] border-gray-300" />
              <p className="text-gray-600 text-base mt-2">
                © Copyright 2025 | All Rights Reserved | Powered by{" "}
                <span
                  onClick={() =>
                    window.open("https://novanectar.co.in/", "_blank")
                  }
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Novanectar Services Pvt. Ltd.
                </span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
