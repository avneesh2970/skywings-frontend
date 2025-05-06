"use client"

import { useRef } from "react"
import emailjs from "@emailjs/browser"

import logo from "../assets/products/image 1.png"
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa"
import { HiPhone, HiMail } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { FaXTwitter } from "react-icons/fa6"
import { FaLinkedinIn } from "react-icons/fa"
import { toast } from "react-toastify"

const Footer = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  const form = useRef("")
  const sendEmail = (e) => {
    e.preventDefault()
    console.log("Submit triggered")
    const formData = new FormData(form.current)
    const userEmailValue = formData.get("user_email")
    console.log("user_email value:", userEmailValue)
    emailjs
      .sendForm("service_4sw2nkm", "template_6sjxdz6", form.current, {
        publicKey: "qiG11gfWE86es3ObM",
      })
      .then(
        () => {
          console.log("SUCCESS!")
          toast.success("Thank You for Subscription !!")
        },
        (error) => {
          console.log("FAILED...", error.text)
        },
      )
  }

  return (
    <footer className="bg-white w-full">
      {/* Desktop and Tablet Footer */}
      <div className="hidden sm:block">
        <div className="footer grid grid-cols-2 md:grid-cols-4 gap-5 p-6">
          {/* First Section (Logo & Social Icons) */}
          <div className="first">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="mb-6 max-h-16" />
            <p className="text-gray-600 mb-6 w-40 lg:w-full"></p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/skywings-advisors-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="w-6 h-6 text-blue-600 hover:text-blue-700" />
              </a>
              <a
                href="https://www.facebook.com/www.assuredjob.in?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-6 h-6 text-blue-600 hover:text-blue-700" />
              </a>
              <a href="https://www.instagram.com/assuredjob/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 text-red-600 hover:text-pink-500" />
              </a>
              <a href="https://x.com/assuredjob "  target="_blank" rel="noopener noreferrer">
                <FaXTwitter className="w-6 h-6 text-black hover:text-gray-700" />
              </a>
              <a href="https://www.youtube.com/@TheAssuredJobChannel"  target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-6 h-6 text-red-500 hover:text-red-600" />
              </a>
            </div>
          </div>

          {/* Second Section (Company Links) */}
          <div className="second">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">COMPANY</p>
              <li
                onClick={() => {
                  navigate("/"), window.scrollTo(0, 0)
                }}
                className="mb-1 cursor-pointer group inline-block"
              >
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative">
                  Home
                  <span className="block h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </span>
              </li>

              <li
                onClick={() => {
                  navigate("/about"), window.scrollTo(0, 0)
                }}
                className="mb-1 cursor-pointer group"
              >
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative inline-block">
                  About
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </li>

              <li
                onClick={() => {
                  navigate("/services"), window.scrollTo(0, 0)
                }}
                className="mb-1 cursor-pointer group"
              >
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative inline-block">
                  Services
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </li>
            </ul>
          </div>

          {/* Third Section (Legal) */}
          <div className="third">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">LEGAL</p>

              <li
                onClick={() => {
                  navigate("/policy"), window.scrollTo(0, 0)
                }}
                className="mb-1 cursor-pointer group"
              >
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative inline-block">
                  Privacy Policy
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </li>

              <li
                onClick={() => {
                  navigate("/disclaimer"), window.scrollTo(0, 0)
                }}
                className="mb-1 cursor-pointer group"
              >
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative inline-block">
                  Disclaimer
                  <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </li>
            </ul>
          </div>

          {/* Fourth Section (Contact) */}
          <div className="fourth">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">CONTACT</p>

              <li className="text-gray-600 mb-1 flex items-center">
                <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                <a href="tel:+918860159136" className="hover:text-blue-500">
                  +91-8860159136
                </a>
              </li>
              <li className="text-gray-600 mb-1 flex items-center">
                <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                <a href="tel:+918368002731" className="hover:text-blue-500">
                  +91 8368002731
                </a>
              </li>

              <div className="flex">
                <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center" />
                <p>
                  <span className="font-semibold">h</span>r@assuredjob.com
                </p>
              </div>
              <div className="flex">
                <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center" />
                <p>
                  <span className="font-semibold">c</span>areer@assuredjob.com
                </p>
              </div>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="sm:hidden py-10">
        <div className="flex flex-col items-center">
          {/* Logo and Tagline */}
          <img src={logo || "/placeholder.svg"} alt="SkyWings Logo" className="h-16 mb-4" />
          <p className="text-gray-600 mb-6 w-75"></p>

          {/* Social Media Icons */}
          <div className="flex gap-4 mb-8">
            <a
              href="https://www.linkedin.com/company/skywings-advisors-pvt-ltd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="w-8 h-8 text-blue-700" />
            </a>
            <a
              href="https://www.facebook.com/www.assuredjob.in?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="w-8 h-8 text-blue-700" />
            </a>
            <a href="https://www.instagram.com/assuredjob/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-8 h-8 text-pink-500" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="w-8 h-8 hover:text-black" />
            </a>
          </div>

          {/* Footer Links Section */}
          <div className="grid grid-cols-2 gap-8 text-left w-full px-6">
            {/* Company Section */}
            <div className="second">
              <ul>
                <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">COMPANY</p>
                <li
                  onClick={() => {
                    navigate("/"), window.scrollTo(0, 0)
                  }}
                  className="text-gray-600 mb-1 hover:text-blue-600 cursor-pointer"
                >
                  Home
                </li>
                <li
                  onClick={() => {
                    navigate("/about"), window.scrollTo(0, 0)
                  }}
                  className="text-gray-600 mb-1 hover:text-blue-600 cursor-pointer"
                >
                  About
                </li>
                <li
                  onClick={() => {
                    navigate("/services"), window.scrollTo(0, 0)
                  }}
                  className="text-gray-600 mb-1 hover:text-blue-600 cursor-pointer"
                >
                  Services
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="third">
              <ul>
                <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">LEGAL</p>
                <li
                  onClick={() => {
                    navigate("/policy"), window.scrollTo(0, 0)
                  }}
                  className="text-gray-600 mb-1 hover:text-blue-600 cursor-pointer"
                >
                  Privacy Policy
                </li>
                <li
                  onClick={() => {
                    navigate("/disclaimer"), window.scrollTo(0, 0)
                  }}
                  className="text-gray-600 mb-1 hover:text-blue-600 cursor-pointer"
                >
                  Disclaimer
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section - Full Width on Mobile */}
          <div className="fourth w-full px-6 mt-8">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">CONTACT</p>
              <li className="text-gray-600 mb-1 flex items-center">
                <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                <a href="tel:+918860159136" className="hover:text-blue-500">
                  +91 8860 1591 36
                </a>
              </li>
              <li className="text-gray-600 mb-1 flex items-center">
                <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                <a href="tel:+918368002731" className="hover:text-blue-500">
                  +91 8368002731
                </a>
              </li>
              <div className="flex">
                <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center" />
                <p>
                  <span className="font-bold">h</span>r@assuredjob.com
                </p>
              </div>
              <div className="flex">
                <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center" />
                <p>
                  <span className="font-bold">c</span>areers@assuredjob.com
                </p>
              </div>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section - Shared between both layouts */}
      <div className="flex flex-col items-center justify-center text-center py-4">
        <hr className="w-[85%] border-gray-300" />
        <p className="text-gray-600 text-base mt-2 px-4">
          © Copyright 2025 | All Rights Reserved | Powered by{" "}
          <span
            onClick={() => window.open("https://novanectar.co.in/", "_blank")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Novanectar Services Pvt. Ltd.
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
