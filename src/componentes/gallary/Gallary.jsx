"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Gallery = memo(function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  // Memoized static data with shorter descriptions
  const allImages = useMemo(
    () => [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        title: "Mountain View",
        description: "Snow-capped peaks",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        title: "Forest Path",
        description: "Peaceful walkway",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        title: "Desert Sunset",
        description: "Golden landscape",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
        title: "Lake View",
        description: "Mountain reflections",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
        title: "City Lights",
        description: "Night skyline",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        title: "Architecture",
        description: "Modern design",
      },
    ],
    []
  );

  // Show only first 6 images for preview
  const previewImages = useMemo(() => allImages.slice(0, 6), [allImages]);

  // Stable effect dependencies
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Memoized handlers to prevent re-creation
  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Memoized Gallery Card Component
  const GalleryCard = memo(function GalleryCard({ image, index }) {
    return (
      <div
        className={`
          group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white
          transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
          ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
          ${index === 1 ? "md:col-span-2" : ""}
          ${index === 2 ? "lg:col-span-2" : ""}
        `}
        onClick={() => handleImageClick(image)}
      >
        <div
          className={`
            relative 
            ${
              index === 0
                ? "h-80 md:h-full"
                : index === 1
                ? "h-64 md:h-full"
                : "h-64"
            }
          `}
        >
          <img
            src={image.url || "/placeholder.svg"}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient overlay that's always visible but gets darker on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300">
            {/* Content that appears on hover */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-lg font-bold mb-1 text-white">
                {image.title}
              </h3>
              <p className="text-sm text-gray-200 text-white">
                {image.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen">
      {/* Preview Gallery */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Media Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of stunning visuals and memorable moments
            </p>
          </div>

          {/* Featured Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
            {previewImages.map((image, index) => (
              <GalleryCard key={image.id} image={image} index={index} />
            ))}
          </div>

          {/* Explore Gallery Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/gallery")}
              //   to="/gallery"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">Explore Full Gallery</span>
              <svg
                className="w-5 h-5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Simple Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-6xl max-h-[95vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Gallery;
