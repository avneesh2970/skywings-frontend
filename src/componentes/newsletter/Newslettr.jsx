import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function Newslettr() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const newsLetterSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!firstName.trim()) {
      return toast.error("First name is required");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/newsletter`,
        {
          email: email.trim(),
          firstName: firstName.trim(),
        }
      );

      // Show success message
      toast.success(response.data.message || "Subscribed successfully! 🎉");

      // Reset form and show success state
      setSuccess(true);
      setEmail("");
      setFirstName("");

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      // Handle different error types
      if (error.response?.status === 409) {
        toast.error("This email is already subscribed to our newsletter.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to subscribe. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-full h-75 mt-8 rounded-2xl relative p-3 md:p-8 mb-10 mx-auto md:bg-[url('./assets/products/BG.png')] bg-no-repeat bg-contain bg-center bg-blue-500 md:bg-white  ">
          <h1 className="font-medium md:text-4xl text-xl text-white flex justify-center  ">
            Subscribe to Our Newsletter
          </h1>
          <div className="md:mt-15 mt-8 flex flex-wrap justify-center gap-x-5 gap-y-4">
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              className="text-white w-full md:w-80 lg:w-72 border border-white outline-none rounded p-2 bg-transparent placeholder-white"
            />
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="text-white w-full md:w-80 lg:w-72 border border-white outline-none rounded p-2 bg-transparent placeholder-white"
            />
            <button
              onClick={newsLetterSubmit}
              disabled={loading}
              className="w-50 md:w-80 lg:w-52 bg-black text-white rounded p-2 cursor-pointer "
            >
              {loading ? "subscribing..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
