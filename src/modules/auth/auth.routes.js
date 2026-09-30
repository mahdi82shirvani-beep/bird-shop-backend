const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// روت درخواست کد: POST /api/auth/send-otp
router.post('/send-otp', authController.sendOtp);

// روت تایید کد: POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;