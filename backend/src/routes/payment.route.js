const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

const { checkOut, handlingWebhook, addBalance , addBalanceWebhook  } = require('../controllers/payment.controller');

router.post('/checkOut', express.json() , authenticateUser, checkOut)
router.post("/handlingWebhook", express.raw({ type: "application/json" }), handlingWebhook);
router.post('/addBalance', express.json() , authenticateUser, addBalance)
router.post("/addBalanceWebhook", express.raw({ type: "application/json" }), addBalanceWebhook);

module.exports = router;