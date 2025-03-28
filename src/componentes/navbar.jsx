import React from "react";
import Nav from "./Nav";
import logo from "../assets/products/image 1.png";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky z-30 top-0   py-2 w-full px-5 md:px-10 lg:px-14 flex items-center justify-between shadow-md lg:backdrop-blur-3xl bg-white ">
      {/* Logo */}
      <div className="flex-shrink-0">
        <NavLink to="/">
          <img className="h-12 lg:h-15 w-auto" src={logo} alt="Logo" />
        </NavLink>
      </div>

      <button
        className="lg:hidden text-gray-700 hover:text-black"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`${
          isMobileMenuOpen
            ? "fixed inset-0 w-full h-screen overflow-y-scroll lg:overflow-y-visible lg:bg-transparent z-50 flex flex-col items-start p-6"
            : "hidden"
        } lg:block lg:w-auto lg:static top-[6vh] w-full lg:h-auto lg:top-0 lg:mr-8 bg-white lg:bg-transparent shadow-md lg:shadow-none overflow-y-scroll lg:overflow-y-visible`}
      >
        <div className="w-full h-auto p-2 border-red-800">
          <Nav toggle={isMobileMenuOpen} fun={setIsMobileMenuOpen}/>
        </div>
      </div>
    </header>
  );
};

export default Navbar;













