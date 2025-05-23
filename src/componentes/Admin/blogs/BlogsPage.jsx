"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { Link } from "react-router-dom"
import { formatDate, truncateText, extractTextFromHtml } from "../../../utils/helpers"
import axios from "axios"
import {
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  PenSquare,
  X,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  User,
  CheckSquare,
  Square,
  Loader2,
  FileText,
  Send,
  Heart,
} from "lucide-react"
import { AppContext } from "../../../context/AppContext"

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [sortOption, setSortOption] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all") // New status filter
  const { posts, loading, error, fetchPosts } = useContext(AppContext)

  // Add state variables for date range filter after the existing state declarations
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [jumpToPage, setJumpToPage] = useState("")
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Bulk actions state
  const [selectedPosts, setSelectedPosts] = useState([])
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false)
  const [deleteProgress, setDeleteProgress] = useState(0)
  const [deleteErrors, setDeleteErrors] = useState([])

  const jumpToPageRef = useRef(null)
  const bulkActionsRef = useRef(null)

  let totalPages = 0 // Declare totalPages here

  // Update the useEffect that handles filtering to include date range filtering
  useEffect(() => {
    if (posts.length > 0) {
      let filtered = [...posts]

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            extractTextFromHtml(post.content).toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((post) => post.status === statusFilter)
      }

      // Add date range filtering
      if (startDate || endDate) {
        filtered = filtered.filter((post) => {
          const postDate = new Date(post.createdAt).setHours(0, 0, 0, 0)

          if (startDate && endDate) {
            const start = new Date(startDate).setHours(0, 0, 0, 0)
            const end = new Date(endDate).setHours(23, 59, 59, 999)
            return postDate >= start && postDate <= end
          } else if (startDate) {
            const start = new Date(startDate).setHours(0, 0, 0, 0)
            return postDate >= start
          } else if (endDate) {
            const end = new Date(endDate).setHours(23, 59, 59, 999)
            return postDate <= end
          }

          return true
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOption === "newest" ? dateB - dateA : dateA - dateB
      })

      setFilteredPosts(filtered)
      // Reset to first page when filters change
      setCurrentPage(1)
    } else {
      setFilteredPosts([])
    }
  }, [posts, searchTerm, sortOption, statusFilter, startDate, endDate])

  // Reset selected posts when page changes or posts are filtered
  useEffect(() => {
    setSelectedPosts([])
  }, [currentPage, filteredPosts])

  // Handle click outside jump to page dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (jumpToPageRef.current && !jumpToPageRef.current.contains(event.target)) {
        setIsJumpToPageOpen(false)
      }
      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target)) {
        setIsBulkActionsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isJumpToPageOpen, isBulkActionsOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close modals
      if (e.key === "Escape") {
        if (isJumpToPageOpen) setIsJumpToPageOpen(false)
        if (showFilters) setShowFilters(false)
        if (isBulkActionsOpen) setIsBulkActionsOpen(false)
        if (isConfirmDeleteOpen) setIsConfirmDeleteOpen(false)
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
  }, [currentPage, totalPages, isJumpToPageOpen, showFilters, isBulkActionsOpen, isConfirmDeleteOpen])

  // Handle jump to page
  const handleJumpToPage = (e) => {
    e.preventDefault()
    const pageNum = Number.parseInt(jumpToPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
      setIsJumpToPageOpen(false)
      setJumpToPage("")
    } else {
      alert(`Please enter a page number between 1 and ${totalPages}`)
    }
  }

  // Refresh posts
  const handleRefresh = () => {
    setRefreshing(true)
    fetchPosts()
    setTimeout(() => {
      setRefreshing(false)
      setSelectedPosts([])
    }, 800)
  }

  // Handle post selection
  const togglePostSelection = (postId) => {
    setSelectedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId)
      } else {
        return [...prev, postId]
      }
    })
  }

  // Handle select all posts
  const toggleSelectAll = () => {
    if (selectedPosts.length === currentItems.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(currentItems.map((post) => post._id))
    }
  }

  // Handle bulk status change
  const handleBulkStatusChange = async (newStatus) => {
    setIsBulkActionsOpen(false)

    try {
      let successCount = 0
      const errors = []

      for (const postId of selectedPosts) {
        try {
          const post = currentItems.find((p) => p._id === postId)
          if (post) {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/blog/posts/${postId}`, {
              ...post,
              status: newStatus,
            })
            successCount++
          }
        } catch (error) {
          console.error(`Error updating post ${postId}:`, error)
          errors.push(postId)
        }
      }

      // Refresh the posts list
      fetchPosts()

      // Show result message
      if (errors.length === 0) {
        alert(`Successfully updated ${successCount} posts to ${newStatus}`)
      } else {
        alert(`Updated ${successCount} posts. Failed to update ${errors.length} posts.`)
      }

      // Clear selection
      setSelectedPosts([])
    } catch (error) {
      console.error("Error in bulk status change operation:", error)
      alert("An error occurred during the bulk status change operation")
    }
  }

  // Handle single post delete
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blog/posts/${postId}`)
      fetchPosts() // Refresh the posts list
      return true
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error)
      return false
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    setIsDeleting(true)
    setIsBulkActionsOpen(false)
    setDeleteProgress(0)
    setDeleteErrors([])

    try {
      let successCount = 0
      const errors = []

      // Process posts one by one to track progress
      for (let i = 0; i < selectedPosts.length; i++) {
        const postId = selectedPosts[i]
        try {
          const success = await handleDeletePost(postId)
          if (success) {
            successCount++
          } else {
            errors.push(postId)
          }
        } catch (error) {
          console.error(`Error deleting post ${postId}:`, error)
          errors.push(postId)
        }

        // Update progress
        setDeleteProgress(Math.round(((i + 1) / selectedPosts.length) * 100))
      }

      setDeleteErrors(errors)

      // Refresh the posts list
      fetchPosts()

      // Show result message
      if (errors.length === 0) {
        alert(`Successfully deleted ${successCount} posts`)
      } else {
        alert(`Deleted ${successCount} posts. Failed to delete ${errors.length} posts.`)
      }

      // Clear selection
      setSelectedPosts([])
    } catch (error) {
      console.error("Error in bulk delete operation:", error)
      alert("An error occurred during the bulk delete operation")
    } finally {
      setIsDeleting(false)
      setIsConfirmDeleteOpen(false)
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = filteredPosts.length
  totalPages = Math.ceil(totalItems / itemsPerPage) // Assign totalPages here

  // Add a function to clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setStartDate("")
    setEndDate("")
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-red-600 text-xl font-semibold mb-3">Error Loading Posts</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-8 sm:py-10 md:py-12 px-4 rounded-xl mb-6 sm:mb-8 md:mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> Blog
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto">
            Discover stories, insights, and knowledge from our community
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No blog posts yet</h2>
              <p className="text-gray-600 mb-6">Be the first to share your thoughts and ideas!</p>
              <Link
                to="/admin/dashboard/blog-post/editor"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition"
              >
                <span>Create Your First Post</span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Blog Management</h1>
                {searchTerm && (
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {filteredPosts.length} results
                  </span>
                )}
                <button
                  onClick={handleRefresh}
                  className={`p-1 rounded-full hover:bg-gray-100 ${refreshing ? "animate-spin" : ""}`}
                  title="Refresh posts"
                  aria-label="Refresh posts"
                >
                  <RefreshCw className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <form onSubmit={(e) => e.preventDefault()} className="flex w-full sm:w-auto">
                  <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>

                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  <Link
                    to="/admin/dashboard/blog-post/editor"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                  >
                    <PenSquare size={16} />
                    <span>New Post</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="Start date"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="End date"
                      />
                    </div>
                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate("")
                          setEndDate("")
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear dates
                      </button>
                    )}
                  </div>
                </div>
                {(searchTerm || statusFilter !== "all" || startDate || endDate) && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bulk Actions */}
            {selectedPosts.length > 0 && (
              <div className="mb-4 flex items-center bg-blue-50 p-2 rounded-md">
                <span className="ml-2 text-sm font-medium text-blue-700">
                  {selectedPosts.length} {selectedPosts.length === 1 ? "post" : "posts"} selected
                </span>
                <div className="ml-auto relative" ref={bulkActionsRef}>
                  <button
                    onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                  >
                    <span>Bulk Actions</span>
                    <ChevronDown size={16} />
                  </button>
                  {isBulkActionsOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                      <button
                        onClick={() => handleBulkStatusChange("published")}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <Send size={16} className="mr-2" />
                        Publish Selected
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange("draft")}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        <FileText size={16} className="mr-2" />
                        Move to Draft
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setIsConfirmDeleteOpen(true)
                          setIsBulkActionsOpen(false)
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Confirmation Modal for Bulk Delete */}
            {isConfirmDeleteOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                  <div className="flex items-center text-red-600 mb-4">
                    <AlertCircle size={24} className="mr-2" />
                    <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                  </div>

                  {isDeleting ? (
                    <div className="mb-6">
                      <p className="text-gray-600 mb-3">Deleting {selectedPosts.length} posts...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${deleteProgress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 text-right">{deleteProgress}% complete</p>
                    </div>
                  ) : (
                    <p className="mb-6 text-gray-600">
                      Are you sure you want to delete {selectedPosts.length} selected{" "}
                      {selectedPosts.length === 1 ? "post" : "posts"}? This action cannot be undone.
                    </p>
                  )}

                  <div className="flex justify-end gap-3">
                    {!isDeleting && (
                      <button
                        onClick={() => setIsConfirmDeleteOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredPosts.length === 0 && searchTerm ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">No posts found matching "{searchTerm}"</p>
                <button onClick={() => setSearchTerm("")} className="text-blue-600 hover:text-blue-700 font-medium">
                  Clear search
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-2 py-3 text-left w-10">
                            <div className="flex items-center">
                              <button
                                onClick={toggleSelectAll}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={
                                  selectedPosts.length === currentItems.length ? "Deselect all" : "Select all"
                                }
                              >
                                {selectedPosts.length === currentItems.length && currentItems.length > 0 ? (
                                  <CheckSquare size={18} className="text-blue-600" />
                                ) : (
                                  <Square size={18} />
                                )}
                              </button>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Post
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                          >
                            Author
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                          >
                            Views
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                          >
                            Likes
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((post) => (
                          <tr
                            key={post._id}
                            className={`hover:bg-gray-50 ${selectedPosts.includes(post._id) ? "bg-blue-50" : ""}`}
                          >
                            <td className="px-2 py-4 whitespace-nowrap w-10">
                              <div className="flex items-center">
                                <button
                                  onClick={() => togglePostSelection(post._id)}
                                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                  aria-label={selectedPosts.includes(post._id) ? "Deselect" : "Select"}
                                >
                                  {selectedPosts.includes(post._id) ? (
                                    <CheckSquare size={18} className="text-blue-600" />
                                  ) : (
                                    <Square size={18} />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                {post.featuredImage && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img
                                      className="h-10 w-10 rounded-md object-cover"
                                      src={post.featuredImage || "/placeholder.svg"}
                                      alt={post.title}
                                    />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">{post.title}</div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {truncateText(extractTextFromHtml(post.content), 50)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap w-20">
                              <div className="text-sm text-gray-500 truncate">{post.author || "Anonymous"}</div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap w-20">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                  post.status,
                                )}`}
                              >
                                {post.status === "published" ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap w-16">
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="h-4 w-4 mr-1 text-gray-400" />
                                {post.views || 0}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap w-16">
                              <div className="flex items-center text-sm text-gray-500">
                                <Heart className="h-4 w-4 mr-1 text-gray-400" />
                                {post.likes || 0}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap w-24">
                              <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
                              <div className="flex items-center justify-end space-x-1">
                                <Link
                                  to={`/admin/dashboard/blog-post/${post._id}`}
                                  className="text-gray-600 hover:text-gray-900 p-1"
                                  title="View"
                                >
                                  <Eye size={16} />
                                  <span className="sr-only">View</span>
                                </Link>
                                <Link
                                  to={`/admin/dashboard/blog-post/editor/${post._id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                  <span className="sr-only">Edit</span>
                                </Link>
                                <button
                                  onClick={async () => {
                                    if (confirm("Are you sure you want to delete this post?")) {
                                      const success = await handleDeletePost(post._id)
                                      if (success) {
                                        alert("Post deleted successfully")
                                      } else {
                                        alert("Failed to delete post")
                                      }
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
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

                {/* Mobile Card View - Only visible on mobile and tablet */}
                <div className="lg:hidden space-y-4">
                  {currentItems.map((post) => (
                    <div
                      key={post._id}
                      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                        selectedPosts.includes(post._id) ? "border-blue-500 bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <button
                          onClick={() => togglePostSelection(post._id)}
                          className="mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={selectedPosts.includes(post._id) ? "Deselect" : "Select"}
                        >
                          {selectedPosts.includes(post._id) ? (
                            <CheckSquare size={20} className="text-blue-600" />
                          ) : (
                            <Square size={20} />
                          )}
                        </button>
                        {post.featuredImage && (
                          <div className="flex-shrink-0">
                            <img
                              className="h-14 w-14 rounded-md object-cover"
                              src={post.featuredImage || "/placeholder.svg"}
                              alt={post.title}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 break-words">{post.title}</h3>
                            <span
                              className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeColor(
                                post.status,
                              )}`}
                            >
                              {post.status === "published" ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {truncateText(extractTextFromHtml(post.content), 80)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="break-words truncate">{post.author || "Anonymous"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{formatDate(post.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{post.views || 0} views</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{post.likes || 0} likes</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                        <Link
                          to={`/admin/dashboard/blog-post/${post._id}`}
                          className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span>View</span>
                        </Link>
                        <Link
                          to={`/admin/dashboard/blog-post/editor/${post._id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this post?")) {
                              const success = await handleDeletePost(post._id)
                              if (success) {
                                alert("Post deleted successfully")
                              } else {
                                alert("Failed to delete post")
                              }
                            }
                          }}
                          className="flex items-center text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalItems > 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      {/* Pagination Info */}
                      <div className="text-sm text-gray-500 order-2 sm:order-1">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
                        <span className="font-medium">{totalItems}</span> posts
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
                          Posts per page:
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
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BlogsPage
