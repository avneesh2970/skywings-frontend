"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { Link } from "react-router-dom"
import { formatDate, truncateText, extractTextFromHtml } from "../../../utils/helpers"
import {
  Calendar,
  Clock,
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
} from "lucide-react"
import { AppContext } from "../../../context/AppContext"

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [sortOption, setSortOption] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const { posts, loading, error } = useContext(AppContext)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [jumpToPage, setJumpToPage] = useState("")
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const jumpToPageRef = useRef(null)

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
  }, [posts, searchTerm, sortOption])

  // Handle click outside jump to page dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (jumpToPageRef.current && !jumpToPageRef.current.contains(event.target)) {
        setIsJumpToPageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isJumpToPageOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close modals
      if (e.key === "Escape") {
        if (isJumpToPageOpen) setIsJumpToPageOpen(false)
        if (showFilters) setShowFilters(false)
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
  }, [currentPage])

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
    // Simulate refresh - in a real app, you would fetch posts again
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = filteredPosts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

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
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-12 px-4 rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> Blog
          </h1>
          <p className="text-lg text-gray-600 mb-8">Discover stories, insights, and knowledge from our community</p>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
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
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{searchTerm ? "Search Results" : "Latest Posts"}</h2>
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

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="ml-2 bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                <Link
                  to="/admin/dashboard/blog-post/editor"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <PenSquare size={18} />
                  <span>New Post</span>
                </Link>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Additional filters could go here */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                      <input
                        type="date"
                        className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            {filteredPosts.length === 0 && searchTerm ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">No posts found matching {searchTerm}</p>
                <button onClick={() => setSearchTerm("")} className="text-blue-600 hover:text-blue-700 font-medium">
                  Clear search
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((post) => (
                    <Link
                      key={post._id}
                      to={`/admin/dashboard/blog-post/${post._id}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        {post.featuredImage ? (
                          <div className="aspect-[16/9] bg-gray-100">
                            <img
                              src={post.featuredImage || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-5 flex-grow flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {truncateText(extractTextFromHtml(post.content), 120)}
                        </p>
                        <div className="mt-auto flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>5 min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalItems > 0 && (
                  <div className="mt-10 border-t border-gray-100 pt-6">
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
                          <option value={6}>6</option>
                          <option value={9}>9</option>
                          <option value={12}>12</option>
                          <option value={24}>24</option>
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
