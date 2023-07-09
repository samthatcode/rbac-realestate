const Marketer = require('../Models/MarketerModel');
const Referral = require('../Models/ReferralModel');
const { createSecretToken } = require("../util/SecretToken");


// Generate a unique referral link for each marketer
const generateUniqueReferralLink = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referralLink = '';

    // Generate a random string of 10 characters for the referral link
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralLink += characters[randomIndex];
    }

    return referralLink;
};

// Generate a random alphanumeric string
const generateReferralCode = () => {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
};


// Login for Marketer Dashboard
module.exports.login = async (req, res, next) => {
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
            return res.status(400).json({ message: "Incorrect password or email" });
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
            data: { marketer },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Create a new marketer
module.exports.createMarketer = async (req, res, next) => {
    try {
        const { name, email, referralLink, referralCode } = req.body;

        let generatedReferralCode = referralCode;

        if (!referralCode) {
            // Generate a unique referral code
            generatedReferralCode = generateReferralCode();
        }

        // Check if the referral code or referral link is unique before creating the marketer
        const existingMarketer = await Marketer.findOne({
            $or: [{ referralCode: generatedReferralCode }, { referralLink }]
        });
        if (existingMarketer) {
            return res.status(400).json({ error: 'Referral code or link already exists' });
        }

        const marketer = await Marketer.create({
            name,
            email,
            referralLink,
            referralCode: generatedReferralCode
        });

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
        const marketerId = req.params.id;
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

// Update marketer details
module.exports.updateMarketer = async (req, res, next) => {
    try {
        const marketerId = req.params.id;
        const { name, email } = req.body;

        const updatedMarketer = await Marketer.findByIdAndUpdate(
            marketerId,
            { name, email },
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