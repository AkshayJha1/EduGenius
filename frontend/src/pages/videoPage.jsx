import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { VideoStore } from "../store/video.store";
import { useNavigate, useParams } from "react-router-dom";

import { socket, connectSocket, disconnectSocket } from "../lib/socket.js";
import { ProfileStore } from "../store/profile.store.js";

const CoursePage = () => {
  const Navigate = useNavigate();
  const { videoUrl } = useParams();
  const decodedUrl = decodeURIComponent(videoUrl);

  const { myProfile } = ProfileStore();
  const {
    GetVideo,
    specificVideo,
    loadingVideo,
    StripePurchaseCourse,
    PurchaseCourse,
    purchasingCourse,
    courseBuyied,
    GetCourseBuyied,
  } = VideoStore();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState();
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (specificVideo.isCoursePurchased) {
      connectSocket();

      if (decodedUrl) {
        socket.emit("joinRoom", decodedUrl); // Join room with video ID
      }

      socket.on("newComment", (comment) => {
        setComments((prev) => [...prev, comment]); // Update comments in real-time
      });

      return () => {
        socket.off("newComment");
        socket.emit("leaveRoom", decodedUrl); // Leave room when user exits
        disconnectSocket();
      };
    }
  }, [decodedUrl, specificVideo.isCoursePurchased]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll to the latest comment
  }, [comments]);

  const sendComment = () => {
    if (newComment.trim() === "") return; // Prevent empty comments

    const commentData = {
      videoId: decodedUrl, // Send video ID to specify room
      comment: {
        text: newComment,
        user: myProfile.fullName, // Replace with actual user from auth
        timestamp: new Date().toLocaleTimeString(),
      },
    };

    socket.emit("sendComment", commentData); // Send comment to the backend
    setNewComment(""); // Clear input field
  };

  useEffect(() => {
    GetVideo(decodedUrl);
  }, [decodedUrl, courseBuyied]);

  useEffect(() => {
    GetCourseBuyied();
  }, [courseBuyied]);

  if (loadingVideo) {
    return <div>Loading, please wait...</div>;
  }
  if (!specificVideo) {
    return <div>No Video Found</div>;
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1E1E1E] text-white p-6 gap-6">
      {/* Left Side - Video */}
      <div className="md:w-2/3 w-full">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          {specificVideo?.isCoursePurchased ? (
            specificVideo?.video?.videoUrl ? (
              <video className="w-full" controls>
                <source src={specificVideo.video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Loading video...</p>
            )
          ) : specificVideo?.video?.thumbnailUrl ? (
            <img
              src={specificVideo.video.thumbnailUrl}
              alt="loading thumbnail"
            />
          ) : (
            <p>Loading thumbnail...</p>
          )}
        </div>

        {/* Course Description */}
        <div className="mt-6 p-4 bg-[#2C2C2C] rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">
            {specificVideo.video.videoTitle}
          </h2>
          <p className="text-gray-400 mt-2">
            {specificVideo.video.description}
          </p>
          <p>{specificVideo.video.videoSubject}</p>
        </div>
      </div>

      {specificVideo.isCoursePurchased ? (
        <motion.div
          className="md:w-1/3 w-full bg-[#2C2C2C] p-6 rounded-lg shadow-lg h-[87vh] flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Right Side - Comment Section */}
          <h2 className="text-xl font-bold mb-4">Live Chat</h2>

          {/* Comments List - Fixed height & Scrollable */}
          <div className="flex-grow overflow-y-auto p-2 border-b border-gray-600 h-[320px]">
            {comments.length === 0 ? (
              <p className="text-gray-400">
                No chats yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded max-w-[75%] ${
                    comment.user === myProfile.fullName
                      ? "bg-[#1E1E1E] ml-auto text-gray-300 text-right"
                      : "bg-[#1E1E1E] text-gray-300"
                  }`}
                >
                  <p className="font-semibold">{comment.user}</p>
                  <p className="font-normal">{comment.text}</p>
                  <p className="text-xs text-gray-500 font-light">{comment.timestamp}</p>
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Input Field & Send Button */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 rounded bg-gray-700 text-white"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition"
              onClick={sendComment}
            >
              Send
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="md:w-1/3 w-full bg-[#2C2C2C] p-6 rounded-lg shadow-lg h-fit"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Right Side - Payment */}
          <h2 className="text-xl font-bold mb-4">Purchase Course</h2>
          <p className="text-gray-400 mb-4">
            Get lifetime access to this course.
          </p>
          <div className="text-2xl font-semibold mb-6">
            ₹{specificVideo.video.price}.00
          </div>
          <button
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            onClick={() => {
              PurchaseCourse(specificVideo.video.thumbnailUrl);
            }}
          >
            🏦 Pay with Wallet
          </button>
          <button
            className="w-full py-3 mt-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            onClick={async() => {
              const url = await StripePurchaseCourse({price : specificVideo.video.price , videoUrl : encodeURIComponent(specificVideo.video.thumbnailUrl) });
              console.log(url)
              window.location.href = url;
            }}
          >
            💳 Secure Checkout
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CoursePage;
