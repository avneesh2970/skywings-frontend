"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";

const GalleryPage = memo(function GalleryPage({ onNavigateBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // All images for the full gallery page
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
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
        title: "Starry Night",
        description: "Night sky",
      },
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
        title: "City Street",
        description: "Urban traffic",
      },
      {
        id: 9,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
        title: "Ocean Waves",
        description: "Crashing waves",
      },
      {
        id: 10,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop",
        title: "Urban Garden",
        description: "City oasis",
      },
      {
        id: 11,
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=700&fit=crop",
        title: "Autumn Forest",
        description: "Colorful leaves",
      },
      {
        id: 12,
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=900&fit=crop",
        title: "Bridge View",
        description: "Modern bridge",
      },
      {
        id: 13,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        title: "Sunset Valley",
        description: "Golden hour",
      },
      {
        id: 14,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        title: "Misty Woods",
        description: "Morning fog",
      },
      {
        id: 15,
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        title: "Canyon View",
        description: "Red rocks",
      },
      {
        id: 16,
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
        title: "Crystal Lake",
        description: "Clear waters",
      },
    ],
    []
  );

  // Stable effect dependencies
  useEffect(() => {
    console.log("GalleryPage mounted");
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

  // Memoized handlers
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
  const GalleryCard = memo(function GalleryCard({ image }) {
    return (
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        onClick={() => handleImageClick(image)}
      >
        <div className="relative h-64">
          <img
            src={image.url || "/placeholder.svg"}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300">
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Complete Gallery
            </h1>
            <p className="text-gray-600">
              Explore our complete collection of {allImages.length} images
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allImages.map((image) => (
            <GalleryCard key={image.id} image={image} />
          ))}
        </div>
      </div>

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

export default GalleryPage;
