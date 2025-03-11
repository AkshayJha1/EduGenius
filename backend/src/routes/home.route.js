const express = require('express');
const router = express.Router();

const { getAllVideos , getVideoById } = require('../controllers/home.controller');

router.route('/getAllVideos').get(getAllVideos)
router.route(`/:id`).get(getVideoById)

module.exports = router;