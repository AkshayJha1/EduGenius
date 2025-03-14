const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

const { checkOut, handlingWebhook } = require('../controllers/payment.controller');

router.route('/checkOut').post(authenticateUser, checkOut);
router.post("/handlingWebhook", express.raw({ type: "application/json" }), handlingWebhook);

module.exports = router;