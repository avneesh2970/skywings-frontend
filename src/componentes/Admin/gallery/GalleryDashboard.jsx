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
  Download,
  ArrowLeft,
  ArrowRight,
  Tag,
  Star,
  ImageIcon,
  ChevronFirst,
  ChevronLast,
  CheckSquare,
  Square,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Eye,
  Heart,
  Upload,
  Grid,
  List,
} from "lucide-react"

export default function GalleryDashboard() {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc", // This ensures newest first
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20) // Optimized for 4-column layout (4x5 = 20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [filterCategory, setFilterCategory] = useState("")
  const [filterFeatured, setFilterFeatured] = useState("")
  const [filterActive, setFilterActive] = useState("")
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [jumpToPage, setJumpToPage] = useState("")
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [viewMode, setViewMode] = useState("table") // Changed default to table

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    tags: "",
    featured: false,
    isActive: true,
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [categories, setCategories] = useState([
    "nature",
    "urban",
    "portrait",
    "landscape",
    "event",
    "product",
    "other",
  ])

  // Bulk actions state
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)

  // Refs
  const categoryFilterRef = useRef(null)
  const jumpToPageRef = useRef(null)
  const searchInputRef = useRef(null)
  const modalRef = useRef(null)
  const dropdownRefs = useRef({})
  const bulkActionRef = useRef(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch gallery items
  const fetchGalleryItems = useCallback(
    async (showRefreshAnimation = false) => {
      try {
        if (showRefreshAnimation) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        const queryParams = {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchTerm,
          category: filterCategory,
          featured: filterFeatured,
          isActive: filterActive,
          sort: sortConfig.key,
          order: sortConfig.direction,
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`, { params: queryParams })

        setGalleryItems(response.data.data || [])
        setTotalItems(response.data.total || 0)
        setTotalPages(response.data.totalPages || 1)
        setError(null)

        // Clear selected items when fetching new data
        setSelectedItems([])
        setSelectAll(false)
      } catch (err) {
        console.error("Error fetching gallery items:", err)
        setError("Failed to load gallery items. Please try again later.")
        setGalleryItems([])
      } finally {
        setLoading(false)
        if (showRefreshAnimation) {
          setTimeout(() => setRefreshing(false), 500)
        }
      }
    },
    [currentPage, itemsPerPage, debouncedSearchTerm, filterCategory, filterFeatured, filterActive, sortConfig],
  )

  useEffect(() => {
    fetchGalleryItems()
  }, [fetchGalleryItems])

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (activeDropdown && !dropdownRefs.current[activeDropdown]?.contains(event.target)) {
        setActiveDropdown(null)
      }

      if (isBulkActionOpen && bulkActionRef.current && !bulkActionRef.current.contains(event.target)) {
        setIsBulkActionOpen(false)
      }

      if (categoryFilterRef.current && !categoryFilterRef.current.contains(event.target) && isCategoryFilterOpen) {
        setIsCategoryFilterOpen(false)
      }

      if (jumpToPageRef.current && !jumpToPageRef.current.contains(event.target) && isJumpToPageOpen) {
        setIsJumpToPageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCategoryFilterOpen, isJumpToPageOpen, activeDropdown, isBulkActionOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !isModalOpen && !isDeleteModalOpen)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      if (e.key === "Escape") {
        if (isCategoryFilterOpen) setIsCategoryFilterOpen(false)
        if (isJumpToPageOpen) setIsJumpToPageOpen(false)
        if (activeDropdown) setActiveDropdown(null)
        if (isBulkActionOpen) setIsBulkActionOpen(false)
      }

      if (!isModalOpen && !isDeleteModalOpen && !isBulkDeleteModalOpen) {
        if (e.altKey && e.key === "ArrowRight" && currentPage < totalPages) {
          e.preventDefault()
          setCurrentPage((prev) => prev + 1)
        } else if (e.altKey && e.key === "ArrowLeft" && currentPage > 1) {
          e.preventDefault()
          setCurrentPage((prev) => prev - 1)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    currentPage,
    totalPages,
    isCategoryFilterOpen,
    isJumpToPageOpen,
    activeDropdown,
    isModalOpen,
    isDeleteModalOpen,
    isBulkActionOpen,
    isBulkDeleteModalOpen,
  ])

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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
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

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Open modal to add new item
  const openAddItemModal = () => {
    setIsEditing(false)
    setEditingItemId(null)
    setFormData({
      title: "",
      description: "",
      category: "other",
      tags: "",
      featured: false,
      isActive: true,
    })
    setSelectedImage(null)
    setImagePreview("")
    setFormErrors({})
    setIsModalOpen(true)
  }

  // Open modal to edit item
  const openEditItemModal = (item) => {
    setIsEditing(true)
    setEditingItemId(item._id)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags ? item.tags.join(", ") : "",
      featured: item.featured,
      isActive: item.isActive,
    })
    setSelectedImage(null)
    setImagePreview(item.imageUrl ? `${import.meta.env.VITE_API_URL}${item.imageUrl}` : "")
    setFormErrors({})
    setIsModalOpen(true)
    setActiveDropdown(null)
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size exceeds 10MB limit")
        e.target.value = ""
        return
      }

      const fileType = file.type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

      if (!validTypes.includes(fileType)) {
        toast.error("Only JPEG, JPG, PNG, WEBP, and GIF files are allowed")
        e.target.value = ""
        return
      }

      setSelectedImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      if (formErrors.image) {
        setFormErrors((prev) => ({ ...prev, image: undefined }))
      }
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.category.trim()) errors.category = "Category is required"

    if (!isEditing && !selectedImage && !imagePreview) {
      errors.image = "Image is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly")
      return
    }

    setFormSubmitting(true)

    try {
      const submitFormData = new FormData()

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          submitFormData.append(key, formData[key])
        }
      })

      if (selectedImage) {
        submitFormData.append("image", selectedImage)
      }

      if (isEditing) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/gallery/${editingItemId}`, submitFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        toast.success("Gallery item updated successfully!")
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/gallery`, submitFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        toast.success("Gallery item created successfully!")
      }

      setIsModalOpen(false)
      fetchGalleryItems()
    } catch (error) {
      console.error("Error submitting gallery item:", error)
      toast.error(error.response?.data?.message || "Failed to save gallery item. Please try again later.")
    } finally {
      setFormSubmitting(false)
    }
  }

  // Confirm delete item
  const confirmDeleteItem = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
    setActiveDropdown(null)
  }

  // Delete item
  const deleteItem = async () => {
    if (!itemToDelete) return

    try {
      setDeleteLoading(true)
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/gallery/${itemToDelete._id}`)

      setGalleryItems((prevItems) => prevItems.filter((item) => item._id !== itemToDelete._id))

      if (selectedItems.includes(itemToDelete._id)) {
        setSelectedItems((prev) => prev.filter((id) => id !== itemToDelete._id))
      }

      setTotalItems((prev) => prev - 1)

      if (galleryItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      toast.success("Gallery item deleted successfully")
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast.error("Failed to delete gallery item")
    } finally {
      setDeleteLoading(false)
      setItemToDelete(null)
    }
  }

  // Handle checkbox selection
  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(galleryItems.map((item) => item._id))
    }
    setSelectAll(!selectAll)
  }

  // Check if all visible items are selected
  useEffect(() => {
    if (galleryItems.length > 0 && selectedItems.length === galleryItems.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedItems, galleryItems])

  // Bulk delete
  const performBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected")
      return
    }

    try {
      setBulkActionLoading(true)

      await axios.post(`${import.meta.env.VITE_API_URL}/api/gallery/bulk-delete`, { ids: selectedItems })

      setGalleryItems((prev) => prev.filter((item) => !selectedItems.includes(item._id)))

      setTotalItems((prev) => prev - selectedItems.length)

      if (selectedItems.length === galleryItems.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      toast.success(`Deleted ${selectedItems.length} items successfully`)
      setIsBulkDeleteModalOpen(false)

      setSelectedItems([])
      setSelectAll(false)
      setIsBulkActionOpen(false)
    } catch (error) {
      console.error("Error performing bulk delete:", error)
      toast.error("Failed to delete items")
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Title",
      "Description",
      "Category",
      "Tags",
      "Featured",
      "Active",
      "Views",
      "Likes",
      "File Size",
      "Dimensions",
      "Format",
      "Created Date",
    ]

    const csvRows = [
      headers.join(","),
      ...galleryItems.map((item) =>
        [
          `"${item.title || ""}"`,
          `"${(item.description || "").replace(/"/g, '""')}"`,
          `"${item.category || ""}"`,
          `"${(item.tags || []).join("; ")}"`,
          `"${item.featured ? "Yes" : "No"}"`,
          `"${item.isActive ? "Yes" : "No"}"`,
          `"${item.views || 0}"`,
          `"${item.likes || 0}"`,
          `"${formatFileSize(item.fileSize)}"`,
          `"${item.dimensions ? `${item.dimensions.width}x${item.dimensions.height}` : "N/A"}"`,
          `"${item.format || "N/A"}"`,
          `"${formatDate(item.createdAt)}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `gallery_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${galleryItems.length} items to CSV`)
  }

  // Export selected items to CSV
  const exportSelectedToCSV = () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected for export")
      return
    }

    // Filter gallery items to only include selected ones
    const selectedGalleryItems = galleryItems.filter((item) => selectedItems.includes(item._id))

    if (selectedGalleryItems.length === 0) {
      toast.error("Selected items not found")
      return
    }

    const headers = [
      "Title",
      "Description",
      "Category",
      "Tags",
      "Featured",
      "Active",
      "Views",
      "Likes",
      "File Size",
      "Dimensions",
      "Format",
      "Created Date",
    ]

    const csvRows = [
      headers.join(","),
      ...selectedGalleryItems.map((item) =>
        [
          `"${item.title || ""}"`,
          `"${(item.description || "").replace(/"/g, '""')}"`,
          `"${item.category || ""}"`,
          `"${(item.tags || []).join("; ")}"`,
          `"${item.featured ? "Yes" : "No"}"`,
          `"${item.isActive ? "Yes" : "No"}"`,
          `"${item.views || 0}"`,
          `"${item.likes || 0}"`,
          `"${formatFileSize(item.fileSize)}"`,
          `"${item.dimensions ? `${item.dimensions.width}x${item.dimensions.height}` : "N/A"}"`,
          `"${item.format || "N/A"}"`,
          `"${formatDate(item.createdAt)}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `selected_gallery_${selectedItems.length}_items_${new Date().toISOString().slice(0, 10)}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${selectedGalleryItems.length} selected items to CSV`)

    // Clear selection after export
    setSelectedItems([])
    setSelectAll(false)
    setIsBulkActionOpen(false)
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-12 px-4 rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gallery <span className="text-purple-600">Management</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">Manage your media gallery with ease</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-purple-700">Gallery Items</h2>
          <button
            onClick={() => fetchGalleryItems(true)}
            className={`p-1 rounded-full hover:bg-gray-100 ${refreshing ? "animate-spin" : ""}`}
            title="Refresh data"
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
              placeholder="Search gallery... (Ctrl+/)"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                isCategoryFilterOpen || filterCategory
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>{filterCategory ? `Category: ${filterCategory}` : "Category"}</span>
              {filterCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFilterCategory("")
                    setCurrentPage(1)
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>

            {isCategoryFilterOpen && (
              <div
                ref={categoryFilterRef}
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Filter by Category</h3>
                </div>
                <div className="p-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setFilterCategory(category)
                        setIsCategoryFilterOpen(false)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filterCategory === category ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        <span className="capitalize">{category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterFeatured(filterFeatured === "" ? "true" : filterFeatured === "true" ? "false" : "")
                setCurrentPage(1)
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
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 ${
                viewMode === "table" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${
                viewMode === "grid" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={galleryItems.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          {/* Add Item Button */}
          <button
            onClick={openAddItemModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Image</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">{selectedItems.length} selected</span>

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
                className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsBulkActionOpen(false)
                      exportSelectedToCSV()
                    }}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Selected to CSV
                  </button>
                  <button
                    onClick={() => {
                      setIsBulkActionOpen(false)
                      setIsBulkDeleteModalOpen(true)
                    }}
                    disabled={bulkActionLoading}
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
            onClick={() => setSelectedItems([])}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Selection
          </button>

          {bulkActionLoading && (
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
          <span className="ml-2 text-lg text-gray-600">Loading gallery...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">No images found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || filterCategory || filterFeatured !== ""
              ? "Try adjusting your search or filters"
              : "Images will appear here once uploaded"}
          </p>
          {(searchTerm || filterCategory || filterFeatured !== "") && (
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("")
                setFilterFeatured("")
                setCurrentPage(1)
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Table View */}
          {viewMode === "table" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[5%] px-3 py-3 text-left">
                      <button onClick={handleSelectAll} className="text-gray-500 hover:text-gray-700">
                        {selectAll ? (
                          <CheckSquare className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </th>
                    <th className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th
                      className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("title")}
                    >
                      <div className="flex items-center gap-1">Title {renderSortIndicator("title")}</div>
                    </th>
                    <th
                      className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("category")}
                    >
                      <div className="flex items-center gap-1">Category {renderSortIndicator("category")}</div>
                    </th>
                    <th className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Info
                    </th>
                    <th className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">Created {renderSortIndicator("createdAt")}</div>
                    </th>
                    <th className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {galleryItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <button
                          onClick={() => handleSelectItem(item._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {selectedItems.includes(item._id) ? (
                            <CheckSquare className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-4">
                        <div className="relative w-16 h-16">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${item.imageUrl}` || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover rounded"
                          />
                          {item.featured && (
                            <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{item.tags.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">{item.category}</span>
                      </td>
                      <td className="px-3 py-4 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{item.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{item.likes || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs">{formatFileSize(item.fileSize)}</span>
                          <span className="text-xs">
                            {item.dimensions ? `${item.dimensions.width}×${item.dimensions.height}` : "N/A"}
                          </span>
                          <span className="text-xs uppercase">{item.format || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                          {item.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                      <td className="px-3 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => toggleDropdown(`table-item-${item._id}`)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Actions
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </button>

                          {activeDropdown === `table-item-${item._id}` && (
                            <div
                              ref={(el) => (dropdownRefs.current[`table-item-${item._id}`] = el)}
                              className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => openEditItemModal(item)}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => confirmDeleteItem(item)}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                >
                  {/* Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => handleSelectItem(item._id)}
                      className="text-white hover:text-gray-200 focus:outline-none bg-black bg-opacity-50 rounded p-1"
                    >
                      {selectedItems.includes(item._id) ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Actions Dropdown - Fixed positioning */}
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={() => toggleDropdown(`grid-item-${item._id}`)}
                      className="text-white hover:text-gray-200 focus:outline-none bg-black bg-opacity-50 rounded p-1"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {activeDropdown === `grid-item-${item._id}` && (
                      <div
                        ref={(el) => (dropdownRefs.current[`grid-item-${item._id}`] = el)}
                        className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteItem(item)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${item.imageUrl}` || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Featured badge */}
                    {item.featured && (
                      <div className="absolute bottom-2 left-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      </div>
                    )}

                    {/* Status indicator */}
                    {!item.isActive && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Inactive</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 mb-1 truncate text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2 h-8">{item.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{item.likes || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* File info */}
                    <div className="text-xs text-gray-500 mb-2">
                      <div className="flex justify-between items-center">
                        <span>{formatFileSize(item.fileSize)}</span>
                        <span>{item.dimensions ? `${item.dimensions.width}×${item.dimensions.height}` : "N/A"}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>

                      <div className="flex items-center gap-1">
                        {item.isActive ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                        {item.featured && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> items
                </div>

                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronFirst className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setIsJumpToPageOpen(!isJumpToPageOpen)}
                      className="flex items-center gap-1 px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isJumpToPageOpen && (
                      <div
                        ref={jumpToPageRef}
                        className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 w-64"
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

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLast className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 order-3">
                  <label className="text-sm text-gray-500">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="border rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={20}>20</option>
                    <option value={32}>32</option>
                    <option value={40}>40</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Gallery Item" : "Add New Gallery Item"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.title ? "border-red-300 focus:ring-red-500" : "focus:ring-purple-500"
                    }`}
                    placeholder="Enter image title"
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.description ? "border-red-300 focus:ring-red-500" : "focus:ring-purple-500"
                    }`}
                    placeholder="Enter image description"
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.category ? "border-red-300 focus:ring-red-500" : "focus:ring-purple-500"
                      }`}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {!isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 ${
                      formErrors.image ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-purple-500"
                    } transition-colors cursor-pointer`}
                    onClick={() => document.getElementById("imageInput").click()}
                  >
                    <input
                      type="file"
                      id="imageInput"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-40 object-contain mb-2"
                        />
                        <p className="text-sm text-gray-500">Click to change image</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP, GIF (max 10MB)</p>
                      </div>
                    )}
                  </div>
                  {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Featured image</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Active</label>
                  </div>
                </div>
              </form>
            </div>

            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={formSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center"
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditing ? "Update" : "Create"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteItem}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Bulk Delete</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete {selectedItems.length} selected items? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={performBulkDelete}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {bulkActionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
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
