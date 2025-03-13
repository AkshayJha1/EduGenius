import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthStore } from "../store/auth.store";
import { ProfileStore } from "../store/profile.store";
import { VideoStore } from "../store/video.store";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const Navigate = useNavigate();

  const { authUser } = AuthStore();
  const { myProfile } = ProfileStore();
  const { GetCourses, courses, GetCourseBuyied, courseBuyied } = VideoStore();

  useEffect(() => {
    GetCourses();
  }, [courses]);

  useEffect(() => {
    if (authUser) {
      GetCourseBuyied();
    }
  }, [courseBuyied]);

  const handleOnClick = (url) => {
    const encodedUrl = encodeURIComponent(url); // ✅ Encode special characters
    Navigate(`/coursepage/${encodedUrl}`);
  };

  return (
    <div
      className="text-white min-h-screen p-6"
      style={{ backgroundColor: "#1E1E1E" }}
    >
      {/* 🏆 Hero Section - Only for Guests */}
      {!authUser ? (
        <section className="text-center py-10">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Learn Smarter, Not Harder 🎓
          </motion.h1>
          <motion.p
            className="text-gray-400 mb-6"
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
            onClick={() => {
              Navigate("/auth");
            }}
          >
            Start Learning
          </motion.button>
        </section>
      ) : (
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-white">
            Welcome Back, {myProfile.fullName}! 👋
          </h2>
          <p className="text-gray-400">
            Continue where you left off or explore new courses.
          </p>
        </section>
      )}

    {/* Purchased Courses */}
    {
        authUser && (courseBuyied.length > 0) ? (
            <section className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Your Purchased Courses</h2>
                <div className="flex overflow-x-auto space-x-6 p-2 scrollbar-hide">
                    {courseBuyied.map((course) => (
                        <motion.div
                        key={course.id}
                        onClick={() => handleOnClick(course.thumbnailUrl)}
                        className="w-[250px] flex-shrink-0 bg-[#2C2C2C] p-4 rounded-lg shadow-md hover:shadow-lg transition"
                        whileHover={{ scale: 1.05 }}
                        >
                        <img
                            src={course.thumbnailUrl}
                            alt={course.videoTitle}
                            className="w-full rounded-lg"
                        />
                        <h3 className="mt-2 font-semibold">{course.videoTitle}</h3>
                        <h3 className="mt-1 font-normal">{course.videoSubject}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>
        ) : (
            <></>
        )
    }

      {/* 🎥 Trending Courses - Horizontal Scroll */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          {authUser ? "Your Recommended Courses" : "Trending Courses"}
        </h2>
        <div className="flex overflow-x-auto space-x-6 p-2 scrollbar-hide">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              onClick={() => handleOnClick(course.thumbnailUrl)}
              className="w-[250px] flex-shrink-0 bg-[#2C2C2C] p-4 rounded-lg shadow-md hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full rounded-lg"
              />
              <h3 className="mt-2 font-semibold">{course.title}</h3>
              <h3 className="mt-1 font-normal">{course.subject}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
