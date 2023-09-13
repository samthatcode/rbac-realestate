const Marketer = require('../Models/MarketerModel');
const Referral = require('../Models/ReferralModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const tokenBlacklist = new Set(); // Create the token blacklist set
const Token = require('../Models/TokenModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const { roles } = require('../roles');
const ac = require('../roles').roles;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_VERIFY,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN
    }
});


const generateRandomString = (characters, length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

const generateReferralCode = () => generateRandomString('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
const generateUniqueReferralLink = () => generateRandomString('0123456789abcdef', 24);

// Create a new marketer
module.exports.createMarketer = async (req, res, next) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            stateProvince,
            country,
            profession,
            discoverySource, createdAt, referralLink, referralCode } = req.body;

        let generatedReferralCode = referralCode;
        let generatedRefferalLink = referralLink;

        if (!referralCode) {
            // Generate a unique referral code
            generatedReferralCode = generateReferralCode();
        }

        if (!referralLink) {
            generatedRefferalLink = generateUniqueReferralLink();
        }

        // Check if the referral code or referral link is unique before creating the marketer
        const existingMarketer = await Marketer.findOne({
            $or: [{ referralCode: generatedReferralCode }, { referralLink: generatedRefferalLink }]
        });
        if (existingMarketer) {
            return res.status(400).json({ error: 'Referral code or link already exists' });
        }

        const marketer = await Marketer.create({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            stateProvince,
            country,
            profession,
            discoverySource,
            role: "marketer",
            createdAt,
            referralLink: generatedRefferalLink,
            referralCode: generatedReferralCode,        
        });
        // console.log(marketer);

        // Create the verification token
        const verificationToken = new Token({
            _userId: marketer._id, // Add this line
            _marketerId: marketer._id,
            token: crypto.randomBytes(16).toString('hex')
        });



        // Save the verification token
        await verificationToken.save();
        // console.log(verificationToken);


        // Send the verification email
        const verificationLink = `http://${req.headers.host}/api/verify-marketer-email-token?token=${verificationToken.token}`;
        transporter.sendMail({
            from: process.env.EMAIL_VERIFY,
            to: email,
            subject: "Account Verification",
            text: `Click the link to verify your account: ${verificationLink}`,
            html: `<div>
                <p>Thank you for creating an account with Surefinders! To ensure the security of your account, please verify your email address by clicking the link below:</p>
                <a href=${verificationLink}>Click here to verify your account</a>
                 </div>`
        }, (error, info) => {
            if (error) {
                console.log('Error occurred while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });

        const token = createSecretToken(marketer._id);
        // console.log("Generated Token:", token); // Log the generated token

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });


        res.status(201).json({
            message: 'Marketer created successfully',
            success: true,
            data: { // only send necessary data       
                firstName: marketer.firstName,
                lastName: marketer.lastName,
                email: marketer.email,
                role: marketer.role,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


module.exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            // console.log('User role:', req.user.role);
            // console.log('Action:', action);
            // console.log('Resource:', resource);
            // console.log('Roles:', roles);

            const role = req.marketer.role;
            // console.log('Role:', role);
            if (!ac.hasRole(role)) {
                return res.status(403).json({
                    error: "Invalid role"
                });
            }
            const permission = ac.can(role)[action](resource);
            // console.log('Permission:', permission);

            if (!permission.granted) {
                return res.status(403).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
};



// Login for Marketer Dashboard
module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the marketer by email
        const marketer = await Marketer.findOne({ email });
        if (!marketer) {
            return res.status(400).json({ message: "Incorrect email" });
        }

        // Validate the password
        const auth = await bcrypt.compare(password, marketer.password);
        if (!auth) {
            return res.status(400).json({ message: "Incorrect or password mismatch" });
        }

        // Generate a secret token
        const token = createSecretToken(marketer._id);
        // console.log("Generated Token:", token); // Log the generated token


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });


        res.status(200).json({
            message: "Marketer logged in successfully",
            success: true,
            data: marketer,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports.Logout = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        // Add the token to the blacklist
        tokenBlacklist.add(token);
    }
    res.clearCookie("token").json({ message: "Logged out successfully" });
};

// Get marketer information
module.exports.getMarketer = async (req, res, next) => {
    try {
        const marketerId = req.params.marketerId;
        // console.log(`Marketer ID: ${marketerId}`);
        const marketer = await Marketer.findById(marketerId);

        if (!marketer) {
            return res.status(404).json({ error: 'Marketer not found' });
        }

        res.status(200).json({ data: marketer });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports.getMarketerByReferralLink = async (req, res, next) => {
    try {
        const referralLink = req.params.referralLink;
        const marketer = await Marketer.findOne({ referralLink: referralLink });

        if (!marketer) {
            return res.status(404).json({ error: 'Marketer not found' });
        }

        res.status(200).json({ data: marketer });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Update Marketer
module.exports.getMarketers = async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    try {
        const marketers = await Marketer.find({})
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: marketers
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update marketer details
module.exports.updateMarketer = async (req, res, next) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['firstName', 'lastName', 'password', 'profilePicture', 'profession', 'address'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

        const marketer = await Marketer.findOne({ _id: req.params.marketerId });

        if (!marketer) return res.status(404).send();

        for (const update of updates) {
            if (update === 'profilePicture' && req.file) {
                marketer[update] = req.file.path;
            } else {
                marketer[update] = req.body[update];
            }
        }

        const updateMarketer = await marketer.save();

        res.status(200).json({
            message: 'Marketer updated successfully',
            data: updateMarketer
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Marketer Dashboard
module.exports.getMarketerDashboard = async (req, res, next) => {
    try {
        // Retrieve the marketer's data, including clients, referrals, and commission earnings
        const marketer = await Marketer.findById(req.userId)
            .populate('clients')
            .populate('referrals');

        // Render the marketer dashboard view with the marketer's data
        res.status(200).json({ marketer });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Generate referral link for a marketer
module.exports.generateReferralLink = async (req, res, next) => {
    try {
        const { marketerId } = req.params;

        // Generate a unique referral link for the marketer
        const referralLink = generateUniqueReferralLink();

        // Update the marketer's referral link in the database
        await Marketer.findByIdAndUpdate(marketerId, { referralLink });

        res.status(200).json({
            message: 'Referral link generated successfully',
            referralLink,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Track referral and update commission earnings
module.exports.trackReferral = async (req, res, next) => {
    try {
        const { referringMarketerId, referredClientId } = req.body;

        // Update the referring marketer's commission earnings
        await Marketer.findByIdAndUpdate(referringMarketerId, { $inc: { commissionEarnings: 10 } });

        // Create a new referral record
        const referral = await Referral.create({
            referringMarketer: referringMarketerId,
            referredClient: referredClientId,
        });

        res.status(201).json({
            message: 'Referral tracked successfully',
            data: referral,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports.deleteMarketer = async (req, res, next) => {
    try {
        const marketerId = req.params.marketerId; // Changed to match the "id" parameter
        const marketer = await Marketer.findByIdAndDelete(marketerId);

        if (!marketer) {
            return res.status(404).json({ error: "Marketer not found" });
        }

        res.status(200).json({
            data: null,
            message: "Marketer deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        next(error);
    }
};


module.exports.marketerForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const marketer = await Marketer.findOne({ email });
        if (!marketer) {
            return res.status(400).json({ message: "No account with that email address exists." });
        }

        // Generate and set password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        marketer.resetPasswordToken = resetToken;
        marketer.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await marketer.save();

        const clientHost = 'https://surefinders-frontend.onrender.com';
        const mailOptions = {
            to: marketer.email,
            from: process.env.EMAIL_VERIFY,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${clientHost}/marketer-reset/${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'An e-mail has been sent to ' + marketer.email + ' with further instructions.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};

module.exports.marketerResetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Find the user by reset token
        const marketer = await Marketer.findOne({ resetPasswordToken: resetToken });
        if (!marketer) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }

        // Check if the token has expired
        if (Date.now() > marketer.resetPasswordExpires) {
            return res.status(400).json({ message: "Reset token has expired." });
        }

        // Hash the new password and save it
        marketer.password = newPassword; // Make sure to hash the password before saving it
        marketer.resetPasswordToken = undefined;
        marketer.resetPasswordExpires = undefined;

        await marketer.save();

        res.status(200).json({ message: "Password has been reset." });

    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};


module.exports.approveMarketer = async (req, res, next) => {
    const marketerId = req.params.marketerId;
    // console.log('Marketer ID:', marketerId);

    try {
        const marketer = await Marketer.findById(marketerId);
        if (!marketer) {
            return res.status(404).json({ error: "Marketer not found." });
        }
        marketer.isActive = true;
        await marketer.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error approving marketer:", error);
        res.status(500).json({ message: "Failed to approve marketer. Please try again later." });
        next(error);
    }
};

module.exports.sendPaymentEmail = async (req, res) => {
    const { email, amount, reference } = req.body;

    // Send the email
    transporter.sendMail({
        from: process.env.EMAIL_VERIFY,
        to: email,
        subject: "Payment Confirmation to SureFinders",
        html: `<div>
                <p>Your payment of ${amount} to SureFinders as a Marketer was successful. Your payment reference: ${reference}</p>
                </div>`
    }, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
            res.status(500).json({ error: 'Error occurred while sending email' });
        } else {
            console.log('Email sent successfully to ' + email + ' :', info.response);
            res.status(200).json({ message: 'Email sent successfully to ' + email + ' successfully' });
        }
    });
};

module.exports.marketerPayment = async (req, res) => {
    const { marketerId } = req.body;

    try {
        // Update the marketer
        const marketer = await Marketer.findOneAndUpdate({ _id: marketerId }, {
            paymentMade: true,            
        }, { new: true });

        res.status(200).json({ message: 'Payment updated successfully', marketer: marketer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while updating payment' });
    }
};
