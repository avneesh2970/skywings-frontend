"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MdArrowOutward } from "react-icons/md"
import axios from "axios"
import { motion } from "framer-motion"
import mountain from "../../assets/products/image(10).png"
import tech from "../../assets/products/image(11).png"
import desktop from "../../assets/products/image(3).png"
import sigleman from "../../assets/products/image(4).png"
import concentration from "../../assets/products/image(5).png"
import podcast from "../../assets/products/image(6).png"

export default function Nws() {
  const [dynamicNews, setDynamicNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

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

  // Existing hardcoded articles
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
    },
  ]

  // Combine dynamic and static news
  // Put dynamic news first, then static news
  const allArticles = [...dynamicNews, ...staticArticles]

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

  // Loading animation variants
  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        ease: "linear",
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

  return (
    <div className="bg-gray-50 overflow-hidden">
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allArticles.map((article, index) => (
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
      )}
    </div>
  )
}
