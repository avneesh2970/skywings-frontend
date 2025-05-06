"use client";

/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { Book, Clock, User, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

function BlogDisplay() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Maximum number of cards to display
  const MAX_VISIBLE_BLOGS = 4;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Fetch blogs from your API with sort parameters
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/blog/posts?sort=createdAt&order=desc`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("blog res: ", data);
        setBlogs(data || []);
        setTotalBlogs(data.total || 0);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Handle redirection to blogs page
  const handleSeeMore = () => {
    window.location.href = "/blogs";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Strip HTML tags from content
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-purple-900 mb-8">
          Latest Blog Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md h-full animate-pulse border border-purple-100"
            >
              <div className="h-36 bg-purple-50"></div>
              <div className="p-4">
                <div className="h-5 bg-purple-50 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-purple-50 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-purple-50 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between mt-3">
                  <div className="h-5 bg-purple-50 rounded w-1/4"></div>
                  <div className="h-5 bg-purple-50 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-50 text-red-600 p-3 rounded-full mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-purple-900 mb-3">
            Unable to Load Blogs
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-center text-purple-900 mb-3 animate-fade-in">
        Latest Blog Posts
      </h2>
      <p className="text-center text-purple-700 mb-8 max-w-2xl mx-auto text-sm animate-fade-in-delay">
        Explore our collection of insightful articles covering industry trends,
        career advice, and professional development.
      </p>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-purple-50 rounded-xl">
          <div className="bg-purple-100 text-purple-500 p-3 rounded-full mb-4">
            <Book size={24} />
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-3">
            No Blog Posts Found
          </h3>
          <p className="text-purple-700 max-w-md text-sm">
            There are no blog posts available at the moment. Please check back
            later for new content.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {blogs.slice(0, MAX_VISIBLE_BLOGS).map((blog, index) => (
              <Link
                to={`/article/${blog._id}`}
                key={blog._id}
                state={{
                  id: blog._id,
                  title: blog.title,
                  description:
                    stripHtmlTags(blog.content).substring(0, 150) + "...",
                  author: blog.author || "Admin",
                  date: formatDate(blog.createdAt),
                  jobtype: blog.category || "Blog",
                  image: blog.featuredImage,
                  content: blog.content,
                  isDynamic: true,
                }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col h-full transform hover:-translate-y-2 border border-purple-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative h-36 overflow-hidden">
                  {/* Animated corner accents */}
                  <div
                    className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-purple-500 z-10 transition-all duration-200 ${
                      hoveredCard === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-purple-500 z-10 transition-all duration-200 ${
                      hoveredCard === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-purple-500 z-10 transition-all duration-200 ${
                      hoveredCard === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-purple-500 z-10 transition-all duration-200 ${
                      hoveredCard === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    }`}
                  ></div>

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-700/30 to-transparent z-10 transition-opacity duration-200 ${
                      hoveredCard === index ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>

                  {/* Animated border */}
                  <div
                    className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 transition-all duration-200 ${
                      hoveredCard === index ? "w-full" : "w-0"
                    }`}
                  ></div>
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage || "/placeholder.svg"}
                      alt={blog.title}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        hoveredCard === index ? "scale-110 brightness-110" : ""
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg"; // Fallback image
                      }}
                    />
                  ) : (
                    <div
                      className={`h-full flex items-center justify-center transition-all duration-200 ${
                        hoveredCard === index
                          ? "bg-gradient-to-r from-purple-100 to-purple-200"
                          : "bg-gradient-to-r from-purple-50 to-purple-100"
                      }`}
                    >
                      <Book
                        className={`h-10 w-10 transition-transform duration-200 ${
                          hoveredCard === index
                            ? "scale-125 text-purple-400"
                            : "text-purple-300"
                        }`}
                      />
                    </div>
                  )}

                  {blog.category && (
                    <div className="absolute top-2 right-2 z-20">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          hoveredCard === index
                            ? "transform -translate-y-1 shadow-lg"
                            : ""
                        } bg-purple-100 text-purple-800`}
                      >
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className={`text-base font-bold mb-2 line-clamp-1 transition-colors duration-200 ${
                      hoveredCard === index
                        ? "text-purple-700"
                        : "text-purple-900"
                    }`}
                  >
                    {blog.title}
                  </h3>

                  <div className="space-y-1.5 mb-3 text-xs text-purple-700">
                    <div
                      className={`flex items-center transition-transform duration-200 ${
                        hoveredCard === index ? "translate-x-1" : ""
                      }`}
                    >
                      <Clock
                        className={`h-3 w-3 mr-1.5 text-purple-500 flex-shrink-0 transition-transform duration-200 ${
                          hoveredCard === index ? "rotate-12" : ""
                        }`}
                      />
                      <span className="line-clamp-1">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    {blog.author && (
                      <div
                        className={`flex items-center transition-transform duration-200 ${
                          hoveredCard === index ? "translate-x-1" : ""
                        }`}
                      >
                        <User
                          className={`h-3 w-3 mr-1.5 text-purple-500 flex-shrink-0 transition-transform duration-200 ${
                            hoveredCard === index ? "scale-125" : ""
                          }`}
                        />
                        <span className="line-clamp-1">{blog.author}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {stripHtmlTags(blog.content)}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-purple-50">
                    {blog.tags && blog.tags.length > 0 ? (
                      <span
                        className={`bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full transition-all duration-200 ${
                          hoveredCard === index
                            ? "transform -translate-y-1 bg-purple-100 shadow-md"
                            : ""
                        }`}
                      >
                        {blog.tags[0]}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    <span
                      className={`text-purple-700 text-xs font-medium flex items-center group transition-colors duration-200 ${
                        hoveredCard === index ? "text-purple-900" : ""
                      }`}
                      aria-label={`Read more about ${blog.title}`}
                    >
                      Read More
                      <ChevronRight
                        className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${
                          hoveredCard === index ? "translate-x-1" : ""
                        }`}
                      />
                    </span>
                  </div>
                </div>

                {/* Enhanced glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-200 ${
                    hoveredCard === index
                      ? "shadow-[0_10px_25px_-5px_rgba(139,92,246,0.4),0_8px_10px_-6px_rgba(139,92,246,0.3),0_0_0_2px_rgba(139,92,246,0.1)]"
                      : ""
                  }`}
                ></div>
              </Link>
            ))}
          </div>

          {blogs.length > MAX_VISIBLE_BLOGS && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleSeeMore}
                className="px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 shadow-md hover:shadow-xl text-sm font-medium relative overflow-hidden group"
                aria-label="See more blog posts"
              >
                <span className="absolute inset-0 w-0 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
                <span className="relative z-10">See More Articles</span>
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Animation classes */
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.3s ease-out 0.15s forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default BlogDisplay;
