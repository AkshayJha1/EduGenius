"use client";
import { useState } from "react";
import { UploadCloud, Image, Video } from "lucide-react";
import { VideoStore } from "../store/video.store";
import toast from "react-hot-toast";

const UploadVideoComponent = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [ price , setPrice ] = useState(0)

  const { UploadVideo, uploadingVideo } = VideoStore();

  const handleUpload = async () => {
    if (!video || !thumbnail || !title || !subject || !description || !price) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("price" , price)

    await UploadVideo(formData);
    setVideo(null);
    setThumbnail(null);
    setTitle("");
    setSubject("");
    setDescription("");
    setPrice(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1E1E1E] p-6">
      <div className="w-full max-w-md p-6 bg-[#2C2C2C] rounded-2xl shadow-lg text-center">
        <UploadCloud className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Upload Your Video</h2>
        <p className="text-sm text-gray-400 mb-4">Select a video file to upload.</p>

        {/* Video Upload */}
        <label className="block cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Choose Video
          <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files[0])} />
        </label>
        {video && <p className="mt-2 text-sm text-gray-300">Selected: {video.name}</p>}

        {/* Thumbnail Upload */}
        <label className="block cursor-pointer px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-4">
          Choose Thumbnail
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnail(e.target.files[0])} />
        </label>
        {thumbnail && <p className="mt-2 text-sm text-gray-300">Selected: {thumbnail.name}</p>}

        {/* Price Input */}
        <input
          type="number"
          placeholder="price"
          className="w-full p-2 mt-4 bg-[#3A3A3A] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mt-4 bg-[#3A3A3A] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Subject Input */}
        <input
          type="text"
          placeholder="Subject"
          className="w-full p-2 mt-2 bg-[#3A3A3A] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          className="w-full p-2 mt-2 bg-[#3A3A3A] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Upload Button */}
        <button
          className="w-full mt-4 p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          onClick={handleUpload}
          disabled={uploadingVideo}
        >
          {uploadingVideo ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </div>
  );
};

export default UploadVideoComponent;