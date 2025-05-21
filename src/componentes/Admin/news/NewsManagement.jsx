"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  FileText,
  X,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Check,
  ChevronRight,
  Tag,
} from "lucide-react"
import { AppContext } from "../../../context/AppContext"
import { Link } from "react-router-dom"

const NewsManagement = () => {
  const { user } = useContext(AppContext)
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [jumpToPage, setJumpToPage] = useState("")
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Bulk actions state
  const [selectedItems, setSelectedItems] = useState([])
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [isStatusSubmenuOpen, setIsStatusSubmenuOpen] = useState(false)
  const [isCategorySubmenuOpen, setIsCategorySubmenuOpen] = useState(false)

  // Status dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  // Category dropdown states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(null)
  const [categoryUpdateLoading, setCategoryUpdateLoading] = useState(false)

  const jumpToPageRef = useRef(null)
  const searchInputRef = useRef(null)
  const bulkActionsRef = useRef(null)
  const statusDropdownRefs = useRef({})
  const categoryDropdownRefs = useRef({})
  const statusSubmenuRef = useRef(null)
  const categorySubmenuRef = useRef(null)

  // Fetch news articles on component mount and when page changes
  useEffect(() => {
    fetchNews()
  }, [currentPage, itemsPerPage])

  // Handle click outside jump to page dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (jumpToPageRef.current && !jumpToPageRef.current.contains(event.target)) {
        setIsJumpToPageOpen(false)
      }

      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target)) {
        setIsBulkActionsOpen(false)
        setIsStatusSubmenuOpen(false)
        setIsCategorySubmenuOpen(false)
      }

      // Don't close status submenu if clicking inside bulk actions menu
      if (isStatusSubmenuOpen && statusSubmenuRef.current && !statusSubmenuRef.current.contains(event.target)) {
        // Check if the click was inside the parent menu
        if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target)) {
          setIsStatusSubmenuOpen(false)
        }
      }

      // Don't close category submenu if clicking inside bulk actions menu
      if (isCategorySubmenuOpen && categorySubmenuRef.current && !categorySubmenuRef.current.contains(event.target)) {
        // Check if the click was inside the parent menu
        if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target)) {
          setIsCategorySubmenuOpen(false)
        }
      }

      // Close status dropdown if clicking outside
      if (statusDropdownOpen) {
        const currentRef = statusDropdownRefs.current[statusDropdownOpen]
        if (currentRef && !currentRef.contains(event.target)) {
          setStatusDropdownOpen(null)
        }
      }

      // Close category dropdown if clicking outside
      if (categoryDropdownOpen) {
        const currentRef = categoryDropdownRefs.current[categoryDropdownOpen]
        if (currentRef && !currentRef.contains(event.target)) {
          setCategoryDropdownOpen(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [
    isJumpToPageOpen,
    isBulkActionsOpen,
    statusDropdownOpen,
    isStatusSubmenuOpen,
    categoryDropdownOpen,
    isCategorySubmenuOpen,
  ])

  // Reset selected items when page changes or news is refreshed
  useEffect(() => {
    setSelectedItems([])
  }, [news])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close modals
      if (e.key === "Escape") {
        if (isJumpToPageOpen) setIsJumpToPageOpen(false)
        if (isBulkActionsOpen) setIsBulkActionsOpen(false)
        if (isStatusSubmenuOpen) setIsStatusSubmenuOpen(false)
        if (isCategorySubmenuOpen) setIsCategorySubmenuOpen(false)
        if (showBulkDeleteConfirm) setShowBulkDeleteConfirm(false)
        if (statusDropdownOpen) setStatusDropdownOpen(null)
        if (categoryDropdownOpen) setCategoryDropdownOpen(null)
      }

      // Pagination with Alt+arrow keys
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

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    currentPage,
    totalPages,
    isJumpToPageOpen,
    isBulkActionsOpen,
    showBulkDeleteConfirm,
    statusDropdownOpen,
    isStatusSubmenuOpen,
    categoryDropdownOpen,
    isCategorySubmenuOpen,
  ])

  const fetchNews = async (showRefreshAnimation = false) => {
    try {
      if (showRefreshAnimation) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      // Replace with your actual API endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
        },
      })
      setNews(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
      setTotalItems(response.data.total || 0)
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Failed to load news articles. Please try again.")
      toast.error("Failed to load news articles")
    } finally {
      setLoading(false)
      if (showRefreshAnimation) {
        setTimeout(() => setRefreshing(false), 500)
      }
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchNews()
  }

  const handleDeleteNews = async (id) => {
    if (confirmDelete === id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/news/${id}`)
        toast.success("News article deleted successfully")
        fetchNews() // Refresh the list
      } catch (err) {
        console.error("Error deleting news:", err)
        toast.error("Failed to delete news article")
      } finally {
        setConfirmDelete(null)
      }
    } else {
      setConfirmDelete(id)
      // Auto-reset after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  // Handle status update for a single news item
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setStatusUpdateLoading(true)

      // Use the specific status update endpoint
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/news/${id}/status`, {
        status: newStatus,
      })

      // Update local state to avoid refetching
      setNews(news.map((item) => (item._id === id ? { ...item, status: newStatus } : item)))

      toast.success(`Status updated to ${newStatus}`)
      setStatusDropdownOpen(null)
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update status: " + (err.response?.data?.message || err.message))
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  // Handle category update for a single news item
  const handleCategoryUpdate = async (id, newCategory) => {
    try {
      setCategoryUpdateLoading(true)

      // Use the specific category update endpoint
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/news/${id}/category`, {
        category: newCategory,
      })

      // Update local state to avoid refetching
      setNews(news.map((item) => (item._id === id ? { ...item, category: newCategory } : item)))

      toast.success(`Category updated to ${newCategory}`)
      setCategoryDropdownOpen(null)
    } catch (err) {
      console.error("Error updating category:", err)
      toast.error("Failed to update category: " + (err.response?.data?.message || err.message))
    } finally {
      setCategoryUpdateLoading(false)
    }
  }

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedItems.length === 0) return

    try {
      setBulkActionLoading(true)

      // Update each selected item using the specific status endpoint
      const updatePromises = selectedItems.map((id) =>
        axios.patch(`${import.meta.env.VITE_API_URL}/api/news/${id}/status`, {
          status: newStatus,
        }),
      )

      await Promise.all(updatePromises)

      // Update local state
      setNews(news.map((item) => (selectedItems.includes(item._id) ? { ...item, status: newStatus } : item)))

      toast.success(
        `Successfully updated ${selectedItems.length} news article${selectedItems.length > 1 ? "s" : ""} to ${newStatus}`,
      )
      setSelectedItems([])
      setIsBulkActionsOpen(false)
      setIsStatusSubmenuOpen(false)
    } catch (err) {
      console.error("Error performing bulk status update:", err)
      toast.error("Failed to update status: " + (err.response?.data?.message || err.message))
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Handle bulk category update
  const handleBulkCategoryUpdate = async (newCategory) => {
    if (selectedItems.length === 0) return

    try {
      setBulkActionLoading(true)

      // Update each selected item using the specific category endpoint
      const updatePromises = selectedItems.map((id) =>
        axios.patch(`${import.meta.env.VITE_API_URL}/api/news/${id}/category`, {
          category: newCategory,
        }),
      )

      await Promise.all(updatePromises)

      // Update local state
      setNews(news.map((item) => (selectedItems.includes(item._id) ? { ...item, category: newCategory } : item)))

      toast.success(
        `Successfully updated ${selectedItems.length} news article${selectedItems.length > 1 ? "s" : ""} to ${newCategory}`,
      )
      setSelectedItems([])
      setIsBulkActionsOpen(false)
      setIsCategorySubmenuOpen(false)
    } catch (err) {
      console.error("Error performing bulk category update:", err)
      toast.error("Failed to update category: " + (err.response?.data?.message || err.message))
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Export selected items to CSV
  const exportSelectedToCSV = () => {
    if (selectedItems.length === 0) return

    // Filter news items that are selected
    const selectedNews = news.filter((item) => selectedItems.includes(item._id))

    // Create CSV content
    let csvContent = "Title,Description,Author,Date,Status,Category,Tags\n"

    selectedNews.forEach((item) => {
      // Clean up description to avoid CSV issues
      const cleanDescription = item.description ? item.description.replace(/,/g, " ").replace(/\n/g, " ") : ""

      // Format date
      const formattedDate = new Date(item.date).toLocaleDateString()

      // Format tags
      const tags = item.tags ? item.tags.join("; ") : ""

      // Add row to CSV
      csvContent += `"${item.title}","${cleanDescription}","${item.author}","${formattedDate}","${item.status}","${item.category || "general"}","${tags}"\n`
    })

    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "news-export.csv")
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Clean up
    document.body.removeChild(link)
    toast.success(`Exported ${selectedItems.length} news articles to CSV`)
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

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedItems.length === news.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(news.map((item) => item._id))
    }
  }

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    try {
      setBulkActionLoading(true)

      // Delete each selected item
      const deletePromises = selectedItems.map((id) => axios.delete(`${import.meta.env.VITE_API_URL}/api/news/${id}`))

      await Promise.all(deletePromises)

      toast.success(`Successfully deleted ${selectedItems.length} news article${selectedItems.length > 1 ? "s" : ""}`)
      setSelectedItems([])
      setShowBulkDeleteConfirm(false)
      setIsBulkActionsOpen(false)
      fetchNews()
    } catch (err) {
      console.error("Error performing bulk delete:", err)
      toast.error("Failed to delete some or all news articles")
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Calculate the range of items being displayed
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">News Management</h1>
          <button
            onClick={() => fetchNews(true)}
            className={`p-1 rounded-full hover:bg-gray-100 ${refreshing ? "animate-spin" : ""}`}
            title="Refresh data"
            aria-label="Refresh data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setCurrentPage(1)
                    fetchNews()
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Bulk Actions Dropdown */}
          {selectedItems.length > 0 && (
            <div className="relative" ref={bulkActionsRef}>
              <button
                onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 whitespace-nowrap"
                disabled={bulkActionLoading}
              >
                {bulkActionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                )}
                <span>Bulk Actions ({selectedItems.length})</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>

              {isBulkActionsOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    {/* Status Update Option with Submenu */}
                    <div className="relative">
                      <button
                        onClick={() => setIsStatusSubmenuOpen(!isStatusSubmenuOpen)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        disabled={bulkActionLoading}
                      >
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-2" />
                          <span>Update Status</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Status Submenu */}
                      {isStatusSubmenuOpen && (
                        <div
                          ref={statusSubmenuRef}
                          className="absolute left-full top-0 mt-0 ml-0 w-36 bg-white rounded-md shadow-lg border border-gray-200"
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleBulkStatusUpdate("published")}
                              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-green-50"
                              disabled={bulkActionLoading}
                            >
                              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                              Published
                            </button>
                            <button
                              onClick={() => handleBulkStatusUpdate("draft")}
                              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-yellow-50"
                              disabled={bulkActionLoading}
                            >
                              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                              Draft
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category Update Option with Submenu */}
                    <div className="relative">
                      <button
                        onClick={() => setIsCategorySubmenuOpen(!isCategorySubmenuOpen)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        disabled={bulkActionLoading}
                      >
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2" />
                          <span>Update Category</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Category Submenu */}
                      {isCategorySubmenuOpen && (
                        <div
                          ref={categorySubmenuRef}
                          className="absolute left-full top-0 mt-0 ml-0 w-36 bg-white rounded-md shadow-lg border border-gray-200"
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleBulkCategoryUpdate("general")}
                              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                              disabled={bulkActionLoading}
                            >
                              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                              General
                            </button>
                            <button
                              onClick={() => handleBulkCategoryUpdate("company")}
                              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-purple-50"
                              disabled={bulkActionLoading}
                            >
                              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                              Company
                            </button>
                            <button
                              onClick={() => handleBulkCategoryUpdate("client")}
                              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50"
                              disabled={bulkActionLoading}
                            >
                              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                              Client
                            </button>
                            <button
                              onClick={() => handleBulkCategoryUpdate("industry")}
                              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-orange-50"
                              disabled={bulkActionLoading}
                            >
                              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                              Industry
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowBulkDeleteConfirm(true)
                        setIsBulkActionsOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      disabled={bulkActionLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </button>

                    <button
                      onClick={exportSelectedToCSV}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      disabled={bulkActionLoading}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Selected to CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            to="/admin/dashboard/news/create"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          >
            <Plus className="h-5 w-5 mr-1" />
            <span>Add News</span>
          </Link>
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Bulk Delete</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete {selectedItems.length} selected news article
              {selectedItems.length > 1 ? "s" : ""}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={bulkActionLoading}
              >
                {bulkActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading news articles...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 sm:p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No news articles found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery ? "Try adjusting your search term" : "Get started by creating a new news article."}
          </p>
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("")
                setCurrentPage(1)
                fetchNews()
              }}
              className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Search
            </button>
          ) : (
            <Link
              to="/admin/dashboard/news/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add News
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={selectedItems.length === news.length && news.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((item) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-50 ${selectedItems.includes(item._id) ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => toggleSelectItem(item._id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={`${import.meta.env.VITE_API_URL}${item.image}`}
                                alt={item.title}
                              />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative" ref={(el) => (statusDropdownRefs.current[item._id] = el)}>
                          <button
                            onClick={() => setStatusDropdownOpen(statusDropdownOpen === item._id ? null : item._id)}
                            className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                              item.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                            disabled={statusUpdateLoading}
                          >
                            {statusUpdateLoading && statusDropdownOpen === item._id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : null}
                            {item.status === "published" ? "Published" : "Draft"}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </button>

                          {statusDropdownOpen === item._id && (
                            <div className="absolute z-10 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => handleStatusUpdate(item._id, "published")}
                                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                    item.status === "published"
                                      ? "bg-green-50 text-green-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  disabled={statusUpdateLoading}
                                >
                                  {item.status === "published" && <Check className="h-4 w-4 mr-2" />}
                                  Published
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(item._id, "draft")}
                                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                    item.status === "draft"
                                      ? "bg-yellow-50 text-yellow-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  disabled={statusUpdateLoading}
                                >
                                  {item.status === "draft" && <Check className="h-4 w-4 mr-2" />}
                                  Draft
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative" ref={(el) => (categoryDropdownRefs.current[item._id] = el)}>
                          <button
                            onClick={() => setCategoryDropdownOpen(categoryDropdownOpen === item._id ? null : item._id)}
                            className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                              item.category === "company"
                                ? "bg-purple-100 text-purple-800"
                                : item.category === "client"
                                  ? "bg-blue-100 text-blue-800"
                                  : item.category === "industry"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                            disabled={categoryUpdateLoading}
                          >
                            {categoryUpdateLoading && categoryDropdownOpen === item._id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : null}
                            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "General"}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </button>

                          {categoryDropdownOpen === item._id && (
                            <div className="absolute z-10 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => handleCategoryUpdate(item._id, "general")}
                                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                    !item.category || item.category === "general"
                                      ? "bg-gray-50 text-gray-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  disabled={categoryUpdateLoading}
                                >
                                  {(!item.category || item.category === "general") && (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  General
                                </button>
                                <button
                                  onClick={() => handleCategoryUpdate(item._id, "company")}
                                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                    item.category === "company"
                                      ? "bg-purple-50 text-purple-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  disabled={categoryUpdateLoading}
                                >
                                  {item.category === "company" && <Check className="h-4 w-4 mr-2" />}
                                  Company
                                </button>
                                <button
                                  onClick={() => handleCategoryUpdate(item._id, "client")}
                                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                    item.category === "client"
                                      ? "bg-blue-50 text-blue-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  disabled={categoryUpdateLoading}
                                >
                                  {item.category === "client" && <Check className="h-4 w-4 mr-2" />}
                                  Client
                                </button>
                                <button
                                  onClick={() => handleCategoryUpdate(item._id, "industry")}
                                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                    item.category === "industry"
                                      ? "bg-orange-50 text-orange-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                  disabled={categoryUpdateLoading}
                                >
                                  {item.category === "industry" && <Check className="h-4 w-4 mr-2" />}
                                  Industry
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/dashboard/news/edit/${item._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteNews(item._id)}
                            className={`${
                              confirmDelete === item._id
                                ? "text-red-600 hover:text-red-900"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                        {confirmDelete === item._id && (
                          <div className="text-xs text-red-600 mt-1">Click again to confirm</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View - Only visible on mobile */}
          <div className="md:hidden space-y-4">
            {news.map((item) => (
              <div
                key={item._id}
                className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                  selectedItems.includes(item._id) ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleSelectItem(item._id)}
                    />
                  </div>
                  {item.image && (
                    <div className="flex-shrink-0">
                      <img
                        className="h-14 w-14 rounded-md object-cover"
                        src={`${import.meta.env.VITE_API_URL}${item.image}`}
                        alt={item.title}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 break-words">{item.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="relative" ref={(el) => (statusDropdownRefs.current[`mobile-${item._id}`] = el)}>
                        <button
                          onClick={() =>
                            setStatusDropdownOpen(
                              statusDropdownOpen === `mobile-${item._id}` ? null : `mobile-${item._id}`,
                            )
                          }
                          className={`px-2 py-0.5 text-xs leading-none font-medium rounded-full inline-flex items-center ${
                            item.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                          disabled={statusUpdateLoading}
                        >
                          {statusUpdateLoading && statusDropdownOpen === `mobile-${item._id}` ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : null}
                          {item.status === "published" ? "Published" : "Draft"}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </button>

                        {statusDropdownOpen === `mobile-${item._id}` && (
                          <div className="absolute z-10 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleStatusUpdate(item._id, "published")}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                  item.status === "published"
                                    ? "bg-green-50 text-green-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={statusUpdateLoading}
                              >
                                {item.status === "published" && <Check className="h-4 w-4 mr-2" />}
                                Published
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(item._id, "draft")}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                  item.status === "draft"
                                    ? "bg-yellow-50 text-yellow-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={statusUpdateLoading}
                              >
                                {item.status === "draft" && <Check className="h-4 w-4 mr-2" />}
                                Draft
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add category dropdown for mobile */}
                      <div
                        className="relative ml-2"
                        ref={(el) => (categoryDropdownRefs.current[`mobile-category-${item._id}`] = el)}
                      >
                        <button
                          onClick={() =>
                            setCategoryDropdownOpen(
                              categoryDropdownOpen === `mobile-category-${item._id}`
                                ? null
                                : `mobile-category-${item._id}`,
                            )
                          }
                          className={`px-2 py-0.5 text-xs leading-none font-medium rounded-full inline-flex items-center ${
                            item.category === "company"
                              ? "bg-purple-100 text-purple-800"
                              : item.category === "client"
                                ? "bg-blue-100 text-blue-800"
                                : item.category === "industry"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                          disabled={categoryUpdateLoading}
                        >
                          {categoryUpdateLoading && categoryDropdownOpen === `mobile-category-${item._id}` ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : null}
                          {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "General"}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </button>

                        {categoryDropdownOpen === `mobile-category-${item._id}` && (
                          <div className="absolute z-10 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleCategoryUpdate(item._id, "general")}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                  !item.category || item.category === "general"
                                    ? "bg-gray-50 text-gray-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={categoryUpdateLoading}
                              >
                                {(!item.category || item.category === "general") && <Check className="h-4 w-4 mr-2" />}
                                General
                              </button>
                              <button
                                onClick={() => handleCategoryUpdate(item._id, "company")}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                  item.category === "company"
                                    ? "bg-purple-50 text-purple-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={categoryUpdateLoading}
                              >
                                {item.category === "company" && <Check className="h-4 w-4 mr-2" />}
                                Company
                              </button>
                              <button
                                onClick={() => handleCategoryUpdate(item._id, "client")}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                  item.category === "client"
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={categoryUpdateLoading}
                              >
                                {item.category === "client" && <Check className="h-4 w-4 mr-2" />}
                                Client
                              </button>
                              <button
                                onClick={() => handleCategoryUpdate(item._id, "industry")}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                                  item.category === "industry"
                                    ? "bg-orange-50 text-orange-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                disabled={categoryUpdateLoading}
                              >
                                {item.category === "industry" && <Check className="h-4 w-4 mr-2" />}
                                Industry
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mt-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="break-words">{item.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>

                  {item.description && (
                    <div className="flex items-start gap-2 mt-1">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 line-clamp-2 break-words">{item.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                  <Link
                    to={`/admin/dashboard/news/edit/${item._id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteNews(item._id)}
                    className={`flex items-center ${
                      confirmDelete === item._id ? "text-red-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span>{confirmDelete === item._id ? "Confirm" : "Delete"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination - Similar to Newsletter Component */}
          {totalItems > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
                  <span className="font-medium">{indexOfLastItem}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> entries
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

                  {/* Page Numbers - Hidden on mobile */}
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
                              ? "bg-blue-100 text-blue-700 font-medium"
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
                              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                    className="border rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NewsManagement
