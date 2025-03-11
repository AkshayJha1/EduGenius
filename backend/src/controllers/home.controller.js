const CourseVideos = require('../models/videos.model');
const mongoose = require('mongoose');

const getAllVideos = async(req,res) => {
    try {
        const Videos = await CourseVideos.find();

        if(Videos.length === 0) return res.status(500).json({ message : "Video not available"})
        res.status(200).json({Videos})
    } catch (error) {
        console.log("Error in getAllVideos" , error.message);
        res.status(500).json({ message : "Internal Server Error"})
    }
};

const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid video ID" });

        const video = await CourseVideos.findById(id);

        if (!video) return res.status(404).json({ message: "Video not found" });

        res.status(200).json({ video });
    } catch (error) {
        console.error("Error in getVideoById:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getAllVideos , getVideoById}