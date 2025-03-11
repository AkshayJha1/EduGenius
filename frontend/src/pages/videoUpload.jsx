import React, { useState } from "react";
import { VideoStore } from "../store/video.store";

const UploadVideoComponent = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const { UploadVideo, uploadingVideo } = VideoStore();

  const handleUpload = async () => {
    if (!video || !thumbnail || !title || !subject) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("subject", subject);

    UploadVideo(formData); // Pass FormData to Zustand store function
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <p>Video</p>
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
      <p>Thumbnail</p>
      <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
      <p>Title</p>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <p>Subject</p>
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

      <button onClick={handleUpload} disabled={uploadingVideo}>
        {uploadingVideo ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
};

export default UploadVideoComponent;
