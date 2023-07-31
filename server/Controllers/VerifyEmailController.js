// const VerificationCode = require('../Models/VerificationCodeModel');
const User = require('../Models/UserModel');
const Token = require('../Models/TokenModel');

module.exports.verifyEmail = async (req, res) => {
    try {
        // Get the token from the request parameters
        const token = req.query.token;

        // Find the verification token in the database
        const verificationToken = await Token.findOne({ token });

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Find the user associated with the verification token
        const user = await User.findById(verificationToken._userId);

        if (!user) {
            return res.status(400).json({ message: 'We were unable to find a user for this token' });
        }

        if (user.isVerified) {
            return res.status(400).send('This user has already been verified');
        }

        // Verify and save the user
        user.isVerified = true;
        await user.save();
        await Token.findByIdAndRemove(verificationToken._id);

        res.json({ message: 'The account has been verified. Please log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.verifyCode = async (req, res) => {
    try {
        // Get the code from the request body
        const { code } = req.body;

        // Find the verification code in the database
        const verificationCode = await VerificationCode.findOne({ code });

        if (!verificationCode) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Find the user associated with the verification code
        const user = await User.findById(verificationCode._userId);

        if (!user) {
            return res.status(400).json({ message: 'We were unable to find a user for this code' });
        }

        // Verify and save the user
        user.isVerified = true;
        await user.save();

        res.json({ message: 'The account has been verified. Please log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
