import React, { useEffect, useState } from "react";
import { VideoStore } from "../store/video.store";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const Navigate = useNavigate(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { courses, GetCourses} = VideoStore();
  
  useEffect(()=> {
    GetCourses();
  },[courses])

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || course.category === selectedCategory)
  );

  const handleEnroll = (url) => {
    const encodedUrl = encodeURIComponent(url); // ✅ Encode special characters
    Navigate(`/coursepage/${encodedUrl}`);
  };
  

  return (
    <div
      className="min-h-screen p-6 text-white"
      style={{ backgroundColor: "#1E1E1E" }}
    >
      <h1 className="text-3xl font-bold mb-4 text-center">
        Explore Our Courses
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search for a course..."
          className="p-2 rounded-lg w-full md:w-1/3 bg-gray-800 text-white border border-gray-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="Full-Stack">Full-Stack</option>
          <option value="Databases">Databases</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-[#2C2C2C] p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
          >
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full rounded-lg"
            />
            <h3 className="mt-2 font-semibold">{course.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{course.category}</p>
            <button onClick={()=>{
              handleEnroll(course.thumbnailUrl)
            }} className="mt-4 px-4 py-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition">
              Enroll Now
            </button>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-400 mt-6">No courses found.</p>
      )}
    </div>
  );
};

export default CoursesPage;
