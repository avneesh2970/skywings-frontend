"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Gallery = memo(function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch gallery images from backend
  const fetchGalleryImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch 7 images for better space utilization
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/gallery/public`,
        {
          params: {
            limit: 7, // Increased from 6 to 7 images
          },
        }
      );

      if (response.data.success) {
        setGalleryImages(response.data.data || []);
      } else {
        setError("Failed to load gallery images");
      }
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  // Show first 7 images for preview
  const previewImages = useMemo(
    () => galleryImages.slice(0, 7),
    [galleryImages]
  );

  // Stable effect dependencies
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

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

  // Loading state
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchGalleryImages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (previewImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Images Available
          </h3>
          <p className="text-gray-600">
            Gallery images will appear here once uploaded.
          </p>
        </div>
      </div>
    );
  }

  // Memoized Gallery Card Component - Optimized Layout for 7 images
  const GalleryCard = memo(function GalleryCard({ image, index }) {
    const imageUrl = image.imageUrl
      ? `${import.meta.env.VITE_API_URL}${image.imageUrl}`
      : "/placeholder.svg";

    return (
      <div
        className={`
          group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white
          transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
          ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
          ${index === 1 ? "md:col-span-2" : ""}
          ${index === 2 ? "lg:col-span-1" : ""}
          ${index === 3 ? "lg:col-span-1" : ""}
          ${index === 4 ? "lg:col-span-1" : ""}
          ${index === 5 ? "lg:col-span-1" : ""}
          ${index === 6 ? "lg:col-span-2" : ""}
        `}
        onClick={() => handleImageClick(image)}
      >
        <div className="relative w-full h-full min-h-[16rem]">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />

          {/* Featured badge */}
          {image.featured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
          )}

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
              Media Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of stunning visuals and memorable moments
            </p>
            {galleryImages.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {previewImages.length} featured images
              </p>
            )}
          </div>

          {/* Featured Gallery Grid - Optimized for 7 images */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
            {previewImages.map((image, index) => (
              <GalleryCard key={image._id} image={image} index={index} />
            ))}
          </div>

          {/* Explore Gallery Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/gallery")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">Explore Full Library</span>
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
            {/* Image Only */}
            <img
              src={
                selectedImage.imageUrl
                  ? `${import.meta.env.VITE_API_URL}${selectedImage.imageUrl}`
                  : "/placeholder.svg"
              }
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.src = "/placeholder.svg";
              }}
            />

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-12 h-12 bg-black bg-opacity-50 hover:bg-black hover:bg-opacity-70 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            >
              <svg
                className="w-6 h-6 text-white"
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
