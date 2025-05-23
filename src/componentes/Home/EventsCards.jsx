/* eslint-disable react/no-unknown-property */
"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Tag, Users, X, AlertCircle, User, ChevronRight, Clock } from "lucide-react"

function EventsDisplay() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalEvents, setTotalEvents] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Maximum number of cards to display
  const MAX_VISIBLE_EVENTS = 4 // Increased to 4 from 3

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // Fetch events from your API with sort parameters
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events?sort=createdAt&order=desc`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data.data || [])
        setTotalEvents(data.total || 0)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Handle modal open
  const openEventModal = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden"
  }

  // Handle modal close
  const closeEventModal = () => {
    setIsModalOpen(false)
    // Re-enable body scrolling
    document.body.style.overflow = "auto"
  }

  // Handle redirection to events page
  const handleSeeMore = () => {
    window.location.href = "/events"
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle click outside modal to close
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      closeEventModal()
    }
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeEventModal()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isModalOpen])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-purple-900 mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md h-full animate-pulse border border-purple-100"
            >
              <div className="h-36 bg-purple-50"></div>
              <div className="p-4">
                <div className="h-5 bg-purple-50 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-purple-50 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-purple-50 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between mt-3">
                  <div className="h-5 bg-purple-50 rounded w-1/4"></div>
                  <div className="h-5 bg-purple-50 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-50 text-red-600 p-3 rounded-full mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-purple-900 mb-3">Unable to Load Events</h2>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-center text-purple-900 mb-3 animate-fade-in">Events</h2>
      <p className="text-center text-purple-700 mb-8 max-w-2xl mx-auto text-sm animate-fade-in-delay">
        Discover and join our exciting events. From workshops to conferences, there's something for everyone.
      </p>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-purple-50 rounded-xl">
          <div className="bg-purple-100 text-purple-500 p-3 rounded-full mb-4">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-3">No Events Found</h3>
          <p className="text-purple-700 max-w-md text-sm">
            There are no upcoming events at the moment. Please check back later for new events.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {events.slice(0, MAX_VISIBLE_EVENTS).map((event, index) => (
              <div
                key={event._id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col h-full transform hover:-translate-y-2 border border-purple-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative h-36 overflow-hidden">
                  {/* Animated corner accents */}
                  <div
                    className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-purple-500 z-10 transition-all duration-200 ${hoveredCard === index ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  ></div>
                  <div
                    className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-purple-500 z-10 transition-all duration-200 ${hoveredCard === index ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-purple-500 z-10 transition-all duration-200 ${hoveredCard === index ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-purple-500 z-10 transition-all duration-200 ${hoveredCard === index ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  ></div>

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-700/30 to-transparent z-10 transition-opacity duration-200 ${hoveredCard === index ? "opacity-100" : "opacity-0"}`}
                  ></div>

                  {/* Animated border */}
                  <div
                    className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 transition-all duration-200 ${hoveredCard === index ? "w-full" : "w-0"}`}
                  ></div>

                  {event.imageUrl ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${event.imageUrl}`}
                      alt={event.title}
                      className={`w-full h-full object-cover transition-all duration-300 ${hoveredCard === index ? "scale-110 brightness-110" : ""}`}
                    />
                  ) : (
                    <div
                      className={`h-full flex items-center justify-center transition-all duration-200 ${hoveredCard === index ? "bg-gradient-to-r from-purple-100 to-purple-200" : "bg-gradient-to-r from-purple-50 to-purple-100"}`}
                    >
                      <Calendar
                        className={`h-10 w-10 transition-transform duration-200 ${hoveredCard === index ? "scale-125 text-purple-400" : "text-purple-300"}`}
                      />
                    </div>
                  )}

                  {event.status && (
                    <div className="absolute top-2 right-2 z-20">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          hoveredCard === index ? "transform -translate-y-1 shadow-lg" : ""
                        } ${
                          event.status === "active"
                            ? "bg-green-100 text-green-800"
                            : event.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className={`text-base font-bold mb-2 line-clamp-1 transition-colors duration-200 ${hoveredCard === index ? "text-purple-700" : "text-purple-900"}`}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 mb-3 text-xs text-purple-700">
                    <div
                      className={`flex items-center transition-transform duration-200 ${hoveredCard === index ? "translate-x-1" : ""}`}
                    >
                      <Clock
                        className={`h-3 w-3 mr-1.5 text-purple-500 flex-shrink-0 transition-transform duration-200 ${hoveredCard === index ? "rotate-12" : ""}`}
                      />
                      <span className="line-clamp-1">{formatDate(event.startDate)}</span>
                    </div>

                    {event.location && (
                      <div
                        className={`flex items-center transition-transform duration-200 ${hoveredCard === index ? "translate-x-1" : ""}`}
                      >
                        <MapPin
                          className={`h-3 w-3 mr-1.5 text-purple-500 flex-shrink-0 transition-transform duration-200 ${hoveredCard === index ? "scale-125" : ""}`}
                        />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-purple-50">
                    {event.category ? (
                      <span
                        className={`bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full transition-all duration-200 ${hoveredCard === index ? "transform -translate-y-1 bg-purple-100 shadow-md" : ""}`}
                      >
                        {event.category}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    <button
                      onClick={() => openEventModal(event)}
                      className={`text-purple-700 text-xs font-medium flex items-center group transition-colors duration-200 ${hoveredCard === index ? "text-purple-900" : ""}`}
                      aria-label={`View details for ${event.title}`}
                    >
                      Details
                      <ChevronRight
                        className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${hoveredCard === index ? "translate-x-1" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Enhanced glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-200 ${
                    hoveredCard === index
                      ? "shadow-[0_10px_25px_-5px_rgba(139,92,246,0.4),0_8px_10px_-6px_rgba(139,92,246,0.3),0_0_0_2px_rgba(139,92,246,0.1)]"
                      : ""
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {events.length > MAX_VISIBLE_EVENTS && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleSeeMore}
                className="px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 shadow-md hover:shadow-xl text-sm font-medium relative overflow-hidden group"
                aria-label="See more events"
              >
                <span className="absolute inset-0 w-0 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
                <span className="relative z-10">See More Events</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-purple-900 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm transition-opacity"
          onClick={handleOutsideClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-[modalIn_0.25s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "0.25s ease-out 0s 1 normal forwards running modalIn",
            }}
          >
            {/* Modal Header */}
            <div className="relative">
              {selectedEvent.imageUrl ? (
                <div className="h-56 sm:h-72 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${selectedEvent.imageUrl}`}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
                </div>
              ) : (
                <div className="h-56 sm:h-72 bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-purple-400" />
                </div>
              )}
              <button
                onClick={closeEventModal}
                className="absolute top-4 right-4 bg-purple-900 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 hover:rotate-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-purple-900 animate-fade-in">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium animate-fade-in ${
                      selectedEvent.status === "active"
                        ? "bg-green-100 text-green-800"
                        : selectedEvent.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="col-span-2 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">About This Event</h3>
                  <div className="prose text-purple-800">
                    <p>{selectedEvent.description || "No description available for this event."}</p>
                  </div>
                </div>

                <div
                  className="bg-purple-50 p-6 rounded-xl border border-purple-100 animate-fade-in-up shadow-md"
                  style={{ animationDelay: "160ms" }}
                >
                  <h3 className="text-lg font-semibold text-purple-900 mb-5">Event Details</h3>
                  <div className="space-y-5">
                    <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                      <div className="flex items-center text-purple-900 mb-2">
                        <Calendar className="h-5 w-5 mr-3 text-purple-600 hover:rotate-12 transition-transform duration-200" />
                        <span className="font-medium">Date & Time</span>
                      </div>
                      <p className="text-purple-700 ml-8">
                        {formatDate(selectedEvent.startDate)}
                        {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.startDate && (
                          <span> - {formatDate(selectedEvent.endDate)}</span>
                        )}
                      </p>
                    </div>

                    {selectedEvent.location && (
                      <div className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
                        <div className="flex items-center text-purple-900 mb-2">
                          <MapPin className="h-5 w-5 mr-3 text-purple-600 hover:scale-125 transition-transform duration-200" />
                          <span className="font-medium">Location</span>
                        </div>
                        <p className="text-purple-700 ml-8">{selectedEvent.location}</p>
                      </div>
                    )}

                    {selectedEvent.category && (
                      <div className="animate-fade-in-up" style={{ animationDelay: "280ms" }}>
                        <div className="flex items-center text-purple-900 mb-2">
                          <Tag className="h-5 w-5 mr-3 text-purple-600 hover:rotate-12 transition-transform duration-200" />
                          <span className="font-medium">Category</span>
                        </div>
                        <p className="text-purple-700 ml-8">
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-sm hover:bg-purple-200 transition-colors duration-200 hover:shadow-md">
                            {selectedEvent.category}
                          </span>
                        </p>
                      </div>
                    )}

                    {selectedEvent.organizer && (
                      <div className="animate-fade-in-up" style={{ animationDelay: "320ms" }}>
                        <div className="flex items-center text-purple-900 mb-2">
                          <User className="h-5 w-5 mr-3 text-purple-600 hover:scale-125 transition-transform duration-200" />
                          <span className="font-medium">Organizer</span>
                        </div>
                        <p className="text-purple-700 ml-8">{selectedEvent.organizer}</p>
                      </div>
                    )}

                    {selectedEvent.capacity > 0 && (
                      <div className="animate-fade-in-up" style={{ animationDelay: "360ms" }}>
                        <div className="flex items-center text-purple-900 mb-2">
                          <Users className="h-5 w-5 mr-3 text-purple-600 hover:rotate-12 transition-transform duration-200" />
                          <span className="font-medium">Capacity</span>
                        </div>
                        <p className="text-purple-700 ml-8">{selectedEvent.capacity} attendees</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration Button */}
              {selectedEvent.registrationUrl && (
                <div
                  className="mt-8 border-t border-purple-100 pt-8 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <a
                    href={selectedEvent.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full sm:w-auto px-8 py-4 bg-purple-700 text-white text-center font-medium rounded-lg hover:bg-purple-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-0 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
                    <span className="relative z-10">Register for Event</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .prose {
          max-width: 65ch;
        }
        .prose p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }
        
        /* Animation classes */
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.3s ease-out 0.15s forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default EventsDisplay
