/* eslint-disable no-unused-vars */
import { MdLocationOn } from "react-icons/md";
import { useParams } from "react-router-dom";
import bag from "../assets/products/Vector.png";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

import { format, isToday, isYesterday, parseISO } from "date-fns";
// Remove the import for static data
// import { jobs } from "../data";

const JobDetails = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const form = useRef();

  const [showFullText, setShowFullText] = useState(false);

  // const [isOpen, setIsOpen] = useState(false);
  // const toggleModal = () => setIsOpen(!isOpen);
  // const closeModal = () => setIsOpen(false);
  const { id } = useParams();
  const formatJobDate = (dateString) => {
    if (!dateString) return "Not available";

    const date = parseISO(dateString); // Convert to Date object

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "do MMM yyyy"); // Example: 12/01/2025
    }
  };
  // State for job details and related jobs
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const description = job?.job_description || job?.details?.summary || "";

  function cleanHtmlContent(htmlString) {
    // Create a temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Get the text content (this automatically removes all HTML tags)
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Replace common HTML entities
    const htmlEntities = {
      '&amp;': '&',
      '&ndash;': '–',
      '&mdash;': '—',
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&lsquo;': "'",
      '&rsquo;': "'",
      '&nbsp;': ' ',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    
    // Replace all HTML entities
    Object.entries(htmlEntities).forEach(([entity, replacement]) => {
      cleanText = cleanText.replace(new RegExp(entity, 'g'), replacement);
    });
    
    // Normalize whitespace
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    // Format for readability (preserve structure)
    cleanText = cleanText.replace(/(Designation:|Grade:|Location:|Industry:|Education:|CTC:|Exp\.|Role:|Job Requirement:)/g, '\n$1');
    cleanText = cleanText.replace(/\s*-\s*/g, '\n- ');
    
    return cleanText;
  }


  const cleanDescription = cleanHtmlContent(description)

  const toggleText = () => setShowFullText(!showFullText);

  const filterSingleJob = (jobs) => jobs.find((job) => job.id === id);

  // Fetch job details and related jobs
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const singleJOb = filterSingleJob(data.results);
        setJob(singleJOb);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
        // Fallback to local data if API fails
        import("../data").then((module) => {
          const localJob = module.jobs.find(
            (j) => j.id.toString() === id.toString()
          );
          if (localJob) {
            setJob(localJob);
          }
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedJobs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRelatedJobs(
          data.results.filter((j) => j.id.toString() !== id.toString())
        );
      } catch (err) {
        console.error("Error fetching related jobs:", err);
        // Fallback to local data if API fails
        import("../data").then((module) => {
          setRelatedJobs(
            module.jobs.filter((j) => j.id.toString() !== id.toString())
          );
        });
      }
    };

    fetchJobDetails();
    fetchRelatedJobs();
  }, [id]);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_0czxrfs", "template_vjhksjv", form.current, {
        publicKey: "qiG11gfWE86es3ObM",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          alert(`Applied successfully: ${job.title}`);
          // closeModal();
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error || !job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 bg-red-100 p-4 rounded-lg">
          {error || "Job not found"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex md:flex-row w-full flex-col-reverse p-6 min-h-screen">
        {/* ------------------------- Job Listings (Left Side) ------------------------- */}
        <div className="flex flex-col w-full md:w-6/12 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {relatedJobs
              .slice(0, showFullText ? 10 : 6)
              .map((relatedJob, index) => (
                <div key={index} className="bg-[#F7F7F7] rounded-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="md:text-lg text-sm font-semibold">
                        {relatedJob.title}
                      </h3>
                      {/* <p className="text-gray-500">{relatedJob.company}</p> */}
                    </div>
                  </div>

                  <div className="mt-4 text-gray-600 space-y-2">

                  <div className="">
                        <h3 className="min-h-[52px] max-h-[52px]  flex items-center break-words text-base sm:text-lg lg:text-lg font-semibold min-clamp-2-lines max-clamp-2-lines">
                          {relatedJob.job_title}
                        </h3>
                      </div>
                    <p className="flex items-center space-x-2">
                      <MdLocationOn />
                      <span>{relatedJob.location}</span>
                    </p>
                    {/* <p className="flex items-center text-sm lg:text-base space-x-2">
                      <img src={bag || "/placeholder.svg"} alt="" />
                      <span>
                        {relatedJob.experience || "Experience not specified"}
                      </span>
                    </p> */}
                    <span>
                      {relatedJob.job_start_date || "Date of posting not Found"}
                    </span>
                  </div>
                  <div className="space-y-1 mb-2">
                    <p className="text-gray-600 font-semibold">
                      Experience: <span>{relatedJob.experience} yr</span>
                    </p>
                  </div>
                  <button
                    className="mt-4 w-full py-2 border-2 border-purple-500 text-purple-500 font-semibold rounded-lg hover:bg-purple-100 transition cursor-pointer"
                    onClick={() => {
                      navigate(`/jobdetails/${relatedJob.id}`);
                      window.scrollTo(0, 0); // Scroll to top when navigating
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
            <h2 className="text-2xl font-bold text-purple-600">
              {job.job_title}
            </h2>
            <p className="mt-2 text-gray-700">
              <strong>Company:</strong> {job.client}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong>{" "}
              {job.location || job.city || job.states || job.country}
            </p>
            <p className="text-gray-700">
              <strong>Experience:</strong>{" "}
              {job.experience || "Experience not specified"}
              {job.experience && "yr"}
            </p>
            <p className="text-gray-700">
              <strong>Job posted:</strong> {formatJobDate(job.job_start_date)}
            </p>
            {job.salary && (
              <p className="text-gray-700">
                <strong>Salary:</strong> {job.pay_rate___salary}
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
                {/* {console.log("job details: ", job.description)} */}
                {/* {job.description || job.details?.summary} */}
                {showFullText
                  ? cleanDescription
                  : `${cleanDescription.slice(0, 300)}...`}
              </p>
              {/* Button to toggle text */}
              {cleanDescription.length > 300 && (
                <button
                  onClick={toggleText}
                  className="mt-2 text-blue-600 hover:underline focus:outline-none"
                >
                  {showFullText ? "See Less ▲" : "See More ▼"}
                </button>
              )}
            </div>

            {/* key responsiblities need to do  */}
            {/* <div className="mt-4">
              <h3 className="text-lg font-semibold">Key Responsibilities:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                {Array.isArray(job.details.responsibilities) ? (
                  job.details.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))
                ) : (
                  <li>
                    {job.details.responsibilities ||
                      "No responsibilities specified"}
                  </li>
                )}
              </ul>
            </div> */}
            {/* need to do  */}
            {/* {job.details?.qualifications &&
              job.details.qualifications.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Qualifications:</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    {job.details.qualifications.map((qual, idx) => (
                      <li key={idx}>{qual}</li>
                    ))}
                  </ul>
                </div>
              )} */}

            {job.details?.skills && job.details.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Skills:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.primary_skills.split.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* <p className="text-gray-600">
                <strong>Total Experience:</strong>{" "}
                {job.experience || "Experience not specified"}
              </p> */}
              <p className="text-gray-600">
                <strong>Work Location:</strong>{" "}
                {job.location || job.city || job.states || job.country}
              </p>
              {job.remoteOpportunity && (
                <p className="text-gray-600">
                  <strong>Remote Work:</strong> {job.remoteOpportunity}
                </p>
              )}
            </div>
            <button
              className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              // onClick={toggleModal}
              onClick={() => window.open(job.apply_job, "_blank")}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/*--------------------------- Modal toggle--------------------- */}
      {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-50">
          <div
            className="relative w-full h-fit sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800"
            style={{ boxShadow: "10px 10px #2979FE" }}
          >
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Information
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✖
              </button>
            </div>

            <div className="">
              <form className="space-y-2" ref={form} onSubmit={sendEmail}>
                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    name="to_name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    Applying for Company
                  </label>
                  <input
                    value={`${job.company} - ${job.title}`}
                    name="company_and_title"
                    readOnly
                    className="w-full p-2 border rounded-lg focus:ring-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    Gender
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    Contact
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 999 777 4321"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    name="to_email"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                  <div className="w-full sm:w-1/2">
                    <input
                      type="file"
                      className="w-full border border-purple-500 text-purple-600 py-2 rounded-lg cursor-pointer file:mr-2 file:py-1 file:px-2 file:border file:rounded-lg file:bg-purple-500 file:text-white hover:file:bg-purple-700"
                    />
                  </div>
                  <input
                    className="w-full sm:w-1/2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
                    type="submit"
                    value="Send"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default JobDetails;
