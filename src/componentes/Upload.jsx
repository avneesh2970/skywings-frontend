"use client";

import { useState } from "react";
import img from "../assets/signup.png";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

function Upload() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    jobAppliedFor: "",
    state: "",
    city: "",
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.contactNumber.trim())
      errors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      errors.contactNumber = "Contact number must be exactly 10 digits";
    if (!formData.jobAppliedFor.trim())
      errors.jobAppliedFor = "Job title is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!file) errors.resume = "Resume is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        event.target.value = "";
        return;
      }

      // Check file type
      const fileType = selectedFile.type;
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(fileType)) {
        toast.error("Only PDF, DOC, and DOCX files are allowed");
        event.target.value = "";
        return;
      }

      setFileName(selectedFile.name);
      setFile(selectedFile);

      // Clear any previous file error
      if (formErrors.resume) {
        setFormErrors((prev) => ({ ...prev, resume: undefined }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow digits for contact number
    if (name === "contactNumber" && value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create form data for file upload
      const submitFormData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        submitFormData.append(key, formData[key]);
      });

      // Add the file
      if (file) {
        submitFormData.append("resume", file);
      }

      // Send data to backend API with progress tracking
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes`,
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Also send email notification using EmailJS
      const serviceId = import.meta.env.VITE_SERVICE_ID;
      const templateId = import.meta.env.VITE_TEMPLATE_ID1;
      const publicKey = import.meta.env.VITE_PUBLIC_KEY;

      const emailData = {
        ...formData,
        resumeFileName: fileName,
      };

      await emailjs.send(serviceId, templateId, emailData, {
        publicKey,
      });

      toast.success("Your resume has been submitted successfully!");

      // Reset form after success
      setFormData({
        fullName: "",
        email: "",
        contactNumber: "",
        jobAppliedFor: "",
        state: "",
        city: "",
      });
      setFileName("");
      setFile(null);
      setUploadProgress(0);

      // Reset file input
      const fileInput = document.getElementById("resume");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error submitting resume:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit your resume. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 bg-blue-50 min-h-screen flex justify-center items-center">
        <div className="container mx-auto p-6 md:p-12 flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
          {/* Left Image Section */}
          <div
            className="hidden md:block w-1/2 h-[500px] bg-cover bg-center rounded-l-lg"
            style={{ backgroundImage: `url(${img})` }}
          ></div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 px-6 md:px-16">
            <h3 className="text-2xl font-bold text-gray-800 text-center md:text-left">
              Submit Your Resume
            </h3>
            <motion.form
              onSubmit={handleSubmit}
              className="mt-4 space-y-3"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15, // 0.15 sec gap between each input
                  },
                },
              }}
            >
              {/* Full Name */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    formErrors.fullName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-100"
                  } text-zinc-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Your Name"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    formErrors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-100"
                  } text-zinc-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Your Email"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </motion.div>

              {/* Contact Number */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    formErrors.contactNumber
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-100"
                  } text-zinc-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Your Contact Number"
                />
                {formErrors.contactNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.contactNumber}
                  </p>
                )}
              </motion.div>

              {/* Job Applied For */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  Job Applied For <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobAppliedFor"
                  value={formData.jobAppliedFor}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    formErrors.jobAppliedFor
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-100"
                  } text-zinc-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Job Title"
                />
                {formErrors.jobAppliedFor && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.jobAppliedFor}
                  </p>
                )}
              </motion.div>

              {/* State */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    formErrors.state
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-100"
                  } text-zinc-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter State"
                />
                {formErrors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.state}
                  </p>
                )}
              </motion.div>

              {/* City */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    formErrors.city
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-100"
                  } text-zinc-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter City"
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </motion.div>

              {/* Upload Resume */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <label className="block text-gray-800 text-base mb-1">
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed ${
                    formErrors.resume
                      ? "border-red-400 bg-red-50"
                      : "border-gray-400 bg-gray-50"
                  } py-6 px-4 rounded-lg cursor-pointer hover:bg-gray-100 transition`}
                >
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="resume"
                    className="text-gray-500 text-center cursor-pointer"
                  >
                    Click to Upload Resume
                  </label>
                  {fileName && (
                    <p className="text-gray-600 text-sm mt-2">{fileName}</p>
                  )}
                  {formErrors.resume && (
                    <p className="text-red-500 text-xs mt-2">
                      {formErrors.resume}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </motion.div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg mt-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
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
            </motion.form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Upload;
