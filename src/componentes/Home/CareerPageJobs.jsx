"use client"

import { useNavigate } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"
import bag from "../../assets/products/Vector.png"
import { Link } from "react-router-dom"
import { CalendarDays } from "lucide-react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

import { useState, useEffect, useRef } from "react"

function CareerPageJobs() {
  const navigate = useNavigate()
  const [jobSearch, setJobSearch] = useState("")
  const [locationSearch, setLocationSearch] = useState("")
  const [currentLocation, setCurrentLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })
  const [visibleJobsCount, setVisibleJobsCount] = useState(5)

  const carouselRef = useRef(null)

  // Check screen size with more granular breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      })
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const handleGetCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get location name from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
            )
            const data = await response.json()

            // Extract city name or area from the response
            const locationName =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "Current Location"

            setCurrentLocation(locationName)
            setLocationSearch(locationName)
            setIsLoading(false)
          } catch (error) {
            console.error("Error getting location name:", error)
            setCurrentLocation("Unable to get location")
            setIsLoading(false)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setCurrentLocation("Location access denied")
          setIsLoading(false)
        },
      )
    } else {
      setCurrentLocation("Geolocation not supported")
      setIsLoading(false)
    }
  }

  // Carousel navigation
  const nextSlide = () => {
    if (currentSlide < filteredJobs.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      setCurrentSlide(0) // Loop back to first slide
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else {
      setCurrentSlide(filteredJobs.length - 1) // Loop to last slide
    }
  }

  // Update carousel position when currentSlide changes
  useEffect(() => {
    if (carouselRef.current && !screenSize.isDesktop) {
      carouselRef.current.scrollTo({
        left: currentSlide * carouselRef.current.offsetWidth,
        behavior: "smooth",
      })
    }
  }, [currentSlide, screenSize.isDesktop])

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setJobs(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Determine number of columns based on screen size
  const getGridCols = () => {
    if (screenSize.isDesktop) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    if (screenSize.isTablet) return "grid-cols-1 sm:grid-cols-2"
    return "grid-cols-1"
  }

  // Filter jobs for Skywings Advisors Pvt. Ltd. and apply search filters
  const filteredJobs = jobs?.results
    ?.filter((job) => job.client === "Skywings Advisors Pvt. Ltd.")
    ?.filter((job) => {
      const jobTitleMatch = job.job_title?.toLowerCase().includes(jobSearch.toLowerCase())
      const companyMatch =
        job.client && typeof job.client === "string"
          ? job.client.toLowerCase().includes(jobSearch.toLowerCase())
          : false

      return jobTitleMatch || companyMatch
    })
    ?.filter((job) => {
      const cityMatch = job.city?.toLowerCase().includes(locationSearch.toLowerCase())

      const postalCodeMatch = job.zip_code?.toString().includes(locationSearch)

      // Match either city or postal code (or both)
      return cityMatch || postalCodeMatch
    })
console.log("filteredJobs: ", filteredJobs)
  // Get visible jobs based on the current count
  const visibleJobs = filteredJobs?.slice(0, visibleJobsCount)

  // Handle "Show More" button click
  const handleShowMore = () => {
    setVisibleJobsCount((prevCount) => prevCount + 5)
  }

  return (
    <>
      {/* Job Cards Section */}
      <div className="flex flex-col items-center w-full p-3 md:p-6 bg-[#F9F5FF]">
        {/* Desktop View - Grid Layout */}
        {screenSize.isDesktop ? (
          <div className="">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
            ) : (
              <>
                <div className={`grid ${getGridCols()} gap-2 mt-6 w-full max-w-6xl`}>
                  {visibleJobs?.map((job, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-md rounded-2xl px-1 md:px-3.5 py-4 md:py-6 border w-full border-gray-200 transition-transform hover:scale-102 hover:shadow-lg min-h-[220px] flex flex-col"
                    >
                      <div className="">
                        <h3 className="min-h-[52px] max-h-[52px] flex items-center break-words text-base sm:text-lg lg:text-lg font-semibold min-clamp-2-lines max-clamp-2-lines">
                          {job.job_title}
                        </h3>
                      </div>

                      <div className="pt-5 text-gray-600 space-y-1">
                        <p className="flex items-center space-x-2 text-xs sm:text-sm lg:text-base">
                          <MdLocationOn className="text-purple-500 w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="flex flex-wrap min-h-8 max-h-12 w-full truncate">
                            {job.city} {!job.city ? "" : ","} {job.country}
                          </span>
                        </p>

                        <div className="space-y-1 mb-2">
                          <p className="text-gray-600 font-semibold">
                            Experience: <span>{job.experience} yr</span>
                          </p>
                        </div>

                        <span className="flex gap-2 space-x-2.5 text-blue-500 font-semibold">
                          <CalendarDays />
                          {job.job_start_date}
                        </span>
                        <Link to={`/jobdetails/${job.id}`}>
                          <button className="mt-4 w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg py-1">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Mobile and Tablet View - Carousel Layout */
          <div className="w-full max-w-md mt-6 md:mt-10 px-2">
            {/* Carousel Container */}
            <div className="relative">
              {/* Carousel Navigation - Left Arrow */}
              {filteredJobs?.length > 1 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100"
                  aria-label="Previous job"
                >
                  <FaChevronLeft className="text-purple-500" size={screenSize.isMobile ? 12 : 16} />
                </button>
              )}

              {/* Carousel Items */}
              <div ref={carouselRef} className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out">
                  {filteredJobs?.length > 0 ? (
                    <div className="min-w-full p-2">
                      <div className="bg-white shadow-md rounded-2xl p-4 md:p-6 border border-gray-200">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold">{filteredJobs[currentSlide].job_title}</h3>
                          <p className="text-gray-500 text-sm md:text-base">{filteredJobs[currentSlide].client}</p>
                        </div>

                        <div className="mt-3 md:mt-4 text-gray-600 space-y-2">
                          <p className="flex items-center text-xs md:text-sm space-x-2">
                            <span>
                              <MdLocationOn className="text-gray-400" />
                            </span>{" "}
                            <span>
                              {filteredJobs[currentSlide].city} {!filteredJobs[currentSlide].city ? "" : ","}{" "}
                              {filteredJobs[currentSlide].country}
                            </span>
                          </p>
                          <p className="flex items-center text-xs md:text-sm space-x-2">
                            <span>
                              <img src={bag || "/placeholder.svg"} alt="" className="w-4 h-4" />
                            </span>{" "}
                            <span>Experience: {filteredJobs[currentSlide].experience} yr</span>
                          </p>
                        </div>
                        <Link to={`/jobdetails/${filteredJobs[currentSlide].id}`}>
                          <button className="mt-3 md:mt-4 w-full py-1.5 md:py-2 border-2 border-purple-500 text-purple-500 font-semibold rounded-lg hover:bg-[#647DE7] hover:text-white transition cursor-pointer text-sm md:text-base">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center p-6 text-sm md:text-base">No jobs found matching your search criteria.</p>
                  )}
                </div>
              </div>

              {/* Carousel Navigation - Right Arrow */}
              {filteredJobs?.length > 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100"
                  aria-label="Next job"
                >
                  <FaChevronRight className="text-purple-500" size={screenSize.isMobile ? 12 : 16} />
                </button>
              )}
            </div>

            {/* Carousel Indicators */}
            {filteredJobs?.length > 1 && (
              <div className="flex justify-center mt-3 space-x-1.5">
                {filteredJobs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      currentSlide === index ? "bg-purple-500 w-3" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Current Slide / Total Slides */}
            {filteredJobs?.length > 0 && (
              <p className="text-center mt-2 text-xs text-gray-500">
                {currentSlide + 1} of {filteredJobs.length}
              </p>
            )}
          </div>
        )}

        {/* Show "No results" message if no jobs match the filters */}
        {filteredJobs?.length === 0 && !loading && (
          <div className="text-center p-6 bg-white rounded-lg shadow mt-6 w-full max-w-md">
            <p className="text-gray-600 text-sm md:text-base">No jobs found matching your search criteria.</p>
            <button
              onClick={() => {
                setJobSearch("")
                setLocationSearch("")
              }}
              className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm md:text-base"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Show More Button - Only show if there are more jobs to load */}
        {filteredJobs?.length > visibleJobsCount && (
          <button
            onClick={handleShowMore}
            className="text-blue-500 px-14 mt-10 rounded-full hover:bg-blue-500 hover:text-white mb-10 font-semibold py-2 border border-blue-500"
          >
            See more
          </button>
        )}
      </div>
    </>
  )
}

export default CareerPageJobs

