"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Home, X } from "lucide-react"
import logo from "../../../assets/products/image 1.png"

const Navbar = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Handle scroll effect
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 10)
  //   }

  //   window.addEventListener("scroll", handleScroll)
  //   return () => window.removeEventListener("scroll", handleScroll)
  // }, [])

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
          {/* Left column - Home link */}
          <div className="flex justify-start">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-colors ${
                location.pathname === "/admin/dashboard"
                  ? "text-blue-600 font-medium bg-emerald-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
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

        {/* Mobile Search Bar - Fixed height to prevent layout shifts */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            searchOpen ? "h-14 opacity-100 mt-4 mb-2" : "h-0 opacity-0 m-0"
          }`}
        >
          <div className="relative flex items-center bg-gray-100 rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 bg-transparent focus:outline-none text-sm"
              autoFocus={searchOpen}
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
      </div>
    </header>
  )
}

export default Navbar
