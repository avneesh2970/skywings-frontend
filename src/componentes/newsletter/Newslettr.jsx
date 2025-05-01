
import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const newsLetterSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      return toast.error("Email is required")
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address")
    }
    if (!firstName.trim()) {
      return toast.error("First name is required")
    }

    setLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter`, {
        email: email.trim(),
        firstName: firstName.trim(),
      })

      // Show success message
      toast.success(response.data.message || "Subscribed successfully! 🎉")

      // Reset form and show success state
      setSuccess(true)
      setEmail("")
      setFirstName("")

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Newsletter subscription error:", error)

      // Handle different error types
      if (error.response?.status === 409) {
        toast.error("This email is already subscribed to our newsletter.")
      } else {
        toast.error(error.response?.data?.message || "Failed to subscribe. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="w-full rounded-2xl relative overflow-hidden my-8 md:my-12 lg:my-16"
        style={{
          backgroundImage: "url('./assets/products/BG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#3b82f6", // Fallback color if image fails to load
        }}
      >
        <div className="w-full h-full bg-blue-500 bg-opacity-90 md:bg-opacity-70 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-medium text-2xl sm:text-3xl md:text-4xl text-white text-center mb-6 md:mb-8">
              Subscribe to Our Newsletter
            </h1>

            <form onSubmit={newsLetterSubmit} className="flex flex-col space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="w-full text-white border border-white outline-none rounded p-3 bg-transparent placeholder-white placeholder-opacity-80 focus:ring-2 focus:ring-white"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full text-white border border-white outline-none rounded p-3 bg-transparent placeholder-white placeholder-opacity-80 focus:ring-2 focus:ring-white"
                />
              </div>

              <div className="flex justify-center sm:justify-start md:justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto md:w-1/2 lg:w-1/3 bg-black hover:bg-gray-800 transition-colors text-white rounded p-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px]"
                >
                  {loading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </div>

              {success && (
                <div className="text-white text-center bg-green-500 bg-opacity-80 p-3 rounded-md">
                  Thank you for subscribing!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
