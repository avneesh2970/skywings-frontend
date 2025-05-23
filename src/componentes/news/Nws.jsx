"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MdArrowOutward, MdChevronLeft, MdChevronRight, MdAccessTime } from "react-icons/md"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import mountain from "../../assets/products/image(10).png"
import tech from "../../assets/products/image(11).png"
import desktop from "../../assets/products/image(3).png"
import sigleman from "../../assets/products/image(4).png"
import concentration from "../../assets/products/image(5).png"
import podcast from "../../assets/products/image(6).png"

// Import the extended article data that contains full content
import { articlesExtended } from "./NewsDetails"

export default function Nws() {
  const [dynamicNews, setDynamicNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [totalPages, setTotalPages] = useState(1)

  // Calculate reading time based on content length
  const calculateReadingTime = (content) => {
    // Average reading speed is about 200-250 words per minute
    const wordsPerMinute = 150

    // Count words in the content
    const wordCount = content.trim().split(/\s+/).length

    // Calculate reading time in minutes
    let readingTime = Math.ceil(wordCount / wordsPerMinute)

    // Ensure minimum reading time is 1 minute
    readingTime = readingTime < 1 ? 1 : readingTime

    return readingTime
  }

  // Extract text content from HTML string
  const extractTextFromHTML = (html) => {
    if (!html) return ""
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    // Get the text content (strips HTML tags)
    return tempDiv.textContent || tempDiv.innerText || ""
  }

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`, {
          params: {
            limit: 6, // Limit to 6 latest news articles
            sort: "date", // Sort by date
            order: "desc", // Newest first
            status: "published", // Only published articles
            includeContent: true, // Request full content for reading time calculation
          },
        })

        // Map the API response to match our article format
        const apiNews = response.data.data.map((item) => ({
          id: item._id, // Use MongoDB _id
          image: item.image ? `${import.meta.env.VITE_API_URL}${item.image}` : null,
          author: item.author,
          date: new Date(item.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          title: item.title,
          description: item.description,
          tags: item.tags || [],
          isFromApi: true, // Flag to identify API news
          // Calculate reading time based on full content if available, otherwise use description
          readingTime: calculateReadingTime(item.content || item.description),
        }))
        setDynamicNews(apiNews)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to load news articles")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Existing hardcoded articles with reading time based on full content
  const staticArticles = [
    {
      id: 1,
      image: mountain,
      author: "Alec Whitten",
      date: "17 Jan 2022",
      title: "Bill Walsh leadership lessons",
      description: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
      tags: ["Leadership", "Management"],
      isFromApi: false, // Explicitly mark as static
      // Get reading time from the full content in articlesExtended
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 1)?.content || ""),
      ),
    },
    {
      id: 2,
      image: tech,
      author: "Demi Wilkinson",
      date: "16 Jan 2022",
      title: "PM mental models",
      description: "Mental models are simple expressions of complex processes or relationships.",
      tags: ["Product", "Research", "Frameworks"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 2)?.content || ""),
      ),
    },
    {
      id: 3,
      image: desktop,
      author: "Candice Wu",
      date: "15 Jan 2022",
      title: "What is Wireframing?",
      description: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
      tags: ["Design", "Research"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 3)?.content || ""),
      ),
    },
    {
      id: 4,
      image: sigleman,
      author: "Natali Craig",
      date: "14 Jan 2022",
      title: "How collaboration makes us better designers",
      description: "Collaboration can make our teams stronger, and our individual designs better.",
      tags: ["Design", "Research"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 4)?.content || ""),
      ),
    },
    {
      id: 5,
      image: concentration,
      author: "Drew Cano",
      date: "13 Jan 2022",
      title: "Our top 10 Javascript frameworks to use",
      description: "JavaScript frameworks make development easy with extensive features and functionalities.",
      tags: ["Software Development", "Tools", "SaaS"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 5)?.content || ""),
      ),
    },
    {
      id: 6,
      image: podcast,
      author: "Orlando Diggs",
      date: "12 Jan 2022",
      title: "Podcast: Creating a better CX Community",
      description: "Starting a community doesn't need to be complicated, but how do you get started?",
      tags: ["Podcasts", "Customer Success"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 6)?.content || ""),
      ),
    },
    {
      id: 7,
      image: sigleman,
      author: "Natali Craig • ",
      date: "14 Jan 2022",
      title: "How collaboration makes us better designers",
      description: "Collaboration can make our teams stronger, and our individual designs better.",
      tags: ["Design", "Research"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 7)?.content || ""),
      ),
    },
    {
      id: 8,
      image: concentration,
      author: "Drew Cano ",
      date: "13 Jan 2022",
      title: "Our top 10 Javascript frameworks to use",
      description: "JavaScript frameworks make development easy with extensive features and functionalities.",
      tags: ["Software Development", "Tools", "SaaS"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 8)?.content || ""),
      ),
    },
    {
      id: 9,
      image: podcast,
      author: "Orlando Diggs • ",
      date: "12 Jan 2022",
      title: "Podcast: Creating a better CX Community",
      description: "Starting a community doesn't need to be complicated, but how do you get started?",
      tags: ["Podcasts", "Customer Success"],
      isFromApi: false,
      readingTime: calculateReadingTime(
        extractTextFromHTML(articlesExtended.find((article) => article.id === 9)?.content || ""),
      ),
    },
  ]

  // Combine dynamic and static news
  // Put dynamic news first, then static news
  const allArticles = [...dynamicNews, ...staticArticles]

  // Calculate total pages
  const totalPagesValue = Math.ceil(allArticles.length / itemsPerPage)

  // Update total pages when articles or items per page changes
  useEffect(() => {
    setTotalPages(totalPagesValue)
  }, [totalPagesValue])

  // Get current articles for pagination
  const indexOfLastArticle = currentPage * itemsPerPage
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage
  const currentArticles = allArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to top of the news section
    window.scrollTo({
      top: document.querySelector(".news-section").offsetTop - 100,
      behavior: "smooth",
    })
  }

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({
        top: document.querySelector(".news-section").offsetTop - 100,
        behavior: "smooth",
      })
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({
        top: document.querySelector(".news-section").offsetTop - 100,
        behavior: "smooth",
      })
    }
  }

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  // Animation variants for each card
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  // Animation variants for header
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  // Animation variants for image
  const imageVariants = {
    hover: {
      scale: 1.1,
      filter: "brightness(1.1)",
      transition: { duration: 0.4 },
    },
  }

  // Animation variants for arrow
  const arrowVariants = {
    initial: { x: 0, y: 0 },
    hover: {
      x: 5,
      y: -5,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        duration: 0.7,
      },
    },
  }

  // Animation variants for tags
  const tagVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: 2,
      },
    },
  }

  // Shimmer effect for loading cards
  const shimmerVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 0%"],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1.5,
        ease: "linear",
      },
    },
  }

  // Pagination button variants
  const paginationButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5, scale: 1 },
  }

  return (
    <div className="bg-gray-50 overflow-hidden news-section">
      <motion.div className="text-center py-12 px-4" initial="hidden" animate="visible" variants={headerVariants}>
        <motion.span
          className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full inline-block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          News
        </motion.span>
        <motion.h1
          className="font-bold lg:text-5xl text-3xl my-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Our News
        </motion.h1>
        <motion.p
          className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Subscribe to learn about new project features, the latest in technology, solutions, and updates
        </motion.p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-16">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              className="bg-white rounded-lg overflow-hidden shadow-md h-[400px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                variants={shimmerVariants}
                animate="animate"
                style={{ backgroundSize: "200% 100%" }}
              />
              <div className="p-5">
                <motion.div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-2/3 mb-4"
                  variants={shimmerVariants}
                  animate="animate"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div
                  className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full mb-3"
                  variants={shimmerVariants}
                  animate="animate"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full mb-2"
                  variants={shimmerVariants}
                  animate="animate"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5 mb-6"
                  variants={shimmerVariants}
                  animate="animate"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <div className="flex gap-2">
                  <motion.div
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-16"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ backgroundSize: "200% 100%" }}
                  />
                  <motion.div
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-20"
                    variants={shimmerVariants}
                    animate="animate"
                    style={{ backgroundSize: "200% 100%" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : error ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-red-100 text-red-500 p-4 rounded-lg inline-block"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {error}
          </motion.div>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`page-${currentPage}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
            >
              {currentArticles.map((article, index) => (
                <motion.div
                  key={`${article.isFromApi ? "dynamic" : "static"}-${article.id}-${index}`}
                  variants={cardVariants}
                  whileHover={{
                    y: -10,
                    transition: { type: "spring", stiffness: 300, damping: 10 },
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl flex flex-col h-full transform-gpu"
                  style={{
                    boxShadow:
                      hoveredCard === index
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        : "",
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                >
                  <Link to={`/news/${article.id}`} state={{ isDynamic: article.isFromApi }} className="block h-full">
                    <div className="h-48 overflow-hidden relative">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0"
                        animate={{ opacity: hoveredCard === index ? 0.6 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        variants={imageVariants}
                        animate={hoveredCard === index ? "hover" : "initial"}
                        onError={(e) => {
                          console.error("Image failed to load:", article.image)
                          e.target.src = "/placeholder.svg"
                          e.target.onerror = null // Prevent infinite loop
                        }}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hoveredCard === index ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow relative">
                      <motion.div
                        className="absolute right-5 top-5 bg-purple-100 rounded-full p-2 text-purple-500"
                        variants={arrowVariants}
                        animate={hoveredCard === index ? "hover" : "initial"}
                      >
                        <MdArrowOutward className="text-xl" />
                      </motion.div>

                      <motion.p
                        className="text-sm text-purple-600 mb-2 font-medium"
                        animate={{
                          x: hoveredCard === index ? 5 : 0,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {article.author} • {article.date}
                      </motion.p>

                      <motion.h3
                        className="text-xl font-bold mb-3 text-gray-800 line-clamp-2"
                        animate={{
                          color: hoveredCard === index ? "#6d28d9" : "#1f2937",
                          transition: { duration: 0.3 },
                        }}
                      >
                        {article.title}
                      </motion.h3>

                      <motion.p
                        className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3"
                        animate={{
                          opacity: hoveredCard === index ? 0.9 : 0.7,
                          transition: { duration: 0.3 },
                        }}
                      >
                        {article.description}
                      </motion.p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {/* Reading time indicator */}
                        <motion.div
                          className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mr-auto"
                          initial={{ opacity: 0.8 }}
                          animate={{
                            opacity: hoveredCard === index ? 1 : 0.8,
                            scale: hoveredCard === index ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <MdAccessTime className="mr-1" />
                          <span>{article.readingTime} min read</span>
                        </motion.div>

                        {article.tags &&
                          article.tags.map((tag, tagIndex) => (
                            <motion.span
                              key={tagIndex}
                              className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full"
                              variants={tagVariants}
                              animate={hoveredCard === index ? "hover" : "initial"}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              className="flex justify-center items-center pb-16 gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
                variants={paginationButtonVariants}
                initial="initial"
                whileHover={currentPage !== 1 ? "hover" : "disabled"}
                whileTap={currentPage !== 1 ? "tap" : "disabled"}
                aria-label="Previous page"
              >
                <MdChevronLeft className="text-xl" />
              </motion.button>

              <div className="flex gap-2 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                  // Show limited page numbers for better mobile experience
                  if (
                    number === 1 ||
                    number === totalPages ||
                    (number >= currentPage - 1 && number <= currentPage + 1)
                  ) {
                    return (
                      <motion.button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentPage === number
                            ? "bg-purple-600 text-white"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        }`}
                        variants={paginationButtonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {number}
                      </motion.button>
                    )
                  } else if (
                    (number === currentPage - 2 && currentPage > 3) ||
                    (number === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    // Show ellipsis for skipped pages
                    return (
                      <span key={number} className="w-10 h-10 flex items-center justify-center text-gray-500">
                        ...
                      </span>
                    )
                  }

                  // Hide other page numbers
                  return null
                })}
              </div>

              <motion.button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
                variants={paginationButtonVariants}
                initial="initial"
                whileHover={currentPage !== totalPages ? "hover" : "disabled"}
                whileTap={currentPage !== totalPages ? "tap" : "disabled"}
                aria-label="Next page"
              >
                <MdChevronRight className="text-xl" />
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
