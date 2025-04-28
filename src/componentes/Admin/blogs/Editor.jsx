/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef, useContext } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import axios from "axios"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TipTapLink from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import EditorMenuBar from "./Editor-menu-bar"
import EditorBubbleMenu from "./Editor-bubble-menu"
import { ImageIcon, ArrowLeft, Save, Loader2, Eye, Edit2, X, Upload, AlertTriangle } from "lucide-react"
import { AppContext } from "../../../context/AppContext"


// eslint-disable-next-line react/prop-types
const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [featuredImage, setFeaturedImage] = useState(null)
  const [currentImage, setCurrentImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const titleInputRef = useRef(null)
  const {fetchPosts} = useContext(AppContext);

  // Initialize TipTap editor with all required extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      TipTapLink.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your amazing blog post here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
      setUnsavedChanges(true)
    },
  })

  // Fetch post data if editing
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setLoading(true)
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blog/posts/${id}`)
          const post = response.data
          setTitle(post.title)
          setContent(post.content)
          if (editor) {
            editor.commands.setContent(post.content)
          }
          if (post.featuredImage) {
            setCurrentImage(post.featuredImage)
          }
          setLoading(false)
        } catch (error) {
          console.error("Error fetching post:", error)
          setLoading(false)
          alert("Failed to load post for editing")
        }
      }
      fetchPost()
    } else {
      // Focus on title input when creating a new post
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [id, editor])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [unsavedChanges])

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0])
      setCurrentImage(URL.createObjectURL(e.target.files[0]))
      setUnsavedChanges(true)
    }
  }

  // Handle drag and drop for image
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setFeaturedImage(file)
        setCurrentImage(URL.createObjectURL(file))
        setUnsavedChanges(true)
      }
    }
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert("Please provide a title for your post")
      return
    }

    if (!content.trim()) {
      alert("Please add some content to your post")
      return
    }

    setSaving(true)
    try {
      let imageUrl = currentImage

      // Upload image if a new one is selected
      if (featuredImage) {
        const formData = new FormData()
        formData.append("image", featuredImage)

        const uploadResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/blog/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        imageUrl = uploadResponse.data.imageUrl
      }

      const postData = {
        title,
        content,
        featuredImage: imageUrl,
      }

      if (id) {
        // Update existing post
        await axios.put(`${import.meta.env.VITE_API_URL}/api/blog/posts/${id}`, postData)
      } else {
        // Create new post
        await axios.post(`${import.meta.env.VITE_API_URL}/api/blog/posts`, postData)
      }

      setSaving(false)
      setUnsavedChanges(false)
      fetchPosts() // Call the callback to refresh the posts list
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Error saving post:", error)
      setSaving(false)
      alert("Failed to save post")
    }
  }

  // Editor functions
  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:")

    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
      setUnsavedChanges(true)
    }
  }

  const setLink = () => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter the URL:", previousUrl)

    // cancelled
    if (url === null) return

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    setUnsavedChanges(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading post...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4">
      <div className="flex justify-between items-center mb-6">
        <RouterLink to="/admin/dashboard" className="flex items-center text-emerald-600 hover:text-emerald-700 transition">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </RouterLink>
        <h1 className="text-2xl font-bold text-gray-800">{id ? "Edit Blog Post" : "Create New Blog Post"}</h1>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-1.5 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          {preview ? (
            <>
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </>
          )}
        </button>
      </div>

      {preview ? (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {currentImage && (
            <img
              src={currentImage || "/placeholder.svg"}
              alt={title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>
          <div
            className="prose prose-lg prose-emerald max-w-none prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
          {/* Featured Image Upload */}
          <div
            className={`mb-6 border-2 border-dashed rounded-xl p-4 transition-colors ${
              dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <label className="block text-gray-700 font-medium mb-2">Featured Image</label>

            {currentImage ? (
              <div className="relative">
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-emerald-600"
                    title="Change image"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null)
                      setCurrentImage("")
                      setUnsavedChanges(true)
                    }}
                    className="p-2 bg-white rounded-full shadow-md text-red-600 hover:text-red-700"
                    title="Remove image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-8 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600 text-center mb-2">Drag & drop an image here, or click to select</p>
                <p className="text-xs text-gray-500">Recommended: 1200×800px, JPEG, PNG or WebP, max 5MB</p>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              ref={titleInputRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setUnsavedChanges(true)
              }}
              className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter an engaging title for your post"
              required
            />
          </div>

          {/* TipTap Editor */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Content
            </label>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {editor && <EditorMenuBar editor={editor} />}
              {editor && <EditorBubbleMenu editor={editor} onSetLink={setLink} />}
              <EditorContent
                editor={editor}
                className="p-4 min-h-[300px] prose prose-lg prose-emerald max-w-none focus:outline-none"
              />
            </div>
          </div>

          {/* Unsaved changes indicator */}
          {unsavedChanges && (
            <div className="mb-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span>You have unsaved changes</span>
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition disabled:bg-emerald-400"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Editor
