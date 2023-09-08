const express = require('express');
const router = express.Router();

const { verifyUserEmail, verifyMarketerEmail, marketerDetails, verifyCode } = require('../Controllers/VerifyEmailController');
const { forgotPassword, resetPassword } = require('../Controllers/UserController');
const { marketerForgotPassword, marketerResetPassword } = require('../Controllers/MarketerController');

const {
    allowIfAdmin,
    verifyTokenAndUser,
    allowIfLoggedin
} = require("../Middlewares/AuthMiddleware");

router.get('/verify-user-email-token', verifyUserEmail);
router.get('/verify-marketer-email-token', verifyMarketerEmail);
router.get('/marketer-details/:marketerId', marketerDetails);

router.post('/forgot-password', forgotPassword);
router.post('/reset/:resetToken', resetPassword);

router.post('/marketer-forgot-password', marketerForgotPassword);
router.post('/marketer-reset/:resetToken', marketerResetPassword);
// router.post('/verify-code', verifyTokenAndUser, verifyCode);

module.exports = router;
