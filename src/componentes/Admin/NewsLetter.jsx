"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronFirst,
  ChevronLast,
  MoreHorizontal,
} from "lucide-react"

export default function NewsLetter() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalSubscribers, setTotalSubscribers] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [filterStatus, setFilterStatus] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSubscribers, setSelectedSubscribers] = useState([])
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false)
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false)
  const [jumpToPage, setJumpToPage] = useState("")
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const filterRef = useRef(null)
  const bulkActionRef = useRef(null)
  const jumpToPageRef = useRef(null)
  const searchInputRef = useRef(null)
  const dropdownRefs = useRef({})

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch subscribers from the backend
  const fetchSubscribers = useCallback(
    async (showRefreshAnimation = false) => {
      try {
        if (showRefreshAnimation) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/newsletter`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearchTerm,
            status: filterStatus,
            sort: sortConfig.key,
            order: sortConfig.direction,
          },
        })

        setSubscribers(response.data.data)
        setTotalSubscribers(response.data.total)
        setTotalPages(response.data.totalPages)
        setError(null)
      } catch (err) {
        console.error("Error fetching subscribers:", err)
        setError("Failed to load newsletter subscribers. Please try again later.")
        setSubscribers([])
      } finally {
        setLoading(false)
        if (showRefreshAnimation) {
          setTimeout(() => setRefreshing(false), 500)
        }
      }
    },
    [currentPage, itemsPerPage, debouncedSearchTerm, filterStatus, sortConfig],
  )

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  // Reset selected subscribers when page changes
  useEffect(() => {
    setSelectedSubscribers([])
  }, [currentPage, itemsPerPage, debouncedSearchTerm, filterStatus])

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close action menu dropdown when clicking outside
      if (activeDropdown && !dropdownRefs.current[activeDropdown]?.contains(event.target)) {
        setActiveDropdown(null)
      }

      // Handle other dropdowns
      if (filterRef.current && !filterRef.current.contains(event.target) && isFilterOpen) {
        setIsFilterOpen(false)
      }
      if (bulkActionRef.current && !bulkActionRef.current.contains(event.target) && isBulkActionOpen) {
        setIsBulkActionOpen(false)
      }
      if (jumpToPageRef.current && !jumpToPageRef.current.contains(event.target) && isJumpToPageOpen) {
        setIsJumpToPageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen, isBulkActionOpen, isJumpToPageOpen, activeDropdown])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Search focus with Ctrl+K or /
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !isDeleteModalOpen)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Escape to close modals
      if (e.key === "Escape") {
        if (isFilterOpen) setIsFilterOpen(false)
        if (isBulkActionOpen) setIsBulkActionOpen(false)
        if (isDeleteModalOpen) setIsDeleteModalOpen(false)
        if (isJumpToPageOpen) setIsJumpToPageOpen(false)
        if (activeDropdown) setActiveDropdown(null)
      }

      // Pagination with Alt+arrow keys
      if (!isDeleteModalOpen) {
        if (e.altKey && e.key === "ArrowRight" && currentPage < totalPages) {
          e.preventDefault()
          setCurrentPage((prev) => prev + 1)
        } else if (e.altKey && e.key === "ArrowLeft" && currentPage > 1) {
          e.preventDefault()
          setCurrentPage((prev) => prev - 1)
        } else if (e.altKey && e.key === "Home") {
          e.preventDefault()
          setCurrentPage(1)
        } else if (e.altKey && e.key === "End") {
          e.preventDefault()
          setCurrentPage(totalPages)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, totalPages, isFilterOpen, isBulkActionOpen, isDeleteModalOpen, isJumpToPageOpen, activeDropdown])

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
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

  // Toggle selection of a subscriber
  const toggleSubscriberSelection = (id) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((subscriberId) => subscriberId !== id) : [...prev, id],
    )
  }

  // Toggle selection of all subscribers on current page
  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(subscribers.map((subscriber) => subscriber._id))
    }
  }

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Delete subscriber
  const confirmDeleteSubscriber = (subscriber) => {
    setSubscriberToDelete(subscriber)
    setIsDeleteModalOpen(true)
    setActiveDropdown(null) // Close any open dropdown
  }

  const deleteSubscriber = async () => {
    if (!subscriberToDelete) return

    try {
      setDeleteLoading(true)
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/newsletter/${subscriberToDelete._id}`)

      // Remove from local state
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => subscriber._id !== subscriberToDelete._id),
      )

      // Update total count
      setTotalSubscribers((prev) => prev - 1)

      // If we deleted the last item on the page, go to previous page
      if (subscribers.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      toast.success("Subscriber deleted successfully")
    } catch (error) {
      console.error("Error deleting subscriber:", error)
      toast.error("Failed to delete subscriber")
    } finally {
      setDeleteLoading(false)
      setIsDeleteModalOpen(false)
      setSubscriberToDelete(null)
    }
  }

  // Bulk delete subscribers
  const bulkDeleteSubscribers = async () => {
    if (selectedSubscribers.length === 0) return

    try {
      setBulkDeleteLoading(true)

      await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/bulk`, {
        action: "delete",
        ids: selectedSubscribers,
      })

      // Update local state
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => !selectedSubscribers.includes(subscriber._id)),
      )

      setTotalSubscribers((prev) => prev - selectedSubscribers.length)

      toast.success(`Deleted ${selectedSubscribers.length} subscribers successfully`)

      // Clear selection
      setSelectedSubscribers([])
      setIsBulkActionOpen(false)
    } catch (error) {
      console.error("Error performing bulk delete:", error)
      toast.error("Failed to delete subscribers")
    } finally {
      setBulkDeleteLoading(false)
    }
  }

  const bulkUpdateStatus = async (status) => {
    if (selectedSubscribers.length === 0) return

    try {
      setBulkUpdateLoading(true)

      await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/bulk`, {
        action: "update",
        ids: selectedSubscribers,
        status,
      })

      // Update local state
      setSubscribers((prevSubscribers) =>
        prevSubscribers.map((subscriber) =>
          selectedSubscribers.includes(subscriber._id) ? { ...subscriber, status } : subscriber,
        ),
      )

      toast.success(`Updated ${selectedSubscribers.length} subscribers to ${status}`)

      // Clear selection
      setSelectedSubscribers([])
      setIsBulkActionOpen(false)
    } catch (error) {
      console.error("Error performing bulk update:", error)
      toast.error("Failed to update subscribers")
    } finally {
      setBulkUpdateLoading(false)
    }
  }

  // Update subscriber status
  const updateSubscriberStatus = async (id, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/newsletter/${id}`, {
        status,
      })

      // Update the subscriber in the local state
      setSubscribers((prevSubscribers) =>
        prevSubscribers.map((subscriber) => (subscriber._id === id ? { ...subscriber, status } : subscriber)),
      )

      toast.success(`Subscriber status updated to ${status}`)
    } catch (error) {
      console.error("Error updating subscriber status:", error)
      toast.error("Failed to update subscriber status")
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["First Name", "Email", "Status", "Date Subscribed"]

    const csvRows = [
      headers.join(","),
      ...subscribers.map((item) =>
        [
          `"${item.firstName || ""}"`,
          `"${item.email || ""}"`,
          `"${item.status || ""}"`,
          `"${formatDate(item.createdAt)}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${subscribers.length} subscribers to CSV`)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      case "unsubscribed":
        return { color: "bg-gray-100 text-gray-700", icon: <XCircle className="h-3 w-3 mr-1" /> }
      case "bounced":
        return { color: "bg-red-100 text-red-700", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
      default:
        return { color: "bg-blue-100 text-blue-700", icon: <Mail className="h-3 w-3 mr-1" /> }
    }
  }

  // Handle jump to page
  const handleJumpToPage = (e) => {
    e.preventDefault()
    const pageNum = Number.parseInt(jumpToPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
      setIsJumpToPageOpen(false)
      setJumpToPage("")
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}`)
    }
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-purple-700">Newsletter Subscribers</h2>
          <button
            onClick={() => fetchSubscribers(true)}
            className={`p-1 rounded-full hover:bg-gray-100 ${refreshing ? "animate-spin" : ""}`}
            title="Refresh data"
            aria-label="Refresh data"
          >
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search subscribers... (Ctrl+/)"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setCurrentPage(1) // Reset to first page when clearing search
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                isFilterOpen || filterStatus
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>
                {filterStatus ? `Status: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}` : "Status"}
              </span>
              {filterStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFilterStatus("")
                    setCurrentPage(1) // Reset to first page when clearing filter
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>

            {/* Status Filter Dropdown */}
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Filter by Status</h3>
                </div>
                <div className="p-2">
                  {["active", "unsubscribed", "bounced"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status)
                        setIsFilterOpen(false)
                        setCurrentPage(1) // Reset to first page when applying filter
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

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={subscribers.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">{selectedSubscribers.length} selected</span>

          <div className="relative">
            <button
              onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              Bulk Actions
              <ChevronDown className="h-4 w-4" />
            </button>

            {isBulkActionOpen && (
              <div
                ref={bulkActionRef}
                className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => bulkUpdateStatus("active")}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mark as Active
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("unsubscribed")}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4 text-gray-500" />
                    Mark as Unsubscribed
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("bounced")}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Mark as Bounced
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={bulkDeleteSubscribers}
                    disabled={bulkDeleteLoading}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedSubscribers([])}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Selection
          </button>

          {(bulkUpdateLoading || bulkDeleteLoading) && (
            <div className="flex items-center ml-2">
              <Loader2 className="animate-spin h-4 w-4 text-purple-600 mr-1" />
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-lg text-gray-600">Loading subscribers...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
          <Mail className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">No subscribers found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || filterStatus
              ? "Try adjusting your search or filters"
              : "Newsletter subscribers will appear here"}
          </p>
          {(searchTerm || filterStatus) && (
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("")
                setCurrentPage(1)
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto max-w-full">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[40px] px-3 py-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th
                      className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("firstName")}
                    >
                      <div className="flex items-center gap-1">Name {renderSortIndicator("firstName")}</div>
                    </th>
                    <th
                      className="w-[30%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("email")}
                    >
                      <div className="flex items-center gap-1">Email {renderSortIndicator("email")}</div>
                    </th>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("status")}
                    >
                      <div className="flex items-center gap-1">Status {renderSortIndicator("status")}</div>
                    </th>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">Date {renderSortIndicator("createdAt")}</div>
                    </th>
                    <th className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedSubscribers.includes(subscriber._id) ? "bg-purple-50" : ""
                      }`}
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={selectedSubscribers.includes(subscriber._id)}
                            onChange={() => toggleSubscriberSelection(subscriber._id)}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-gray-900">{subscriber.firstName}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{subscriber.email}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="relative group">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              getStatusBadge(subscriber.status).color
                            } cursor-pointer`}
                            onClick={() => toggleDropdown(`status-${subscriber._id}`)}
                          >
                            {getStatusBadge(subscriber.status).icon}
                            <span className="capitalize">{subscriber.status}</span>
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </div>

                          {/* Status Dropdown */}
                          {activeDropdown === `status-${subscriber._id}` && (
                            <div
                              ref={(el) => (dropdownRefs.current[`status-${subscriber._id}`] = el)}
                              className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                            >
                              {["active", "unsubscribed", "bounced"].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    updateSubscriberStatus(subscriber._id, status)
                                    setActiveDropdown(null)
                                  }}
                                  disabled={subscriber.status === status}
                                  className={`w-full text-left px-3 py-2 text-sm ${
                                    subscriber.status === status ? "bg-gray-100 cursor-default" : "hover:bg-gray-50"
                                  } flex items-center gap-2`}
                                >
                                  {getStatusBadge(status).icon}
                                  <span className="capitalize">{status}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{formatDate(subscriber.createdAt)}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        <div className="flex justify-center">
                          <div className="relative">
                            <button
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={() => toggleDropdown(`action-${subscriber._id}`)}
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="h-5 w-5 text-gray-500" />
                            </button>

                            {/* Actions Dropdown - Click-based instead of hover-based */}
                            {activeDropdown === `action-${subscriber._id}` && (
                              <div
                                ref={(el) => (dropdownRefs.current[`action-${subscriber._id}`] = el)}
                                className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                              >
                                <button
                                  onClick={() => confirmDeleteSubscriber(subscriber)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber._id}
                className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
                  selectedSubscribers.includes(subscriber._id) ? "border-purple-300 bg-purple-50" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedSubscribers.includes(subscriber._id)}
                      onChange={() => toggleSubscriberSelection(subscriber._id)}
                    />
                    <h3 className="font-medium text-gray-900">{subscriber.firstName}</h3>
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      getStatusBadge(subscriber.status).color
                    }`}
                  >
                    {getStatusBadge(subscriber.status).icon}
                    <span className="capitalize">{subscriber.status}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{subscriber.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(subscriber.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                  <select
                    value={subscriber.status}
                    onChange={(e) => updateSubscriberStatus(subscriber._id, e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmDeleteSubscriber(subscriber)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {totalSubscribers > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalSubscribers)}</span> of{" "}
                  <span className="font-medium">{totalSubscribers}</span> subscribers
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* First Page Button */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className={`p-2 rounded-md ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronFirst className="h-5 w-5" />
                  </button>

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

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center">
                    {(() => {
                      // Calculate which page numbers to show
                      let pages = []
                      const maxVisiblePages = 5

                      if (totalPages <= maxVisiblePages) {
                        // Show all pages if there are 5 or fewer
                        pages = Array.from({ length: totalPages }, (_, i) => i + 1)
                      } else if (currentPage <= 3) {
                        // Near the start
                        pages = [1, 2, 3, 4, 5]
                      } else if (currentPage >= totalPages - 2) {
                        // Near the end
                        pages = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)
                      } else {
                        // In the middle
                        pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
                      }

                      return pages.map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-label={`Page ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
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

                  {/* Jump to Page Button (Mobile & Desktop) */}
                  <div className="relative">
                    <button
                      onClick={() => setIsJumpToPageOpen(!isJumpToPageOpen)}
                      className="sm:hidden px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      {currentPage} / {totalPages}
                    </button>

                    <button
                      onClick={() => setIsJumpToPageOpen(!isJumpToPageOpen)}
                      className="hidden sm:flex items-center gap-1 px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isJumpToPageOpen && (
                      <div
                        ref={jumpToPageRef}
                        className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 w-64"
                      >
                        <form onSubmit={handleJumpToPage}>
                          <label className="block text-sm text-gray-600 mb-2">Jump to page:</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              max={totalPages}
                              value={jumpToPage}
                              onChange={(e) => setJumpToPage(e.target.value)}
                              className="w-full px-3 py-2 border rounded-md text-sm"
                              placeholder={`1-${totalPages}`}
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                              Go
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
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

                  {/* Last Page Button */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLast className="h-5 w-5" />
                  </button>
                </div>

                {/* Items Per Page Selector */}
                <div className="flex items-center gap-2 order-3">
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
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && subscriberToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Subscriber</h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to delete the subscriber{" "}
                <span className="font-medium">{subscriberToDelete.email}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteSubscriber}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Subscriber</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
