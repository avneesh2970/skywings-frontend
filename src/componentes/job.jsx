"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { useState, useEffect, useRef, useCallback } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function Job() {
  const navigate = useNavigate();
  // Add searchParams hook to handle URL parameters for pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobSearch, setJobSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Update jobs state to include pagination data
  const [jobs, setJobs] = useState({
    count: 0,
    num_pages: 0,
    limit: 20,
    page_number: 1,
    page_count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [initialJobs, setInitialJobs] = useState({
    count: 0,
    num_pages: 0,
    limit: 20,
    page_number: 1,
    page_count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add currentPage state to track the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });
  const [isSearching, setIsSearching] = useState(false);

  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true);
  const debounceTimerRef = useRef(null);
  const prevSearchParamsRef = useRef("");

  // Check screen size with more granular breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Initial data fetch and page changes
  useEffect(() => {
    // Get page from URL or default to 1
    const pageParam = searchParams.get("page");
    const initialPage = pageParam ? Number.parseInt(pageParam) : 1;
    setCurrentPage(initialPage);

    // Store current search params to compare later
    const currentSearchParamsString = searchParams.toString();

    // Skip if the search params haven't changed (prevents duplicate fetches)
    if (
      currentSearchParamsString === prevSearchParamsRef.current &&
      !initialLoadRef.current
    ) {
      return;
    }

    prevSearchParamsRef.current = currentSearchParamsString;

    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Cancel any ongoing fetch requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Update API call to include page parameter
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs${
            initialPage > 1 ? `?page=${initialPage}` : ""
          }`,
          {
            signal,
            credentials: "include", // Enables sending cookies/auth headers
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Only update state if the request wasn't aborted
        if (!signal.aborted) {
          setJobs(data);

          // Store initial jobs data for reference
          if (initialLoadRef.current) {
            setInitialJobs(data);
            initialLoadRef.current = false;
          }

          setError(null);
          setLoading(false);
        }
      } catch (err) {
        // Only update error state if the request wasn't aborted
        if (err.name !== "AbortError") {
          console.error("Error fetching jobs:", err);
          setError("Failed to load jobs. Please try again later.");
          setLoading(false);
        }
      }
    };

    fetchJobs();

    // Cleanup function to cancel any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchParams]); // Add searchParams as dependency to refetch when page changes

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const locationName =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "Current Location";
            setCurrentLocation(locationName);
            setLocationSearch(locationName);

            // Trigger search with the new location
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current);
              debounceTimerRef.current = null;
            }
            debouncedSearch();
          } catch (error) {
            console.error("Error getting location name:", error);
            setCurrentLocation("Unable to get location");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location access denied");
          setIsLoading(false);
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
      setIsLoading(false);
    }
  };

  // Add function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    // Scroll to top when changing pages for better UX
    window.scrollTo(0, 0);
  };

  // Debounced search function
  const debouncedSearch = useCallback(() => {
    // If both search fields are empty, restore initial jobs
    if (!jobSearch && !locationSearch) {
      setJobs(initialJobs);
      setIsSearching(false);
      return;
    }

    // Set a flag to indicate search is in progress
    setIsSearching(true);
    setLoading(true);

    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Create a new timeout
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Cancel any ongoing fetch requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const params = new URLSearchParams();
        if (jobSearch) params.append("query", jobSearch);
        if (locationSearch) params.append("location", locationSearch);

        // Reset to page 1 when searching
        setCurrentPage(1);

        // Update search params without triggering a navigation
        const newSearchParams = new URLSearchParams({ page: "1" });
        setSearchParams(newSearchParams, { replace: true });
        prevSearchParamsRef.current = newSearchParams.toString();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/searchjobs?${params.toString()}`,
          { signal }
        );

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Format the search results to match the expected pagination format
        const formattedData = {
          ...data,
          num_pages: Math.ceil(data.count / 20), // Assuming 20 items per page
          page_number: 1,
          limit: 20,
          page_count: data.results.length,
        };

        setJobs(formattedData);
        setError(null);
      } catch (err) {
        // Only update error state if the request wasn't aborted
        if (err.name !== "AbortError") {
          console.error("Error searching jobs:", err);
          setError("Failed to search jobs. Please try again later.");
        }
      } finally {
        setLoading(false);
        setIsSearching(false);
        debounceTimerRef.current = null;
      }
    }, 500); // 500ms delay
  }, [jobSearch, locationSearch, initialJobs, setSearchParams]);

  // Handle input changes with debounce
  const handleJobSearchChange = (e) => {
    setJobSearch(e.target.value);

    // If both fields are empty after this change, restore initial jobs
    if (e.target.value === "" && locationSearch === "") {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setJobs(initialJobs);
      setIsSearching(false);
      setLoading(false);
      return;
    }

    debouncedSearch();
  };

  const handleLocationSearchChange = (e) => {
    setLocationSearch(e.target.value);

    // If both fields are empty after this change, restore initial jobs
    if (e.target.value === "" && jobSearch === "") {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setJobs(initialJobs);
      setIsSearching(false);
      setLoading(false);
      return;
    }

    debouncedSearch();
  };

  // Handle manual search button click
  const handleSearchClick = (e) => {
    e.preventDefault();

    // Clear any existing timeout to execute search immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    debouncedSearch();
  };

  // Handle clearing search inputs
  const handleClearSearch = () => {
    setJobSearch("");
    setLocationSearch("");
    setJobs(initialJobs);
    setCurrentPage(1);
    setSearchParams({ page: "1" });
    setLoading(false);
    setIsSearching(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

  // Add a function to sort jobs by date (newest first)
  // Place this before the return statement

  // Sort jobs based on creation date or start date (newest first)
  const sortJobsByDate = (jobs) => {
    if (!jobs || !Array.isArray(jobs)) return [];

    return [...jobs].sort((a, b) => {
      // Try to use creation_date if available
      if (a.creation_date && b.creation_date) {
        return new Date(b.creation_date) - new Date(a.creation_date);
      }

      // Fall back to job_start_date
      if (a.job_start_date && b.job_start_date) {
        return new Date(b.job_start_date) - new Date(a.job_start_date);
      }

      // If no dates available, keep original order
      return 0;
    });
  };

  // Update the filteredJobs definition to use the sorting function
  // Replace the existing filteredJobs definition with this:
  const filteredJobs = sortJobsByDate(
    jobs?.results
      ?.filter((job) => {
        if (!jobSearch) return true;

        const jobTitleMatch = job.job_title
          ?.toLowerCase()
          .includes(jobSearch.toLowerCase());
        const companyMatch = job.client
          ?.toLowerCase()
          .includes(jobSearch.toLowerCase());
        const skillsMatch = job.skills
          ?.toLowerCase()
          .includes(jobSearch.toLowerCase());

        return jobTitleMatch || companyMatch || skillsMatch;
      })
      .filter((job) => {
        if (!locationSearch) return true;

        const cityMatch = job.city
          ?.toLowerCase()
          .includes(locationSearch.toLowerCase());
        const countryMatch = job.country
          ?.toLowerCase()
          .includes(locationSearch.toLowerCase());
        const postalCodeMatch = job.zip_code
          ?.toString()
          .includes(locationSearch);

        return cityMatch || countryMatch || postalCodeMatch;
      })
  );

  function decodeEntities(encodedString) {
    if (!encodedString) return "";
    const textarea = document.createElement("textarea");
    textarea.innerHTML = encodedString;
    return textarea.value;
  }

  // Add function to generate pagination numbers
  const generatePaginationNumbers = () => {
    const totalPages = jobs.num_pages || 1;
    const currentPageNum = jobs.page_number || 1;

    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, currentPageNum - 1);
    const end = Math.min(totalPages - 1, currentPageNum + 1);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <div className="">
        <div className="bg-gray-100 text-center px-6 sm:px-8 py-10 cursor-default">
          <div className="text-[#42307D] w-full  text-center  px-4 lg:px-8">
            <p className="text-2xl sm:text-3xl lg:text-5xl font-semibold leading-tight">
              Find your dream job with us
            </p>

            <p className="text-[#6941C6] mt-4 text-lg sm:text-base lg:text-lg">
              Assure you better tomorrow
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 sticky top-20 w-full z-10">
        <form
          onSubmit={handleSearchClick}
          className="flex flex-col gap-3 p-3 md:p-4 rounded-lg shadow bg-white mx-auto w-full md:w-11/12 max-w-4xl"
        >
          {/* First row: Job Search Input and Location Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Job Search Input */}
            <div className="relative flex-1">
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={screenSize.isMobile ? 14 : 18}
              />
              <input
                type="text"
                name="job"
                value={jobSearch}
                onChange={handleJobSearchChange}
                placeholder="Search by job or skill"
                aria-label="Job Search"
                className="w-full pl-10 pr-4 py-2 outline-0 border rounded text-sm md:text-base"
              />
              {jobSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setJobSearch("");

                    // If location is also empty, restore initial jobs
                    if (locationSearch === "") {
                      setJobs(initialJobs);
                      setIsSearching(false);
                      setLoading(false);
                    } else {
                      debouncedSearch();
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear job search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Input */}
            <div className="relative flex-1">
              <FaMapMarkerAlt
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={screenSize.isMobile ? 14 : 18}
              />
              <input
                type="text"
                name="location"
                value={locationSearch}
                onChange={handleLocationSearchChange}
                placeholder="Location"
                aria-label="Location"
                className="w-full pl-10 pr-4 py-2 outline-0 border rounded text-sm md:text-base"
              />
              {locationSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocationSearch("");

                    // If job search is also empty, restore initial jobs
                    if (jobSearch === "") {
                      setJobs(initialJobs);
                      setIsSearching(false);
                      setLoading(false);
                    } else {
                      debouncedSearch();
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear location search"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-4 text-lg py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                isSearching ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <p>
                {isSearching ? "Searching..." : `Search ${jobs.count} jobs`}
              </p>
            </button>
          </div>

          {/* Second row: Current Location button and display */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Use Current Location Button */}
            <p
              onClick={handleGetCurrentLocation}
              className="flex items-center justify-center gap-2 bg-white hover:underline rounded-lg px-3 py-2 text-gray-700 cursor-pointer transition w-full sm:w-auto text-sm md:text-base"
            >
              <FaLocationArrow
                className="text-blue-500"
                size={screenSize.isMobile ? 12 : 16}
              />
              {isLoading ? "Getting location..." : "Use Current Location"}
            </p>

            {currentLocation && (
              <div className="text-gray-700 text-xs sm:text-sm flex-1 mt-2 sm:mt-0">
                <span className="font-medium">Current: </span>
                {currentLocation}
              </div>
            )}

            {/* Clear all filters button */}
            {(jobSearch || locationSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="p-6 bg-[#F9F5FF]">
        {loading ? (
          // Add loading spinner for better UX
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Search results summary */}
            {(jobSearch || locationSearch) && (
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold">
                  Found {jobs.count || 0} matching jobs
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mx-5 lg:mx-10">
              {filteredJobs && filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white shadow-md p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="min-h-[36px] max-h-[52px] flex items-center break-words text-base sm:text-lg lg:text-lg font-semibold clamp-2-lines">
                      {job.job_title}
                    </h3>

                    <p className="min-h-12 max-h-14 text-gray-600 flex items-center gap-2.5 mt-2">
                      <MdLocationOn className="text-purple-500 min-w-5 max-w-5 h-4 sm:w-5 sm:h-5" />{" "}
                      {job.city} {!job.city ? "" : ","} {job.country}
                    </p>
                    <div className="mt-2">
                      <p className="text-gray-600 font-semibold">
                        Experience: <span>{job.experience} yr</span>
                      </p>
                    </div>
                    <span className="flex gap-2 space-x-2.5 text-blue-500 font-semibold mt-2">
                      <CalendarDays />
                      {job.job_start_date
                        ? job.job_start_date
                        : "Not Specified"}
                    </span>
                    <Link
                      to={{
                        pathname: `/jobdetails/${job.id}`,
                        search: `?source=${encodeURIComponent(
                          JSON.stringify({
                            id: job.id,
                            job_title: job.job_title,
                            client: job.client,
                            city: job.city,
                            country: job.country,
                            experience: job.experience,
                            job_start_date: job.job_start_date,
                            apply_job_without_registration:
                              job.apply_job_without_registration,
                            job_description: job.job_description,
                            // Add any other essential fields you need
                          })
                        )}`,
                      }}
                    >
                      <button className="mt-4 w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg py-1 transition-colors">
                        View Details
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg">
                    No jobs found matching your search criteria.
                  </p>
                  {(jobSearch || locationSearch) && (
                    <button
                      onClick={handleClearSearch}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Add Pagination Component */}
            {jobs.num_pages > 1 && filteredJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  {/* Previous Page Button */}
                  <button
                    onClick={() =>
                      jobs.previous && handlePageChange(jobs.page_number - 1)
                    }
                    disabled={!jobs.previous}
                    className={`p-2 rounded-md ${
                      !jobs.previous
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:bg-blue-50"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page Numbers */}
                  {generatePaginationNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          page === jobs.page_number
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Page Button */}
                  <button
                    onClick={() =>
                      jobs.next && handlePageChange(jobs.page_number + 1)
                    }
                    disabled={!jobs.next}
                    className={`p-2 rounded-md ${
                      !jobs.next
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-500 hover:bg-blue-50"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Job;
