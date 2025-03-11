const express = require('express');
const router = express.Router();

const { signUp, login , logout, checkAuth } = require('../controllers/auth.controller');
const { authenticateUser } = require('../middlewares/authenticateUser.middleware');

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/logout').post(authenticateUser,logout);
router.route('/check').get(authenticateUser , checkAuth)

module.exports = router;