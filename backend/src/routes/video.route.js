const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');

const { uploadVideo, getThumbnails, coursesBuyied , yourCourses , getVideoByThumbnail , buyCourse} = require('../controllers/VideoHandle.controller');
const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

router.route('/upload-video').post(authenticateUser , upload.fields([
    { name: "video", maxCount: 1 },       // Upload 1 video file
    { name: "thumbnail", maxCount: 1 }   // Upload 1 thumbnail file
]) , uploadVideo);
router.route('/get-coursesBuyiedVideos').get(coursesBuyied);
router.route('/get-yourCourseVideos').get(authenticateUser, yourCourses);
router.route('/get-thumbnails').get(getThumbnails); 
router.route('/getVideo/:thumbnail').get(authenticateUser, getVideoByThumbnail);

router.route('/buyVideo/:thumbnail').post(authenticateUser, buyCourse);

module.exports = router;