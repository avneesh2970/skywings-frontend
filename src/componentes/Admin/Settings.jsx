"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Save, Loader2, Upload } from "lucide-react"

export default function Settings() {
  const [saving, setSaving] = useState(false)
  const [profileImage, setProfileImage] = useState("/skywings.png")
  const [imageFile, setImageFile] = useState(null)

  // Default settings
  const defaultSettings = {
    name: "skywings",
    email: "career@assuredjob.com",
    role: "Administrator",
    bio: "Managing the admin dashboard and system settings.",
    phone: "+91-8860159136",
  }

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState(defaultSettings)

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    // Load profile settings
    const savedSettings = localStorage.getItem("profileSettings")
    if (savedSettings) {
      setProfileSettings(JSON.parse(savedSettings))
    }

    // Load profile image
    const savedImage = localStorage.getItem("profileImage")
    if (savedImage && savedImage !== "null" && savedImage !== "undefined") {
      setProfileImage(savedImage)
    }
  }, [])

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    const updatedSettings = {
      ...profileSettings,
      [name]: value,
    }
    setProfileSettings(updatedSettings)
  }

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target.result
        setProfileImage(result)
        // Save image to localStorage
        localStorage.setItem("profileImage", result)
      }
      reader.readAsDataURL(file)
      setImageFile(file)
    }
  }

  // Remove profile image
  const removeImage = () => {
    const defaultImage = "/skywings.png"
    setProfileImage(defaultImage)
    setImageFile(null)
    localStorage.setItem("profileImage", defaultImage)
  }

  // Save settings
  const saveSettings = (e) => {
    e.preventDefault()
    setSaving(true)

    // Save to localStorage
    localStorage.setItem("profileSettings", JSON.stringify(profileSettings))

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast.success("Settings saved successfully!")
    }, 1000)
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={saveSettings}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={profileImage || "/skywings.png"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border border-gray-200"
                />
                <div className="absolute bottom-0 right-0">
                  <label
                    htmlFor="profile-image"
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4" />
                  </label>
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              {profileImage !== "/skywings.png" && (
                <button type="button" onClick={removeImage} className="ml-4 text-sm text-red-600 hover:text-red-800">
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileSettings.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileSettings.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={profileSettings.role}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileSettings.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={profileSettings.bio}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
