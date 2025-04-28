import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Tag, Star, Search, Filter, ChevronDown, X, ArrowLeft, ArrowRight, Clock, Users, ExternalLink } from 'lucide-react';

export default function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "startDate",
    direction: "asc",
  });

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', 9); // Show 9 events per page
        
        if (searchTerm) params.append('search', searchTerm);
        if (filterStatus) params.append('status', filterStatus);
        if (filterCategory) params.append('category', filterCategory);
        if (filterFeatured) params.append('featured', filterFeatured);
        params.append('sort', sortConfig.key);
        params.append('order', sortConfig.direction);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events?${params.toString()}`);
        
        setEvents(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalEvents(response.data.total);
        
        // Extract unique categories for filtering
        const uniqueCategories = [...new Set(response.data.data.map(event => event.category))];
        setCategories(uniqueCategories);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchTerm, filterStatus, filterCategory, filterFeatured, sortConfig]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return { color: "bg-blue-100 text-blue-700", icon: <Calendar className="h-3 w-3 mr-1" /> };
      case "ongoing":
        return { color: "bg-green-100 text-green-700", icon: <Calendar className="h-3 w-3 mr-1" /> };
      case "past":
        return { color: "bg-gray-100 text-gray-700", icon: <Calendar className="h-3 w-3 mr-1" /> };
      case "cancelled":
        return { color: "bg-red-100 text-red-700", icon: <Calendar className="h-3 w-3 mr-1" /> };
      default:
        return { color: "bg-purple-100 text-purple-700", icon: <Calendar className="h-3 w-3 mr-1" /> };
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterCategory("");
    setFilterFeatured("");
    setCurrentPage(1);
  };

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-purple-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Join us for workshops, webinars, and networking opportunities
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  setIsCategoryFilterOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
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
                      e.stopPropagation();
                      setFilterStatus("");
                      setCurrentPage(1);
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
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
                          setFilterStatus(status);
                          setIsFilterOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
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

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCategoryFilterOpen(!isCategoryFilterOpen);
                  setIsFilterOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                  isCategoryFilterOpen || filterCategory
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Tag className="h-4 w-4" />
                <span>
                  {filterCategory ? `${filterCategory}` : "Category"}
                </span>
                {filterCategory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterCategory("");
                      setCurrentPage(1);
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
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
                          setFilterCategory(category);
                          setIsCategoryFilterOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
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

            {/* Featured Filter */}
            <button
              onClick={() => {
                setFilterFeatured(filterFeatured === "" ? "true" : filterFeatured === "true" ? "false" : "");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                filterFeatured !== ""
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Star className="h-4 w-4" />
              <span>
                {filterFeatured === "true" ? "Featured" : filterFeatured === "false" ? "Not Featured" : "Featured"}
              </span>
              {filterFeatured !== "" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterFeatured("");
                    setCurrentPage(1);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>

            {/* Clear Filters */}
            {(searchTerm || filterStatus || filterCategory || filterFeatured) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
            <p className="text-lg font-medium mb-2">Error Loading Events</p>
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus || filterCategory || filterFeatured
                ? "No events match your current filters. Try adjusting your search criteria."
                : "There are no upcoming events at the moment. Please check back later."}
            </p>
            {(searchTerm || filterStatus || filterCategory || filterFeatured) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gray-200">
                    {event.imageUrl ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${event.imageUrl}`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg?height=200&width=400&query=event";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100">
                        <Calendar className="h-16 w-16 text-purple-300" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 ${getStatusBadge(event.status).color} px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
                      {getStatusBadge(event.status).icon}
                      <span className="capitalize">{event.status}</span>
                    </div>
                    
                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {/* Date and Time */}
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <div>{formatDate(event.startDate)}</div>
                          {event.endDate && event.startDate !== event.endDate && (
                            <div className="text-gray-500">to {formatDate(event.endDate)}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      
                      {/* Category */}
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                          {event.category}
                        </span>
                      </div>
                      
                      {/* Capacity if available */}
                      {event.capacity > 0 && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span>Capacity: {event.capacity}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                    
                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 flex gap-2">
                      <a
                        href={`/event/${event._id}`}
                        className="flex-grow px-4 py-2 bg-purple-600 text-white text-center rounded-md hover:bg-purple-700 transition-colors"
                      >
                        View Details
                      </a>
                      
                      {event.registrationUrl && event.status !== "past" && event.status !== "cancelled" && (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                        >
                          Register
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  <div className="hidden md:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and pages around current page
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1 ||
                          (page === 2 && currentPage === 1) ||
                          (page === totalPages - 1 && currentPage === totalPages)
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis where needed
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return (
                            <span
                              key={`ellipsis-${page}`}
                              className="px-4 py-2 border rounded-md text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border rounded-md ${
                              currentPage === page ? "bg-purple-600 text-white" : ""
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                  </div>

                  <span className="flex md:hidden items-center px-4 py-2 border rounded-md">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}