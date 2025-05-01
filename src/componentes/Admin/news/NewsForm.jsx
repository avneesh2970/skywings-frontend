"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { X, Loader2, ImageIcon } from "lucide-react";
import { AppContext } from "../../../context/AppContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const NewsForm = ({ newsItem }) => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: user?.name || "",
    date: new Date().toISOString().split("T")[0],
    tags: [],
    status: "published",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef(null);

  // Initialize form with existing news data if editing
  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || "",
        description: newsItem.description || "",
        content: newsItem.content || "",
        author: newsItem.author || user?.name || "",
        date: newsItem.date
          ? new Date(newsItem.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        tags: newsItem.tags || [],
        status: newsItem.status || "published",
        image: null, // We don't set the file object, just the preview
      });
      if (newsItem.image) {
        setImagePreview(newsItem.image);
      }
    }
  }, [newsItem, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.date) newErrors.date = "Date is required";

    // If creating new news and no image is provided
    if (!newsItem && !formData.image && !imagePreview) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));

    // Clear error for content if it exists
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file (JPEG, PNG, or WebP)",
      }));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 2MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));

    // Clear error for image if it exists
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "image") {
          // Only append image if it's a new file
          if (formData.image) {
            formDataToSend.append("image", formData.image);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;

      if (newsItem) {
        // Update existing news
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/news/${newsItem._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("News updated successfully!");
      } else {
        // Create new news
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/news`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("News created successfully!");
      }

      // Navigate back to news list
      navigate("/admin/dashboard/news");
    } catch (err) {
      console.error("Error saving news:", err);
      toast.error(err.response?.data?.message || "Failed to save news article");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard/news");
  };

  // Rich text editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {newsItem ? "Edit News Article" : "Create News Article"}
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content <span className="text-red-500">*</span>
          </label>
          <div
            className={`mt-1 ${
              errors.content ? "border border-red-500 rounded-md" : ""
            }`}
          >
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              className="min-h-[200px]"
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Author and Date - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.author ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="flex-1">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={addTag}
                placeholder="Add tags (press Enter or comma to add)"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Press Enter or comma to add a tag
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image{" "}
            {!newsItem && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-1 flex flex-col items-center">
            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <img
                  src={`${import.meta.env.VITE_API_URL}${imagePreview} `}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-md border-2 border-dashed ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-blue-500`}
              >
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload an image or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 2MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="mt-1">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="status-published"
                  name="status"
                  type="radio"
                  value="published"
                  checked={formData.status === "published"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="status-published"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Published
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-draft"
                  name="status"
                  type="radio"
                  value="draft"
                  checked={formData.status === "draft"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="status-draft"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Draft
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                <span>{newsItem ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              <span>{newsItem ? "Update News" : "Create News"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
