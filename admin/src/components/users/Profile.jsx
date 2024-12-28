import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Clock, Shield } from "lucide-react";
import { useGetUserDetailsQuery } from "../../features/user/userApiSlice";

const Profile = () => {
  const [glassEffect, setGlassEffect] = useState(false);
  const [profileColor, setProfileColor] = useState("#6366f1");
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery();

  useEffect(() => {
    localStorage.setItem("profileColor", profileColor);
  }, [profileColor]);

  const user = userDetails?.data || null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-100">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500">Error fetching user details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gray-900 p-4">
      <div className="w-full max-w-4xl mb-4 flex justify-end space-x-4">
        <div className="flex items-center">
          <label htmlFor="glassToggle" className="mr-2 text-white">
            Glass Effect
          </label>
          <div className="relative inline-block align-middle select-none">
            <input
              type="checkbox"
              name="glassToggle"
              id="glassToggle"
              className="toggle-checkbox"
              checked={glassEffect}
              onChange={() => setGlassEffect(!glassEffect)}
            />
            <label htmlFor="glassToggle" className="toggle-label">
              <span className="toggle-button" />
            </label>
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="colorPicker" className="mr-2 text-white">
            Profile Color
          </label>
          <input
            type="color"
            id="colorPicker"
            value={profileColor}
            onChange={(e) => setProfileColor(e.target.value)}
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>

      <div
        className={`w-full max-w-4xl p-8 bg-gray-800 rounded-xl shadow-lg ${
          glassEffect ? "bg-opacity-20 backdrop-filter backdrop-blur-lg" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div
            className="flex justify-center items-center z-1 h-40 w-40 rounded-full bg-gray-700 overflow-hidden border-4"
            style={{ borderColor: profileColor }}
          >
            <img
              src="https://c4.wallpaperflare.com/wallpaper/679/564/33/night-city-lights-city-lights-atmosphere-hd-wallpaper-preview.jpg"
              alt={`${user.first_name} ${user.last_name}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-lg text-gray-300 mt-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    user.status === "Active" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {user.status}
                </span>
              </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-2" style={{ color: profileColor }} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone
                  className="w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                <span>{user.mobile}</span>
              </div>
              {user.DOB && (
                <div className="flex items-center text-gray-300">
                  <Calendar
                    className="w-5 h-5 mr-2"
                    style={{ color: profileColor }}
                  />
                  <span>{new Date(user.DOB).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-lg ${
              glassEffect ? "bg-gray-700 bg-opacity-50" : "bg-gray-700"
            }`}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Account Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                <User
                  className="inline w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                User ID:{" "}
                <span className="font-mono" style={{ color: profileColor }}>
                  {user._id}
                </span>
              </p>
              <p className="text-gray-300">
                <Shield
                  className="inline w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                Admin:{" "}
                <span style={{ color: profileColor }}>
                  {user.isAdmin ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-gray-300">
                <Shield
                  className="inline w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                Supreme:{" "}
                <span style={{ color: profileColor }}>
                  {user.isSupreme ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-gray-300">
                <Shield
                  className="inline w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                Verified:{" "}
                <span style={{ color: profileColor }}>
                  {user.isVerified ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              glassEffect ? "bg-gray-700 bg-opacity-50" : "bg-gray-700"
            }`}
          >
            <h2 className="text-xl font-semibold text-white mb-2">Activity</h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                <Clock
                  className="inline w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                Last Login:{" "}
                <span style={{ color: profileColor }}>
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "N/A"}
                </span>
              </p>
              <p className="text-gray-300">
                <Calendar
                  className="inline w-5 h-5 mr-2"
                  style={{ color: profileColor }}
                />
                Account Created:{" "}
                <span style={{ color: profileColor }}>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
