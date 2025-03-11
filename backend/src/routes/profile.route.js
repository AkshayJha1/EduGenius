const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');

const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

const { updateProfilePic , updateProfile , profiledata } = require('../controllers/profile.controller');

//general Settings 
router.route('/profiledata').get(authenticateUser , profiledata)
router.route('/updateProfilePic').post(authenticateUser , upload.single("profilePic") , updateProfilePic);
router.route('/updateProfile').post(authenticateUser , updateProfile)

module.exports = router;