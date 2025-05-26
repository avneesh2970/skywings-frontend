import { useState, useEffect } from "react"

export default function Gallery() {
  const [currentView, setCurrentView] = useState("preview")
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)

  // Sample images
  const allImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      title: "Mountain Landscape",
      description: "Beautiful mountain scenery with snow-capped peaks",
      category: "nature",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      title: "Forest Path",
      description: "Peaceful forest walkway through tall trees",
      category: "nature",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
      title: "Desert Sunset",
      description: "Golden desert landscape at sunset",
      category: "nature",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
      title: "Lake Reflection",
      description: "Serene lake with mountain reflections",
      category: "nature",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
      title: "City Lights",
      description: "Urban night photography with city skyline",
      category: "urban",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      title: "Architecture",
      description: "Modern architectural design",
      category: "urban",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      title: "Starry Night",
      description: "Beautiful night sky with stars",
      category: "nature",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
      title: "City Street",
      description: "Busy city street with traffic",
      category: "urban",
    },
  ]

  const categories = ["all", "nature", "urban"]
  const previewImages = allImages.slice(0, 4)
  const filteredImages = filter === "all" ? allImages : allImages.filter((img) => img.category === filter)

  // Simple loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Preview Gallery Component
  const PreviewGallery = () => (
    <section className="py-16 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Media Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of stunning visuals and memorable moments
          </p>
        </div>

        {/* Gallery Grid - NO HOVER ANIMATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {previewImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div className={`relative ${index === 0 ? "h-96 md:h-full" : "h-64"}`}>
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Static overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button - only button hover effect */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView("full")}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <span className="mr-2">See More</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )

  // Full Gallery Component
  const FullGallery = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Full Gallery</h1>
            <p className="text-gray-600">Explore our complete collection of {allImages.length} images</p>
          </div>

          <button
            onClick={() => setCurrentView("preview")}
            className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Preview
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
                filter === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="ml-2 text-sm opacity-75">
                ({category === "all" ? allImages.length : allImages.filter((img) => img.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid - NO HOVER ANIMATIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white transition-shadow duration-300 hover:shadow-xl"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-64">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Static overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No images found for this category.</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      {currentView === "preview" ? <PreviewGallery /> : <FullGallery />}

      {/* Simple Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedImage.title}</h3>
              <p className="text-gray-600 mb-4">{selectedImage.description}</p>

              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {selectedImage.category}
                </span>
                <div className="text-sm text-gray-500">Image ID: {selectedImage.id}</div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
