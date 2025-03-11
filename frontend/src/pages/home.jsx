import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthStore } from "../store/auth.store";
import { ProfileStore } from "../store/profile.store";
import { VideoStore } from "../store/video.store";
import { useNavigate } from "react-router-dom";

const categories = [
    { name: "JavaScript", icon: "💛", color: "#F7DF1E" },
    { name: "React.js", icon: "⚛️", color: "#61DAFB" },
    { name: "Node.js", icon: "🌿", color: "#3C873A" },
    { name: "Full-Stack", icon: "🌐", color: "#FF5733" },
    { name: "Databases", icon: "🛢️", color: "#4DB33D" },
];
  
const videos = [
    { id: 1, title: "JavaScript Fundamentals", thumbnail: "https://via.placeholder.com/250" },
    { id: 2, title: "Advanced JavaScript Concepts", thumbnail: "https://via.placeholder.com/250" },
    { id: 3, title: "Mastering React.js", thumbnail: "https://via.placeholder.com/250" },
    { id: 4, title: "Building Full-Stack Apps", thumbnail: "https://via.placeholder.com/250" },
    { id: 5, title: "Node.js for Backend Development", thumbnail: "https://via.placeholder.com/250" },
    { id: 6, title: "Express.js & REST API", thumbnail: "https://via.placeholder.com/250" },
    { id: 7, title: "MongoDB Database Essentials", thumbnail: "https://via.placeholder.com/250" },
    { id: 8, title: "Building Real-time Apps with WebSockets", thumbnail: "https://via.placeholder.com/250" },
    { id: 9, title: "Optimizing React Performance", thumbnail: "https://via.placeholder.com/250" },
    { id: 10, title: "Authentication with JWT & OAuth", thumbnail: "https://via.placeholder.com/250" },
];

const Home = () => {
    const { authUser } = AuthStore();
    const { myProfile } = ProfileStore();
    const { GetCourses , courses } = VideoStore();

    useEffect(()=>{
        GetCourses();
    },[courses]);

    if(!myProfile && !authUser) {
        return (<div>
            loading....
        </div>)
    }

    const Navigate = useNavigate();

    const handleOnClick = (url) => {
        const encodedUrl = encodeURIComponent(url); // ✅ Encode special characters
        Navigate(`/coursepage/${encodedUrl}`);
    };

  return (
    <div className="text-white min-h-screen p-6" style={{ backgroundColor: "#1E1E1E" }}>
      {/* 🏆 Hero Section - Only for Guests */}
      {
        !authUser ? (
            <section className="text-center py-10">
            <motion.h1
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Learn Smarter, Not Harder 🎓
            </motion.h1>
            <motion.p className="text-gray-400 mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            >
                Master new skills with interactive lessons & expert tutors.
            </motion.p>
            <motion.button
                className="px-6 py-3 rounded-full text-white transition transform hover:scale-105"
                style={{ backgroundColor: "#0056b3" }}
                whileHover={{ scale: 1.1 }}
            >
                Start Learning
            </motion.button>
            </section>
            ) : (
                <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-2 text-white" >Welcome Back, {myProfile.fullName}! 👋</h2>
                <p className="text-gray-400">Continue where you left off or explore new courses.</p>
                </section>
            )
        }

      {/* 📚 Categories Section */}
        <section className="my-8">
            <h2 className="text-2xl font-semibold mb-4">Explore Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
                <motion.div
                key={index}
                className="p-4 rounded-lg text-center text-white transition cursor-pointer"
                style={{ backgroundColor: cat.color }}
                whileHover={{ scale: 1.1 }}
                >
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="mt-2">{cat.name}</h3>
                </motion.div>
            ))}
            </div>
        </section>

        {/* 🎥 Trending Courses - Horizontal Scroll */}
        <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">
            {authUser ? "Your Recommended Courses" : "Trending Courses"}
            </h2>
            <div className="flex overflow-x-auto space-x-6 p-2 scrollbar-hide">
            {courses.map((course) => (
                <motion.div onClick={()=>{
                    handleOnClick(course.thumbnailUrl);
                }}
                className="min-w-[250px] bg-[#2C2C2C] p-4 rounded-lg shadow-md hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
                >
                <img src={course.thumbnailUrl} alt={course.title} className="w-full rounded-lg" />
                <h3 className="mt-2 font-semibold">{course.title}</h3>
                </motion.div>
            ))}
            </div>
        </section>
    </div>
  );
};

export default Home;
