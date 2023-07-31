const express = require('express');
const router = express.Router();

const { verifyEmail, verifyCode } = require('../Controllers/VerifyEmailController');

const {
    allowIfAdmin,
    verifyTokenAndUser,
    allowIfLoggedin
} = require("../Middlewares/AuthMiddleware");

router.get('/verify-email', verifyEmail);
router.post('/verify-code', verifyTokenAndUser, verifyCode);

module.exports = router;