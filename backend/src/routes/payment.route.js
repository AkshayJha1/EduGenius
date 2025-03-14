const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

const { checkOut, handlingWebhook } = require('../controllers/payment.controller');

router.post('/checkOut', express.json() , authenticateUser, checkOut)
router.post("/handlingWebhook", express.raw({ type: "application/json" }), handlingWebhook);

module.exports = router;