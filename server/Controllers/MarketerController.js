const Marketer = require('../Models/MarketerModel');
const Referral = require('../Models/ReferralModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const tokenBlacklist = new Set(); // Create the token blacklist set
const { roles } = require('../roles');
const ac = require('../roles').roles;


const generateRandomString = (characters, length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

const generateReferralCode = () => generateRandomString('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
const generateUniqueReferralLink = () => generateRandomString('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 24);


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
        console.log("Generated Token:", token); // Log the generated token

        // Set the token as a cookie
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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
            referralCode: generatedReferralCode
        });
        console.log(marketer);
        res.status(201).json({
            message: 'Marketer created successfully',
            data: marketer
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
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
        const updates = req.body; // Changed to use updates object directly
        const marketerId = req.params.id; // Changed to match the "id" parameter

        // Update the marketer
        const updatedMarketer = await Marketer.findByIdAndUpdate(
            marketerId,
            updates, // Using the updates object directly
            { new: true }
        );

        if (!updatedMarketer) {
            return res.status(404).json({ error: 'Marketer not found' });
        }

        res.status(200).json({
            message: 'Marketer updated successfully',
            data: updatedMarketer
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