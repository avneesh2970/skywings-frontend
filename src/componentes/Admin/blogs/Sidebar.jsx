"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, FileText, Calendar, Mail, Users, Settings, Menu, X, Upload, Bell, Newspaper } from "lucide-react"

function Sidebar({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef(null)
  const location = useLocation()
  const [newsExpanded, setNewsExpanded] = useState(false)
  const [settingsExpanded, setSettingsExpanded] = useState(false)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [location.pathname])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Fixed isActive function to only highlight the exact path or its direct children
  const isActive = (path) => {
    // For the dashboard home route, only be active if it's exactly /admin/dashboard
    if (path === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard"
    }

    // For other routes, check if the current path starts with this path
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { path: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    {
      path: "/admin/dashboard/news",
      icon: <Newspaper size={20} />,
      label: "News",
      hasSubmenu: true,
      submenu: [
        { path: "/admin/dashboard/news", label: "All News" },
        { path: "/admin/dashboard/news/create", label: "Add News" },
      ],
    },
    { path: "/admin/dashboard/blogs", icon: <FileText size={20} />, label: "Blog" },
    { path: "/admin/dashboard/events", icon: <Calendar size={20} />, label: "Events" },
    { path: "/admin/dashboard/contact-us", icon: <Mail size={20} />, label: "Contact Us" },
    { path: "/admin/dashboard/resumes", icon: <Upload size={20} />, label: "Resumes" },
    { path: "/admin/dashboard/newsletter", icon: <Bell size={20} />, label: "Newsletter" },
    {
      path: "/admin/dashboard/settings",
      icon: <Settings size={20} />,
      label: "Settings",
      hasSubmenu: true,
      submenu: [
        { path: "/admin/dashboard/settings", label: "Profile" },
        { path: "/admin/dashboard/settings/security", label: "Security" },
      ],
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:sticky top-0 left-0 h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out z-50 
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0"}`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.path}>
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => {
                        if (item.label === "News") {
                          setNewsExpanded(!newsExpanded)
                        } else if (item.label === "Settings") {
                          setSettingsExpanded(!settingsExpanded)
                        }
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-md transition-colors ${
                        isActive(item.path)
                          ? "bg-purple-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive(item.path) ? "text-blue-600" : "text-gray-500"}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {isActive(item.path) && <span className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></span>}
                    </button>

                    {/* Submenu */}
                    {(item.label === "News" && newsExpanded) || (item.label === "Settings" && settingsExpanded) ? (
                      <div className="pl-10 space-y-1 mt-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                              location.pathname === subItem.path
                                ? "bg-purple-50 text-blue-700 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                          >
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path) ? "bg-purple-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  >
                    <span className={isActive(item.path) ? "text-blue-600" : "text-gray-500"}>{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive(item.path) && <span className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></span>}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User profile section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Users size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.email?.split("@")[0] || "Admin"}</p>
              <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile to account for the fixed sidebar button */}
      <div className="h-16 md:hidden" />
    </>
  )
}

export default Sidebar
