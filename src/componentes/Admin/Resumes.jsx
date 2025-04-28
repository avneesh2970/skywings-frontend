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
  Eye,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Mail,
  FileText,
  Briefcase,
  User,
  MapPinIcon,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  RefreshCw,
  ChevronFirst,
  ChevronLast,
} from "lucide-react"

export default function Resumes() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedResume, setSelectedResume] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [totalResumes, setTotalResumes] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dateFilter, setDateFilter] = useState("all")
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  const [jumpToPage, setJumpToPage] = useState("")
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  const [notesChanged, setNotesChanged] = useState(false)
  const [notesCharCount, setNotesCharCount] = useState(0)

  const modalRef = useRef(null)
  const filterRef = useRef(null)
  const dateFilterRef = useRef(null)
  const jumpToPageRef = useRef(null)
  const searchInputRef = useRef(null)

  // Fetch resumes from the backend
  const fetchResumes = useCallback(
    async (showRefreshAnimation = false) => {
      try {
        if (showRefreshAnimation) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        // Build query parameters
        const queryParams = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus,
          sort: sortConfig.key,
          order: sortConfig.direction,
        }

        // Add date filtering if applicable
        if (dateFilter === "custom" && customDateRange.startDate && customDateRange.endDate) {
          queryParams.startDate = customDateRange.startDate
          queryParams.endDate = customDateRange.endDate
        } else if (dateFilter !== "all") {
          const today = new Date()
          const startDate = new Date()

          switch (dateFilter) {
            case "today":
              startDate.setHours(0, 0, 0, 0)
              break
            case "yesterday":
              startDate.setDate(today.getDate() - 1)
              startDate.setHours(0, 0, 0, 0)
              break
            case "thisWeek":
              startDate.setDate(today.getDate() - today.getDay())
              startDate.setHours(0, 0, 0, 0)
              break
            case "thisMonth":
              startDate.setDate(1)
              startDate.setHours(0, 0, 0, 0)
              break
            case "lastMonth":
              startDate.setMonth(today.getMonth() - 1)
              startDate.setDate(1)
              startDate.setHours(0, 0, 0, 0)
              break
            default:
              break
          }

          queryParams.startDate = startDate.toISOString()
          queryParams.endDate = today.toISOString()
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes`, { params: queryParams })

        setResumes(response.data.data)
        setTotalResumes(response.data.total)
        setTotalPages(response.data.totalPages)
      } catch (err) {
        console.error("Error fetching resumes:", err)
        setError("Failed to load resumes. Please try again later.")
        toast.error("Failed to load resumes")
      } finally {
        setLoading(false)
        if (showRefreshAnimation) {
          setTimeout(() => setRefreshing(false), 500)
        }
      }
    },
    [currentPage, itemsPerPage, searchTerm, filterStatus, sortConfig, dateFilter, customDateRange],
  )

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  // Handle click outside modals
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
      if (filterRef.current && !filterRef.current.contains(event.target) && isFilterOpen) {
        setIsFilterOpen(false)
      }
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target) && isDateFilterOpen) {
        setIsDateFilterOpen(false)
      }
      if (jumpToPageRef.current && !jumpToPageRef.current.contains(event.target) && isJumpToPageOpen) {
        setIsJumpToPageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen, isDateFilterOpen, isJumpToPageOpen])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      // Search shortcut: Ctrl+/
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Close modal: Escape
      if (e.key === "Escape") {
        if (isModalOpen) setIsModalOpen(false)
        if (isFilterOpen) setIsFilterOpen(false)
        if (isDateFilterOpen) setIsDateFilterOpen(false)
        if (isJumpToPageOpen) setIsJumpToPageOpen(false)
        if (isDeleteModalOpen) setIsDeleteModalOpen(false)
      }

      // Pagination shortcuts
      if (!isModalOpen && !isDeleteModalOpen) {
        // Next page: Alt+Right
        if (e.altKey && e.key === "ArrowRight" && currentPage < totalPages) {
          e.preventDefault()
          setCurrentPage((prev) => prev + 1)
        }

        // Previous page: Alt+Left
        if (e.altKey && e.key === "ArrowLeft" && currentPage > 1) {
          e.preventDefault()
          setCurrentPage((prev) => prev - 1)
        }

        // First page: Alt+Home
        if (e.altKey && e.key === "Home") {
          e.preventDefault()
          setCurrentPage(1)
        }

        // Last page: Alt+End
        if (e.altKey && e.key === "End") {
          e.preventDefault()
          setCurrentPage(totalPages)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentPage, totalPages, isModalOpen, isFilterOpen, isDateFilterOpen, isJumpToPageOpen, isDeleteModalOpen])

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

  // View resume details
  const viewResumeDetails = (resume) => {
    setSelectedResume(resume)
    setNotes(resume.notes || "")
    setNotesCharCount((resume.notes || "").length)
    setNotesChanged(false)
    setNotesSaved(false)
    setIsModalOpen(true)
  }

  // Update resume status
  const updateResumeStatus = async (id, status) => {
    try {
      setStatusUpdateLoading(true)
      setNotesSaved(false)

      // Prepare the data to update - include both status and notes
      const updateData = {
        status: status || selectedResume.status, // Use the provided status or keep the current one
        notes: notes, // Always send the current notes from the textarea
      }

      // Make the API call
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, updateData)

      if (response.data && response.data.data) {
        // Update the resume in the local state
        setResumes((prevResumes) =>
          prevResumes.map((resume) => (resume._id === id ? { ...resume, ...updateData } : resume)),
        )

        // Update the selected resume if it's the one being edited
        if (selectedResume && selectedResume._id === id) {
          setSelectedResume({ ...selectedResume, ...updateData })
        }

        // Show success feedback
        setNotesSaved(true)
        setNotesChanged(false)

        // Show toast only when status changes
        if (status && status !== selectedResume.status) {
          toast.success(`Status updated to ${status}`)
        } else {
          toast.success("Notes saved successfully")
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Error updating resume:", error)
      toast.error("Failed to update resume: " + (error.response?.data?.message || error.message))
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  // Delete resume
  const confirmDeleteResume = (resume) => {
    setResumeToDelete(resume)
    setIsDeleteModalOpen(true)
  }

  const deleteResume = async () => {
    if (!resumeToDelete) return

    try {
      setDeleteLoading(true)
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/resumes/${resumeToDelete._id}`)

      // Remove from local state
      setResumes((prevResumes) => prevResumes.filter((resume) => resume._id !== resumeToDelete._id))

      // Close modals
      setIsDeleteModalOpen(false)
      if (selectedResume && selectedResume._id === resumeToDelete._id) {
        setIsModalOpen(false)
      }

      // Update total count
      setTotalResumes((prev) => prev - 1)

      // If we deleted the last item on the page, go to previous page
      if (resumes.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      toast.success("Resume deleted successfully")
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    } finally {
      setDeleteLoading(false)
      setResumeToDelete(null)
    }
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return { color: "bg-blue-100 text-blue-700", icon: <Clock className="h-3 w-3 mr-1" /> }
      case "reviewed":
        return { color: "bg-purple-100 text-purple-700", icon: <Eye className="h-3 w-3 mr-1" /> }
      case "contacted":
        return { color: "bg-yellow-100 text-yellow-700", icon: <Mail className="h-3 w-3 mr-1" /> }
      case "interviewed":
        return { color: "bg-orange-100 text-orange-700", icon: <User className="h-3 w-3 mr-1" /> }
      case "rejected":
        return { color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3 mr-1" /> }
      case "hired":
        return { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      default:
        return { color: "bg-gray-100 text-gray-700", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Contact",
      "Job Applied For",
      "State",
      "City",
      "Status",
      "Date Submitted",
      "Notes",
    ]

    const csvRows = [
      headers.join(","),
      ...resumes.map((item) =>
        [
          `"${item.fullName || ""}"`,
          `"${item.email || ""}"`,
          `"${item.contactNumber || ""}"`,
          `"${item.jobAppliedFor || ""}"`,
          `"${item.state || ""}"`,
          `"${item.city || ""}"`,
          `"${item.status || ""}"`,
          `"${formatDate(item.createdAt)}"`,
          `"${item.notes?.replace(/"/g, '""') || ""}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `resume_submissions_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  // Apply date filter
  const applyDateFilter = () => {
    setCurrentPage(1) // Reset to first page when applying filter
    setIsDateFilterOpen(false)
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-purple-700">Resume Submissions</h2>
          <button
            onClick={() => fetchResumes(true)}
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
              placeholder="Search resumes... (Ctrl+/)"
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
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto"
              >
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Filter by Status</h3>
                </div>
                <div className="p-2">
                  {["new", "reviewed", "contacted", "interviewed", "rejected", "hired"].map((status) => (
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

          {/* Date Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                isDateFilterOpen || dateFilter !== "all"
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>
                {dateFilter === "all"
                  ? "Date"
                  : dateFilter === "custom"
                    ? "Custom Date"
                    : dateFilter === "today"
                      ? "Today"
                      : dateFilter === "yesterday"
                        ? "Yesterday"
                        : dateFilter === "thisWeek"
                          ? "This Week"
                          : dateFilter === "thisMonth"
                            ? "This Month"
                            : "Last Month"}
              </span>
              {dateFilter !== "all" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDateFilter("all")
                    setCurrentPage(1) // Reset to first page when clearing filter
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>

            {/* Date Filter Dropdown */}
            {isDateFilterOpen && (
              <div
                ref={dateFilterRef}
                className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Filter by Date</h3>
                </div>
                <div className="p-2">
                  {[
                    { id: "all", label: "All Time" },
                    { id: "today", label: "Today" },
                    { id: "yesterday", label: "Yesterday" },
                    { id: "thisWeek", label: "This Week" },
                    { id: "thisMonth", label: "This Month" },
                    { id: "lastMonth", label: "Last Month" },
                    { id: "custom", label: "Custom Range" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setDateFilter(option.id)
                        if (option.id !== "custom") {
                          setIsDateFilterOpen(false)
                          setCurrentPage(1) // Reset to first page when applying filter
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilter === option.id ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Custom date range */}
                  {dateFilter === "custom" && (
                    <div className="p-3 border-t border-gray-200 mt-2">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={customDateRange.startDate}
                            onChange={(e) => setCustomDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={customDateRange.endDate}
                            onChange={(e) => setCustomDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </div>
                        <button
                          onClick={applyDateFilter}
                          disabled={!customDateRange.startDate || !customDateRange.endDate}
                          className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={resumes.length === 0}
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
          <span className="ml-2 text-lg text-gray-600">Loading resumes...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No resume submissions found.</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto max-w-full">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("fullName")}
                    >
                      <div className="flex items-center gap-1">Name {renderSortIndicator("fullName")}</div>
                    </th>
                    <th
                      className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer truncate"
                      onClick={() => requestSort("email")}
                    >
                      <div className="flex items-center gap-1">Email {renderSortIndicator("email")}</div>
                    </th>
                    <th
                      className="hidden lg:table-cell w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("jobAppliedFor")}
                    >
                      <div className="flex items-center gap-1">Position {renderSortIndicator("jobAppliedFor")}</div>
                    </th>
                    <th
                      className="hidden xl:table-cell w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("state")}
                    >
                      <div className="flex items-center gap-1">Location {renderSortIndicator("state")}</div>
                    </th>
                    <th
                      className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                  {resumes.map((resume) => (
                    <tr key={resume._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4 text-sm font-medium text-gray-900 truncate">{resume.fullName}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 truncate">{resume.email}</td>
                      <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-500 truncate">
                        {resume.jobAppliedFor}
                      </td>
                      <td className="hidden xl:table-cell px-3 py-4 text-sm text-gray-500 truncate">
                        {resume.city}, {resume.state}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadge(resume.status).color}`}
                        >
                          {getStatusBadge(resume.status).icon}
                          <span className="capitalize">{resume.status}</span>
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 truncate">{formatDate(resume.createdAt)}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-900 transition-colors"
                            onClick={() => viewResumeDetails(resume)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </button>
                          <button
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-900 transition-colors"
                            onClick={() => confirmDeleteResume(resume)}
                            title="Delete resume"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
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
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{resume.fullName}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadge(resume.status).color}`}
                  >
                    {getStatusBadge(resume.status).icon}
                    <span className="capitalize">{resume.status}</span>
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{resume.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{resume.jobAppliedFor}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {resume.city}, {resume.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(resume.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
                    onClick={() => viewResumeDetails(resume)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                    onClick={() => confirmDeleteResume(resume)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {totalResumes > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalResumes)}</span> of{" "}
                  <span className="font-medium">{totalResumes}</span> entries
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

      {/* Detail Modal */}
      {isModalOpen && selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-900">Resume Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                    <p className="mt-1 text-gray-900">{selectedResume.fullName}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1 text-gray-900">
                      <a href={`mailto:${selectedResume.email}`} className="text-blue-600 hover:underline">
                        {selectedResume.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                    <p className="mt-1 text-gray-900">
                      <a href={`tel:${selectedResume.contactNumber}`} className="text-blue-600 hover:underline">
                        {selectedResume.contactNumber}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Job Applied For</h4>
                    <p className="mt-1 text-gray-900">{selectedResume.jobAppliedFor}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1 text-gray-900">
                      {selectedResume.city}, {selectedResume.state}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date Submitted</h4>
                    <p className="mt-1 text-gray-900">{formatDate(selectedResume.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">Resume</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{selectedResume.resumeFileName}</span>
                  </div>
                  {selectedResume.resumeUrl && (
                    <a
                      href={`${import.meta.env.VITE_API_URL}${selectedResume.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {["new", "reviewed", "contacted", "interviewed", "rejected", "hired"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateResumeStatus(selectedResume._id, status)}
                      disabled={statusUpdateLoading}
                      className={`px-3 py-2 rounded-md text-xs font-medium capitalize flex flex-col items-center justify-center ${
                        selectedResume.status === status
                          ? `${getStatusBadge(status).color} ring-2 ring-offset-2 ring-purple-500`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getStatusBadge(status).icon}
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    const newNotes = e.target.value
                    setNotes(newNotes)
                    setNotesCharCount(newNotes.length)
                    setNotesChanged(newNotes !== selectedResume?.notes)
                    if (notesSaved) setNotesSaved(false)
                  }}
                  className={`mt-2 w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    notesChanged ? "border-yellow-400 focus:ring-yellow-500" : "focus:ring-purple-500"
                  } ${notesSaved ? "bg-green-50 border-green-300" : ""}`}
                  placeholder="Add notes about this candidate..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>{notesCharCount}/1000 characters</span>
                  {notesChanged && <span className="text-yellow-600">Unsaved changes</span>}
                  {notesSaved && <span className="text-green-600">✓ Saved</span>}
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => updateResumeStatus(selectedResume._id, selectedResume.status)}
                disabled={statusUpdateLoading || (!notesChanged && !notesSaved)}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  notesChanged
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : notesSaved
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {statusUpdateLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    <span>Saving...</span>
                  </>
                ) : notesSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Notes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && resumeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Resume</h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to delete the resume for{" "}
                <span className="font-medium">{resumeToDelete.fullName}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteResume}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Resume</span>
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
