"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Tag,
  Star,
  Clock,
  CalendarCheck,
  CalendarX,
  CalendarOff,
  MoreHorizontal,
  ImageIcon,
  ChevronFirst,
  ChevronLast,
  User,
  CheckSquare,
  Square,
  Ban,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "startDate",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");
  const [isJumpToPageOpen, setIsJumpToPageOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    featured: false,
    registrationUrl: "",
    capacity: "",
    organizer: "",
  });
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isBulkRestoreModalOpen, setIsBulkRestoreModalOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  // New state for bulk actions
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkCancelModalOpen, setIsBulkCancelModalOpen] = useState(false);

  const filterRef = useRef(null);
  const categoryFilterRef = useRef(null);
  const dateFilterRef = useRef(null);
  const jumpToPageRef = useRef(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const dropdownRefs = useRef({});
  const bulkActionRef = useRef(null);
  const statusDropdownRefs = useRef({});

  // This effect runs when the component mounts
  useEffect(() => {
    console.log("Events component mounted");

    // Return a cleanup function that runs when the component unmounts
    return () => {
      console.log("Events component unmounted");
      // Reset any global state or listeners that might persist
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("keydown", () => {});

      // Clear any possible intervals
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }
    };
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate event status based on dates
  const calculateEventStatus = useCallback((event) => {
    // If the event is already cancelled, keep it that way
    if (event.status === "cancelled") {
      return "cancelled";
    }

    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) {
      return "upcoming";
    } else if (now >= startDate && now <= endDate) {
      return "ongoing";
    } else {
      return "past";
    }
  }, []);

  // Update event statuses periodically
  useEffect(() => {
    // Function to update statuses
    const updateEventStatuses = () => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => ({
          ...event,
          calculatedStatus: calculateEventStatus(event),
        }))
      );
    };

    // Update immediately
    updateEventStatuses();

    // Set up interval to update every minute
    const intervalId = setInterval(updateEventStatuses, 60000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Remove the events dependency to prevent re-creating the interval

  // Fetch events from the backend
  const fetchEvents = useCallback(
    async (showRefreshAnimation = false) => {
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
          search: debouncedSearchTerm,
          status: filterStatus,
          category: filterCategory,
          featured: filterFeatured,
          sort: sortConfig.key,
          order: sortConfig.direction,
        };

        // Add date filtering if applicable
        if (
          dateFilter === "custom" &&
          customDateRange.startDate &&
          customDateRange.endDate
        ) {
          queryParams.startDate = customDateRange.startDate;
          queryParams.endDate = customDateRange.endDate;
        } else if (dateFilter !== "all") {
          const today = new Date();
          const startDate = new Date();

          switch (dateFilter) {
            case "today":
              startDate.setHours(0, 0, 0, 0);
              break;
            case "yesterday":
              startDate.setDate(today.getDate() - 1);
              startDate.setHours(0, 0, 0, 0);
              break;
            case "thisWeek":
              startDate.setDate(today.getDate() - today.getDay());
              startDate.setHours(0, 0, 0, 0);
              break;
            case "thisMonth":
              startDate.setDate(1);
              startDate.setHours(0, 0, 0, 0);
              break;
            case "lastMonth":
              startDate.setMonth(today.getMonth() - 1);
              startDate.setDate(1);
              startDate.setHours(0, 0, 0, 0);
              break;
            default:
              break;
          }

          queryParams.startDate = startDate.toISOString();
          queryParams.endDate = today.toISOString();
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events`,
          { params: queryParams }
        );

        // Calculate real-time status for each event
        const updatedEvents = response.data.data.map((event) => {
          const calculatedStatus = calculateEventStatus(event);
          return {
            ...event,
            calculatedStatus,
          };
        });

        setEvents(updatedEvents);
        setTotalEvents(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
        setError(null);

        // Extract unique categories for the filter
        const uniqueCategories = [
          ...new Set(
            updatedEvents.map((event) => event.category).filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories);

        // Clear selected events when fetching new data
        setSelectedEvents([]);
        setSelectAll(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setLoading(false);
        if (showRefreshAnimation) {
          setTimeout(() => setRefreshing(false), 500);
        }
      }
    },
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      filterStatus,
      filterCategory,
      filterFeatured,
      sortConfig,
      dateFilter,
      customDateRange,
      calculateEventStatus,
    ]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!isMounted) return;

        await fetchEvents();
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchEvents]);

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close action menu dropdown when clicking outside
      if (
        activeDropdown &&
        !dropdownRefs.current[activeDropdown]?.contains(event.target)
      ) {
        setActiveDropdown(null);
      }

      // Close bulk action dropdown when clicking outside
      if (
        isBulkActionOpen &&
        bulkActionRef.current &&
        !bulkActionRef.current.contains(event.target)
      ) {
        setIsBulkActionOpen(false);
      }

      // Handle other dropdowns
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        isFilterOpen
      ) {
        setIsFilterOpen(false);
      }
      if (
        categoryFilterRef.current &&
        !categoryFilterRef.current.contains(event.target) &&
        isCategoryFilterOpen
      ) {
        setIsCategoryFilterOpen(false);
      }
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target) &&
        isDateFilterOpen
      ) {
        setIsDateFilterOpen(false);
      }
      if (
        jumpToPageRef.current &&
        !jumpToPageRef.current.contains(event.target) &&
        isJumpToPageOpen
      ) {
        setIsJumpToPageOpen(false);
      }

      // Close any open status dropdowns
      Object.keys(statusDropdownRefs.current).forEach((key) => {
        if (
          statusDropdownRefs.current[key] &&
          !statusDropdownRefs.current[key].contains(event.target) &&
          activeDropdown === `status-${key}`
        ) {
          setActiveDropdown(null);
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isFilterOpen,
    isCategoryFilterOpen,
    isDateFilterOpen,
    isJumpToPageOpen,
    activeDropdown,
    isModalOpen,
    isBulkActionOpen,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Search focus with Ctrl+K or /
      if (
        (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "/" && !isModalOpen && !isDeleteModalOpen)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Escape to close modals
      if (e.key === "Escape") {
        if (isFilterOpen) setIsFilterOpen(false);
        if (isCategoryFilterOpen) setIsCategoryFilterOpen(false);
        if (isDateFilterOpen) setIsDateFilterOpen(false);
        if (isJumpToPageOpen) setIsJumpToPageOpen(false);
        if (activeDropdown) setActiveDropdown(null);
        if (isBulkActionOpen) setIsBulkActionOpen(false);
      }

      // Pagination with Alt+arrow keys
      if (
        !isModalOpen &&
        !isDeleteModalOpen &&
        !isBulkDeleteModalOpen &&
        !isBulkCancelModalOpen
      ) {
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
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentPage,
    totalPages,
    isFilterOpen,
    isCategoryFilterOpen,
    isDateFilterOpen,
    isJumpToPageOpen,
    activeDropdown,
    isModalOpen,
    isDeleteModalOpen,
    isBulkActionOpen,
    isBulkDeleteModalOpen,
    isBulkCancelModalOpen,
  ]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
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

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Open modal to add new event
  const openAddEventModal = () => {
    setIsEditing(false);
    setEditingEventId(null);
    setEventFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      category: "",
      featured: false,
      registrationUrl: "",
      capacity: "",
      organizer: "",
    });
    setEventImage(null);
    setImagePreview("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal to edit event
  const openEditEventModal = (event) => {
    setIsEditing(true);
    setEditingEventId(event._id);
    setEventFormData({
      title: event.title,
      description: event.description,
      startDate: formatDateForInput(event.startDate),
      endDate: formatDateForInput(event.endDate),
      location: event.location,
      category: event.category,
      featured: event.featured,
      registrationUrl: event.registrationUrl || "",
      capacity: event.capacity || "",
      organizer: event.organizer || "",
    });
    setEventImage(null);
    setImagePreview(
      event.imageUrl ? `${import.meta.env.VITE_API_URL}${event.imageUrl}` : ""
    );
    setFormErrors({});
    setIsModalOpen(true);
    setActiveDropdown(null); // Close any open dropdown
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB limit");
        e.target.value = "";
        return;
      }

      // Check file type
      const fileType = file.type;
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

      if (!validTypes.includes(fileType)) {
        toast.error("Only JPEG, JPG, PNG, and WEBP files are allowed");
        e.target.value = "";
        return;
      }

      // Load image to check dimensions
      const img = new Image();
      img.onload = function () {
        // Show a warning if dimensions are far from recommended
        const ratio = this.width / this.height;
        if (ratio < 1.4 || ratio > 1.7) {
          toast.warning(
            "For best results, use an image with a 3:2 ratio (e.g., 600x400px)"
          );
        }
        URL.revokeObjectURL(this.src);
      };

      setEventImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      img.src = previewUrl;

      // Clear any previous file error
      if (formErrors.image) {
        setFormErrors((prev) => ({ ...prev, image: undefined }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!eventFormData.title.trim()) errors.title = "Title is required";
    if (!eventFormData.description.trim())
      errors.description = "Description is required";
    if (!eventFormData.startDate) errors.startDate = "Start date is required";
    if (!eventFormData.endDate) errors.endDate = "End date is required";
    if (new Date(eventFormData.endDate) < new Date(eventFormData.startDate)) {
      errors.endDate = "End date must be after start date";
    }
    if (!eventFormData.location.trim())
      errors.location = "Location is required";
    if (!eventFormData.category.trim())
      errors.category = "Category is required";

    // Only require image for new events
    if (!isEditing && !eventImage && !imagePreview) {
      errors.image = "Event image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setFormSubmitting(true);

    try {
      // Create form data for file upload
      const submitFormData = new FormData();

      // Add all form fields
      Object.keys(eventFormData).forEach((key) => {
        if (eventFormData[key] !== "") {
          submitFormData.append(key, eventFormData[key]);
        }
      });

      // Add the file if selected
      if (eventImage) {
        submitFormData.append("image", eventImage);
      }

      let response;

      if (isEditing) {
        // Update existing event
        response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/events/${editingEventId}`,
          submitFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/events`,
          submitFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event created successfully!");
      }

      // Close modal and refresh events
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save event. Please try again later."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Confirm delete event
  const confirmDeleteEvent = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null); // Close any open dropdown
  };

  // Delete event
  const deleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/events/${eventToDelete._id}`
      );

      // Remove from local state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventToDelete._id)
      );

      // Remove from selected events if it was selected
      if (selectedEvents.includes(eventToDelete._id)) {
        setSelectedEvents((prev) =>
          prev.filter((id) => id !== eventToDelete._id)
        );
      }

      // Update total count
      setTotalEvents((prev) => prev - 1);

      // If we deleted the last item on the page, go to previous page
      if (events.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.success("Event deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleteLoading(false);
      setEventToDelete(null);
    }
  };

  // Cancel event
  const cancelEvent = async (eventId) => {
    try {
      setStatusUpdateLoading(true);

      // Make API call to update status to cancelled
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
        {
          status: "cancelled",
        }
      );

      if (response.data && response.data.data) {
        // Update the event in the local state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, status: "cancelled", calculatedStatus: "cancelled" }
              : event
          )
        );

        toast.success("Event cancelled successfully");
      }
    } catch (error) {
      console.error("Error cancelling event:", error);
      toast.error("Failed to cancel event");
    } finally {
      setStatusUpdateLoading(false);
      setActiveDropdown(null); // Close the dropdown
    }
  };

  // Restore event
  const restoreEvent = async (eventId) => {
    try {
      setStatusUpdateLoading(true);

      // Make API call to update status to empty string (will be calculated based on dates)
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
        {
          status: "",
        }
      );

      if (response.data && response.data.data) {
        // Update the event in the local state
        setEvents((prevEvents) =>
          prevEvents.map((e) => {
            if (e._id === eventId) {
              // Get the updated event from the response
              const updatedEvent = { ...response.data.data };
              // Calculate the status based on dates
              updatedEvent.calculatedStatus =
                calculateEventStatus(updatedEvent);
              return updatedEvent;
            }
            return e;
          })
        );

        toast.success("Event restored successfully");
      }
    } catch (error) {
      console.error("Error restoring event:", error);
      toast.error("Failed to restore event");
    } finally {
      setStatusUpdateLoading(false);
      setActiveDropdown(null); // Close the dropdown
    }
  };

  // Get status badge color
  const getStatusBadge = (event) => {
    // Use calculatedStatus if available, otherwise fall back to status
    const status = event.calculatedStatus || event.status;

    switch (status) {
      case "upcoming":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <Calendar className="h-3 w-3 mr-1" />,
        };
      case "ongoing":
        return {
          color: "bg-green-100 text-green-700",
          icon: <CalendarCheck className="h-3 w-3 mr-1" />,
        };
      case "past":
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <CalendarX className="h-3 w-3 mr-1" />,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700",
          icon: <CalendarOff className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          color: "bg-purple-100 text-purple-700",
          icon: <Calendar className="h-3 w-3 mr-1" />,
        };
    }
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

  // Apply date filter
  const applyDateFilter = () => {
    setCurrentPage(1); // Reset to first page when applying filter
    setIsDateFilterOpen(false);
  };

  // Handle checkbox selection
  const handleSelectEvent = (id) => {
    setSelectedEvents((prev) => {
      if (prev.includes(id)) {
        return prev.filter((eventId) => eventId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map((event) => event._id));
    }
    setSelectAll(!selectAll);
  };

  // Check if all visible events are selected
  useEffect(() => {
    if (events.length > 0 && selectedEvents.length === events.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedEvents, events]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Title",
      "Description",
      "Start Date",
      "End Date",
      "Location",
      "Category",
      "Status",
      "Featured",
      "Registration URL",
      "Capacity",
      "Organizer",
    ];

    const csvRows = [
      headers.join(","),
      ...events.map((item) =>
        [
          `"${item.title || ""}"`,
          `"${(item.description || "").replace(/"/g, '""')}"`,
          `"${formatDate(item.startDate)}"`,
          `"${formatDate(item.endDate)}"`,
          `"${item.location || ""}"`,
          `"${item.category || ""}"`,
          `"${item.calculatedStatus || item.status || ""}"`,
          `"${item.featured ? "Yes" : "No"}"`,
          `"${item.registrationUrl || ""}"`,
          `"${item.capacity || ""}"`,
          `"${item.organizer || ""}"`,
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
      `events_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${events.length} events to CSV`);
  };

  // Add a new function to export selected events to CSV after the existing exportToCSV function (around line 1000)
  const exportSelectedToCSV = () => {
    // Find the selected events from the events array
    const selectedEventsData = events.filter((event) =>
      selectedEvents.includes(event._id)
    );

    const headers = [
      "Title",
      "Description",
      "Start Date",
      "End Date",
      "Location",
      "Category",
      "Status",
      "Featured",
      "Registration URL",
      "Capacity",
      "Organizer",
    ];

    const csvRows = [
      headers.join(","),
      ...selectedEventsData.map((item) =>
        [
          `"${item.title || ""}"`,
          `"${(item.description || "").replace(/"/g, '""')}"`,
          `"${formatDate(item.startDate)}"`,
          `"${formatDate(item.endDate)}"`,
          `"${item.location || ""}"`,
          `"${item.category || ""}"`,
          `"${item.calculatedStatus || item.status || ""}"`,
          `"${item.featured ? "Yes" : "No"}"`,
          `"${item.registrationUrl || ""}"`,
          `"${item.capacity || ""}"`,
          `"${item.organizer || ""}"`,
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
      `selected_events_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `Exported ${selectedEventsData.length} selected events to CSV`
    );
    setIsBulkActionOpen(false);
  };

  // 1. Add a function to check if all selected events are cancelled
  const areAllSelectedEventsCancelled = () => {
    if (selectedEvents.length === 0) return false;
    return selectedEvents.every((id) => {
      const event = events.find((e) => e._id === id);
      return (
        event &&
        (event.status === "cancelled" || event.calculatedStatus === "cancelled")
      );
    });
  };

  // 2. Add a function to check if any selected events are cancelled
  const areAnySelectedEventsCancelled = () => {
    if (selectedEvents.length === 0) return false;
    return selectedEvents.some((id) => {
      const event = events.find((e) => e._id === id);
      return (
        event &&
        (event.status === "cancelled" || event.calculatedStatus === "cancelled")
      );
    });
  };

  // 3. Add a bulk restore function
  const performBulkRestore = async () => {
    if (selectedEvents.length === 0) {
      toast.error("No events selected");
      return;
    }

    try {
      setBulkActionLoading(true);

      // Handle bulk restore
      for (const eventId of selectedEvents) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
          {
            status: "",
          }
        );
      }

      // Update local state with restored status
      setEvents((prev) =>
        prev.map((event) => {
          if (selectedEvents.includes(event._id)) {
            const updatedEvent = { ...event, status: "" };
            updatedEvent.calculatedStatus = calculateEventStatus(updatedEvent);
            return updatedEvent;
          }
          return event;
        })
      );

      toast.success(`Restored ${selectedEvents.length} events successfully`);
      setIsBulkRestoreModalOpen(false);

      // Clear selection
      setSelectedEvents([]);
      setSelectAll(false);
      setIsBulkActionOpen(false);
    } catch (error) {
      console.error("Error performing bulk restore:", error);
      toast.error("Failed to restore events");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Perform bulk action
  const performBulkAction = async (action) => {
    if (selectedEvents.length === 0) {
      toast.error("No events selected");
      return;
    }

    try {
      setBulkActionLoading(true);

      if (action === "delete") {
        // Handle bulk delete
        for (const eventId of selectedEvents) {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/events/${eventId}`
          );
        }

        // Update local state to remove deleted events
        setEvents((prev) =>
          prev.filter((event) => !selectedEvents.includes(event._id))
        );

        // Update total count
        setTotalEvents((prev) => prev - selectedEvents.length);

        // If we deleted all items on the page and it's not the first page, go to previous page
        if (selectedEvents.length === events.length && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }

        toast.success(`Deleted ${selectedEvents.length} events successfully`);
        setIsBulkDeleteModalOpen(false);
      } else if (action === "cancel") {
        // Handle bulk cancel
        for (const eventId of selectedEvents) {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
            {
              status: "cancelled",
            }
          );
        }

        // Update local state with cancelled status
        setEvents((prev) =>
          prev.map((event) =>
            selectedEvents.includes(event._id)
              ? { ...event, status: "cancelled", calculatedStatus: "cancelled" }
              : event
          )
        );

        toast.success(`Cancelled ${selectedEvents.length} events successfully`);
        setIsBulkCancelModalOpen(false);
      }

      // Clear selection
      setSelectedEvents([]);
      setSelectAll(false);
      setIsBulkActionOpen(false);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-12 px-4 rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> Events
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover stories, insights, and knowledge from our community
          </p>
        </div>
      </div>
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-blue-700">
            Events Management
          </h2>
          <button
            onClick={() => fetchEvents(true)}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              refreshing ? "animate-spin" : ""
            }`}
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
              placeholder="Search events... (Ctrl+/)"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1); // Reset to first page when clearing search
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
                {filterStatus
                  ? `Status: ${
                      filterStatus.charAt(0).toUpperCase() +
                      filterStatus.slice(1)
                    }`
                  : "Status"}
              </span>
              {filterStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterStatus("");
                    setCurrentPage(1); // Reset to first page when clearing filter
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
                  <h3 className="font-medium text-gray-700">
                    Filter by Status
                  </h3>
                </div>
                <div className="p-2">
                  {["upcoming", "ongoing", "past", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsFilterOpen(false);
                          setCurrentPage(1); // Reset to first page when applying filter
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filterStatus === status
                            ? "bg-purple-100 text-purple-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {getStatusBadge({ status }).icon}
                          <span className="capitalize">{status}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Category Filter Button */}
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
              <span>
                {filterCategory ? `Category: ${filterCategory}` : "Category"}
              </span>
              {filterCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterCategory("");
                    setCurrentPage(1); // Reset to first page when clearing filter
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>

            {/* Category Filter Dropdown */}
            {isCategoryFilterOpen && (
              <div
                ref={categoryFilterRef}
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
              >
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">
                    Filter by Category
                  </h3>
                </div>
                <div className="p-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setFilterCategory(category);
                          setIsCategoryFilterOpen(false);
                          setCurrentPage(1); // Reset to first page when applying filter
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filterCategory === category
                            ? "bg-purple-100 text-purple-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span>{category}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      No categories found
                    </div>
                  )}
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
                    e.stopPropagation();
                    setDateFilter("all");
                    setCurrentPage(1); // Reset to first page when clearing filter
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
                        setDateFilter(option.id);
                        if (option.id !== "custom") {
                          setIsDateFilterOpen(false);
                          setCurrentPage(1); // Reset to first page when applying filter
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilter === option.id
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-100"
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
                          <label className="block text-sm text-gray-600 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={customDateRange.startDate}
                            onChange={(e) =>
                              setCustomDateRange((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={customDateRange.endDate}
                            onChange={(e) =>
                              setCustomDateRange((prev) => ({
                                ...prev,
                                endDate: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </div>
                        <button
                          onClick={applyDateFilter}
                          disabled={
                            !customDateRange.startDate ||
                            !customDateRange.endDate
                          }
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

          {/* Featured Filter Button */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterFeatured(
                  filterFeatured === ""
                    ? "true"
                    : filterFeatured === "true"
                    ? "false"
                    : ""
                );
                setCurrentPage(1); // Reset to first page when changing filter
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                filterFeatured !== ""
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Star className="h-4 w-4" />
              <span>
                {filterFeatured === "true"
                  ? "Featured"
                  : filterFeatured === "false"
                  ? "Not Featured"
                  : "Featured"}
              </span>
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={events.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          {/* Add Event Button */}
          <button
            onClick={openAddEventModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions - Dropdown menu like in newsletter section */}
      {selectedEvents.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">
            {selectedEvents.length} selected
          </span>

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
                    onClick={() => {
                      exportSelectedToCSV();
                    }}
                    disabled={bulkActionLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4 text-green-500" />
                    Export Selected to CSV
                  </button>
                  {!areAllSelectedEventsCancelled() && (
                    <button
                      onClick={() => {
                        setIsBulkActionOpen(false);
                        setIsBulkCancelModalOpen(true);
                      }}
                      disabled={bulkActionLoading}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Ban className="h-4 w-4 text-orange-500" />
                      Cancel Selected
                    </button>
                  )}

                  {areAnySelectedEventsCancelled() && (
                    <button
                      onClick={() => {
                        setIsBulkActionOpen(false);
                        setIsBulkRestoreModalOpen(true);
                      }}
                      disabled={bulkActionLoading}
                      className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Restore Selected
                    </button>
                  )}

                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setIsBulkActionOpen(false);
                      setIsBulkDeleteModalOpen(true);
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
            onClick={() => setSelectedEvents([])}
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
          <span className="ml-2 text-lg text-gray-600">Loading events...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">No events found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm ||
            filterStatus ||
            filterCategory ||
            filterFeatured ||
            dateFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Events will appear here once created"}
          </p>
          {(searchTerm ||
            filterStatus ||
            filterCategory ||
            filterFeatured !== "" ||
            dateFilter !== "all") && (
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("");
                setFilterCategory("");
                setFilterFeatured("");
                setDateFilter("all");
                setCurrentPage(1);
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
                    {/* Checkbox column */}
                    <th className="w-[5%] px-3 py-3 text-left">
                      <div className="flex items-center">
                        <button
                          onClick={handleSelectAll}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={selectAll ? "Deselect all" : "Select all"}
                        >
                          {selectAll ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </th>
                    <th
                      className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Event {renderSortIndicator("title")}
                      </div>
                    </th>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("startDate")}
                    >
                      <div className="flex items-center gap-1">
                        Date {renderSortIndicator("startDate")}
                      </div>
                    </th>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("location")}
                    >
                      <div className="flex items-center gap-1">
                        Location {renderSortIndicator("location")}
                      </div>
                    </th>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("category")}
                    >
                      <div className="flex items-center gap-1">
                        Category {renderSortIndicator("category")}
                      </div>
                    </th>
                    <th
                      className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status {renderSortIndicator("status")}
                      </div>
                    </th>
                    <th className="w-[15%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Checkbox cell */}
                      <td className="px-3 py-4">
                        <button
                          onClick={() => handleSelectEvent(event._id)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={
                            selectedEvents.includes(event._id)
                              ? "Deselect"
                              : "Select"
                          }
                        >
                          {selectedEvents.includes(event._id) ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            {event.imageUrl ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL}${
                                  event.imageUrl
                                }`}
                                alt={event.title}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {event.title}
                            </span>
                            {event.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>{formatDate(event.startDate)}</span>
                          <span className="text-xs text-gray-400">to</span>
                          <span>{formatDate(event.endDate)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                          <Tag className="h-3 w-3 mr-1" />
                          {event.category}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            getStatusBadge(event).color
                          }`}
                        >
                          {getStatusBadge(event).icon}
                          <span className="capitalize">
                            {event.calculatedStatus || event.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        <div className="flex justify-center">
                          <div className="relative">
                            <button
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={() =>
                                toggleDropdown(`action-${event._id}`)
                              }
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="h-5 w-5 text-gray-500" />
                            </button>

                            {/* Actions Dropdown */}
                            {activeDropdown === `action-${event._id}` && (
                              <div
                                ref={(el) =>
                                  (dropdownRefs.current[`action-${event._id}`] =
                                    el)
                                }
                                className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                              >
                                <button
                                  onClick={() => openEditEventModal(event)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </button>

                                {event.status !== "cancelled" ? (
                                  <button
                                    onClick={() => cancelEvent(event._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                  >
                                    <Ban className="h-4 w-4" />
                                    Cancel Event
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => restoreEvent(event._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                  >
                                    <Calendar className="h-4 w-4" />
                                    Restore Event
                                  </button>
                                )}

                                <button
                                  onClick={() => confirmDeleteEvent(event)}
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
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleSelectEvent(event._id)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
                      aria-label={
                        selectedEvents.includes(event._id)
                          ? "Deselect"
                          : "Select"
                      }
                    >
                      {selectedEvents.includes(event._id) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <div className="h-12 w-12 flex-shrink-0 mr-3">
                      {event.imageUrl ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            event.imageUrl
                          }`}
                          alt={event.title}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            getStatusBadge(event).color
                          }`}
                        >
                          {getStatusBadge(event).icon}
                          <span className="capitalize">
                            {event.calculatedStatus || event.status}
                          </span>
                        </div>
                        {event.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={() => toggleDropdown(`mobile-${event._id}`)}
                      aria-label="Actions"
                    >
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>

                    {/* Mobile Actions Dropdown */}
                    {activeDropdown === `mobile-${event._id}` && (
                      <div
                        ref={(el) =>
                          (dropdownRefs.current[`mobile-${event._id}`] = el)
                        }
                        className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      >
                        <button
                          onClick={() => openEditEventModal(event)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>

                        {event.status !== "cancelled" ? (
                          <button
                            onClick={() => cancelEvent(event._id)}
                            className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                          >
                            <Ban className="h-4 w-4" />
                            Cancel Event
                          </button>
                        ) : (
                          <button
                            onClick={() => restoreEvent(event._id)}
                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Restore Event
                          </button>
                        )}

                        <button
                          onClick={() => confirmDeleteEvent(event)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span>{event.category}</span>
                  </div>

                  {event.organizer && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{event.organizer}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => openEditEventModal(event)}
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  {event.status !== "cancelled" ? (
                    <button
                      onClick={() => cancelEvent(event._id)}
                      className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 flex items-center gap-1"
                    >
                      <Ban className="h-4 w-4" />
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreEvent(event._id)}
                      className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 flex items-center gap-1"
                    >
                      <Calendar className="h-4 w-4" />
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() => confirmDeleteEvent(event)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {totalEvents > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalEvents)}
                  </span>{" "}
                  of <span className="font-medium">{totalEvents}</span> events
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* First Page Button */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronFirst className="h-5 w-5" />
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  {/* Page Numbers */}
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
                          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
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
                          <label className="block text-sm text-gray-600 mb-2">
                            Jump to page:
                          </label>
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
                  <label
                    htmlFor="items-per-page"
                    className="text-sm text-gray-500"
                  >
                    Items per page:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
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

      {/* Event Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Event" : "Add New Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventFormData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.title
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-purple-500"
                    }`}
                    placeholder="Enter event title"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={eventFormData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.startDate
                          ? "border-red-300 focus:ring-red-500"
                          : "focus:ring-purple-500"
                      }`}
                    />
                    {formErrors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={eventFormData.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.endDate
                          ? "border-red-300 focus:ring-red-500"
                          : "focus:ring-purple-500"
                      }`}
                    />
                    {formErrors.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventFormData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.location
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-purple-500"
                    }`}
                    placeholder="Enter event location"
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={eventFormData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.category
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-purple-500"
                    }`}
                    placeholder="Enter event category (e.g., Workshop, Conference)"
                  />
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventFormData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.description
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-purple-500"
                    }`}
                    placeholder="Enter event description"
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image{" "}
                    {!isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 ${
                      formErrors.image
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-purple-500"
                    } transition-colors cursor-pointer`}
                    onClick={() =>
                      document.getElementById("eventImage").click()
                    }
                  >
                    <input
                      type="file"
                      id="eventImage"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Event preview"
                          className="h-40 object-contain mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Click to change image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Recommended size: 600x400px or 3:2 ratio
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Click to upload event image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPEG, PNG, WEBP (max 5MB)
                        </p>
                        <p className="text-xs text-gray-400">
                          Recommended size: 600x400px or 3:2 ratio
                        </p>
                      </div>
                    )}
                  </div>
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.image}
                    </p>
                  )}
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Registration URL */}
                  <div>
                    <label
                      htmlFor="registrationUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Registration URL
                    </label>
                    <input
                      type="url"
                      id="registrationUrl"
                      name="registrationUrl"
                      value={eventFormData.registrationUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/register"
                    />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={eventFormData.capacity}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Maximum number of attendees"
                    />
                  </div>
                </div>

                {/* Organizer */}
                <div>
                  <label
                    htmlFor="organizer"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organizer
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={eventFormData.organizer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter organizer name"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={eventFormData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Mark as featured event
                  </label>
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
                  <span>{isEditing ? "Update Event" : "Create Event"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                Delete Event
              </h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to delete the event {eventToDelete.title}?
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteEvent}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Event</span>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                Bulk Delete Events
              </h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{selectedEvents.length}</span>{" "}
                selected events? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => performBulkAction("delete")}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  {bulkActionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Selected</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Cancel Confirmation Modal */}
      {isBulkCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
                <Ban className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                Cancel Events
              </h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to cancel{" "}
                <span className="font-medium">{selectedEvents.length}</span>{" "}
                selected events? This will mark them as cancelled.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsBulkCancelModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  No, Keep Events
                </button>
                <button
                  onClick={() => performBulkAction("cancel")}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors flex items-center"
                >
                  {bulkActionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel Events</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Restore Confirmation Modal */}
      {isBulkRestoreModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                Restore Events
              </h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to restore{" "}
                <span className="font-medium">{selectedEvents.length}</span>{" "}
                selected events? This will recalculate their status based on
                dates.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsBulkRestoreModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={performBulkRestore}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center"
                >
                  {bulkActionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <span>Yes, Restore Events</span>
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
