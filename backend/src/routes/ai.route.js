const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.route('/chat').post(aiController.aIMessage);

module.exports = router;