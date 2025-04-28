
import { Link, useLocation } from "react-router-dom";
import { Search, PenSquare, Home } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../../assets/products/image 1.png";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/admin/dashboard"
            className="text-2xl font-bold text-gray-800 flex items-center gap-2"
          >
            <img src={logo} className="w-28" alt="skywings" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-6">
              <li>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-1 ${
                    location.pathname === "/admin/dashboard"
                      ? "text-emerald-600 font-medium"
                      : "text-gray-600 hover:text-emerald-600"
                  }`}
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>
              </li>
              
              <li>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                  <button className="flex items-center gap-1 text-gray-600 px-3 py-1.5 rounded-md">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </div>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  to="/admin/dashboard"
                  className={`block py-2 px-3 rounded-md ${
                    location.pathname === "/admin/dashboard"
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Home size={18} />
                    <span>Home</span>
                  </div>
                </Link>
              </li>
              
              <li>
                <button className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md text-gray-600 hover:bg-gray-50">
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </li>
              <li>
                <Link
                  to="/admin/dashboard/blog-post/editor"
                  className="block py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <PenSquare size={18} />
                    <span>New Post</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
