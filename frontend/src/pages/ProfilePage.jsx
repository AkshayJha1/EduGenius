import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileStore } from '../store/profile.store';

const ProfileDashboard = () => {

  const { myProfile } = ProfileStore();
  const user = {
    fullName: "Akshay Kumar Jha",
    email: "akshay@example.com",
    bio: "MERN Stack Developer | Lifelong Learner | unbeatable game most fantastic banda",
    avatar: "https://via.placeholder.com/150",
    stats: {
      courses: 5,
      progress: "80%",
      certificates: 2,
    },
  };

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
          <img src={myProfile.profilePic} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-gray-500" />
          <h2 className="text-2xl font-bold">{myProfile.fullName}</h2>
          <p className="text-gray-400">{myProfile.email}</p>
        </div>
        
        {/* Bio Section */}
        <div className="mt-4 p-4 bg-[#3C3C3C] rounded-lg">
          <h3 className="text-lg font-semibold">About Me</h3>
          <p className="text-gray-400 text-sm mt-2">{user.bio}</p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#3C3C3C] p-4 rounded-lg">
            <h4 className="text-xl font-bold">{myProfile.coursesBuyied.length || 0}</h4>
            <p className="text-gray-400 text-sm">Courses</p>
          </div>
          <div className="bg-[#3C3C3C] p-4 rounded-lg">
            <h4 className="text-xl font-bold">{user.stats.progress}</h4>
            <p className="text-gray-400 text-sm">Progress</p>
          </div>
          <div className="bg-[#3C3C3C] p-4 rounded-lg">
            <h4 className="text-xl font-bold">{user.stats.certificates}</h4>
            <p className="text-gray-400 text-sm">Certificates</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 text-center flex flex-col gap-4">
          <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">Edit Profile</button>
          <button className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition">View My Courses</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileDashboard;
