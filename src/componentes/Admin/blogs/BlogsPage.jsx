import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  formatDate,
  truncateText,
  extractTextFromHtml,
} from "../../../utils/helpers";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  PenSquare,
} from "lucide-react";
import { AppContext } from "../../../context/AppContext";

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const { posts, loading, error } = useContext(AppContext);

  useEffect(() => {
    if (posts.length > 0) {
      let filtered = [...posts];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            extractTextFromHtml(post.content)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOption === "newest" ? dateB - dateA : dateA - dateB;
      });

      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  }, [posts, searchTerm, sortOption]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-red-600 text-xl font-semibold mb-3">
            Error Loading Posts
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-12 px-4 rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-emerald-600">Skywings</span> Blog
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover stories, insights, and knowledge from our community
          </p>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No blog posts yet
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to share your thoughts and ideas!
              </p>
              <Link
                to="/admin/dashboard/blog-post/editor"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-md hover:bg-emerald-700 transition"
              >
                <span>Create Your First Post</span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchTerm ? "Search Results" : "Latest Posts"}
                </h2>
                {searchTerm && (
                  <span className="ml-2 text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    {filteredPosts.length} results
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 text-gray-600 hover:text-emerald-600"
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="ml-2 bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                <Link
                  to="/admin/dashboard/blog-post/editor"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <PenSquare size={18} />
                  <span>New Post</span>
                </Link>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Additional filters could go here */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                      />
                      <input
                        type="date"
                        className="bg-white border border-gray-300 rounded-md text-gray-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            {filteredPosts.length === 0 && searchTerm ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">
                  No posts found matching {searchTerm}
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/admin/dashboard/blog-post/${post._id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden">
                      {post.featuredImage ? (
                        <div className="aspect-[16/9] bg-gray-100">
                          <img
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {truncateText(extractTextFromHtml(post.content), 120)}
                      </p>
                      <div className="mt-auto flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
