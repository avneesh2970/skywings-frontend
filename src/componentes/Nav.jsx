"use client"

import { useState, useRef } from "react"
import { NavLink } from "react-router-dom"
import { ChevronDown, ChevronUp } from "lucide-react"

const Nav = ({ toggle, fun }) => {
  const baseStyles = "lg:px-3 py-2 rounded-md text-sm font-medium"

  const [openDropdown, setOpenDropdown] = useState(null)
  const closeTimeout = useRef(null)

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const closeMenuOnMobile = () => {
    if (toggle) {
      fun(false)
    }
  }

  const handleMouseEnter = (menu) => {
    if (window.innerWidth >= 1024) {
      clearTimeout(closeTimeout.current)
      setOpenDropdown(menu)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      closeTimeout.current = setTimeout(() => {
        setOpenDropdown(null)
      }, 150) // slight delay for allowing click
    }
  }

  const menuItems = [
    {
      label: "Services",
      items: [
        { name: "Permanent Staffing", path: "/DetailService/1" },
        { name: "Temporary Staffing", path: "/DetailService/2" },
        { name: "Contract Staffing", path: "/DetailService/3" },
        { name: "Executive Search", path: "/DetailService/4" },
        {
          name: "Recruitment Process Outsourcing (RPO)",
          path: "/DetailService/5",
        },
        { name: "Skill Gap Assessment", path: "/DetailService/6" },
        { name: "Internship Program Management", path: "/DetailService/7" },
        {
          name: "Diversity & Inclusion Hiring Initiatives",
          path: "/DetailService/8",
        },
        { name: "Onboarding and Training Support", path: "/DetailService/9" },
        {
          name: "Pre-Placement Offer (PPO) Recruitment",
          path: "/DetailService/10",
        },
        { name: "Remote Talent Pooling", path: "/DetailService/11" },
        { name: "Payroll Management", path: "/DetailService/12" },
        { name: "Labour Compliance Management", path: "/DetailService/13" },
        { name: "Freelance Recruiter Partnership", path: "/DetailService/14" },
        { name: "Outplacement Services", path: "/DetailService/15" },
        { name: "HR Consulting and Strategy", path: "/DetailService/16" },
        {
          name: "Talent Mapping and Market Intelligence",
          path: "/DetailService/17",
        },
        { name: "Graduate Trainee Programs", path: "/DetailService/18" },
      ],
    },
    {
      label: "Company",
      items: [
        { name: "About", path: "/about" },
        { name: "Career", path: "/carrers" },
        { name: "Contact us", path: "/contact" },
        { name: "Send Your Resume", path: "/upload" },
      ],
    },
    {
      label: "Resources",
      items: [
        { name: "Blogs", path: "/blog" },
        { name: "Events", path: "/events" },
        { name: "News", path: "/news" },
      ],
    },
    {
      label: "Innovations",
      items: [
        {
          name: "Pool-Campus.com",
          path: "https://pool-campus.com/",
          external: true,
        },
        {
          name: "Freelancerecruiter.in",
          path: "https://www.freelanceRecruiter.in/",
          external: true,
        },
      ],
    },
  ]

  return (
    <nav className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-4 h-auto w-full relative gap-2">
      <NavLink
        to="/job"
        className="text-sm font-medium group relative cursor-pointer text-gray-800 hover:text-blue-500 transition"
        onClick={closeMenuOnMobile}
      >
        Job
        <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
      </NavLink>

      {menuItems.map((menu, index) => (
        <div
          key={index}
          className="relative group w-full lg:w-auto"
          onMouseEnter={() => handleMouseEnter(menu.label)}
          onMouseLeave={handleMouseLeave}
        >
          <span
            onClick={() => toggleDropdown(menu.label)}
            className={`group relative ${baseStyles} cursor-pointer flex items-center gap-1 text-gray-800 hover:text-blue-500 transition`}
            aria-expanded={openDropdown === menu.label}
          >
            {menu.label}
            {openDropdown === menu.label ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </span>

          {openDropdown === menu.label && (
            <div
              className={`
                z-50 dropdown-menu
                ${window.innerWidth < 1024 ? "static w-full" : "absolute left-1/2 transform -translate-x-1/2 top-full"}
              `}
              onClick={() => setOpenDropdown(null)}
            >
              <div
                className={
                  menu.label === "Services"
                    ? `bg-white p-4 rounded-md shadow-2xl transition-all duration-300 overflow-y-auto
                       ${window.innerWidth < 1024 ? "w-full max-h-[60vh]" : "w-[600px] h-[450px]"} 
                       grid ${
                         window.innerWidth < 640
                           ? "grid-cols-1"
                           : window.innerWidth < 1024
                             ? "grid-cols-2"
                             : "grid-cols-3"
                       } gap-2`
                    : `bg-white shadow-lg transition-all duration-200 ease-in-out z-10 rounded-md
                       ${window.innerWidth < 1024 ? "w-full" : "w-56 mt-2"}`
                }
              >
                {menu.items.map((item, idx) =>
                  item.external ? (
                    <a
                      key={idx}
                      href={item.path}
                      className="block text-gray-800 text-sm py-2 border-b border-gray-300 hover:text-blue-600 transition-colors duration-200 ml-4"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        closeMenuOnMobile()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <NavLink
                      key={idx}
                      to={item.path}
                      className={({ isActive }) =>
                        `block text-gray-800 text-sm py-2 border-b border-gray-300 hover:text-blue-600 hover:font-semibold transition-colors duration-200 ${
                          isActive ? "font-semibold" : ""
                        } ml-4`
                      }
                      onClick={() => {
                        closeMenuOnMobile()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    >
                      {item.name}
                    </NavLink>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Nav
