/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Upload, X, ImageIcon, Loader2, Save } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorMenuBar from "./Editor-menu-bar";
import EditorBubbleMenu from "./Editor-bubble-menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEvents() {
  const [dragActive, setDragActive] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [title, setTitle] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const titleInputRef = useRef(null);

  const navigate = useNavigate(); // ✅ Hook to navigate

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: () => {
      setUnsavedChanges(true);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetImage(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetImage(file);
  };

  const validateAndSetImage = (file) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller image.");
      return;
    }
    setFeaturedImage(file);
    setCurrentImage(URL.createObjectURL(file));
    setUnsavedChanges(true);
  };

  const uploadImage = async () => {
    if (!featuredImage) return "";
    const formData = new FormData();
    formData.append("image", featuredImage);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );
      return res.data.url;
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
      return "";
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a title for your post");
      return;
    }

    const content = editor?.getHTML() || "";
    if (!content.trim()) {
      alert("Please add some content to your post");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = currentImage;

      // Upload image if a new one is selected
      if (featuredImage) {
        const formData = new FormData();
        formData.append("image", featuredImage);

        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/blog/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      const content = editor?.getHTML() || "";
      const postData = {
        title,
        content,
        featuredImage: imageUrl,
      };

      // Create new post
      await axios.post(`${import.meta.env.VITE_API_URL}/api/blog/posts`, postData);

      setSaving(false);
      setUnsavedChanges(false);
      navigate("/admin/dashboard/events");
    } catch (error) {
      console.error("Error saving post:", error);
      setSaving(false);
      alert("Failed to save post");
    }
  };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSaving(true);

  //   const imageUrl = await uploadImage();
  //   const content = editor?.getHTML() || "";

  //   try {
  //     await axios.post("http://localhost:5000/api/posts", {
  //       title,
  //       content,
  //       featuredImage: imageUrl,
  //     });

  //     setSaving(false);
  //     setUnsavedChanges(false);
  //     toast.success("Post saved!");

  //     navigate("/events");
  //   } catch (err) {
  //     console.error("Failed to save post", err);
  //     alert("Failed to save post");
  //     setSaving(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
        >
          {/* Featured Image Upload */}
          <div
            role="button"
            aria-label="Upload featured image"
            tabIndex={0}
            className={`mb-6 border-2 border-dashed rounded-xl p-4 transition-colors ${
              dragActive
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
          >
            <label className="block text-gray-700 font-medium mb-2">
              Featured Image
            </label>

            {currentImage ? (
              <div className="relative">
                <img
                  src={currentImage}
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
                      setFeaturedImage(null);
                      setCurrentImage("");
                      setUnsavedChanges(true);
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
                <p className="text-gray-600 text-center mb-2">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Recommended: 1200×800px, JPEG, PNG or WebP, max 5MB
                </p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              ref={titleInputRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter an engaging title for your post"
              required
            />
          </div>

          {/* Editor */}
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium mb-2"
            >
              Content
            </label>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {editor && <EditorMenuBar editor={editor} />}
              {editor && <EditorBubbleMenu editor={editor} />}
              <EditorContent
                editor={editor}
                className="p-4 min-h-[300px] prose prose-lg prose-emerald max-w-none focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
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
                  <span>Publish Post 1</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvents;
