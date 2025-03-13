import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProfileStore } from "../store/profile.store";
import WalletCard from "../components/Wallet";
import { Pencil } from "lucide-react";
import EditProfileCard from "../components/EditProfileCard";

const ProfileDashboard = () => {
  const [walletOpen, setWalletOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const { ProfileData, myProfile, UpdateProfilePic, isUpdatingProfilePic } =
    ProfileStore();

  useEffect(() => {
    ProfileData();
  }, [myProfile]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6 flex justify-center items-center">
      <motion.div
        className="bg-[#2C2C2C] p-8 rounded-lg shadow-lg max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 relative">
            {
              isUpdatingProfilePic ? (
                <div className="w-24 h-24 rounded-full border-4 border-gray-500 flex items-center justify-center font-extralight text-xs" >loading...</div>
              ) : (
                <>
                    <img
              src={myProfile.profilePic}
              alt="loading..."
              className="w-24 h-24 rounded-full border-4 border-gray-500 flex items-center justify-center font-extralight text-xs"
            />
            <label htmlFor="profilePicInput">
              <Pencil className="absolute bottom-2 right-2 bg-gray-700 p-1 rounded-full text-white cursor-pointer" />
            </label>
            <input
              type="file"
              id="profilePicInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("profilePic", file); // ✅ Append file with correct key

                  UpdateProfilePic(formData); // ✅ Pass FormData instead of File
                } else {
                  console.error("No file selected.");
                }
              }}
            />
                </>
              )
            }
            
          </div>
          <h2 className="text-2xl font-bold">{myProfile.fullName}</h2>
          <p className="text-gray-400">{myProfile.email}</p>
        </div>

        {/* Bio Section */}
        <div className="mt-4 p-4 bg-[#3C3C3C] rounded-lg">
          <h3 className="text-lg font-semibold">About Me</h3>
          <p className="text-gray-400 text-sm mt-2">{myProfile.about}</p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#3C3C3C] p-4 rounded-lg flex flex-col items-center justify-center">
            <h4 className="text-xl font-bold">
              {myProfile.coursesBuyied.length || 0}
            </h4>
            <p className="text-gray-400 text-sm">Purchased Courses</p>
          </div>
          <div
            className="bg-[#3C3C3C] p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#444444] transition"
            onClick={() => setWalletOpen(true)} // Open Wallet Modal
          >
            <h4 className="text-xl font-bold text-green-400">
              ₹{myProfile.wallet}
            </h4>
            <p className="text-gray-400 text-sm">Wallet</p>
          </div>
          <div className="bg-[#3C3C3C] p-4 rounded-lg flex flex-col items-center justify-center">
            <h4 className="text-xl font-bold">Keep Learning 🚀</h4>
            <p className="text-gray-400 text-sm">Stay Consistent</p>
          </div>
        </div>

        {/* User's Wallet */}
        {walletOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <motion.div
              className="bg-[#2C2C2C] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WalletCard onClose={() => setWalletOpen(false)} money={myProfile.wallet} />
            </motion.div>
          </div>
        )}

        {editProfileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <motion.div
              className="bg-[#2C2C2C] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EditProfileCard
                onClose={() => setEditProfileOpen(false)}
                initialProfile={myProfile}
              />
            </motion.div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 text-center flex flex-col gap-4">
          <button
            onClick={() => setEditProfileOpen(true)}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileDashboard;
