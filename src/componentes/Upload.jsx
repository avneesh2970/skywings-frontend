import { useState } from "react";
import img from "../assets/signup.png";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

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
    resumeFileName: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData((prev) => ({ ...prev, resumeFileName: file.name }));

      // You can also use FileReader to convert the file to base64 if needed
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   const base64 = e.target.result;
      //   setFormData((prev) => ({ ...prev, resumeBase64: base64 }));
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceId = import.meta.env.VITE_SERVICE_ID;
      const templateId = import.meta.env.VITE_TEMPLATE_ID1;
      const publicKey = import.meta.env.VITE_PUBLIC_KEY;

      console.log("Form submitted", formData);

      emailjs
        .send(serviceId, templateId, formData, {
          publicKey,
        })
        .then(
          () => {
            console.log("SUCCESS!");
            toast.success("Your resume has been submitted successfully!");
            // Reset form after success
            setFormData({
              fullName: "",
              email: "",
              contactNumber: "",
              jobAppliedFor: "",
              state: "",
              city: "",
              resumeFileName: "",
            });
            setFileName("");
            // Reset file input
            const fileInput = document.getElementById("resume");
            if (fileInput) {
              fileInput.value = "";
            }
          },
          (error) => {
            console.log("FAILED...", error.text);
            toast.error(
              "Failed to submit your resume. Please try again later."
            );
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
  };

  return (
    <>
      <div className="bg-blue-50 min-h-screen flex justify-center items-center">
        <div className="container mx-auto p-6 md:p-12 flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
          {/* Left Image Section */}
          <div
            className="hidden md:block w-1/2 h-[500px] bg-cover bg-center rounded-l-lg"
            style={{ backgroundImage: `url(${img})` }}
          ></div>

          {/* Right Form Section */}
          <div className="w-10/12 outline-none md:w-1/2 px-16">
            <h3 className="text-2xl font-bold text-gray-800 text-center md:text-left">
              Submit Your Resume
            </h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-2">
              {/* Full Name */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
                  placeholder="Enter Your Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
                  placeholder="Enter Your Email"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
                  placeholder="Enter Your Contact Number"
                  required
                />
              </div>

              {/* Job Applied For */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  Job Applied For
                </label>
                <input
                  type="text"
                  name="jobAppliedFor"
                  value={formData.jobAppliedFor}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
                  placeholder="Enter Job Title"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
                  placeholder="Enter State"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
                  placeholder="Enter City"
                  required
                />
              </div>

              {/* Upload Resume */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  Upload Resume
                </label>
                <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-400 py-6 px-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    id="resume"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
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
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg mt-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Upload;
