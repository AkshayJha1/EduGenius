const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

const { checkOut, handlingWebhook } = require('../controllers/payment.controller');

router.route('/checkOut').post(authenticateUser, checkOut);
router.route("/handlingWebhook").post(handlingWebhook);

module.exports = router;