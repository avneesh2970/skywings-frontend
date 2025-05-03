"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Filter,
  Download,
  Eye,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react"

export default function ContactUs() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const modalRef = useRef(null)
  const filterRef = useRef(null)

  // Fetch enquiries from the backend
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/enquiries`)
        setEnquiries(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching enquiries:", err)
        setError("Failed to load enquiries. Please try again later.")
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, [])

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
      if (filterRef.current && !filterRef.current.contains(event.target) && isFilterOpen) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Get unique enquiry types for filter
  const getUniqueEnquiryTypes = () => {
    const types = [...new Set(enquiries.map((enquiry) => enquiry.enquire))]
    return types.sort()
  }

  // Format enquiry type for display
  const formatEnquiryType = (type) => {
    return type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Sort and filter enquiries
  const getSortedEnquiries = () => {
    let sortableEnquiries = [...enquiries]

    // Filter by search term
    if (searchTerm) {
      sortableEnquiries = sortableEnquiries.filter(
        (enquiry) =>
          enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.enquire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.enquireDetail?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by enquiry type
    if (filterType) {
      sortableEnquiries = sortableEnquiries.filter((enquiry) => enquiry.enquire === filterType)
    }

    // Sort
    if (sortConfig.key) {
      sortableEnquiries.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return sortableEnquiries
  }

  // Format date
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

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    )
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = getSortedEnquiries().slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(getSortedEnquiries().length / itemsPerPage)

  // Export to CSV
  const exportToCSV = () => {
    const filteredData = getSortedEnquiries()
    const headers = ["Name", "Email", "Contact", "State", "City", "Enquiry Type", "Enquiry Detail", "Date"]

    const csvRows = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          `"${item.name || ""}"`,
          `"${item.email || ""}"`,
          `"${item.contact || ""}"`,
          `"${item.state || ""}"`,
          `"${item.city || ""}"`,
          `"${formatEnquiryType(item.enquire) || ""}"`,
          `"${(item.enquireDetail || "").replace(/"/g, '""')}"`,
          `"${formatDate(item.createdAt)}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `contact_enquiries_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // View enquiry details
  const viewEnquiryDetails = (enquiry) => {
    setSelectedEnquiry(enquiry)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
       <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-12 px-4 rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> Contacts
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover stories, insights, and knowledge from our community
          </p>
         
        </div>
      </div>
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-700">Contact Submissions</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search submissions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                isFilterOpen || filterType
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="truncate max-w-[100px] sm:max-w-none">
                {filterType ? `Filter: ${formatEnquiryType(filterType)}` : "Filter"}
              </span>
              {filterType && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFilterType("")
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto"
              >
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Filter by Enquiry Type</h3>
                </div>
                <div className="p-2">
                  {getUniqueEnquiryTypes().map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filterType === type ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                      }`}
                    >
                      {formatEnquiryType(type)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={getSortedEnquiries().length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-lg text-gray-600">Loading submissions...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
      ) : getSortedEnquiries().length === 0 ? (
        <div className="text-center py-10 text-gray-500">No submissions found.</div>
      ) : (
        <>
          {/* Desktop Table View - With improved responsive design */}
          <div className="hidden md:block overflow-hidden">
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center gap-1">Name {renderSortIndicator("name")}</div>
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("email")}
                      >
                        <div className="flex items-center gap-1">Email {renderSortIndicator("email")}</div>
                      </th>
                      {/* Contact column - only visible on larger screens */}
                      <th
                        className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("contact")}
                      >
                        <div className="flex items-center gap-1">Contact {renderSortIndicator("contact")}</div>
                      </th>
                      {/* Type column - only visible on larger screens */}
                      <th
                        className="hidden xl:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("enquire")}
                      >
                        <div className="flex items-center gap-1">Type {renderSortIndicator("enquire")}</div>
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">Date {renderSortIndicator("createdAt")}</div>
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4 text-sm font-medium text-gray-900">
                          <div className="truncate max-w-[150px]">{enquiry.name}</div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div className="truncate max-w-[200px]">{enquiry.email}</div>
                        </td>
                        {/* Contact cell - only visible on larger screens */}
                        <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-500">
                          <div className="truncate max-w-[120px]">{enquiry.contact}</div>
                        </td>
                        {/* Type cell - only visible on larger screens */}
                        <td className="hidden xl:table-cell px-3 py-4 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs truncate inline-block max-w-[150px]">
                            {formatEnquiryType(enquiry.enquire)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div className="truncate max-w-[150px]">{formatDate(enquiry.createdAt)}</div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 text-center">
                          <button
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-900 transition-colors"
                            onClick={() => viewEnquiryDetails(enquiry)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Card View - Improved for better readability */}
          <div className="md:hidden space-y-4">
            {currentItems.map((enquiry) => (
              <div
                key={enquiry._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 truncate max-w-[200px]">{enquiry.name}</h3>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs truncate max-w-[100px]">
                    {formatEnquiryType(enquiry.enquire)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{enquiry.email}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{enquiry.contact}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="truncate">
                      {enquiry.city}, {enquiry.state}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{formatDate(enquiry.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
                    onClick={() => viewEnquiryDetails(enquiry)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination - Made more responsive */}
          {getSortedEnquiries().length > itemsPerPage && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, getSortedEnquiries().length)}</span> of{" "}
                  <span className="font-medium">{getSortedEnquiries().length}</span> entries
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`p-2 rounded-md ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  {/* Page Numbers - Simplified for mobile */}
                  <div className="flex items-center">
                    {(() => {
                      // Calculate which page numbers to show
                      let pages = []
                      const maxVisiblePages = window.innerWidth < 640 ? 3 : 5

                      if (totalPages <= maxVisiblePages) {
                        // Show all pages if there are fewer than maxVisiblePages
                        pages = Array.from({ length: totalPages }, (_, i) => i + 1)
                      } else if (currentPage <= 2) {
                        // Near the start
                        pages = Array.from({ length: maxVisiblePages }, (_, i) => i + 1)
                      } else if (currentPage >= totalPages - 1) {
                        // Near the end
                        pages = Array.from({ length: maxVisiblePages }, (_, i) => totalPages - maxVisiblePages + 1 + i)
                      } else {
                        // In the middle
                        const offset = Math.floor(maxVisiblePages / 2)
                        pages = Array.from({ length: maxVisiblePages }, (_, i) => currentPage - offset + i)
                      }

                      return pages.map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-label={`Page ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md transition-colors ${
                            currentPage === pageNum
                              ? "bg-purple-100 text-purple-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Items Per Page Selector - Hidden on small screens */}
                <div className="hidden sm:flex items-center gap-2 order-3">
                  <label htmlFor="items-per-page" className="text-sm text-gray-500">
                    Items per page:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1) // Reset to first page when changing items per page
                    }}
                    className="border rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal - Improved for better content handling */}
      {isModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">Enquiry Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                    <p className="mt-1 text-gray-900 break-words">{selectedEnquiry.name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1 text-gray-900 break-words">{selectedEnquiry.email}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                    <p className="mt-1 text-gray-900 break-words">{selectedEnquiry.contact}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1 text-gray-900 break-words">
                      {selectedEnquiry.city}, {selectedEnquiry.state}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Enquiry Type</h4>
                    <p className="mt-1">
                      <span className="inline-flex px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        {formatEnquiryType(selectedEnquiry.enquire)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date Submitted</h4>
                    <p className="mt-1 text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Enquiry Details
                </h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 break-words">
                  {selectedEnquiry.enquireDetail || "No details provided."}
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
