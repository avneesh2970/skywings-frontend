/* eslint-disable no-unused-vars */
import Cont5 from "./componentes/Home/cont5";
import { Mail } from "lucide-react";
import img from "./assets/gmail.jpg";
import { Phone } from "lucide-react";
import { HiPhone, HiMail } from "react-icons/hi";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

function Contact() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({
    name: "",
    contact: "",
    email: "",
    state: "",
    city: "",
    enquire: "",
    enquireDetail: "",
  });

  // Track if form was submitted to show all errors
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [contactData, setContactData] = useState({
    name: "",
    contact: "",
    email: "",
    state: "",
    city: "",
    enquire: "",
    enquireDetail: "",
  });

  const countryCityMap = {
    usa: [
      "New York",
      "Los Angeles",
      "Chicago",
      "San Francisco",
      "Miami",
      "Other",
    ],
    canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Other"],
    uk: [
      "London",
      "Manchester",
      "Birmingham",
      "Liverpool",
      "Edinburgh",
      "Other",
    ],
    australia: [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide",
      "Other",
    ],
    germany: ["Berlin", "Hamburg", "Munich", "Frankfurt", "Cologne", "Other"],
    france: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Other"],

    india: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Other",
    ],

    japan: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Fukuoka", "Other"],
    china: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Chengdu", "Other"],
    brazil: [
      "São Paulo",
      "Rio de Janeiro",
      "Brasilia",
      "Salvador",
      "Fortaleza",
      "Other",
    ],
    "south-africa": [
      "Cape Town",
      "Johannesburg",
      "Durban",
      "Pretoria",
      "Port Elizabeth",
      "Other",
    ],
    russia: [
      "Moscow",
      "Saint Petersburg",
      "Novosibirsk",
      "Yekaterinburg",
      "Kazan",
      "Other",
    ],
    mexico: [
      "Mexico City",
      "Guadalajara",
      "Monterrey",
      "Cancún",
      "Puebla",
      "Other",
    ],
    italy: ["Rome", "Milan", "Naples", "Florence", "Venice", "Other"],
    spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Other"],
  };

  // Validate a single field
  const validateField = (name, value) => {
    let errorMessage = "";
    if (!value || value.trim() === "") {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    } else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      errorMessage = "Please enter a valid email address";
    } else if (
      name === "contact" &&
      !/^\d{10,15}$/.test(value.replace(/[^0-9]/g, ""))
    ) {
      errorMessage = "Please enter a valid contact number (10-15 digits)";
    }

    return errorMessage;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(contactData).forEach((key) => {
      const error = validateField(key, contactData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };
  function onChangeHandler(e) {
    const { id, value } = e.target;
    setContactData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user types if form was already submitted once
    if (formSubmitted) {
      setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    setFormSubmitted(true);
    // Validate all fields before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const serviceId = import.meta.env.VITE_SERVICE_ID;
      const templateId = import.meta.env.VITE_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_PUBLIC_KEY;

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/enquiries`,
        contactData
      );
      toast.success("Enquiry saved successfully!");

      emailjs
        .send(serviceId, templateId, contactData, {
          publicKey,
        })
        .then(
          () => {
            console.log("SUCCESS!");
            toast.success("Your message has been sent successfully!");
            // Reset form after success
            setContactData({
              name: "",
              contact: "",
              email: "",
              state: "",
              city: "",
              enquire: "",
              enquireDetail: "",
            });
            setFormSubmitted(false);
          },
          (error) => {
            console.log("FAILED...", error.text);
            toast.error("Failed to send message. Please try again later.");
          }
        )
        .finally(() => {
          setLoading(false); // Make sure loading is set to false after the promise resolves
        });
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false); // Set loading to false in case of error
    }
  }
  return (
    <>
      {/* Header Section */}
      <div className="bg-purple-50 py-12 text-center px-4 ">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          CONTACT
        </span>
        <h1 className="text-4xl text-[#42307D] font-bold my-3">
          Want to get in touch?
        </h1>
        <p className="text-purple-500 mt-4 text-lg">
          We are always open to meeting new and interesting folks who want to
          join us on this journey.
        </p>
      </div>

      {/* Form Section */}

      <div className="grid bg-gray-50 grid-cols-1 lg:grid-cols-2 gap-10 px-6 md:px-12 lg:px-20 py-10">
  {/* Contact Details Section with Animation */}
  <motion.div
    className="flex"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div className="flex flex-col mt-20">
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.h3
          className="text-3xl text-zinc-800 font-bold mb-2"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          Contact Details
        </motion.h3>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <motion.h3
            className="text-xl font-semibold text-gray-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Email
          </motion.h3>
          <div className="flex flex-col space-y-3">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                <HiMail className="w-5 h-5 text-blue-500" alt="" />
              </motion.div>
              <li className="list-none">
                <span className="font-bold">c</span>areer@assuredjob.com
              </li>
            </motion.div>

            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                <HiMail className="w-5 h-5 text-blue-500" alt="" />
              </motion.div>
              <li className="list-none">
                <span className="font-bold">h</span>r@assurejob.com
              </li>
            </motion.div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
          <motion.h3
            className="text-xl font-semibold text-gray-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Phone Number
          </motion.h3>
          <div className="flex flex-col space-y-3">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                <Phone className="w-5 h-5 text-blue-500" />
              </motion.div>
              <li className="list-none">+91 8368002731</li>
            </motion.div>
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                <Phone className="w-5 h-5 text-blue-500" />
              </motion.div>
              <li className="list-none">+91-8860159136</li>
            </motion.div>

            <div className="flex flex-col font-semibold text-lg"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
        {/* Form Section */}
        <div
          className="p-6 rounded-2xl bg-white  w-full"
          style={{ boxShadow: "10px -10px  blue" }}
        >
          <motion.form
            className="grid grid-cols-1 gap-4"
            onSubmit={submitHandler}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Your Name"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
                onChange={onChangeHandler}
                value={contactData.name}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Contact Field */}
            <div>
              <label
                htmlFor="contact"
                className="block text-gray-700 font-medium"
              >
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contact"
                placeholder="Enter Your Contact Number"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.contact ? "border-red-500" : ""
                }`}
                onChange={onChangeHandler}
                value={contactData.contact}
                required
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                className={`w-full px-4 py-2 text-black mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                onChange={onChangeHandler}
                value={contactData.email}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {/* State Field */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-gray-800 font-medium"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.state ? "border-red-500" : "border-black"
                  }`}
                  onChange={onChangeHandler}
                  value={contactData.state}
                  required
                >
                  <option value="" disabled className="text-gray-400">
                    Select a state
                  </option>
                  {countryCityMap["india"].map((city) => (
                    <option key={city} value={city} className="text-gray-800">
                      {city}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            {/* City field */}
            <div>
              <label htmlFor="city" className="block text-gray-800 font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                placeholder="Enter Your City"
                className={`w-full px-4 py-2 text-gray-800 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.city ? "border-red-500" : ""
                }`}
                onChange={onChangeHandler}
                value={contactData.city}
                required
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            {/* Enquire Field */}
            <div>
              <label
                htmlFor="enquire"
                className="block text-gray-700 font-medium"
              >
                Enquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                id="enquire"
                className={`w-full text-gray-800 px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.enquire ? "border-red-500" : ""
                }`}
                onChange={onChangeHandler}
                value={contactData.enquire}
                required
              >
                <option value="" disabled>
                  Select Enquiry Type
                </option>
                <option value="permanent-staffing">Permanent Staffing</option>
                <option value="temporary-staffing">Temporary Staffing</option>
                <option value="contract-staffing">Contract Staffing</option>
                <option value="executive-search">Executive Search</option>
                <option value="recruitment-process-outsourcing-rpo">
                  Recruitment Process Outsourcing (RPO)
                </option>
                <option value="skill-gap-assessment">
                  Skill Gap Assessment
                </option>
                <option value="internship-program-management">
                  Internship Program Management
                </option>
                <option value="diversity-inclusion-hiring-initiatives">
                  Diversity & Inclusion Hiring Initiatives
                </option>
                <option value="onboarding-and-training-support">
                  Onboarding and Training Support
                </option>
                <option value="pre-placement-offer-ppo-recruitment">
                  Pre-Placement Offer (PPO) Recruitment
                </option>
                <option value="remote-talent-pooling">
                  Remote Talent Pooling
                </option>
                <option value="payroll-management">Payroll Management</option>
                <option value="labour-compliance-management">
                  Labour Compliance Management
                </option>
                <option value="freelance-recruiter-partnership">
                  Freelance Recruiter Partnership
                </option>
                <option value="outplacement-services">
                  Outplacement Services
                </option>
                <option value="hr-consulting-and-strategy">
                  HR Consulting and Strategy
                </option>
                <option value="talent-mapping-and-market-intelligence">
                  Talent Mapping and Market Intelligence
                </option>
                <option value="graduate-trainee-programs">
                  Graduate Trainee Programs
                </option>
              </select>
              {errors.enquire && (
                <p className="mt-1 text-sm text-red-500">{errors.enquire}</p>
              )}
            </div>

            {/* Enquire Detail Field */}
            <div>
              <label
                htmlFor="enquireDetail"
                className="block text-gray-700 font-medium"
              >
                Enquiry Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="enquireDetail"
                placeholder="Your requirement"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.enquireDetail ? "border-red-500" : ""
                }`}
                onChange={onChangeHandler}
                value={contactData.enquireDetail}
                rows="4"
                required
              ></textarea>
              {errors.enquireDetail && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.enquireDetail}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
      <div className="flex w-full ">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.5282803438927!2d78.0209715745825!3d30.335932804703045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929ec1f76b89d%3A0xf5c5f81fa6e9af6c!2sSkywings%20Advisors%20Private%20Limited!5e0!3m2!1sen!2sin!4v1741413952815!5m2!1sen!2sin"
          width=""
          height=""
          className="w-full mx-10 h-96"
          allowFullscreen=""
          loading="fast"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <Cont5></Cont5>
    </>
  );
}

export default Contact;
