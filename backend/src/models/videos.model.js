const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    videos : [
        {
        videoTitle : {
            type : String,
            required : true,
        },
        videoSubject : {
            type : String,
            required : true,
        },
        videoUrl : {
            type : String,
            required : true,
        },
        thumbnailUrl : {
            type : String,
            required : true,
        }
    }
    ]
});

const CourseVideos = mongoose.model('CourseVideo' , videoSchema);
module.exports = CourseVideos;