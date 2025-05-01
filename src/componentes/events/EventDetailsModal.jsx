/* eslint-disable react/prop-types */
"use client"

import { X, Calendar, Clock, MapPin, Tag, Users, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"

const EventDetailsModal = ({ event, isOpen, onClose, formatDate, getStatusBadge, apiUrl }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const imageContainerRef = useRef(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    if (isOpen) {
      const imageArray = []
      if (event.imageUrl) {
        imageArray.push(`${apiUrl}${event.imageUrl}`)
      } else {
        imageArray.push(`/placeholder.svg?height=600&width=800&query=event ${event.category}`)
      }
      setImages(imageArray)
      setTimeout(() => setIsVisible(true), 10)

      const handleEscape = (e) => {
        if (e.key === "Escape") onClose()
      }

      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "auto"
      }
    } else {
      setIsVisible(false)
      setIsZoomed(false)
      setCurrentImageIndex(0)
    }
  }, [isOpen, event, apiUrl, onClose])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const toggleImageZoom = (e) => {
    e.stopPropagation()
    setIsZoomed(!isZoomed)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={onClose}
      role="dialog"
      aria-labelledby="event-modal-title"
      aria-modal="true"
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close event details modal"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Image Gallery */}
          <div
            className="relative h-64 sm:h-80 md:h-96 bg-gray-100"
            ref={imageContainerRef}
          >
            {images.length > 0 ? (
              <>
                <div
                  className="w-full h-full cursor-zoom-in"
                  onClick={toggleImageZoom}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleImageZoom(e)}
                  aria-label="Zoom image"
                >
                  <img
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${event.title} - Image ${currentImageIndex + 1}`}
                    className={`w-full h-full object-contain object-center transition-transform duration-300 ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/community-celebration.png"
                    }}
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-800" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(index)
                          }}
                          className={`w-2 h-2 rounded-full ${
                            currentImageIndex === index ? "bg-white" : "bg-white bg-opacity-50"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div
                  className={`absolute top-4 left-4 ${
                    getStatusBadge(event.status).color
                  } px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm`}
                >
                  {getStatusBadge(event.status).icon}
                  <span className="capitalize">{event.status}</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                <Calendar className="h-24 w-24 text-purple-300" />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="p-6">
            <h2 id="event-modal-title" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About This Event</h3>
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>

                {event.additionalDetails && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                    <p className="text-gray-700 whitespace-pre-line">{event.additionalDetails}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Date & Time</div>
                      <div>{formatDate(event.startDate)}</div>
                      {event.endDate && event.startDate !== event.endDate && (
                        <div className="text-gray-600">to {formatDate(event.endDate)}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div>{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Category</div>
                      <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-sm inline-block mt-1">
                        {event.category}
                      </div>
                    </div>
                  </div>

                  {event.capacity > 0 && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Capacity</div>
                        <div>{event.capacity} attendees</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {event.registrationUrl && event.status !== "past" && event.status !== "cancelled" && (
              <div className="mt-6">
                <motion.a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ backgroundColor: "#2563eb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register for this Event
                  <ExternalLink className="h-4 w-4 ml-2" />
                </motion.a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

EventDetailsModal.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    location: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    capacity: PropTypes.number,
    status: PropTypes.string.isRequired,
    registrationUrl: PropTypes.string,
    additionalDetails: PropTypes.string
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired
}

export default EventDetailsModal