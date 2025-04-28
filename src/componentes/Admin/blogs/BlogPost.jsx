
import { useState, useEffect, useRef, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { formatDate } from "../../../utils/helpers"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { AppContext } from "../../../context/AppContext"


const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef(null)

  const {fetchPosts} = useContext(AppContext)

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Check if post is bookmarked
  useEffect(() => {
    if (id) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      setIsBookmarked(bookmarks.includes(id))

      // Simulate like count (would be from API in real app)
      setLikeCount(Math.floor(Math.random() * 50))
      setIsLiked(localStorage.getItem(`liked_${id}`) === "true")
    }
  }, [id])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blog/posts/${id}`)
        setPost(response.data)
        setLoading(false)

        // Scroll to top when post loads
        window.scrollTo(0, 0)
      } catch (error) {
        console.error("Error fetching post:", error)
        setError("Failed to load blog post")
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blog/posts/${id}`)
      fetchPosts() // Call the callback to refresh the posts list
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
      setDeleting(false)
    }
  }

  const toggleBookmark = () => {
    if (!id) return

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
    let newBookmarks

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id)
    } else {
      newBookmarks = [...bookmarks, id]
    }

    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const toggleLike = () => {
    if (!id) return

    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    localStorage.setItem(`liked_${id}`, (!isLiked).toString())
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareMenu(false)
    // Show toast notification (would implement in a real app)
    alert("Link copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading post...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Post</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
            >
              Try Again
            </button>
            <Link to="/admin/dashboard" className="text-emerald-600 hover:text-emerald-700 px-4 py-2">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post not found</h2>
        <Link to="/admin/dashboard" className="text-emerald-600 hover:text-emerald-700">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <>
      <article className="max-w-3xl mx-auto pt-6 pb-16 px-4">
        {/* Back button and actions */}
        <div className="mb-8 flex justify-between items-center">
          <Link to="/admin/dashboard" className="flex items-center text-emerald-600 hover:text-emerald-700 transition">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/dashboard/blog-post/editor/${post._id}`}
              className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 transition"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Title and metadata */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center text-gray-500 gap-x-6 gap-y-2 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Published {formatDate(post.createdAt)}</span>
            </div>
            {post.updatedAt !== post.createdAt && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>Updated {formatDate(post.updatedAt)}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>5 min read</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-3 flex justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1.5 ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600">
                <MessageCircle className="h-5 w-5" />
                <span>0</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 animate-fadeIn">
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy link
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share on Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share on Facebook
                    </a>
                  </div>
                )}
              </div>
              <button
                onClick={toggleBookmark}
                className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600"
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div
          className="prose prose-lg prose-emerald max-w-none prose-img:rounded-xl prose-headings:text-gray-800 prose-a:text-emerald-600 hover:prose-a:text-emerald-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BlogPost
