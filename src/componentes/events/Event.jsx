"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Calendar,
  MapPin,
  Tag,
  Star,
  Search,
  Filter,
  X,
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  CalendarCheck,
  CalendarX,
  CalendarOff,
  ChevronDown,
  ChevronUp,
  Users,
  Bookmark,
  Share2,
  Info,
} from "lucide-react"
import EventDetailsModal from "./EventDetailsModal"
import { motion, AnimatePresence } from "framer-motion"

export default function Event() {
  const [events, setEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [ongoingEvents, setOngoingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [cancelledEvents, setCancelledEvents] = useState([])
  const [featuredEvents, setFeaturedEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterFeatured, setFilterFeatured] = useState("")
  const [categories, setCategories] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({
    key: "startDate",
    direction: "asc",
  })

  // Section visibility toggles - past events now visible by default
  const [showOngoing, setShowOngoing] = useState(true)
  const [showPast, setShowPast] = useState(true)
  const [showCancelled, setShowCancelled] = useState(true)

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filterRef = useRef(null)
  const categoryFilterRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
      if (categoryFilterRef.current && !categoryFilterRef.current.contains(event.target)) {
        setIsCategoryFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calculate real-time status based on current date and event dates
  const calculateEventStatus = (event) => {
    // If manually set to cancelled, keep it that way
    if (event.status === "cancelled") {
      return "cancelled"
    }

    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate || event.startDate) // Fallback to startDate if endDate is not provided

    if (now < startDate) {
      return "upcoming"
    } else if (now >= startDate && now <= endDate) {
      return "ongoing"
    } else if (now > endDate) {
      return "past"
    }

    // Fallback to the stored status if something goes wrong
    return event.status
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        params.append("page", currentPage)
        params.append("limit", 100) // Fetch more events to ensure we have enough for each category

        if (searchTerm) params.append("search", searchTerm)
        // We'll handle status filtering client-side to ensure accuracy
        if (filterCategory) params.append("category", filterCategory)
        if (filterFeatured) params.append("featured", filterFeatured)

        // Sort by start date by default
        params.append("sort", sortConfig.key)
        params.append("order", sortConfig.direction)

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events?${params.toString()}`)

        // Process events to update status based on current date
        const processedEvents = response.data.data.map((event) => {
          const calculatedStatus = calculateEventStatus(event)
          return {
            ...event,
            calculatedStatus,
            status: calculatedStatus, // Override the status with calculated one
          }
        })

        // Apply status filter if needed (client-side)
        const filteredEvents = filterStatus
          ? processedEvents.filter((event) => event.calculatedStatus === filterStatus)
          : processedEvents

        // Group events by status
        const upcoming = filteredEvents.filter((event) => event.calculatedStatus === "upcoming")
        const ongoing = filteredEvents.filter((event) => event.calculatedStatus === "ongoing")
        const past = filteredEvents.filter((event) => event.calculatedStatus === "past")
        const cancelled = filteredEvents.filter((event) => event.calculatedStatus === "cancelled")
        const featured = filteredEvents.filter((event) => event.featured)

        setEvents(filteredEvents)
        setUpcomingEvents(upcoming)
        setOngoingEvents(ongoing)
        setPastEvents(past)
        setCancelledEvents(cancelled)
        setFeaturedEvents(featured)

        setTotalPages(response.data.totalPages)
        setTotalEvents(response.data.total)

        const uniqueCategories = [...new Set(response.data.data.map((event) => event.category))]
        setCategories(uniqueCategories)

        setError(null)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
        setEvents([])
        setUpcomingEvents([])
        setOngoingEvents([])
        setPastEvents([])
        setCancelledEvents([])
        setFeaturedEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentPage, searchTerm, filterStatus, filterCategory, filterFeatured, sortConfig])

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <Calendar className="h-3 w-3 mr-1" />,
        }
      case "ongoing":
        return {
          color: "bg-green-100 text-green-700",
          icon: <CalendarCheck className="h-3 w-3 mr-1" />,
        }
      case "past":
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <CalendarX className="h-3 w-3 mr-1" />,
        }
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700",
          icon: <CalendarOff className="h-3 w-3 mr-1" />,
        }
      default:
        return {
          color: "bg-purple-100 text-purple-700",
          icon: <Calendar className="h-3 w-3 mr-1" />,
        }
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterStatus("")
    setFilterCategory("")
    setFilterFeatured("")
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const EventSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="mt-6 pt-4 flex gap-2">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )

  // Event card component to avoid repetition
  const EventCard = ({ event }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        key={event._id}
        className="relative bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Event Image */}
        <div className="relative h-52 bg-gray-200 overflow-hidden">
          {event.imageUrl ? (
            <>
              <motion.img
                src={`${import.meta.env.VITE_API_URL}${event.imageUrl}`}
                alt={event.title}
                className="w-full h-full object-cover object-center"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/community-event.png"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
              <Calendar className="h-16 w-16 text-purple-300" />
            </div>
          )}

          {/* Status Badge */}
          <div
            className={`absolute top-3 left-3 ${
              getStatusBadge(event.calculatedStatus || event.status).color
            } px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm backdrop-blur-sm`}
          >
            {getStatusBadge(event.calculatedStatus || event.status).icon}
            <span className="capitalize">{event.calculatedStatus || event.status}</span>
          </div>

          {/* Featured Badge */}
          {event.featured && (
            <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}

          {/* Quick action buttons that appear on hover */}
          <motion.div
            className="absolute bottom-3 right-3 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              aria-label="Bookmark event"
              title="Bookmark event"
            >
              <Bookmark className="h-4 w-4 text-gray-700" />
            </button>
            <button
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              aria-label="Share event"
              title="Share event"
            >
              <Share2 className="h-4 w-4 text-gray-700" />
            </button>
          </motion.div>
        </div>

        {/* Event Content */}
        <motion.div
          className="p-5 flex-grow flex flex-col relative"
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
            {event.title}
          </h3>

          <div className="space-y-3 mb-4 text-sm text-gray-600">
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div>{formatDate(event.startDate)}</div>
                {event.endDate && event.startDate !== event.endDate && (
                  <div className="text-gray-500">to {formatDate(event.endDate)}</div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            {event.category && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{event.category}</span>
              </div>
            )}

            {event.capacity > 0 && (
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-xs">{event.capacity} attendees</span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 flex gap-2">
            <motion.button
              onClick={() => handleViewDetails(event)}
              className="flex-grow px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>

            {event.registrationUrl &&
              (event.calculatedStatus === "upcoming" || event.calculatedStatus === "ongoing") &&
              event.calculatedStatus !== "cancelled" && (
                <motion.a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300 text-sm font-medium"
                  whileHover={{ backgroundColor: "#eff6ff", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register
                  <ExternalLink className="h-3 w-3" />
                </motion.a>
              )}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Section header component
  const SectionHeader = ({ title, count, isOpen, toggleOpen, color, icon }) => (
    <motion.div
      className={`flex items-center justify-between ${color} px-6 py-4 rounded-xl mb-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl md:text-2xl font-bold flex items-center">
        <span className="text-blue-500">{icon}</span>
        <span className="ml-2">{title}</span>
        <span className="ml-2 text-sm bg-opacity-20 px-2 py-0.5 rounded-full text-gray-900 border-2 border-blue-500">
        {count}
        </span>
      </h2>
      {/* <button
        onClick={toggleOpen}
        className="p-2 rounded-full bg-whit bg-opacity-20 hover:bg-opacity-30 transition-colors"
        aria-label={isOpen ? `Hide ${title}` : `Show ${title}`}
      >
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button> */}
    </motion.div>
  )

  // Empty state component
  const EmptyState = ({ message, filterActive }) => (
    <motion.div
      className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-800 mb-2">No Events Found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      {filterActive && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 transition-colors shadow-sm"
        >
          Clear All Filters
        </button>
      )}
    </motion.div>
  )

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-100 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Welcome to <span className="text-blue-500">Events</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-700 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join us for workshops, webinars, and networking opportunities
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{upcomingEvents.length}</div>
              <div className="text-sm opacity-80 text-gray-900">Upcoming Events</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{ongoingEvents.length}</div>
              <div className="text-sm opacity-80 text-gray-900">Happening Now</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg text-gray-900">
              <div className="text-3xl font-bold">{pastEvents.length}</div>
              <div className="text-sm opacity-80">Past Events</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setCurrentPage(1)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen)
                    setIsCategoryFilterOpen(false)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 ${
                    isFilterOpen || filterStatus
                      ? "bg-purple-50 border-purple-300 text-purple-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>
                    {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}` : "Status"}
                  </span>
                  {filterStatus && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilterStatus("")
                        setCurrentPage(1)
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </button>

                {isFilterOpen && (
                  <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2">
                      {["upcoming", "ongoing", "past", "cancelled"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status)
                            setIsFilterOpen(false)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                            filterStatus === status ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            {getStatusBadge(status).icon}
                            <span className="capitalize">{status}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={categoryFilterRef}>
                <button
                  onClick={() => {
                    setIsCategoryFilterOpen(!isCategoryFilterOpen)
                    setIsFilterOpen(false)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 ${
                    isCategoryFilterOpen || filterCategory
                      ? "bg-purple-50 border-purple-300 text-purple-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  <span>{filterCategory ? `${filterCategory}` : "Category"}</span>
                  {filterCategory && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilterCategory("")
                        setCurrentPage(1)
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </button>

                {isCategoryFilterOpen && categories.length > 0 && (
                  <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setFilterCategory(category)
                            setIsCategoryFilterOpen(false)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                            filterCategory === category ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>{category}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setFilterFeatured(filterFeatured === "" ? "true" : filterFeatured === "true" ? "false" : "")
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 ${
                  filterFeatured !== ""
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Star className="h-4 w-4" />
                <span>{filterFeatured === "true" ? "Featured" : 'Not Featured" : "Featured'}</span>
                {filterFeatured !== "" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterFeatured("")
                      setCurrentPage(1)
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </button>

              {(searchTerm || filterStatus || filterCategory || filterFeatured) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {(searchTerm || filterStatus || filterCategory || filterFeatured) && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchTerm && <span className="bg-gray-100 px-2 py-1 rounded-full">Search: "{searchTerm}"</span>}
                {filterStatus && <span className="bg-gray-100 px-2 py-1 rounded-full">Status: {filterStatus}</span>}
                {filterCategory && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full">Category: {filterCategory}</span>
                )}
                {filterFeatured && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {filterFeatured === "true" ? "Featured" : "Not Featured"}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, index) => (
              <EventSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center shadow-md">
            <p className="text-lg font-medium mb-2">Error Loading Events</p>
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            message={
              searchTerm || filterStatus || filterCategory || filterFeatured
                ? "No events match your current filters. Try adjusting your search criteria."
                : "There are no events at the moment. Please check back later."
            }
            filterActive={searchTerm || filterStatus || filterCategory || filterFeatured}
          />
        ) : (
          <>
            {/* Featured Events Section (if any) */}
            {/* {featuredEvents.length > 0 && !filterStatus && !filterCategory && (
              <div className="mb-16">
                <motion.h2
                  className="text-2xl font-bold mb-6 text-gray-800 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Featured Events
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {featuredEvents.slice(0, 2).map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )} */}

            {/* Upcoming Events Section */}
            {(filterStatus === "upcoming" ? upcomingEvents.length > 0 : upcomingEvents.length > 0) && (
              <div className="mb-16">
                <SectionHeader
                  title="Upcoming Events"
                  count={upcomingEvents.length}
                  isOpen={true}
                  toggleOpen={() => {}} // Always open
                  color=""
                  icon={<Calendar className="h-6 w-6" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Ongoing Events Section */}
            {(filterStatus === "ongoing" ? ongoingEvents.length > 0 : ongoingEvents.length > 0) && (
              <div className="mb-16">
                <SectionHeader
                  title="Happening Now"
                  count={ongoingEvents.length}
                  isOpen={showOngoing || filterStatus === "ongoing"}
                  toggleOpen={() => filterStatus !== "ongoing" && setShowOngoing(!showOngoing)}
                  color="bg-gradient-to-r from-green-600 to-green-700 text-white"
                  icon={<CalendarCheck className="h-6 w-6" />}
                />

                <AnimatePresence>
                  {(showOngoing || filterStatus === "ongoing") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {ongoingEvents.map((event) => (
                          <EventCard key={event._id} event={event} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Past Events Section */}
            {(filterStatus === "past" ? pastEvents.length > 0 : pastEvents.length > 0) && (
              <div className="mb-16">
                <SectionHeader
                  title="Past Events"
                  count={pastEvents.length}
                  isOpen={showPast || filterStatus === "past"}
                  toggleOpen={() => filterStatus !== "past" && setShowPast(!showPast)}
                  color=""
                  icon={<CalendarX className="h-6 w-6" />}
                />

                <AnimatePresence>
                  {(showPast || filterStatus === "past") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {pastEvents.map((event) => (
                          <EventCard key={event._id} event={event} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cancelled Events Section */}
            {(filterStatus === "cancelled" ? cancelledEvents.length > 0 : cancelledEvents.length > 0) && (
              <div className="mb-16">
                <SectionHeader
                  title="Cancelled Events"
                  count={cancelledEvents.length}
                  isOpen={showCancelled || filterStatus === "cancelled"}
                  toggleOpen={() => filterStatus !== "cancelled" && setShowCancelled(!showCancelled)}
                  color="bg-gradient-to-r from-red-600 to-red-700 text-white"
                  icon={<CalendarOff className="h-6 w-6" />}
                />

                <AnimatePresence>
                  {(showCancelled || filterStatus === "cancelled") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {cancelledEvents.map((event) => (
                          <EventCard key={event._id} event={event} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* No events in any category */}
            {upcomingEvents.length === 0 &&
              ongoingEvents.length === 0 &&
              pastEvents.length === 0 &&
              cancelledEvents.length === 0 && (
                <EmptyState
                  message={
                    searchTerm || filterStatus || filterCategory || filterFeatured
                      ? "No events match your current filters. Try adjusting your search criteria."
                      : "There are no events at the moment. Please check back later."
                  }
                  filterActive={searchTerm || filterStatus || filterCategory || filterFeatured}
                />
              )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-12">
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 transition-colors duration-300 hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </motion.button>

                  <div className="hidden md:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1 ||
                          (page === 2 && currentPage === 1) ||
                          (page === totalPages - 1 && currentPage === totalPages)
                        )
                      })
                      .map((page, index, array) => {
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return (
                            <span key={`ellipsis-${page}`} className="px-4 py-2 border rounded-md text-gray-400">
                              ...
                            </span>
                          )
                        }
                        return (
                          <motion.button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border rounded-md transition-colors duration-300 ${
                              currentPage === page
                                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600"
                                : "hover:bg-gray-50"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {page}
                          </motion.button>
                        )
                      })}
                  </div>

                  <span className="flex md:hidden items-center px-4 py-2 border rounded-md">
                    Page {currentPage} of {totalPages}
                  </span>

                  <motion.button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50 transition-colors duration-300 hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
          apiUrl={import.meta.env.VITE_API_URL}
        />
      )}
    </div>
  )
}
