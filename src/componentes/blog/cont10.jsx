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

import { MdArrowOutward, MdAccessTime, MdCalendarMonth } from "react-icons/md"
import { Link } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

// Skeleton component for loading state
const ArticleSkeleton = () => (
  <div className="bg-white overflow-hidden h-full rounded-xl border border-gray-100 flex flex-col animate-pulse shadow-sm">
    <div className="bg-gray-200 w-full h-52"></div>
    <div className="p-6 relative flex-grow">
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </div>
      <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded-full w-32"></div>
    </div>
  </div>
)

// Function to estimate reading time
const getReadingTime = (text) => {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes < 1 ? 1 : minutes
}

// Function to format date in a friendly way
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
}

// Get category color
const getCategoryColor = (category) => {
  const categories = {
    Recruitment: "bg-blue-100 text-blue-700",
    "Interview Tips": "bg-green-100 text-green-700",
    "Company Culter": "bg-purple-100 text-purple-700",
    "Company Culture": "bg-purple-100 text-purple-700",
    Placement: "bg-indigo-100 text-indigo-700",
    Internship: "bg-pink-100 text-pink-700",
    "Skill Gap": "bg-orange-100 text-orange-700",
    Resume: "bg-teal-100 text-teal-700",
    Hiring: "bg-blue-100 text-blue-700",
    "Pre-Placement": "bg-amber-100 text-amber-700",
    Staffing: "bg-cyan-100 text-cyan-700",
    AI: "bg-red-100 text-red-700",
    Businesses: "bg-emerald-100 text-emerald-700",
    Success: "bg-violet-100 text-violet-700",
    "W2 & C2C": "bg-gray-100 text-gray-700",
    Freshers: "bg-lime-100 text-lime-700",
    "FreelanceRecruiter.": "bg-rose-100 text-rose-700",
    Blog: "bg-purple-100 text-purple-700",
  }

  // Clean up category name by trimming spaces
  const cleanCategory = category.trim()

  // Return the color for the category or default to purple
  return categories[cleanCategory] || "bg-purple-100 text-purple-700"
}

const Cont10 = () => {
  const [dynamicPosts, setDynamicPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [imageLoadingStates, setImageLoadingStates] = useState({})
  const postsPerPage = 9

  // Helper function to strip HTML tags
  function stripHtmlTags(html) {
    if (!html) return ""
    return html.replace(/<\/?[^>]+(>|$)/g, "")
  }

  // Track image loading state
  const handleImageLoad = (id) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const handleImageError = (id) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [id]: true, // Mark as loaded even on error, since we'll show fallback
    }))
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
      date: "Feb 5, 2025",
      jobtype: "Company Culture",
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
      jobtype: "Hiring",
      title: "How Staffing Companies Can Improve Diversity & Inclusion Hiring  ",
      description:
        "Introduction: The Growing Importance of Diversity & Inclusion in Hiring Diversity and inclusion (D&I) are...",
    },
    {
      id: 10,
      image: img104,
      author: "Admin",
      date: "Jan 24, 2025",
      jobtype: "Pre-Placement",
      title: "How Pre-Placement Offers (PPOs) Are Changing Campus Hiring",
      description:
        "Introduction: The Rise of Pre-Placement Offers (PPOs) in India Campus hiring has long been the primary ...",
    },
    {
      id: 11,
      image: img43,
      author: "Admin",
      date: "March 18, 2025",
      jobtype: "Staffing",
      title: "Top Challenges in the Staffing Industry and How to Overcome Them",
      description:
        "Introduction: Why Staffing is More Challenging Than Ever The staffing industry  plays a crucial role...",
    },
    {
      id: 12,
      image: img42,
      author: "Admin",
      date: "March 17, 2025",
      jobtype: "Recruitment",
      title: "The Role of Recruitment Agencies in India's Growing Job Market",
      description:
        "Introduction: Why Recruitment Agencies Are More Important Than Ever India's job market is experiencing...",
    },
    {
      id: 13,
      image: img103,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "AI",
      title: "How AI is Revolutionizing Talent Acquisition & the Staffing Industry",
      description:
        "Introduction: The Role of AI in Modern Recruitment The recruitment industry is undergoing a massive...",
    },
    {
      id: 14,
      image: img108,
      author: "Admin",
      date: "Jan 8, 2025",
      jobtype: "Businesses",
      title: "Understanding Whitepapers: A Comprehensive Guide for Businesses",
      description:
        "In the fast-paced world of digital content, businesses are constantly searching for ways to establish...",
    },
    {
      id: 15,
      image: img102,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "Success",
      title: "Competency Mapping: Unlocking Potential for Organizational Success",
      description:
        "In today's dynamic and competitive market, businesses, especially in India, face the challenge of...",
    },
    {
      id: 16,
      image: img110,
      author: "Admin",
      date: "Feb 16, 2025",
      jobtype: "W2 & C2C",
      title: "Understanding W2 and C2C Employment Arrangements",
      description: "When engaging with staffing or recruitment agencies, prospective employees often encounter two...",
    },
    {
      id: 17,
      image: img37,
      author: "Admin",
      date: "Feb 7, 2025",
      jobtype: "Freshers",
      title: "How to source freshers",
      description: "Sourcing freshers for sales roles can be quite effective when using a multi-channel approach....",
    },
    {
      id: 18,
      image: img101,
      author: "Admin",
      date: "March 15, 2025",
      jobtype: "FreelanceRecruiter.",
      title: "Closing the Skill Gap: How FreelanceRecruiter.in Supports Workforce Readiness",
      description:
        "The Rise of Freelance Recruiters in India: Why More Companies Are Turning to Gig Talent for Hiring The ",
    },
    {
      id: 19,
      image: img50,
      author: "Admin",
      date: "March 26, 2025",
      jobtype: "FreelanceRecruiter.",
      title: "How can I become Freelance Recruiter",
      description: "Becoming a freelance recruiter can be a great career path if you have strong networking and... ",
    },
  ]

  // Preload first page images
  useEffect(() => {
    const preloadImages = async () => {
      const firstPageArticles = staticArticles.slice(0, postsPerPage)

      // Create an array of promises for preloading images
      const preloadPromises = firstPageArticles.map((article) => {
        return new Promise((resolve) => {
          if (!article.image) {
            resolve()
            return
          }

          const img = new Image()
          img.src = article.image
          img.onload = () => {
            handleImageLoad(article.id)
            resolve()
          }
          img.onerror = () => {
            handleImageError(article.id)
            resolve()
          }
        })
      })

      // Wait for all images to preload
      await Promise.all(preloadPromises)
    }

    preloadImages()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const fetchPosts = async () => {
      try {
        // Check if the API endpoint is available
        const apiUrl = import.meta.env.VITE_API_URL || ""
        const blogApiEndpoint = `${apiUrl}/api/blog/posts`

        console.log("Fetching posts from:", blogApiEndpoint)

        const response = await axios.get(blogApiEndpoint, {
          timeout: 5000, // Set a timeout to avoid long waiting
          signal: controller.signal,
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
        if (err.name !== "AbortError") {
          console.error("Error fetching blog posts:", err)
          // Don't set error state, just log it - we'll still show static articles
          console.log("Continuing with static articles only")
        }
      } finally {
        setLoading(false)
      }
    }

    // Start showing static content quickly, then fetch dynamic content
    const timer = setTimeout(() => {
      if (loading) setLoading(false)
    }, 1500)

    fetchPosts()

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [])

  const staticArticlesMemo = useMemo(() => staticArticles, [])

  // Memoized data processing
  const allArticles = useMemo(() => [...staticArticlesMemo, ...dynamicPosts], [staticArticlesMemo, dynamicPosts])

  // Sort articles by date (newest first) - memoized
  const sortedArticles = useMemo(() => {
    return [...allArticles].sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
  }, [allArticles])

  // Pagination logic - memoized
  const { currentPosts, totalPages } = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    return {
      currentPosts: sortedArticles.slice(indexOfFirstPost, indexOfLastPost),
      totalPages: Math.ceil(sortedArticles.length / postsPerPage),
    }
  }, [sortedArticles, currentPage, postsPerPage])

  // Animation variants - optimized for performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced for faster appearance
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 }, // Reduced distance for faster animation
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Faster animation
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10 }, // Reduced distance for faster animation
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, // Faster animation
        ease: "easeOut",
      },
    },
    hover: {
      y: -5, // Reduced movement for smoother hover
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2, // Faster hover transition
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.05, // Slightly increased scale for more noticeable effect
      transition: { duration: 0.3 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.03, // Reduced scale for smoother animation
      backgroundColor: "#7e22ce",
      color: "#ffffff",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97, // Less dramatic for smoother feel
    },
  }

  // Render loading skeletons
  if (loading) {
    return (
      <div className="p-6 lg:mx-20 w-85 m-auto md:w-auto">
        <div className="text-center mt-10 mb-10">
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full inline-block">
            BLOG
          </span>
          <h1 className="font-bold lg:text-5xl text-3xl my-3">Stories and interviews</h1>
          <p className="text-gray-500 mt-4 text-lg">
            Subscribe to learn about new project features, the latest in technology,
            <br /> solutions, and updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <ArticleSkeleton key={index} />
            ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="blog-container">
      <motion.div className="text-center mt-10" variants={headerVariants}>
        <motion.span
          className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full inline-block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          BLOG
        </motion.span>
        <motion.h1
          className="font-bold lg:text-5xl text-3xl my-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text"
          variants={headerVariants}
        >
          Stories and interviews
        </motion.h1>
        <motion.p className="text-gray-500 mt-4 text-lg" variants={headerVariants}>
          Subscribe to learn about new project features, the latest in technology,
          <br /> solutions, and updates
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 lg:mx-20 w-85 m-auto md:w-auto"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          {currentPosts.map((article, index) => {
            // Calculate reading time
            const readingTime = getReadingTime(article.description)

            // Format date
            const formattedDate = formatDate(article.date)

            // Get category color
            const categoryColor = getCategoryColor(article.jobtype)

            return (
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
                <Link to={`/article/${article.id}`} state={article} className="block h-full">
                  <div className="bg-white overflow-hidden h-full rounded-xl border border-gray-100 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="overflow-hidden relative h-52">
                      {/* Image loading indicator */}
                      {!imageLoadingStates[article.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      <motion.img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className={`w-full object-cover h-52 transition-opacity duration-300 ${
                          imageLoadingStates[article.id] ? "opacity-100" : "opacity-0"
                        }`}
                        variants={imageVariants}
                        whileHover="hover"
                        onLoad={() => handleImageLoad(article.id)}
                        onError={() => handleImageError(article.id)}
                        loading="lazy"
                      />

                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
                          {article.jobtype}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 relative flex-grow">
                      {/* Date and reading time */}
                      <div className="flex items-center gap-4 mb-3 text-gray-500 text-sm">
                        <div className="flex items-center">
                          <MdCalendarMonth className="mr-1" />
                          {formattedDate}
                        </div>
                        <div className="flex items-center">
                          <MdAccessTime className="mr-1" />
                          {readingTime} min read
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-5 line-clamp-3">{article.description}</p>

                      {/* Read more button */}
                      <motion.div
                        className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full transition-colors duration-200"
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        Read Article
                        <MdArrowOutward />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <motion.button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-full border-2 border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 transition-colors duration-200"
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
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  currentPage === page
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-purple-200 hover:border-purple-500"
                } transition-colors duration-200`}
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
              className="px-5 py-2.5 rounded-full border-2 border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 transition-colors duration-200"
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
