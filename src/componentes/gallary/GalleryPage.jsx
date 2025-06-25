// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/prop-types */
// "use client";

// import { useState, useEffect, useCallback, memo } from "react";
// import axios from "axios";

// const GalleryPage = memo(function GalleryPage() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [allImages, setAllImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const itemsPerPage = 12;

//   // Fetch gallery images from backend
//   const fetchGalleryImages = useCallback(
//     async (page = 1, search = "", category = "") => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/gallery/public`,
//           {
//             params: {
//               page,
//               limit: itemsPerPage,
//               search,
//               category,
//             },
//           }
//         );

//         if (response.data.success) {
//           setAllImages(response.data.data || []);
//           setTotalPages(response.data.totalPages || 1);
//           setTotalItems(response.data.total || 0);

//           // Extract unique categories
//           const uniqueCategories = [
//             ...new Set(response.data.data.map((item) => item.category)),
//           ];
//           setCategories(uniqueCategories);
//         } else {
//           setError("Failed to load gallery images");
//         }
//       } catch (err) {
//         console.error("Error fetching gallery images:", err);
//         setError("Failed to load gallery images. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Load images on component mount and when filters change
//   useEffect(() => {
//     fetchGalleryImages(currentPage, searchTerm, selectedCategory);
//   }, [fetchGalleryImages, currentPage, searchTerm, selectedCategory]);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (currentPage !== 1) {
//         setCurrentPage(1);
//       } else {
//         fetchGalleryImages(1, searchTerm, selectedCategory);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, selectedCategory, fetchGalleryImages]);

//   // Stable effect dependencies
//   useEffect(() => {
//     if (!loading) {
//       const timer = setTimeout(() => {
//         setIsLoaded(true);
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [loading]);

//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape") {
//         setSelectedImage(null);
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, []);

//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     if (selectedImage) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     // Cleanup on unmount
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [selectedImage]);

//   // Memoized handlers
//   const handleImageClick = useCallback((image) => {
//     setSelectedImage(image);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setSelectedImage(null);
//   }, []);

//   const handlePageChange = useCallback((page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   const handleSearchChange = useCallback((e) => {
//     setSearchTerm(e.target.value);
//   }, []);

//   const handleCategoryChange = useCallback((category) => {
//     setSelectedCategory(category);
//   }, []);

//   // Loading state
//   if (loading && !isLoaded) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading gallery...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error && allImages.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-500 mb-4">
//             <svg
//               className="w-12 h-12 mx-auto mb-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() =>
//               fetchGalleryImages(currentPage, searchTerm, selectedCategory)
//             }
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Memoized Gallery Card Component
//   const GalleryCard = memo(function GalleryCard({ image }) {
//     const imageUrl = image.imageUrl
//       ? `${import.meta.env.VITE_API_URL}${image.imageUrl}`
//       : "/placeholder.svg";

//     return (
//       <div
//         className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
//         onClick={() => handleImageClick(image)}
//       >
//         <div className="relative h-64">
//           <img
//             src={imageUrl || "/placeholder.svg"}
//             alt={image.title}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//             loading="lazy"
//             onError={(e) => {
//               e.target.src = "/placeholder.svg";
//             }}
//           />

//           {/* Featured badge */}
//           {image.featured && (
//             <div className="absolute top-3 left-3 z-10">
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                 <svg
//                   className="w-3 h-3 mr-1"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 Featured
//               </span>
//             </div>
//           )}

//           {/* Category badge */}
//           {image.category && (
//             <div className="absolute top-3 right-3 z-10">
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
//                 {image.category}
//               </span>
//             </div>
//           )}

//           {/* Hover Overlay - Only Title and Description */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300">
//             <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <h3 className="text-lg font-bold mb-2 text-white">
//                 {image.title}
//               </h3>
//               <p className="text-sm text-gray-200 text-white">
//                 {image.description}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
//           <div>
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
//               Complete Gallery
//             </h1>
//             <p className="text-gray-600">
//               Explore our complete collection of {totalItems} images
//             </p>
//           </div>
//         </div>

//         {/* Search and Filter Controls */}
//         <div className="flex flex-col md:flex-row gap-4 mb-8">
//           {/* Search */}
//           <div className="flex-1">
//             <div className="relative">
//               <svg
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search images..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Category Filter */}
//           <div className="md:w-64">
//             <select
//               value={selectedCategory}
//               onChange={(e) => handleCategoryChange(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category.charAt(0).toUpperCase() + category.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Loading indicator for pagination */}
//         {loading && (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
//             <p className="text-gray-600">Loading...</p>
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && allImages.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-gray-400 mb-4">
//               <svg
//                 className="w-16 h-16 mx-auto mb-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">
//               No Images Found
//             </h3>
//             <p className="text-gray-600 mb-4">
//               {searchTerm || selectedCategory
//                 ? "Try adjusting your search or filter criteria."
//                 : "Gallery images will appear here once uploaded."}
//             </p>
//             {(searchTerm || selectedCategory) && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedCategory("");
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         )}

//         {/* Gallery Grid */}
//         {!loading && allImages.length > 0 && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//               {allImages.map((image) => (
//                 <GalleryCard key={image._id} image={image} />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 >
//                   Previous
//                 </button>

//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={`px-3 py-2 rounded-lg transition-colors ${
//                           currentPage === pageNum
//                             ? "bg-blue-600 text-white"
//                             : "border border-gray-300 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Simple Image Modal - Only Image */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
//           onClick={handleCloseModal}
//         >
//           <div
//             className="relative max-w-6xl max-h-[95vh] w-full h-full flex items-center justify-center"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Image Only */}
//             <img
//               src={
//                 selectedImage.imageUrl
//                   ? `${import.meta.env.VITE_API_URL}${selectedImage.imageUrl}`
//                   : "/placeholder.svg"
//               }
//               alt={selectedImage.title}
//               className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
//               onError={(e) => {
//                 e.target.src = "/placeholder.svg";
//               }}
//             />

//             {/* Close Button */}
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
//             >
//               <svg
//                 className="w-6 h-6 text-gray-800"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });

// export default GalleryPage;

"use client"

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, memo } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, X, Search, Star, AlertTriangle, ImageOff, Loader2 } from "lucide-react"

const GalleryPage = memo(function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allImages, setAllImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const itemsPerPage = 12

  const API_URL = import.meta.env.VITE_API_URL || ""

  const fetchGalleryImages = useCallback(
    async (page = 1, search = "", category = "") => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`${API_URL}/api/gallery/public`, {
          params: {
            page,
            limit: itemsPerPage,
            search,
            category,
          },
        })

        if (response.data.success) {
          setAllImages(response.data.data || [])
          setTotalPages(response.data.totalPages || 1)
          setTotalItems(response.data.total || 0)

          const uniqueCategories = Array.from(
            new Set((response.data.data || []).map((item) => item.category).filter(Boolean)),
          )
          setCategories(uniqueCategories)
        } else {
          setError("Failed to load gallery images")
        }
      } catch (err) {
        console.error("Error fetching gallery images:", err)
        setError("Failed to load gallery images. Please try again later.")
      } finally {
        setLoading(false)
      }
    },
    [API_URL],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchGalleryImages(currentPage, searchTerm, selectedCategory)
  }, [fetchGalleryImages, currentPage, searchTerm, selectedCategory])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1)
      } else {
        fetchGalleryImages(1, searchTerm, selectedCategory)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const handleCloseModal = useCallback(() => {
    setSelectedImageIndex(null)
  }, [])

  const handlePrevImage = useCallback(() => {
    if (allImages.length === 0) return
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0
      return prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    })
  }, [allImages.length])

  const handleNextImage = useCallback(() => {
    if (allImages.length === 0) return
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0
      return prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    })
  }, [allImages.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return

      if (e.key === "Escape") {
        handleCloseModal()
      } else if (e.key === "ArrowLeft") {
        handlePrevImage()
      } else if (e.key === "ArrowRight") {
        handleNextImage()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedImageIndex, handleCloseModal, handlePrevImage, handleNextImage])

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedImageIndex])

  const handleImageClick = useCallback(
    (image) => {
      const index = allImages.findIndex((img) => img._id === image._id)
      if (index !== -1) {
        setSelectedImageIndex(index)
      }
    },
    [allImages],
  )

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
  }, [])

  if (loading && !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (error && allImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-700 text-lg mb-2 font-semibold">Oops! Something went wrong.</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchGalleryImages(currentPage, searchTerm, selectedCategory)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const GalleryCard = memo(function GalleryCard({ image }) {
    const imageUrl = image.imageUrl
      ? `${API_URL}${image.imageUrl}`
      : `/placeholder.svg?width=400&height=256&query=${encodeURIComponent(image.title || "gallery image")}`

    return (
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        onClick={() => handleImageClick(image)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleImageClick(image)}
        aria-label={`View image: ${image.title}`}
      >
        <div className="relative h-64">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `/placeholder.svg?width=400&height=256&query=broken+image`
            }}
          />

          {image.featured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 shadow">
                <Star className="w-3.5 h-3.5 mr-1.5 fill-yellow-500 text-yellow-600" />
                Featured
              </span>
            </div>
          )}

          {image.category && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize shadow">
                {image.category}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-lg font-bold text-white mb-1 truncate">{image.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
          </div>
        </div>
      </div>
    )
  })
  GalleryCard.displayName = "GalleryCard"

  const currentImage = selectedImageIndex !== null ? allImages[selectedImageIndex] : null
  const modalImageUrl = currentImage?.imageUrl
    ? `${API_URL}${currentImage.imageUrl}`
    : currentImage
      ? `/placeholder.svg?width=1200&height=800&query=${encodeURIComponent(currentImage.title || "enlarged image")}`
      : ""

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">Image Gallery</h1>
          <p className="text-lg text-gray-600">
            Explore our collection of {totalItems > 0 ? `${totalItems} stunning images` : "images"}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search images by title or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-label="Search images"
            />
          </div>

          {categories.length > 0 && (
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm appearance-none bg-white bg-no-repeat bg-right pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.25em 1.25em",
                }}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading && allImages.length === 0 && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">Loading images...</p>
          </div>
        )}

        {loading && allImages.length > 0 && (
          <div className="text-center py-4 mb-4">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600 mx-auto" />
          </div>
        )}

        {!loading && allImages.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow p-8">
            <ImageOff className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Images Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory
                ? "We couldn't find any images matching your criteria. Try adjusting your search or filters."
                : "It looks like there are no images in the gallery yet. Check back soon!"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && allImages.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {allImages.map((image) => (
                <GalleryCard key={image._id} image={image} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Image gallery pagination" className="flex justify-center items-center gap-2 pb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Go to previous page"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    if (pageNum > totalPages || pageNum < 1) return null

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Go to next page"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {selectedImageIndex !== null && currentImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-2 sm:p-4"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="imageModalTitle"
        >
          <div
            className="relative max-w-5xl max-h-[95vh] w-full h-auto flex flex-col items-center justify-center bg-black rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="imageModalTitle" className="sr-only">
              {currentImage.title}
            </h2>

            <div className="relative w-full flex-grow flex items-center justify-center p-4 sm:p-8 md:p-12">
              <img
                key={selectedImageIndex}
                src={modalImageUrl || "/placeholder.svg"}
                alt={currentImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-md shadow-lg animate-image-modal-entry"
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?width=1200&height=800&query=broken+enlarged+image`
                }}
              />
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="p-3 sm:p-4 text-center bg-black/50 w-full">
              <p className="text-white text-sm sm:text-base truncate">{currentImage.title}</p>
              {allImages.length > 1 && (
                <p className="text-gray-400 text-xs sm:text-sm">
                  Image {selectedImageIndex + 1} of {allImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
GalleryPage.displayName = "GalleryPage"

export default GalleryPage
