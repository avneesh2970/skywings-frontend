import React, { useState } from "react";
import img from "../assets/signup.png";

function Upload() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
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
            <div className="mt-4 space-y-2">
              {/* Full Name */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400  outline-none"
                  placeholder="Enter Your Name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-800 text-base mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400  outline-none"
                  placeholder="enter your email"
                />
              </div>

              {/* Contact Number */}
<div>
  <label className="block text-gray-800 text-base mb-1">Contact Number</label>
  <input
    type="tel"
    className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
    placeholder="enter your contact number"
  />
</div>

{/* Job Applied For */}
<div>
  <label className="block text-gray-800 text-base mb-1">Job Applied For</label>
  <input
    type="text"
    className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
    placeholder="Enter Job Title"
  />
</div>

{/* City */}
<div>
  <label className="block text-gray-800 text-base mb-1">City</label>
  <input
    type="text"
    className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
    placeholder="Enter City"
  />
</div>

{/* State */}
<div>
  <label className="block text-gray-800 text-base mb-1">State</label>
  <input
    type="text"
    className="w-full px-2 py-1 rounded-lg bg-gray-100 text-zinc-700 placeholder-gray-400 outline-none"
    placeholder="Enter State"
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
              <button className="w-full py-3 rounded-lg mt-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Upload;
