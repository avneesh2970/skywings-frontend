"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Lock,
  Bell,
  Palette,
  SettingsIcon,
  Save,
  Loader2,
  Moon,
  Sun,
  Upload,
  Check,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState("/skywings.png");
  const [imageFile, setImageFile] = useState(null);

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    name: "skywings",
    email: "career@assuredjob.com",
    role: "Administrator",
    bio: "Managing the admin dashboard and system settings.",
    phone: "+91-8860159136",
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newSubmissionAlert: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    sidebarCollapsed: false,
    denseMode: false,
    fontSize: "medium",
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    siteTitle: "Admin Dashboard",
    siteDescription: "Comprehensive admin panel for managing content and users",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "en-US",
    itemsPerPage: 10,
  });

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle security form changes
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle notification form changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle appearance form changes
  const handleAppearanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle system form changes
  const handleSystemChange = (e) => {
    const { name, value } = e.target;
    setSystemSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // Remove profile image
  const removeImage = () => {
    setProfileImage("/skywings.png");
    setImageFile(null);
  };

  // Save settings
  const saveSettings = (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  // Validate password change
  const validatePasswordChange = () => {
    if (!securitySettings.currentPassword) {
      toast.error("Current password is required");
      return false;
    }
    if (securitySettings.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return false;
    }
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    return true;
  };

  // Change password
  const changePassword = (e) => {
    e.preventDefault();
    if (!validatePasswordChange()) return;

    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Password changed successfully!");
      setSecuritySettings({
        ...securitySettings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  // Toggle two-factor authentication
  const toggleTwoFactor = () => {
    setSecuritySettings((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
    toast.success(
      securitySettings.twoFactorEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled"
    );
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "profile"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "security"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Lock className="mr-3 h-5 w-5" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "notifications"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "appearance"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Palette className="mr-3 h-5 w-5" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "system"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <SettingsIcon className="mr-3 h-5 w-5" />
              System
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Profile Settings
              </h2>
              <form onSubmit={saveSettings}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
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
                    {profileImage !== "/vibrant-street-market.png" && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="ml-4 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Security Settings
              </h2>

              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Change Password
                </h3>
                <form onSubmit={changePassword}>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={securitySettings.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={securitySettings.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
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
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account by enabling
                      two-factor authentication.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {securitySettings.twoFactorEnabled
                        ? "Two-factor authentication is currently enabled."
                        : "Two-factor authentication is currently disabled."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTwoFactor}
                    className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      securitySettings.twoFactorEnabled
                        ? "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500"
                        : "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500"
                    }`}
                  >
                    {securitySettings.twoFactorEnabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Login Sessions
                </h3>
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Current Session
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Started: Today at 10:23 AM
                      </p>
                      <p className="text-xs text-gray-500">
                        IP: 192.168.1.1 • Chrome on Windows
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      Active
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                  onClick={() =>
                    toast.success("All other sessions have been logged out")
                  }
                >
                  Log out of all other sessions
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Notification Settings
              </h2>
              <form onSubmit={saveSettings}>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive email notifications from the system
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        New Submission Alerts
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Get notified when new resumes or forms are submitted
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newSubmissionAlert"
                        checked={notificationSettings.newSubmissionAlert}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        System Updates
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive notifications about system updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="systemUpdates"
                        checked={notificationSettings.systemUpdates}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Marketing Emails
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
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
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Appearance Settings
              </h2>
              <form onSubmit={saveSettings}>
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    Theme
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        appearanceSettings.theme === "light"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "light",
                        })
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium">Light</span>
                        </div>
                        {appearanceSettings.theme === "light" && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="h-20 bg-white border border-gray-200 rounded"></div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        appearanceSettings.theme === "dark"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "dark",
                        })
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Moon className="h-5 w-5 text-blue-700 mr-2" />
                          <span className="font-medium">Dark</span>
                        </div>
                        {appearanceSettings.theme === "dark" && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="h-20 bg-gray-800 border border-gray-700 rounded"></div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        appearanceSettings.theme === "system"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "system",
                        })
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex">
                            <Sun className="h-5 w-5 text-yellow-500" />
                            <Moon className="h-5 w-5 text-blue-700 -ml-1" />
                          </div>
                          <span className="font-medium ml-2">System</span>
                        </div>
                        {appearanceSettings.theme === "system" && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Collapsed Sidebar
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Start with the sidebar collapsed
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="sidebarCollapsed"
                        checked={appearanceSettings.sidebarCollapsed}
                        onChange={handleAppearanceChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Dense Mode
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Compact layout with less whitespace
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="denseMode"
                        checked={appearanceSettings.denseMode}
                        onChange={handleAppearanceChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="py-3 border-b">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Font Size
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Adjust the font size of the interface
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="fontSize"
                          value="small"
                          checked={appearanceSettings.fontSize === "small"}
                          onChange={handleAppearanceChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Small
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="fontSize"
                          value="medium"
                          checked={appearanceSettings.fontSize === "medium"}
                          onChange={handleAppearanceChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Medium
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="fontSize"
                          value="large"
                          checked={appearanceSettings.fontSize === "large"}
                          onChange={handleAppearanceChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Large
                        </span>
                      </label>
                    </div>
                  </div>
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
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                System Settings
              </h2>
              <form onSubmit={saveSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="siteTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Site Title
                    </label>
                    <input
                      type="text"
                      id="siteTitle"
                      name="siteTitle"
                      value={systemSettings.siteTitle}
                      onChange={handleSystemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={systemSettings.language}
                      onChange={handleSystemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="siteDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={2}
                    value={systemSettings.siteDescription}
                    onChange={handleSystemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="dateFormat"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={systemSettings.dateFormat}
                      onChange={handleSystemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="timeFormat"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Time Format
                    </label>
                    <select
                      id="timeFormat"
                      name="timeFormat"
                      value={systemSettings.timeFormat}
                      onChange={handleSystemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="itemsPerPage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Items Per Page
                  </label>
                  <select
                    id="itemsPerPage"
                    name="itemsPerPage"
                    value={systemSettings.itemsPerPage}
                    onChange={handleSystemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
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
          )}
        </div>
      </div>
    </div>
  );
}
