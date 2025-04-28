"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Home, Menu, X } from "lucide-react"
import logo from "../../../assets/products/image 1.png"

const Navbar = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Handle search functionality
  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen)
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? "shadow-md py-2" : "py-4"}`}
    >
      <div className="container mx-auto px-4">
        {/* Main header row with 3 columns */}
        <div className="grid grid-cols-3 items-center">
          {/* Left column - Menu button on mobile, Home link on desktop */}
          <div className="flex justify-start">
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 focus:outline-none p-1 rounded-md hover:bg-gray-100"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="hidden md:flex">
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-colors ${
                  location.pathname === "/admin/dashboard"
                    ? "text-emerald-600 font-medium bg-emerald-50"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
            </div>
          </div>

          {/* Center column - Logo centered on all screen sizes */}
          <div className="flex justify-center">
            <Link
              to="/admin/dashboard"
              className="flex items-center text-2xl font-bold text-gray-800"
              aria-label="Dashboard Home"
            >
              <img src={logo || "/placeholder.svg"} className="w-28" alt="Skywings Logo" />
            </Link>
          </div>

          {/* Right column - Search button/bar */}
          <div className="flex justify-end">
            {/* Desktop Search */}
            <div className="hidden md:block">
              {searchOpen ? (
                <div className="relative flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 w-64">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-2 px-4 bg-transparent focus:outline-none text-sm"
                    autoFocus
                  />
                  <button
                    onClick={handleSearchToggle}
                    className="absolute right-2 text-gray-500 hover:text-emerald-600"
                    aria-label="Close search"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchToggle}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                  <span>Search</span>
                </button>
              )}
            </div>

            {/* Mobile Search Button */}
            <div className="md:hidden">
              <button
                onClick={handleSearchToggle}
                className="text-gray-600 focus:outline-none p-1 rounded-md hover:bg-gray-100"
                aria-label="Search"
              >
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Inline, not fullscreen */}
        {searchOpen && (
          <div className="md:hidden mt-4 mb-2 transition-all duration-300 ease-in-out">
            <div className="relative flex items-center bg-gray-100 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 px-4 bg-transparent focus:outline-none text-sm"
                autoFocus
              />
              <button
                onClick={handleSearchToggle}
                className="absolute right-2 text-gray-500 hover:text-emerald-600 p-1"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu with animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pt-4 pb-2">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  to="/admin/dashboard"
                  className={`block py-2.5 px-4 rounded-md transition-colors ${
                    location.pathname === "/admin/dashboard"
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Home size={18} />
                    <span>Home</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
