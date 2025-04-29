"use client"
import desktop from "../../assets/products/image(3).png"
import podcast from "../../assets/products/image(6).png"
import singleman from "../../assets/products/image(4).png"
import img49 from "../../assets/service/image49.png"
import img42 from "../../assets/service/image42.png"
import img50 from "../../assets/service/image50.png"
import img37 from "../../assets/service/image37.png"
import img43 from "../../assets/service/image43.png"
import img11 from "../../assets/products/img11.jpg"
import img101 from "../../assets/products/img101.jpg"
import img102 from "../../assets/products/img102.jpg"
import img103 from "../../assets/products/img103.jpg"
import img104 from "../../assets/products/img104.jpg"
import img105 from "../../assets/products/img105.jpg"
import img106 from "../../assets/products/img106.jpg"
import img107 from "../../assets/products/img107.jpg"
import img108 from "../../assets/products/img108.jpg"
import img109 from "../../assets/products/img109.jpg"
import img110 from "../../assets/products/img110.jpg"

import { MdArrowOutward } from "react-icons/md"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const Cont10 = () => {
  const [dynamicPosts, setDynamicPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Helper function to strip HTML tags
  function stripHtmlTags(html) {
    if (!html) return ""
    return html.replace(/<\/?[^>]+(>|$)/g, "")
  }

  const staticArticles = [
    {
      id: 1,
      image: img11,
      author: "Admin",
      date: "Feb 25, 2025",
      jobtype: "Recruitment",
      title: "Busted No Show Reasons ",
      description:
        'I met with an accident!", "My best friend is hospitalized", "I am unwell", "My grandparent expired", "important meeting at office scheduled and I got the update last night", either..',
    },
    {
      id: 2,
      image: podcast,
      author: "Admin",
      date: "Feb 20, 2025",
      jobtype: "Interview Tips",
      title: "The One Thing Every Employer Wants to See On Your Resume",
      description:
        "It's tough out there in the job market. And it may be getting tougher if you are following the news. You are It's tough ..",
    },

    {
      id: 3,
      image: img107,
      author: "Admin",
      date: "Feb 5,, 2025",
      jobtype: "Company Culter ",
      title: "How to create a culture of leadership",
      description:
        "Culture is a composition of 'Intellectual Activity'. In this competitive world, a key factor behind a company's success, apart from .",
    },
    {
      id: 4,
      image: desktop,
      author: "Admin",
      date: "Jan 2, 2025",
      jobtype: "Interview Tips",
      title: "Basic questions asked in any job Interview",
      description:
        "It's a well known fact that looking at a candidate's past behaviour is the best way to predict their future",
    },
    {
      id: 5,
      image: singleman,
      author: "Admin",
      date: "Jan 10, 2025",
      jobtype: "Placement",
      title: "How College Placement Cells Can Improve Student Employability ",
      description:
        "A college's placement cell plays a crucial role in shaping the future of students by connecting them with....",
    },
    {
      id: 6,
      image: img106,
      author: "Admin",
      date: "Feb 19, 2025",
      jobtype: "Internship",
      title: "Internship Programs: Why They Are Essential for Career Growth ",
      description:
        "India is home to one of the world's largest and youngest workforces, yet many industries face a severe skill ...",
    },
    {
      id: 7,
      image: img109,
      author: "Admin",
      date: "Feb 5, 2025",
      jobtype: "Skill Gap",
      title: " Skill Gap in India: How to Bridge It Through Training & Recruitment ",
      description:
        "Skill Gap in India: How to Bridge It Through Training & Recruitment Introduction: The Growing Skill Gap in ..",
    },
    {
      id: 8,
      image: img105,
      author: "Admin",
      date: "Jan 17, 2025",
      jobtype: "Resume",
      title: "How to Optimize Your Resume for ATS  ",
      description:
        "Applicant Tracking Systems (ATS). ATS is an AI-driven resume screening tool used by companies to filter...",
    },
    {
      id: 9,
      image: img49,
      author: "Admin",
      date: "Feb 18, 2025",
      jobtype: " Hiring ",
      title: "How Staffing Companies Can Improve Diversity & Inclusion Hiring  ",
      description:
        "Introduction: The Growing Importance of Diversity & Inclusion in Hiring Diversity and inclusion (D&I) are...",
    },
    {
      id: 10,
      image: img104,
      author: "Admin",
      date: "Jan 24, 2025",
      jobtype: " Pre-Placement ",
      title: "How Pre-Placement Offers (PPOs) Are Changing Campus Hiring",
      description:
        "Introduction: The Rise of Pre-Placement Offers (PPOs) in India Campus hiring has long been the primary ...",
    },
    {
      id: 11,
      image: img43,
      author: "Admin",
      date: "March 18, 2025",
      jobtype: "Staffing  ",
      title: "Top Challenges in the Staffing Industry and How to Overcome Them",
      description:
        "Introduction: Why Staffing is More Challenging Than Ever The staffing industry  plays a crucial role...",
    },
    {
      id: 12,
      image: img42,
      author: "Admin",
      date: "March 17, 2025",
      jobtype: "Recruitment  ",
      title: "The Role of Recruitment Agencies in India's Growing Job Market",
      description:
        "Introduction: Why Recruitment Agencies Are More Important Than Ever India's job market is experiencing...",
    },
    {
      id: 13,
      image: img103,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "AI  ",
      title: "How AI is Revolutionizing Talent Acquisition & the Staffing Industry",
      description:
        "Introduction: The Role of AI in Modern Recruitment The recruitment industry is undergoing a massive...",
    },
    {
      id: 14,
      image: img108,
      author: "Admin",
      date: "Jan 8, 2025",
      jobtype: "Businesses ",
      title: "Understanding Whitepapers: A Comprehensive Guide for Businesses",
      description:
        "In the fast-paced world of digital content, businesses are constantly searching for ways to establish...",
    },
    {
      id: 15,
      image: img102,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "Success ",
      title: "Competency Mapping: Unlocking Potential for Organizational Success",
      description:
        "In today's dynamic and competitive market, businesses, especially in India, face the challenge of...",
    },
    {
      id: 16,
      image: img110,
      author: "Admin",
      date: "Feb 16, 2025",
      jobtype: "W2 & C2C ",
      title: "Understanding W2 and C2C Employment Arrangements",
      description: "When engaging with staffing or recruitment agencies, prospective employees often encounter two...",
    },
    {
      id: 17,
      image: img37,
      author: "Admin",
      date: "Feb 7, 2025",
      jobtype: "Freshers ",
      title: "How to source freshers",
      description: "Sourcing freshers for sales roles can be quite effective when using a multi-channel approach....",
    },
    {
      id: 18,
      image: img101,
      author: "Admin",
      date: "March 15, 2025",
      jobtype: " FreelanceRecruiter.",
      title: "Closing the Skill Gap: How FreelanceRecruiter.in Supports Workforce  Readiness",
      description:
        "The Rise of Freelance Recruiters in India: Why More Companies Are Turning to Gig Talent for Hiring The ",
    },
    {
      id: 19,
      image: img50,
      author: "Admin",
      date: "March 26, 2025",
      jobtype: " FreelanceRecruiter.",
      title: "How can i become Freelance Recruiter",
      description: "Becoming a freelance recruiter can be a great career path if you have strong networking and... ",
    },
  ]
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Check if the API endpoint is available
        const apiUrl = import.meta.env.VITE_API_URL || ""
        const blogApiEndpoint = `${apiUrl}/api/blog/posts`

        console.log("Fetching posts from:", blogApiEndpoint)

        const response = await axios.get(blogApiEndpoint, {
          timeout: 5000, // Set a timeout to avoid long waiting
        })

        // Format the dynamic posts to match the structure of static posts
        const formattedPosts = response.data.map((post) => ({
          id: post._id,
          title: post.title,
          // Strip HTML tags from the content for the description
          description: stripHtmlTags(post.content).substring(0, 150) + "...",
          author: post.author || "Admin",
          date: new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          jobtype: post.category || "Blog",
          image: post.featuredImage,
          content: post.content,
          isDynamic: true,
        }))

        setDynamicPosts(formattedPosts)
        console.log("Successfully fetched", formattedPosts.length, "dynamic posts")
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        // Don't set error state, just log it - we'll still show static articles
        console.log("Continuing with static articles only")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Combine static and dynamic articles
  const allArticles = [...staticArticles, ...dynamicPosts]

  // Sort articles by date (newest first)
  const sortedArticles = [...allArticles].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedArticles.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(sortedArticles.length / postsPerPage)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#7e22ce",
      color: "#ffffff",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        />
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="text-center mt-10" variants={headerVariants}>
        <motion.span
          className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full inline-block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          BLOG
        </motion.span>
        <motion.h1 className="font-bold lg:text-5xl text-3xl my-3" variants={headerVariants}>
          Stories and interviews
        </motion.h1>
        <motion.p className="text-gray-500 mt-4 text-lg" variants={headerVariants}>
          Subscribe to learn about new project features, the latest in technology,
          <br /> solutions, and update
        </motion.p>
      </motion.div>

      {/* Show warning if dynamic posts failed to load */}
      {error && (
        <motion.div
          className="text-center p-2 mb-4 text-amber-600 bg-amber-50 rounded-md mx-auto max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>Note: Some blog posts couldn't be loaded. Showing available articles.</p>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 lg:mx-20 w-85 m-auto md:w-auto"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          {currentPosts.map((article, index) => (
            <motion.div
              key={`${article.id}-${currentPage}`}
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
              custom={index}
              layout
            >
              <Link
                to={`/article/${article.id}`}
                state={article} // Pass article data
                className="text-purple-500 font-semibold block h-full"
              >
                <div className="bg-white overflow-hidden h-full rounded-lg border border-gray-100 flex flex-col">
                  <motion.div className="overflow-hidden">
                    <motion.img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full object-cover h-48"
                      variants={imageVariants}
                      whileHover="hover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg" // Fallback image
                      }}
                    />
                  </motion.div>
                  <div className="p-4 relative flex-grow">
                    <motion.div
                      className="absolute right-3 top-5 md:block hidden"
                      whileHover={{
                        rotate: 45,
                        scale: 1.2,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <MdArrowOutward />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-purple-500 mb-2">
                      <span className="text-black font-semibold">{article.jobtype} </span>
                      <span className="text-black">| By :</span> {article.author} {""}
                      <span className="text-black">| Last Updates: </span> {article.date}
                    </p>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{article.description}</p>
                    <motion.p
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      Read More...
                    </motion.p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex space-x-2">
            <motion.button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Previous
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-md ${currentPage === page ? "bg-purple-600 text-white" : ""}`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {page}
              </motion.button>
            ))}

            <motion.button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Cont10
