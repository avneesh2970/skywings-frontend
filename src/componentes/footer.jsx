import logo from "../assets/products/image 1.png";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { HiPhone, HiMail } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail("");
    // You could add toast notification or other feedback here
  };
  return (
    <>
      <div className=" w-full hidden md:block">
        {/* Footer Grid Section */}
        <div className=" footer grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 p-6 gap-5 ">
          {/* First Section (Logo & Social Icons) */}
          <div className="first ">
            <img src={logo} alt="Logo" className="mb-6 " />
            <p className="text-gray-600 mb-6 w-40 lg:w-full"></p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/skywings-advisors-pvt-ltd/"
                target="_blank"
              >
                <FaLinkedinIn className=" border-blue-500 ml-2.5 w-6 h-6 p-0.5 text-blue-600 hover:text-blue-700" />
              </a>

              <a
                href="https://www.facebook.com/www.assuredjob.in?mibextid=ZbWKwL"
                target="_blank"
              >
                <FaFacebook className="border-blue-500 w-6 h-6   text-blue-600 hover:text-blue-700" />
              </a>
              <a href="https://www.instagram.com/assuredjob/" target="_blank">
                <FaInstagram className="border-red-400 w-6 h-6  text-red-600 hover:text-pink-500" />
              </a>
              <a href="" target="_blank">
                <FaXTwitter className=" border-black w-6 h-6  text-black hover:text-black" />
              </a>
            </div>
          </div>

          {/* Second Section (Company Links) */}

          <div className="second  mx-5 mt-14 lg:m-0">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">
                COMPANY
              </p>
              <li
                onClick={() => {
                  navigate("/"), window.scrollTo(0, 0);
                }}
                className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
              >
                Home
              </li>
              <li
                onClick={() => {
                  navigate("/about"), window.scrollTo(0, 0);
                }}
                className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
              >
                About
              </li>
              <li
                onClick={() => {
                  navigate("/services"), window.scrollTo(0, 0);
                }}
                className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
              >
                Services
              </li>
              {/* <li className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer">
                Industries
              </li> */}
            </ul>
          </div>

          {/* Third Section (Legal) */}

          <div className="third">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">
                LEGAL
              </p>

              <li
                onClick={() => {
                  navigate("/policy"), window.scrollTo(0, 0);
                }}
                className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
              >
                Privacy Policy
              </li>

              <li
                onClick={() => {
                  navigate("/disclaimer"), window.scrollTo(0, 0);
                }}
                className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
              >
                disclaimer
              </li>
            </ul>
          </div>

          {/* Fourth Section (Contact) */}
          <div className="fourth">
            <ul>
              <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">
                CONTACT
              </p>

              <li className="text-gray-600 mb-1 flex items-center">
                <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                <a href="tel:+918860159136" className="hover:text-blue-500">
                  +91-8860159136
                </a>
              </li>
              <li className="text-gray-600 mb-1 flex items-center">
                <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                <a href="tel:+918860159136" className="hover:text-blue-500">
                  +91 8368002731
                </a>
              </li>


             <div className="flex ">
             <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center"/><p><span className="font-bold">h</span>r@assuredjob.com</p>
             </div>
             <div className="flex ">
             <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center"/><p><span className="font-bold">c</span>areers@assuredjob.com</p>
             </div>
              

              {/* {["hr", "careers", "hiring ", "Business "].map((email, index) => (
                <li
                  key={index}
                  className="text-gray-600 mb-1 flex items-center"
                >
                  <HiMail className="mr-2 w-4 h-4 text-gray-600 hover:text-blue-500" />
                  <a
                    href={`mailto:${email}@assuredjob.com`}
                    className="hover:text-blue-500"
                  >
                    {email}@assuredjob.com
                  </a>
                </li>
              ))} */}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <hr className="w-[85%] border-gray-300 mx-auto" />
        <div className=" w-[85%] mx-auto pt-6 sm:pt-8 pb-6 mb-4">
          <div className="max-w-md mx-auto text-center px-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Newsletter</h3>
            <p className="text-sm sm:text-base text-slate-500 mb-4">
              Subscribe to our newsletter to receive updates, news, and
              exclusive offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row"
            >
              <div className="flex-1 relative">
                <Mail
                  className="absolute top-1/2 transform -translate-y-1/2 ml-2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 border-2 border-gray-300 text-gray-800 placeholder:text-slate-400 w-full h-10 sm:h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 h-10 sm:h-11 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="flex flex-col items-center justify-center text-center  py-4 ">
          <hr className="w-[85%] border-gray-300" />
          <p className="text-gray-600 text-base mt-2">
            © Copyright 2025 | All Rights Reserved | Powered by{" "}
            <span
              onClick={() => window.open("https://novanectar.co.in/", "_blank")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Novanectar Services Pvt. Ltd.
            </span>
          </p>
        </div>
      </div>

      {/**------------------------------------------------------------------------ */}

      {/** for mobile*/}

      <footer className="bg-white text-center py-10  lg:hidden  ">
        <div className="flex flex-col items-center ">
          {/* Logo and Tagline */}
          <img src={logo} alt="SkyWings Logo" className="h-16 mb-4" />
          <p className="text-gray-600 mb-6 w-75"></p>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/skywings-advisors-pvt-ltd/"
              target="_blank"
            >
              <FaLinkedinIn className=" w-8 h-8    text-blue-700" />
            </a>

            <a
              href="https://www.facebook.com/www.assuredjob.in?mibextid=ZbWKwL"
              target="_blank"
            >
              <FaFacebook className=" w-8 h-8 text-blue-700" />
            </a>
            <a href="https://www.instagram.com/assuredjob/" target="_blank">
              <FaInstagram className="w-8 h-8 text-pink-500" />
            </a>
            <a href="" target="_blank">
              <FaXTwitter className=" w-8 h-8  hover:text-black" />
            </a>
          </div>

          {/* Footer Links Section */}
          <div className="grid grid-cols-2 gap-10 text-left md:grid-cols-3">
            {/* Company Section */}
            <div className="second  mx-5 mt-14 lg:m-0">
              <ul>
                <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">
                  COMPANY
                </p>
                <li className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer">
                  Home
                </li>
                <li className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer">
                  About
                </li>
                <li className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer">
                  Services
                </li>
                <li className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer">
                  Industries
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="third mt-13">
              <ul>
                <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">
                  LEGAL
                </p>
                <li
                  onClick={() => {
                    navigate("/policy"), window.scrollTo(0, 0);
                  }}
                  className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
                >
                  Privacy Policy
                </li>
                <li
                  onClick={() => {
                    navigate("/disclaimer"), window.scrollTo(0, 0);
                  }}
                  className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
                >
                  Disclaimer
                  </li>
                {/* </li><li
                  onClick={() => {
                    navigate("/disclaimer"), window.scrollTo(0, 0);
                  }}
                  className="text-gray-600 mb-1 hover:text-gray-800 cursor-pointer"
                >
                  Disclaimer
                </li> */}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="fourth mx-5 w-full ">
              <ul>
                <p className="font-bold text-blue-500 hover:text-blue-700 mb-2">
                  CONTACT
                </p>
                <li className="text-gray-600 mb-1 flex items-center">
                  <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />{" "}
                  91 8860 1591 36
                </li>

                <li className="text-gray-600 mb-1 flex items-center">
                  <HiPhone className="mr-2 text-gray-600 hover:text-blue-500" />
                  <a href="tel:+918860159136" className="hover:text-blue-500">
                    +91 8368002731
                  </a>
                </li>
                <div className="flex ">
             <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center"/><p><span className="font-bold">h</span>r@assuredjob.com</p>
             </div>
             <div className="flex ">
             <HiMail className="mr-2 my-auto w-4 h-5 pt-1 text-gray-600 hover:text-blue-500 flex items-center"/><p><span className="font-bold">c</span>areers@assuredjob.com</p>
             </div>
                {/* {["hr", "careers", "hiring", "business"].map((email, index) => (
                  <li
                    key={index}
                    className="text-gray-600 mb-1 flex items-center w-full"
                  >
                    <HiMail className="mr-2 w-1/12 h-4 text-gray-600 hover:text-blue-500" />
                    <a
                      href={`mailto:${email}@assuredjob.com`}
                      className="hover:text-blue-500 w-9/12"
                    >
                      {email}@assuredjob.com
                    </a>
                  </li>
                ))} */}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-700 pt-6 sm:pt-8 pb-6 mb-4">
          <div className="max-w-md mx-auto text-center px-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Newsletter</h3>
            <p className="text-sm sm:text-base text-slate-500 mb-4">
              Subscribe to our newsletter to receive updates, news, and
              exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex  ">
              <div className="flex-1 relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-white border border-gray-300 text-gray-800 placeholder:text-slate-400 w-full h-10 sm:h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium px-2 md:px-4 py-2 h-10 sm:h-11 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center  py-4 ">
          <hr className="w-[85%] border-gray-300" />
          <p className="text-gray-600 text-base mt-2">
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
    </>
  );
};

export default Footer;
