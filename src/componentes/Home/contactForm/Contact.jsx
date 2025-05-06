/* eslint-disable no-unused-vars */

import { Phone } from "lucide-react";
import { HiPhone, HiMail } from "react-icons/hi";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import contact from "../../../assets/contact/contact.jpg"


export default function Contact() {
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

         <div className="grid bg-gradient-to-br from-gray-50 to-gray-100 grid-cols-1 lg:grid-cols-2 gap-10 px-6 md:px-12 lg:px-20 py-16">
           {/* Contact Details Side */}
           <motion.div
             className="flex"
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
             <div className="flex flex-col w-full">
               <motion.div
                 className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
               >
                 {/* Image with overlay */}
                 <div className="relative h-64 overflow-hidden">
                   <img
                     src={contact}
                     alt="Contact Us"
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-600/30"></div>
                 </div>
   
                 <div className="p-6">
                   <motion.h3
                     className="text-3xl text-zinc-800 font-bold mb-6 relative"
                     initial={{ x: -50 }}
                     animate={{ x: 0 }}
                     transition={{
                       delay: 0.4,
                       duration: 0.6,
                       type: "spring",
                       stiffness: 100,
                     }}
                   >
                     Contact Details
                     <span className="block h-1 w-20 bg-blue-500 mt-2"></span>
                   </motion.h3>
   
                   {/* Address Section */}
                   <motion.div
                     className="mb-8"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.5, duration: 0.8 }}
                   >
                     <motion.h3
                       className="text-xl font-semibold text-gray-700 mb-4 flex items-center"
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.6, duration: 0.5 }}
                     >
                       <div className="bg-blue-100 p-2 rounded-full mr-3">
                         <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-5 h-5 text-blue-600"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         >
                           <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                           <circle cx="12" cy="10" r="3"></circle>
                         </svg>
                       </div>
                       Office Address
                     </motion.h3>
   
                     <div className="flex flex-col space-y-3 pl-12">
                       <motion.div
                         className="text-gray-600"
                         initial={{ x: -30, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 0.7, duration: 0.5 }}
                       >
                         <p className="leading-relaxed">
                           AssuredJob Pvt. Ltd.
                           <br />
                           2nd floor, Sirmour Plaza, Kaulagarh Rd,
                           <br />
                           Anand Vihar Colony, Sector 62, Noida
                           <br />
                           Dehradun, Uttarakhand 248001
                         </p>
                       </motion.div>
                     </div>
                   </motion.div>
   
                   {/* Email Section */}
                   <motion.div
                     className="mb-8"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.8, duration: 0.8 }}
                   >
                     <motion.h3
                       className="text-xl font-semibold text-gray-700 mb-4 flex items-center"
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.9, duration: 0.5 }}
                     >
                       <div className="bg-blue-100 p-2 rounded-full mr-3">
                         <HiMail className="w-5 h-5 text-blue-600" />
                       </div>
                       Email
                     </motion.h3>
   
                     <div className="flex flex-col space-y-3 pl-12">
                       <motion.div
                         className="flex items-center space-x-3 group"
                         initial={{ x: -30, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 1.0, duration: 0.5 }}
                         whileHover={{ x: 5 }}
                         whileTap={{ x: 2 }}
                         transition={{
                           type: "spring",
                           stiffness: 400,
                           damping: 17,
                           hover: { duration: 0.2 },
                         }}
                       >
                         <a
                           href="mailto:career@assuredjob.com"
                           className="text-gray-600 group-hover:text-blue-600 transition-colors duration-150"
                         >
                           <span className="font-bold">c</span>areer@assuredjob.com
                         </a>
                       </motion.div>
   
                       <motion.div
                         className="flex items-center space-x-3 group"
                         initial={{ x: -30, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 1.1, duration: 0.5 }}
                         whileHover={{ x: 5 }}
                         whileTap={{ x: 2 }}
                         transition={{
                           type: "spring",
                           stiffness: 400,
                           damping: 17,
                           hover: { duration: 0.2 },
                         }}
                       >
                         <a
                           href="mailto:hr@assurejob.com"
                           className="text-gray-600 group-hover:text-blue-600 transition-colors duration-150"
                         >
                           <span className="font-bold">h</span>r@assurejob.com
                         </a>
                       </motion.div>
                     </div>
                   </motion.div>
   
                   {/* Phone Section */}
                   <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1.2, duration: 0.8 }}
                   >
                     <motion.h3
                       className="text-xl font-semibold text-gray-700 mb-4 flex items-center"
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 1.3, duration: 0.5 }}
                     >
                       <div className="bg-blue-100 p-2 rounded-full mr-3">
                         <Phone className="w-5 h-5 text-blue-600" />
                       </div>
                       Phone Number
                     </motion.h3>
   
                     <div className="flex flex-col space-y-3 pl-12">
                       <motion.div
                         className="flex items-center space-x-3 group"
                         initial={{ x: -30, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 1.4, duration: 0.5 }}
                         whileHover={{ x: 5 }}
                         whileTap={{ x: 2 }}
                         transition={{
                           type: "spring",
                           stiffness: 400,
                           damping: 17,
                           hover: { duration: 0.2 },
                         }}
                       >
                         <a
                           href="tel:+918368002731"
                           className="text-gray-600 group-hover:text-blue-600 transition-colors duration-150"
                         >
                           +91 8368002731
                         </a>
                       </motion.div>
   
                       <motion.div
                         className="flex items-center space-x-3 group"
                         initial={{ x: -30, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 1.5, duration: 0.5 }}
                         whileHover={{ x: 5 }}
                         whileTap={{ x: 2 }}
                         transition={{
                           type: "spring",
                           stiffness: 400,
                           damping: 17,
                           hover: { duration: 0.2 },
                         }}
                       >
                         <a
                           href="tel:+918860159136"
                           className="text-gray-600 group-hover:text-blue-600 transition-colors duration-150"
                         >
                           +91 8860159136
                         </a>
                       </motion.div>
                     </div>
                   </motion.div>
   
                   {/* Business Hours Section */}
                 </div>
               </motion.div>
             </div>
           </motion.div>
   
           {/* Form Side */}
           <div className="flex items-center">
             <div className="p-8 rounded-xl bg-white w-full shadow-lg border-t-4 border-blue-600 h-full">
               <h2 className="text-2xl font-bold text-gray-800 mb-6">
                 Send Us a Message
               </h2>
   
               <motion.form
                 className="grid grid-cols-1 gap-5"
                 onSubmit={submitHandler}
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8 }}
               >
                 <div>
                   <label
                     htmlFor="name"
                     className="block text-gray-700 font-medium mb-1"
                   >
                     Name <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     id="name"
                     placeholder="Enter Your Name"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                       errors.name ? "border-red-500" : "border-gray-300"
                     }`}
                     onChange={onChangeHandler}
                     value={contactData.name}
                     required
                   />
                   {errors.name && (
                     <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                   )}
                 </div>
   
                 <div>
                   <label
                     htmlFor="contact"
                     className="block text-gray-700 font-medium mb-1"
                   >
                     Contact <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="tel"
                     id="contact"
                     placeholder="Enter Your Contact Number"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                       errors.contact ? "border-red-500" : "border-gray-300"
                     }`}
                     onChange={onChangeHandler}
                     value={contactData.contact}
                     required
                   />
                   {errors.contact && (
                     <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
                   )}
                 </div>
   
                 <div>
                   <label
                     htmlFor="email"
                     className="block text-gray-700 font-medium mb-1"
                   >
                     Email <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="email"
                     id="email"
                     placeholder="Enter Your Email"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                       errors.email ? "border-red-500" : "border-gray-300"
                     }`}
                     onChange={onChangeHandler}
                     value={contactData.email}
                     required
                   />
                   {errors.email && (
                     <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                   )}
                 </div>
   
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label
                       htmlFor="state"
                       className="block text-gray-700 font-medium mb-1"
                     >
                       State <span className="text-red-500">*</span>
                     </label>
                     <select
                       id="state"
                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                         errors.state ? "border-red-500" : "border-gray-300"
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
   
                   <div>
                     <label
                       htmlFor="city"
                       className="block text-gray-700 font-medium mb-1"
                     >
                       City <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       id="city"
                       placeholder="Enter Your City"
                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                         errors.city ? "border-red-500" : "border-gray-300"
                       }`}
                       onChange={onChangeHandler}
                       value={contactData.city}
                       required
                     />
                     {errors.city && (
                       <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                     )}
                   </div>
                 </div>
   
                 <div>
                   <label
                     htmlFor="enquire"
                     className="block text-gray-700 font-medium mb-1"
                   >
                     Enquiry Type <span className="text-red-500">*</span>
                   </label>
                   <select
                     id="enquire"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                       errors.enquire ? "border-red-500" : "border-gray-300"
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
   
                 <div>
                   <label
                     htmlFor="enquireDetail"
                     className="block text-gray-700 font-medium mb-1"
                   >
                     Enquiry Details <span className="text-red-500">*</span>
                   </label>
                   <textarea
                     id="enquireDetail"
                     placeholder="Your requirement"
                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                       errors.enquireDetail ? "border-red-500" : "border-gray-300"
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
   
                 <div>
                   <button
                     type="submit"
                     className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                     disabled={loading}
                   >
                     {loading ? (
                       <div className="flex items-center justify-center">
                         <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                         <span>Submitting...</span>
                       </div>
                     ) : (
                       "Submit Enquiry"
                     )}
                   </button>
                 </div>
               </motion.form>
             </div>
           </div>
         </div>
    </>
  );
}
