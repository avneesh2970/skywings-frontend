"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
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
  FileText,
  ChevronFirst,
  ChevronLast,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  MoreHorizontal,
  AlertCircle,
  Copy,
  SlidersHorizontal,
} from "lucide-react";

export default function ContactUs() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // New state for bulk actions and status management
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesChanged, setNotesChanged] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesCharCount, setNotesCharCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // New state for duplicate contacts
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [duplicateRelatedEnquiries, setDuplicateRelatedEnquiries] = useState(
    []
  );

  const modalRef = useRef(null);
  const filterRef = useRef(null);
  const statusFilterRef = useRef(null);
  const jumpToPageRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRefs = useRef({});

  // Fetch enquiries from the backend
  const fetchEnquiries = async (showRefreshAnimation = false) => {
    try {
      if (showRefreshAnimation) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Build query parameters
      const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        enquireType: filterType,
        status: filterStatus,
        sort: sortConfig.key,
        order: sortConfig.direction,
        duplicatesOnly: showDuplicatesOnly,
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/enquiries`,
        { params: queryParams }
      );
      setEnquiries(response.data.data || []);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
      setDuplicateInfo(response.data.duplicates);
      setError(null);

      // Clear selected enquiries when fetching new data
      setSelectedEnquiries([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Failed to load enquiries. Please try again later.");
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
      if (showRefreshAnimation) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  // Fetch single enquiry with duplicate info
  const fetchEnquiryDetails = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/enquiries/${id}`
      );
      setSelectedEnquiry(response.data);
      setNotes(response.data.notes || "");
      setNotesCharCount((response.data.notes || "").length);
      setNotesChanged(false);
      setNotesSaved(false);

      // If this is a duplicate, set the related enquiries
      if (response.data.isDuplicate) {
        setDuplicateRelatedEnquiries(response.data.duplicateEnquiries || []);
      } else {
        setDuplicateRelatedEnquiries([]);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching enquiry details:", error);
      toast.error("Failed to load enquiry details");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    filterType,
    filterStatus,
    sortConfig,
    showDuplicatesOnly,
  ]);

  // Reset selected enquiries when page changes
  useEffect(() => {
    setSelectedEnquiries([]);
  }, [currentPage, itemsPerPage, searchTerm, filterType, filterStatus]);

  // Handle click outside modal and dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close action menu dropdown when clicking outside
      if (
        activeDropdown &&
        !dropdownRefs.current[activeDropdown]?.contains(event.target)
      ) {
        setActiveDropdown(null);
      }

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        isFilterOpen
      ) {
        setIsFilterOpen(false);
      }
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target) &&
        isStatusFilterOpen
      ) {
        setIsStatusFilterOpen(false);
      }
      if (
        jumpToPageRef.current &&
        !jumpToPageRef.current.contains(event.target) &&
        isJumpToPageOpen
      ) {
        setIsJumpToPageOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, isStatusFilterOpen, isJumpToPageOpen, activeDropdown]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Search focus with Ctrl+K or /
      if (
        (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "/" && !isDeleteModalOpen)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Escape to close modals
      if (e.key === "Escape") {
        if (isFilterOpen) setIsFilterOpen(false);
        if (isStatusFilterOpen) setIsStatusFilterOpen(false);
        if (isJumpToPageOpen) setIsJumpToPageOpen(false);
        if (isModalOpen) setIsModalOpen(false);
        if (isDeleteModalOpen) setIsDeleteModalOpen(false);
        if (activeDropdown) setActiveDropdown(null);
      }

      // Pagination with Alt+arrow keys
      if (!isModalOpen && !isDeleteModalOpen) {
        if (e.altKey && e.key === "ArrowRight" && currentPage < totalPages) {
          e.preventDefault();
          setCurrentPage((prev) => prev + 1);
        } else if (e.altKey && e.key === "ArrowLeft" && currentPage > 1) {
          e.preventDefault();
          setCurrentPage((prev) => prev - 1);
        } else if (e.altKey && e.key === "Home") {
          e.preventDefault();
          setCurrentPage(1);
        } else if (e.altKey && e.key === "End") {
          e.preventDefault();
          setCurrentPage(totalPages);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    currentPage,
    totalPages,
    isFilterOpen,
    isStatusFilterOpen,
    isJumpToPageOpen,
    isModalOpen,
    isDeleteModalOpen,
  ]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get unique enquiry types for filter
  const getUniqueEnquiryTypes = () => {
    const types = [...new Set(enquiries.map((enquiry) => enquiry.enquire))];
    return types.sort();
  };

  // Format enquiry type for display
  const formatEnquiryType = (type) => {
    return type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date for mobile (shorter)
  const formatDateShort = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    );
  };

  // Handle jump to page
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNum = Number.parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setIsJumpToPageOpen(false);
      setJumpToPage("");
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Contact",
      "State",
      "City",
      "Enquiry Type",
      "Status",
      "Enquiry Detail",
      "Date",
      "Duplicate",
    ];

    const csvRows = [
      headers.join(","),
      ...enquiries.map((item) =>
        [
          `"${item.name || ""}"`,
          `"${item.email || ""}"`,
          `"${item.contact || ""}"`,
          `"${item.state || ""}"`,
          `"${item.city || ""}"`,
          `"${formatEnquiryType(item.enquire) || ""}"`,
          `"${formatStatus(item.status) || "New"}"`,
          `"${(item.enquireDetail || "").replace(/"/g, '""')}"`,
          `"${formatDate(item.createdAt)}"`,
          `"${item.isDuplicate ? "Yes" : "No"}"`,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `contact_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${enquiries.length} enquiries to CSV`);
  };

  // Export selected enquiries to CSV
  const exportSelectedToCSV = () => {
    // Find the selected enquiries from the enquiries array
    const selectedEnquiriesData = enquiries.filter((enquiry) =>
      selectedEnquiries.includes(enquiry._id)
    );

    const headers = [
      "Name",
      "Email",
      "Contact",
      "State",
      "City",
      "Enquiry Type",
      "Status",
      "Enquiry Detail",
      "Date",
      "Duplicate",
    ];

    const csvRows = [
      headers.join(","),
      ...selectedEnquiriesData.map((item) =>
        [
          `"${item.name || ""}"`,
          `"${item.email || ""}"`,
          `"${item.contact || ""}"`,
          `"${item.state || ""}"`,
          `"${item.city || ""}"`,
          `"${formatEnquiryType(item.enquire) || ""}"`,
          `"${formatStatus(item.status) || "New"}"`,
          `"${(item.enquireDetail || "").replace(/"/g, '""')}"`,
          `"${formatDate(item.createdAt)}"`,
          `"${item.isDuplicate ? "Yes" : "No"}"`,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `selected_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `Exported ${selectedEnquiriesData.length} selected enquiries to CSV`
    );
    setActiveDropdown(null); // Close the dropdown
  };

  // View enquiry details
  const viewEnquiryDetails = (enquiry) => {
    fetchEnquiryDetails(enquiry._id);
  };

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Handle checkbox selection
  const handleSelectEnquiry = (id) => {
    setSelectedEnquiries((prev) => {
      if (prev.includes(id)) {
        return prev.filter((enquiryId) => enquiryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(enquiries.map((enquiry) => enquiry._id));
    }
    setSelectAll(!selectAll);
  };

  // Check if all visible enquiries are selected
  useEffect(() => {
    if (enquiries.length > 0 && selectedEnquiries.length === enquiries.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedEnquiries, enquiries]);

  // Get status badge color and icon
  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return {
          color: "bg-green-100 text-green-700",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "in-progress":
        return {
          color: "bg-purple-100 text-purple-700",
          icon: <RefreshCw className="h-3 w-3 mr-1" />,
        };
      case "contacted":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: <Mail className="h-3 w-3 mr-1" />,
        };
      case "follow-up":
        return {
          color: "bg-orange-100 text-orange-700",
          icon: <MessageCircle className="h-3 w-3 mr-1" />,
        };
      case "converted":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
        };
      case "closed":
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <XCircle className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return "New";
    return status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Update enquiry status
  const updateEnquiryStatus = async (id, status) => {
    try {
      // If updating from the modal, include notes
      const updateData =
        selectedEnquiry && selectedEnquiry._id === id
          ? { status, notes }
          : { status };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/enquiries/${id}`,
        updateData
      );

      // Update the enquiry in the local state
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry._id === id ? { ...enquiry, ...updateData } : enquiry
        )
      );

      // Update the selected enquiry if it's the one being edited
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, ...updateData });
        setNotesSaved(true);
        setNotesChanged(false);
      }

      toast.success(`Status updated to ${formatStatus(status)}`);

      // Close dropdown
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error updating enquiry status:", error);
      toast.error("Failed to update enquiry status");
    }
  };

  // Delete enquiry
  const confirmDeleteEnquiry = (enquiry) => {
    setEnquiryToDelete(enquiry);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null); // Close any open dropdown
  };

  const deleteEnquiry = async () => {
    if (!enquiryToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/enquiries/${enquiryToDelete._id}`
      );

      // Remove from local state
      setEnquiries((prevEnquiries) =>
        prevEnquiries.filter((enquiry) => enquiry._id !== enquiryToDelete._id)
      );

      // Remove from selected enquiries if it was selected
      if (selectedEnquiries.includes(enquiryToDelete._id)) {
        setSelectedEnquiries((prev) =>
          prev.filter((id) => id !== enquiryToDelete._id)
        );
      }

      // Close modals
      setIsDeleteModalOpen(false);
      if (selectedEnquiry && selectedEnquiry._id === enquiryToDelete._id) {
        setIsModalOpen(false);
      }

      // Update total count
      setTotalItems((prev) => prev - 1);

      // If we deleted the last item on the page, go to previous page
      if (enquiries.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.success("Enquiry deleted successfully");
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      toast.error("Failed to delete enquiry");
    } finally {
      setDeleteLoading(false);
      setEnquiryToDelete(null);
    }
  };

  // Bulk delete enquiries
  const bulkDeleteEnquiries = async () => {
    if (selectedEnquiries.length === 0) return;

    try {
      setBulkDeleteLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/enquiries/bulk`, {
        action: "delete",
        ids: selectedEnquiries,
      });

      // Update local state
      setEnquiries((prevEnquiries) =>
        prevEnquiries.filter(
          (enquiry) => !selectedEnquiries.includes(enquiry._id)
        )
      );

      setTotalItems((prev) => prev - selectedEnquiries.length);

      toast.success(
        `Deleted ${selectedEnquiries.length} enquiries successfully`
      );

      // Clear selection
      setSelectedEnquiries([]);
    } catch (error) {
      console.error("Error performing bulk delete:", error);
      toast.error("Failed to delete enquiries");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (status) => {
    if (selectedEnquiries.length === 0) return;

    try {
      setBulkUpdateLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/enquiries/bulk`, {
        action: "update",
        ids: selectedEnquiries,
        status,
      });

      // Update local state
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          selectedEnquiries.includes(enquiry._id)
            ? { ...enquiry, status }
            : enquiry
        )
      );

      toast.success(
        `Updated ${selectedEnquiries.length} enquiries to ${formatStatus(
          status
        )}`
      );

      // Clear selection
      setSelectedEnquiries([]);
    } catch (error) {
      console.error("Error performing bulk update:", error);
      toast.error("Failed to update enquiries");
    } finally {
      setBulkUpdateLoading(false);
    }
  };

  // Get duplicate count
  const getDuplicateCount = () => {
    if (!duplicateInfo) return 0;
    return duplicateInfo.total || 0;
  };

  // Toggle show duplicates only
  const toggleDuplicatesOnly = () => {
    setShowDuplicatesOnly(!showDuplicatesOnly);
    setCurrentPage(1); // Reset to first page
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterStatus("");
    setShowDuplicatesOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
      {/* Hero section - more compact on mobile */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-6 sm:py-8 md:py-12 px-3 sm:px-4 rounded-xl mb-6 md:mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> Contacts
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-8">
            Discover stories, insights, and knowledge from our community
          </p>
        </div>
      </div>

      {/* Header with search and filters - Improved responsive layout */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700">
              Contact Submissions
            </h2>
            <button
              onClick={() => fetchEnquiries(true)}
              className={`p-1 rounded-full hover:bg-gray-100 ${
                refreshing ? "animate-spin" : ""
              }`}
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </button>

            {/* Duplicate Contacts Badge - Smaller on mobile */}
            {duplicateInfo && duplicateInfo.total > 0 && (
              <button
                onClick={toggleDuplicatesOnly}
                className={`flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  showDuplicatesOnly
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">
                  {getDuplicateCount()} Duplicates
                </span>
                <span className="xs:hidden">{getDuplicateCount()}</span>
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 border rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">Filters</span>
              {(searchTerm || filterType || filterStatus) && (
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Export Button - Simplified on mobile */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={enquiries.length === 0}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Search and filters row - Responsive layout */}
        <div
          className={`flex flex-col gap-3 ${
            showFilters || !window.matchMedia("(max-width: 768px)").matches
              ? "flex"
              : "hidden"
          }`}
        >
          {/* Search - Full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search submissions... (Ctrl+/)"
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          {/* Filter buttons row - Wrap on small screens */}
          <div className="flex flex-wrap gap-2">
            {/* Type Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                  isFilterOpen || filterType
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none">
                  {filterType ? formatEnquiryType(filterType) : "Type"}
                </span>
                {filterType && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterType("");
                    }}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </button>

              {/* Type Filter Dropdown */}
              {isFilterOpen && (
                <div
                  ref={filterRef}
                  className="absolute left-0 right-0 sm:left-auto sm:right-auto sm:w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  <div className="p-2 border-b border-gray-200">
                    <h3 className="font-medium text-sm text-gray-700">
                      Filter by Type
                    </h3>
                  </div>
                  <div className="p-2">
                    {getUniqueEnquiryTypes().map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilterType(type);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                          filterType === type
                            ? "bg-purple-100 text-purple-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {formatEnquiryType(type)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                  isStatusFilterOpen || filterStatus
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none">
                  {filterStatus ? formatStatus(filterStatus) : "Status"}
                </span>
                {filterStatus && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterStatus("");
                    }}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </button>

              {/* Status Filter Dropdown */}
              {isStatusFilterOpen && (
                <div
                  ref={statusFilterRef}
                  className="absolute left-0 right-0 sm:left-auto sm:right-auto sm:w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  <div className="p-2 border-b border-gray-200">
                    <h3 className="font-medium text-sm text-gray-700">
                      Filter by Status
                    </h3>
                  </div>
                  <div className="p-2">
                    {[
                      "new",
                      "in-progress",
                      "contacted",
                      "follow-up",
                      "converted",
                      "closed",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsStatusFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                          filterStatus === status
                            ? "bg-purple-100 text-purple-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {getStatusBadge(status).icon}
                          <span className="capitalize">
                            {formatStatus(status)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear filters button - Only show when filters are active */}
            {(searchTerm ||
              filterType ||
              filterStatus ||
              showDuplicatesOnly) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions - More compact on mobile */}
      {selectedEnquiries.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 mr-1 sm:mr-2">
            {selectedEnquiries.length} selected
          </span>

          <div className="relative">
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "bulk-actions" ? null : "bulk-actions"
                )
              }
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              <span className="hidden xs:inline">Bulk Actions</span>
              <span className="xs:hidden">Actions</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {activeDropdown === "bulk-actions" && (
              <div
                ref={(el) => (dropdownRefs.current["bulk-actions"] = el)}
                className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      bulkUpdateStatus("new");
                      setActiveDropdown(null);
                    }}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    Mark as New
                  </button>
                  <button
                    onClick={() => {
                      bulkUpdateStatus("in-progress");
                      setActiveDropdown(null);
                    }}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-purple-500" />
                    Mark as In Progress
                  </button>
                  <button
                    onClick={() => {
                      bulkUpdateStatus("contacted");
                      setActiveDropdown(null);
                    }}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Mail className="h-3.5 w-3.5 text-yellow-500" />
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => {
                      bulkUpdateStatus("follow-up");
                      setActiveDropdown(null);
                    }}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-orange-500" />
                    Mark as Follow-up
                  </button>
                  <button
                    onClick={() => {
                      bulkUpdateStatus("converted");
                      setActiveDropdown(null);
                    }}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    Mark as Converted
                  </button>
                  <button
                    onClick={() => {
                      bulkUpdateStatus("closed");
                      setActiveDropdown(null);
                    }}
                    disabled={bulkUpdateLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <XCircle className="h-3.5 w-3.5 text-gray-500" />
                    Mark as Closed
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      exportSelectedToCSV();
                    }}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download className="h-3.5 w-3.5 text-green-500" />
                    Export Selected
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      bulkDeleteEnquiries();
                      setActiveDropdown(null);
                    }}
                    disabled={bulkDeleteLoading}
                    className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedEnquiries([])}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>

          {(bulkUpdateLoading || bulkDeleteLoading) && (
            <div className="flex items-center ml-1 sm:ml-2">
              <Loader2 className="animate-spin h-3.5 w-3.5 text-purple-600 mr-1" />
              <span className="text-xs sm:text-sm text-gray-600">
                Processing...
              </span>
            </div>
          )}
        </div>
      )}

      {/* Duplicate Filter Banner - More compact on mobile */}
      {showDuplicatesOnly && (
        <div className="mb-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm text-amber-800 font-medium">
              Showing only duplicate contacts ({getDuplicateCount()})
            </span>
          </div>
          <button
            onClick={toggleDuplicatesOnly}
            className="px-2 sm:px-3 py-1 bg-white border border-amber-300 rounded-md text-xs sm:text-sm text-amber-700 hover:bg-amber-50"
          >
            Show All
          </button>
        </div>
      )}

      {/* Loading State - More compact on mobile */}
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-base sm:text-lg text-gray-600">
            Loading submissions...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base">
          {error}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-8 sm:py-10 text-gray-500 border border-dashed rounded-lg">
          <Mail className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
          <h3 className="text-base sm:text-lg font-medium mb-1">
            No submissions found
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            {searchTerm || filterType || filterStatus || showDuplicatesOnly
              ? "Try adjusting your search or filters"
              : "Contact submissions will appear here"}
          </p>
          {(searchTerm || filterType || filterStatus || showDuplicatesOnly) && (
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={clearAllFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop/Tablet Table View - Improved responsive design */}
          <div className="hidden sm:block overflow-hidden">
            <div className="w-full border border-gray-200 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Checkbox column */}
                      <th className="w-[5%] px-2 py-2.5 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={
                              selectedEnquiries.length === enquiries.length &&
                              enquiries.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th
                        className="w-[15%] px-2 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Name {renderSortIndicator("name")}
                        </div>
                      </th>
                      <th
                        className="w-[20%] px-2 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email {renderSortIndicator("email")}
                          {showDuplicatesOnly && (
                            <Copy className="ml-1 h-3 w-3 text-amber-600" />
                          )}
                        </div>
                      </th>
                      {/* Type column - only visible on larger screens */}
                      <th
                        className="hidden lg:table-cell w-[15%] px-2 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("enquire")}
                      >
                        <div className="flex items-center gap-1">
                          Type {renderSortIndicator("enquire")}
                        </div>
                      </th>
                      <th
                        className="w-[15%] px-2 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status {renderSortIndicator("status")}
                        </div>
                      </th>
                      <th
                        className="w-[15%] px-2 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">
                          Date {renderSortIndicator("createdAt")}
                        </div>
                      </th>
                      <th className="w-[10%] px-2 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enquiries.map((enquiry) => (
                      <tr
                        key={enquiry._id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedEnquiries.includes(enquiry._id)
                            ? "bg-purple-50"
                            : ""
                        } ${enquiry.isDuplicate ? "bg-amber-50" : ""}`}
                      >
                        {/* Checkbox cell */}
                        <td className="px-2 py-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              checked={selectedEnquiries.includes(enquiry._id)}
                              onChange={() => handleSelectEnquiry(enquiry._id)}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm font-medium text-gray-900">
                          <div className="truncate max-w-[120px]">
                            {enquiry.name}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <div
                              className={`truncate max-w-[150px] ${
                                enquiry.isDuplicate
                                  ? "font-medium text-amber-700"
                                  : ""
                              }`}
                            >
                              {enquiry.email}
                            </div>
                            {enquiry.isDuplicate && (
                              <span className="ml-1 inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <Copy className="h-3 w-3 mr-0.5" />
                                {enquiry.duplicateCount > 0
                                  ? `${enquiry.duplicateCount}x`
                                  : "Dup"}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Type cell - only visible on larger screens */}
                        <td className="hidden lg:table-cell px-2 py-3 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs truncate inline-block max-w-[120px]">
                            {formatEnquiryType(enquiry.enquire)}
                          </span>
                        </td>
                        {/* Status cell with dropdown */}
                        <td className="px-2 py-3 text-sm text-gray-500">
                          <div className="relative group">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                getStatusBadge(enquiry.status || "new").color
                              } cursor-pointer`}
                              onClick={() =>
                                toggleDropdown(`status-${enquiry._id}`)
                              }
                            >
                              {getStatusBadge(enquiry.status || "new").icon}
                              <span className="capitalize">
                                {formatStatus(enquiry.status)}
                              </span>
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </div>

                            {/* Status Dropdown */}
                            {activeDropdown === `status-${enquiry._id}` && (
                              <div
                                ref={(el) =>
                                  (dropdownRefs.current[
                                    `status-${enquiry._id}`
                                  ] = el)
                                }
                                className="absolute left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                              >
                                {[
                                  "new",
                                  "in-progress",
                                  "contacted",
                                  "follow-up",
                                  "converted",
                                  "closed",
                                ].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      updateEnquiryStatus(enquiry._id, status)
                                    }
                                    disabled={enquiry.status === status}
                                    className={`w-full text-left px-2 py-1.5 text-xs ${
                                      enquiry.status === status
                                        ? "bg-gray-100 cursor-default"
                                        : "hover:bg-gray-50"
                                    } flex items-center gap-1.5`}
                                  >
                                    {getStatusBadge(status).icon}
                                    <span className="capitalize">
                                      {formatStatus(status)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-500">
                          <div className="truncate max-w-[120px]">
                            {formatDate(enquiry.createdAt)}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-500 text-center">
                          <div className="flex justify-center">
                            <div className="relative">
                              <button
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={() =>
                                  toggleDropdown(`action-${enquiry._id}`)
                                }
                                aria-label="Actions"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                              </button>

                              {/* Actions Dropdown */}
                              {activeDropdown === `action-${enquiry._id}` && (
                                <div
                                  ref={(el) =>
                                    (dropdownRefs.current[
                                      `action-${enquiry._id}`
                                    ] = el)
                                  }
                                  className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                >
                                  <button
                                    onClick={() => viewEnquiryDetails(enquiry)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                                  >
                                    <Eye className="h-3.5 w-3.5 text-purple-600" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteEnquiry(enquiry)
                                    }
                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
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
          </div>

          {/* Mobile Card View - Improved for better readability and compactness */}
          <div className="sm:hidden space-y-3">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                className={`bg-white border rounded-lg p-3 shadow-sm ${
                  selectedEnquiries.includes(enquiry._id)
                    ? "border-purple-300 bg-purple-50"
                    : ""
                } ${
                  enquiry.isDuplicate
                    ? "border-amber-300 bg-amber-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedEnquiries.includes(enquiry._id)}
                      onChange={() => handleSelectEnquiry(enquiry._id)}
                    />
                    <h3 className="font-medium text-gray-900 truncate max-w-[120px]">
                      {enquiry.name}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs truncate max-w-[80px]">
                      {formatEnquiryType(enquiry.enquire)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-start gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex items-center">
                      <span
                        className={`truncate ${
                          enquiry.isDuplicate
                            ? "font-medium text-amber-700"
                            : ""
                        }`}
                      >
                        {enquiry.email}
                      </span>
                      {enquiry.isDuplicate && (
                        <span className="ml-1 inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Copy className="h-3 w-3 mr-0.5" />
                          Dup
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{enquiry.contact}</span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{formatDateShort(enquiry.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                  <select
                    value={enquiry.status || "new"}
                    onChange={(e) =>
                      updateEnquiryStatus(enquiry._id, e.target.value)
                    }
                    className="px-1.5 py-0.5 text-xs border border-gray-300 rounded-md bg-white"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100"
                      onClick={() => viewEnquiryDetails(enquiry)}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-0.5 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                      onClick={() => confirmDeleteEnquiry(enquiry)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination - More compact and responsive */}
          {totalItems > 0 && (
            <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-3 sm:pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                {/* Pagination Info - Simplified on mobile */}
                <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                  <span className="hidden xs:inline">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of{" "}
                  </span>
                  <span className="font-medium">{totalItems}</span> entries
                </div>

                {/* Pagination Controls - Simplified on mobile */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* First Page Button - Hidden on smallest screens */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className={`hidden xs:flex p-1.5 sm:p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronFirst className="h-4 w-4" />
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`p-1.5 sm:p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  {/* Current Page / Total Pages - Mobile */}
                  <span className="sm:hidden px-2 py-1.5 text-xs text-gray-600">
                    {currentPage} / {totalPages}
                  </span>

                  {/* Page Numbers - Hidden on mobile */}
                  <div className="hidden sm:flex items-center">
                    {(() => {
                      // Calculate which page numbers to show
                      let pages = [];
                      const maxVisiblePages = 5;

                      if (totalPages <= maxVisiblePages) {
                        // Show all pages if there are 5 or fewer
                        pages = Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        );
                      } else if (currentPage <= 3) {
                        // Near the start
                        pages = [1, 2, 3, 4, 5];
                      } else if (currentPage >= totalPages - 2) {
                        // Near the end
                        pages = Array.from(
                          { length: 5 },
                          (_, i) => totalPages - 4 + i
                        );
                      } else {
                        // In the middle
                        pages = [
                          currentPage - 2,
                          currentPage - 1,
                          currentPage,
                          currentPage + 1,
                          currentPage + 2,
                        ];
                      }

                      return pages.map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-label={`Page ${pageNum}`}
                          aria-current={
                            currentPage === pageNum ? "page" : undefined
                          }
                          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md transition-colors ${
                            currentPage === pageNum
                              ? "bg-purple-100 text-purple-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ));
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`p-1.5 sm:p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Last Page Button - Hidden on smallest screens */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    className={`hidden xs:flex p-1.5 sm:p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLast className="h-4 w-4" />
                  </button>
                </div>

                {/* Items Per Page Selector - Hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2 order-3">
                  <label
                    htmlFor="items-per-page"
                    className="text-xs text-gray-500"
                  >
                    Per page:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                    className="border rounded-md px-1.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
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

      {/* Detail Modal - Improved with responsive design */}
      {isModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center border-b p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-4">
                Enquiry Details
                {selectedEnquiry.isDuplicate && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </span>
                )}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Duplicate Alert Banner */}
              {selectedEnquiry.isDuplicate && (
                <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm text-amber-800">
                        Duplicate Email Detected
                      </h4>
                      <p className="text-xs text-amber-700 mt-1">
                        This email appears {selectedEnquiry.duplicateCount || 2}{" "}
                        times in your contacts database.
                      </p>

                      {/* Show related contacts with same email */}
                      {duplicateRelatedEnquiries.length > 0 && (
                        <div className="mt-2 sm:mt-3">
                          <h5 className="text-xs font-medium text-amber-800 mb-1 sm:mb-2">
                            Other contacts with this email:
                          </h5>
                          <div className="space-y-1 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                            {duplicateRelatedEnquiries.map((dup) => (
                              <div
                                key={dup._id}
                                className="flex items-center justify-between bg-white p-1.5 sm:p-2 rounded border border-amber-200 text-xs"
                              >
                                <div>
                                  <div className="font-medium">{dup.name}</div>
                                  <div className="text-gray-500 text-xs">
                                    {formatDateShort(dup.createdAt)}
                                  </div>
                                </div>
                                <span
                                  className={`px-1.5 py-0.5 rounded-full ${
                                    getStatusBadge(dup.status || "new").color
                                  }`}
                                >
                                  {formatStatus(dup.status)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                      Name
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 break-words">
                      {selectedEnquiry.name}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                      Email
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 break-words">
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className={`hover:underline ${
                          selectedEnquiry.isDuplicate
                            ? "text-amber-600 font-medium"
                            : "text-blue-600"
                        }`}
                      >
                        {selectedEnquiry.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                      Contact
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 break-words">
                      <a
                        href={`tel:${selectedEnquiry.contact}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedEnquiry.contact}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                      Location
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 break-words">
                      {selectedEnquiry.city}, {selectedEnquiry.state}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                      Enquiry Type
                    </h4>
                    <p className="mt-1">
                      <span className="inline-flex px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm">
                        {formatEnquiryType(selectedEnquiry.enquire)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                      Date Submitted
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900">
                      {formatDate(selectedEnquiry.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                  Status
                </h4>
                <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-1 sm:gap-2">
                  {[
                    "new",
                    "in-progress",
                    "contacted",
                    "follow-up",
                    "converted",
                    "closed",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateEnquiryStatus(selectedEnquiry._id, status)
                      }
                      disabled={statusUpdateLoading}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs font-medium capitalize flex flex-col items-center justify-center ${
                        selectedEnquiry.status === status
                          ? `${
                              getStatusBadge(status).color
                            } ring-2 ring-offset-1 ring-purple-500`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getStatusBadge(status).icon}
                      <span className="text-xs">{formatStatus(status)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Enquiry Details
                </h4>
                <div className="mt-2 p-2 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-700 break-words">
                  {selectedEnquiry.enquireDetail || "No details provided."}
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-500">
                  Notes
                </h4>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    const newNotes = e.target.value;
                    setNotes(newNotes);
                    setNotesCharCount(newNotes.length);
                    setNotesChanged(newNotes !== selectedEnquiry?.notes);
                    if (notesSaved) setNotesSaved(false);
                  }}
                  className={`mt-2 w-full h-24 sm:h-32 p-2 sm:p-3 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                    notesChanged
                      ? "border-yellow-400 focus:ring-yellow-500"
                      : "focus:ring-purple-500"
                  } ${notesSaved ? "bg-green-50 border-green-300" : ""}`}
                  placeholder="Add notes about this enquiry..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>{notesCharCount}/1000</span>
                  {notesChanged && (
                    <span className="text-yellow-600">Unsaved changes</span>
                  )}
                  {notesSaved && (
                    <span className="text-green-600">✓ Saved</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t p-3 sm:p-4 flex justify-between">
              <button
                onClick={() => confirmDeleteEnquiry(selectedEnquiry)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Delete</span>
              </button>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors text-xs sm:text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    updateEnquiryStatus(
                      selectedEnquiry._id,
                      selectedEnquiry.status
                    )
                  }
                  disabled={
                    statusUpdateLoading || (!notesChanged && !notesSaved)
                  }
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors flex items-center text-xs sm:text-sm ${
                    notesChanged
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : notesSaved
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {statusUpdateLoading ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : notesSaved ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save Notes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - More compact on mobile */}
      {isDeleteModalOpen && enquiryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-red-100 rounded-full mb-3 sm:mb-4">
                <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-center text-gray-900 mb-2">
                Delete Enquiry
              </h3>
              <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Are you sure you want to delete the enquiry from{" "}
                <span className="font-medium">{enquiryToDelete.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteEnquiry}
                  disabled={deleteLoading}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center text-xs sm:text-sm"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Enquiry</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
