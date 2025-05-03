"use client";

import { useEffect, useRef } from "react";
import { list } from "../data";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

function DetailService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const contentRef = useRef(null);
  const service = list.find((service) => service.id === Number(id));
  console.log(":service: ", service);
  const handleClick = (service) => {
    navigate(`/DetailService/${service.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [id]);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/services")}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base mb-6 transition-colors duration-300"
        aria-label="Go back to services"
      >
        <FaArrowLeft className="text-lg" />
        <span>Back to Services</span>
      </button>

      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Left Section - Image */}
        <div className="w-full lg:w-1/2">
          <img
            className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
            src={service.image || "/placeholder.svg"}
            alt={service.title}
          />
        </div>

        {/* Right Section - Scrollable Text Content */}
        <div className="w-full lg:w-1/2">
          <div ref={contentRef} className="max-h-[500px] overflow-y-auto scrollbar-hide pr-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 text-start">
              {service.title}
            </h1>
            <div
              className="text-gray-700 text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
            <button
              onClick={() => navigate("/contact")}
              className="mt-6 w-full sm:w-64 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
              aria-label="Contact us for this service"
            >
              {service.button || "Contact Us"}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          Related Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {list.map((service, index) => (
            <div
              key={index}
              onClick={() => handleClick(service)}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-8px] cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClick(service)}
              aria-label={`View details for ${service.title}`}
            >
              <div className="overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <div className="overflow-hidden">
                  <span className="text-blue-600 text-sm font-medium mt-2 inline-flex items-center group-hover:translate-x-1 transition-transform duration-300">
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Scrollbar Hiding */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default DetailService;
