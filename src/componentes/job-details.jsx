"use client"

/* eslint-disable no-unused-vars */
import { MdLocationOn } from "react-icons/md"
import { useParams, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import emailjs from "@emailjs/browser"
import { useNavigate } from "react-router-dom"

import { format, isToday, isYesterday, parseISO } from "date-fns"

const JobDetails = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const form = useRef()
  const location = useLocation()
  const [showFullText, setShowFullText] = useState(false)

  const { id } = useParams()
  const formatJobDate = (dateString) => {
    if (!dateString) return "Not available"

    try {
      const date = parseISO(dateString) // Convert to Date object

      if (isToday(date)) {
        return "Today"
      } else if (isYesterday(date)) {
        return "Yesterday"
      } else {
        return format(date, "do MMM yyyy") // Example: 12/01/2025
      }
    } catch (error) {
      console.error("Date parsing error:", error)
      return dateString // Return the original string if parsing fails
    }
  }

  // State for job details and related jobs
  const [job, setJob] = useState(null)
  const [relatedJobs, setRelatedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to safely get job description
  const getJobDescription = () => {
    if (!job) return ""
    return job.job_description || job.details?.summary || ""
  }

  const description = getJobDescription()

  function cleanHtmlContent(htmlString) {
    if (!htmlString) return ""

    // Create a temporary DOM element
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlString

    // Get the text content (this automatically removes all HTML tags)
    let cleanText = tempDiv.textContent || tempDiv.innerText || ""

    // Replace common HTML entities
    const htmlEntities = {
      "&amp;": "&",
      "&ndash;": "–",
      "&mdash;": "—",
      "&ldquo;": '"',
      "&rdquo;": '"',
      "&lsquo;": "'",
      "&rsquo;": "'",
      "&nbsp;": " ",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
    }

    // Replace all HTML entities
    Object.entries(htmlEntities).forEach(([entity, replacement]) => {
      cleanText = cleanText.replace(new RegExp(entity, "g"), replacement)
    })

    // Normalize whitespace
    cleanText = cleanText.replace(/\s+/g, " ").trim()

    // Format for readability (preserve structure)
    cleanText = cleanText.replace(
      /(Designation:|Grade:|Location:|Industry:|Education:|CTC:|Exp\.|Role:|Job Requirement:)/g,
      "\n$1",
    )
    cleanText = cleanText.replace(/\s*-\s*/g, "\n- ")

    return cleanText
  }

  const cleanDescription = cleanHtmlContent(description)

  const toggleText = () => setShowFullText(!showFullText)

  // Fetch job details and related jobs
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // First, try to get job data from URL search params
        const searchParams = new URLSearchParams(location.search)
        const sourceParam = searchParams.get("source")

        if (sourceParam) {
          try {
            // If we have source data in the URL, use it
            const sourceData = JSON.parse(decodeURIComponent(sourceParam))
            if (sourceData && sourceData.id) {
              setJob(sourceData)
              setLoading(false)

              // Still fetch related jobs
              fetchRelatedJobs()
              return // Exit early, we have the data
            }
          } catch (e) {
            console.error("Error parsing source data:", e)
            // Continue to API fetch if parsing fails
          }
        }

        // Try multiple approaches to get the job data
        let jobData = null

        // Approach 1: Try direct job fetch by ID
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`)

          if (response.ok) {
            jobData = await response.json()
            console.log("Successfully fetched job by ID:", jobData)
          }
        } catch (directFetchError) {
          console.error("Error in direct job fetch:", directFetchError)
        }

        // Approach 2: If direct fetch failed, try getting all jobs
        if (!jobData) {
          try {
            const allJobsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`)

            if (allJobsResponse.ok) {
              const allJobsData = await allJobsResponse.json()

              // Make sure results exists and is an array before using find
              if (allJobsData && Array.isArray(allJobsData.results)) {
                const foundJob = allJobsData.results.find((job) => job && job.id && job.id.toString() === id.toString())

                if (foundJob) {
                  jobData = foundJob
                  console.log("Found job in all jobs data:", jobData)
                }
              } else {
                console.error("Invalid job data structure:", allJobsData)
              }
            }
          } catch (allJobsError) {
            console.error("Error fetching all jobs:", allJobsError)
          }
        }

        // Approach 3: Try fetching from Skywings jobs endpoint
        if (!jobData) {
          try {
            const skywingsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/skywingsjobs`)

            if (skywingsResponse.ok) {
              const skywingsData = await skywingsResponse.json()

              // Make sure results exists and is an array before using find
              if (skywingsData && Array.isArray(skywingsData.results)) {
                const foundJob = skywingsData.results.find(
                  (job) => job && job.id && job.id.toString() === id.toString(),
                )

                if (foundJob) {
                  jobData = foundJob
                  console.log("Found job in skywings data:", jobData)
                }
              }
            }
          } catch (skywingsError) {
            console.error("Error fetching skywings jobs:", skywingsError)
          }
        }

        // If we found job data through any approach, set it
        if (jobData) {
          setJob(jobData)
          setError(null)
        } else {
          // If all approaches failed, try local data as last resort
          throw new Error("Job not found in any data source")
        }
      } catch (err) {
        console.error("Error fetching job details:", err)
        setError("Failed to load job details. Please try again later.")

        // Fallback to local data if API fails
        try {
          import("../data")
            .then((module) => {
              if (module.jobs) {
                const localJob = module.jobs.find((j) => j.id.toString() === id.toString())
                if (localJob) {
                  setJob(localJob)
                  setError(null)
                }
              }
            })
            .catch((importError) => {
              console.error("Error importing local data:", importError)
            })
        } catch (localDataError) {
          console.error("Error with local data fallback:", localDataError)
        }
      } finally {
        setLoading(false)
        fetchRelatedJobs()
      }
    }

    const fetchRelatedJobs = async () => {
      try {
        // Try multiple endpoints to get related jobs
        let jobsData = null

        // Try the main jobs endpoint
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`)

          if (response.ok) {
            const data = await response.json()
            if (data && Array.isArray(data.results)) {
              jobsData = data.results
            }
          }
        } catch (mainJobsError) {
          console.error("Error fetching main jobs:", mainJobsError)
        }

        // If main endpoint failed, try skywings endpoint
        if (!jobsData) {
          try {
            const skywingsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/skywingsjobs`)

            if (skywingsResponse.ok) {
              const data = await skywingsResponse.json()
              if (data && Array.isArray(data.results)) {
                jobsData = data.results
              }
            }
          } catch (skywingsError) {
            console.error("Error fetching skywings jobs:", skywingsError)
          }
        }

        // If we have jobs data, filter out the current job and set related jobs
        if (jobsData) {
          setRelatedJobs(jobsData.filter((j) => j && j.id && j.id.toString() !== id.toString()))
        } else {
          // Fallback to local data if API fails
          try {
            import("../data")
              .then((module) => {
                if (module.jobs) {
                  setRelatedJobs(module.jobs.filter((j) => j.id.toString() !== id.toString()))
                }
              })
              .catch((importError) => {
                console.error("Error importing local data for related jobs:", importError)
              })
          } catch (localDataError) {
            console.error("Error with local data fallback for related jobs:", localDataError)
          }
        }
      } catch (err) {
        console.error("Error fetching related jobs:", err)
      }
    }

    fetchJobDetails()
  }, [id, location.search])

  const sendEmail = (e) => {
    e.preventDefault()

    emailjs
      .sendForm("service_0czxrfs", "template_vjhksjv", form.current, {
        publicKey: "qiG11gfWE86es3ObM",
      })
      .then(
        () => {
          console.log("SUCCESS!")
          alert(`Applied successfully: ${job.title}`)
        },
        (error) => {
          console.log("FAILED...", error.text)
        },
      )
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show error message if there's an error
  if (error || !job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error || "Job not found"}</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex md:flex-row w-full flex-col-reverse p-6 min-h-screen">
        {/* ------------------------- Job Listings (Left Side) ------------------------- */}
        <div className="flex flex-col w-full md:w-6/12 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {relatedJobs.slice(0, showFullText ? 10 : 6).map((relatedJob, index) => (
              <div key={index} className="bg-[#F7F7F7] rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="md:text-lg text-sm font-semibold">{relatedJob.title || relatedJob.job_title}</h3>
                  </div>
                </div>

                <div className="mt-4 text-gray-600 space-y-2">
                  <div className="">
                    <h3 className="min-h-[52px] max-h-[52px] flex items-center break-words text-base sm:text-lg lg:text-lg font-semibold min-clamp-2-lines max-clamp-2-lines">
                      {relatedJob.job_title}
                    </h3>
                  </div>
                  <p className="flex items-center space-x-2">
                    <MdLocationOn />
                    <span>
                      {relatedJob.location || relatedJob.city || relatedJob.country || "Location not specified"}
                    </span>
                  </p>
                  <span>{relatedJob.job_start_date || "Date of posting not Found"}</span>
                </div>
                <div className="space-y-1 mb-2">
                  <p className="text-gray-600 font-semibold">
                    Experience:{" "}
                    <span>
                      {relatedJob.experience || "Not specified"} {relatedJob.experience ? "yr" : ""}
                    </span>
                  </p>
                </div>
                <button
                  className="mt-4 w-full py-2 border-2 border-purple-500 text-purple-500 font-semibold rounded-lg hover:bg-purple-100 transition cursor-pointer"
                  onClick={() => {
                    // Pass job data in the URL when navigating to related jobs
                    navigate(
                      `/jobdetails/${relatedJob.id}?source=${encodeURIComponent(
                        JSON.stringify({
                          id: relatedJob.id,
                          job_title: relatedJob.job_title || relatedJob.title,
                          client: relatedJob.client || relatedJob.company,
                          city: relatedJob.city,
                          country: relatedJob.country,
                          experience: relatedJob.experience,
                          job_start_date: relatedJob.job_start_date,
                          apply_job_without_registration: relatedJob.apply_job_without_registration,
                          job_description: relatedJob.job_description || relatedJob.description,
                          // Add any other essential fields
                        }),
                      )}`,
                    )
                    window.scrollTo(0, 0) // Scroll to top when navigating
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------- Job Details (Right Side) ------------------------- */}
        <div className="bg-white w-full md:w-6/12 p-6 rounded-lg shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-purple-600">{job.job_title || job.title}</h2>
            <p className="mt-2 text-gray-700">
              <strong>Company:</strong> {job.client || job.company || "Not specified"}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong>{" "}
              {job.location || job.city || job.states || job.country || "Location not specified"}
            </p>
            <p className="text-gray-700">
              <strong>Experience:</strong> {job.experience || "Experience not specified"}
              {job.experience && " yr"}
            </p>
            <p className="text-gray-700">
              <strong>Job posted:</strong> {formatJobDate(job.job_start_date)}
            </p>
            {job.salary && (
              <p className="text-gray-700">
                <strong>Salary:</strong> {job.pay_rate___salary || job.salary}
              </p>
            )}
            {job.job_code && (
              <p className="text-gray-700">
                <strong>Job Code:</strong> {job.job_code}
              </p>
            )}

            <div className="mt-4">
              <h3 className="text-lg font-semibold">About the Job:</h3>
              <p className="text-gray-600 mt-2">
                {cleanDescription
                  ? showFullText
                    ? cleanDescription
                    : `${cleanDescription.slice(0, 300)}...`
                  : "No job description available."}
              </p>
              {/* Button to toggle text */}
              {cleanDescription && cleanDescription.length > 300 && (
                <button onClick={toggleText} className="mt-2 text-blue-600 hover:underline focus:outline-none">
                  {showFullText ? "See Less ▲" : "See More ▼"}
                </button>
              )}
            </div>

            {job.details?.skills && job.details.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Skills:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.primary_skills &&
                    typeof job.primary_skills === "string" &&
                    job.primary_skills.split &&
                    job.primary_skills.split(",").map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-gray-600">
                <strong>Work Location:</strong>{" "}
                {job.location || job.city || job.states || job.country || "Location not specified"}
              </p>
              {job.remoteOpportunity && (
                <p className="text-gray-600">
                  <strong>Remote Work:</strong> {job.remoteOpportunity}
                </p>
              )}
            </div>
            {job.apply_job_without_registration ? (
              <button
                className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => window.open(job.apply_job_without_registration, "_blank")}
              >
                Apply Now
              </button>
            ) : (
              <button
                className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => navigate("/contact")}
              >
                Contact Us to Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default JobDetails
