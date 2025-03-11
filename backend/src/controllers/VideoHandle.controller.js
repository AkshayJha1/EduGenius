const User = require('../models/user.model');
const CourseVideos = require('../models/videos.model');

const cloudinary = require('../config/cloudinary.config');
const fs = require("fs");
const path = require("path");

const uploadVideo = async (req,res) => {
    if (!req.files || !req.files.video || req.files.video.length === 0) {
        return res.status(400).json({ error: "No video file uploaded" });
    }

    const { title , subject } = req.body;
    try {

        const upload = await cloudinary.uploader.upload(req.files.video[0].path, {
            resource_type: "video",
            folder: "kringstep/videos"
        });

        // Upload Thumbnail to Cloudinary
        const thumbnailUrl =  ( await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
            resource_type: "image",
            folder: "kringstep/thumbnails"
        }) || cloudinary.url(upload.public_id, {
            resource_type: "video",
            format: "jpg",  // Generate thumbnail as an image
            transformation: [{ width: 300, height: 200, crop: "thumb" , start_offset: "5"}] // Resize to 300x200
        }))

        fs.unlink(req.files.video[0].path, (err) => {
            if (err) console.error("Error deleting video:", err);
            else console.log("Video deleted:", req.files.video[0].path);
        });
        
        // ✅ Delete Thumbnail from Local Storage (if uploaded)
        if (req.files.thumbnail && req.files.thumbnail.length > 0) {
            fs.unlink(req.files.thumbnail[0].path, (err) => {
                if (err) console.error("Error deleting thumbnail:", err);
                else console.log("Thumbnail deleted:", req.files.thumbnail[0].path);
            });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,  // i am going to pass req.user in my middleware of authenticateUser
            {
                $push: {
                    yourCourse: {
                        videoUrl: upload.secure_url,
                        thumbnailUrl: thumbnailUrl.secure_url,
                        videoTitle: title || req.file.originalname, // Using the original filename as the title
                        videoSubject : subject || req.file.originalname,
                    }
                }
            },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedVideos = await CourseVideos.create({ 
            userId: req.user.userId,
            videos: [  
                {
                    videoUrl: upload.secure_url,
                    thumbnailUrl: thumbnailUrl.secure_url,
                    videoTitle: title || req.file.originalname,
                    videoSubject: subject || req.file.originalname,
                }
            ]
        });
        

        if (!updatedVideos) {
            return res.status(404).json({ error: "CourseVideos not found" });
        }

        res.status(200).json({ 
            message: "Video uploaded successfully",
            videoUrl: upload.secure_url,
            thumbnailUrl: thumbnailUrl.secure_url,
            public_id: upload.public_id,
            user: updatedUser
        });
        
    } catch (error) {
        console.log("Error in uploadVideo" , error);
        res.status(500).json({ message : "Internal Server Error"})
    }
}

const yourCourses = async(req,res) => {
    const userId = req.user.userId;
    try {
        const yourCourseVideos = await User.findById(userId,{ yourCourse : 1 });
        if(!yourCourseVideos) return res.status(200).json({ "message" : "No courses found"});

        res.status(200).json(yourCourseVideos);
    } catch (error) {
        console.log("Error in yourCourses" , error);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

const coursesBuyied = async(req,res) => {
    const userId = req.user.userId;
    try {
        const coursesBuyiedVidoes = await User.findById(userId,{ coursesBuyied : 1 });
        if(!coursesBuyiedVidoes) return res.status(200).json({ "message" : "user not buyied any course"});

        res.status(200).json(coursesBuyiedVidoes);
    } catch (error) {
        console.log("Error in coursesBuyied" , error);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

const getThumbnails = async (req, res) => {
    try {
        const users = await User.find({}, { 
            fullName: 0, email: 0, password: 0, role: 0, profilePic: 0, coursesBuyied: 0 
        });

        if (users.length === 0) {
            return res.status(400).json({ message: "Videos not found" });
        }

        const allVideos = users.flatMap((user) => 
            user.yourCourse.map((course) => ({
                thumbnailUrl: course.thumbnailUrl,
                title: course.videoTitle,  // Ensure this is the correct field name
                subject: course.videoSubject // Ensure this is the correct field name
            }))
        );

        res.status(200).json({ allVideos });
    } catch (error) {
        console.log("Error in getThumbnails", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getVideoByThumbnail = async (req, res) => {
    try {
        const { thumbnail } = req.params;
        const decodedThumbnail = decodeURIComponent(thumbnail).trim();

        const user = await User.findOne(
            { yourCourse: { $elemMatch: { thumbnailUrl: { $regex: new RegExp(`^${decodedThumbnail}$`, "i") } } } },
            { "yourCourse.$": 1, _id: 0 }
        );

        if (!user || !user.yourCourse.length) {
            return res.status(404).json({ message: "Video not found" });
        }

        const currUser = await User.findById(req.user.userId, { coursesBuyied: 1, _id: 0 });

        const isCourseBuyied = currUser.coursesBuyied.some(video =>
            video.thumbnailUrl === user.yourCourse[0].thumbnailUrl
        );

        if (isCourseBuyied) {
            return res.status(200).json({
                video: user.yourCourse[0],
                isCoursePurchased: true
            });
        } else {
            return res.status(200).json({
                video : {
                    thumbnailUrl: user.yourCourse[0].thumbnailUrl,
                    videoTitle: user.yourCourse[0].videoTitle,
                    videoSubject: user.yourCourse[0].videoSubject,
                    _id : user.yourCourse[0]._id,
                },                
                isCoursePurchased: false
            });
        }
    } catch (error) {
        console.error("Error in getVideoByThumbnail:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const buyCourse = async (req, res) => {
    try {
        const { thumbnail } = req.params; // Get thumbnail from request body
        const decodedThumbnail = decodeURIComponent(thumbnail);

        const user = await User.findOne(
            { "yourCourse.thumbnailUrl": { $regex: new RegExp(`^${decodedThumbnail}$`, "i") } },
            { "yourCourse.$": 1 } 
        );

        if (!user || !user.yourCourse.length) {
            return res.status(404).json({ message: "Course not found" });
        }

        const courseToBuy = user.yourCourse[0]; 

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                $push: {
                    coursesBuyied: {
                        videoUrl: courseToBuy.videoUrl,
                        thumbnailUrl: courseToBuy.thumbnailUrl,
                        videoTitle: courseToBuy.videoTitle,
                        videoSubject: courseToBuy.videoSubject,
                    },
                },
            },
            { new: true }
        ).select("coursesBuyied");

        return res.status(200).json({ message: "Course purchased successfully!", updatedUser });
    } catch (error) {
        console.error("Error buying course:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = {uploadVideo  , getThumbnails , coursesBuyied , yourCourses , getVideoByThumbnail , buyCourse}