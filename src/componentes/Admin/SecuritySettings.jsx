import { useState } from "react";
import { toast } from "react-hot-toast";
import { Lock, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import axios from "axios";

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle security form changes
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate password change
  const validatePasswordChange = () => {
    // Get stored password from localStorage or use default

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
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordChange()) return;

    setLoading(true);

    try {
      // Simulate API call with setTimeout
      const changePassword = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/change-password`,
        {
          currentPassword: securitySettings.currentPassword,
          newPassword: securitySettings.newPassword,
        }
      );
      console.log(changePassword.data);
      toast.success(
        changePassword.data.message || "password changed successfully"
      );
      setSecuritySettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error.response.data.message ||
          "Error changing password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Security Settings
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange}>
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
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
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
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                {loading ? (
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
      </div>
      <Toaster />
    </div>
  );
}
