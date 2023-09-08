// const VerificationCode = require('../Models/VerificationCodeModel');
const User = require('../Models/UserModel');
const Marketer = require('../Models/MarketerModel');
const Token = require('../Models/TokenModel');

module.exports.verifyUserEmail = async (req, res) => {
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

        // Redirect to the frontend route with the token as a parameter
        // res.redirect(`http://localhost:5173/verify-user-email/${token}`);
        res.redirect(`https://surefinders-frontend.onrender.com/verify-user-email/${token}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.verifyMarketerEmail = async (req, res) => {
    try {
        // Get the token from the request parameters
        const token = req.query.token;

        // Find the verification token in the database
        const verificationToken = await Token.findOne({ token });

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Find the marketer associated with the verification token
        const marketer = await Marketer.findById(verificationToken._marketerId);

        if (!marketer) {
            return res.status(400).json({ message: 'We were unable to find a marketer for this token' });
        }

        if (marketer.isVerified) {
            return res.status(400).send('This marketer has already been verified');
        }

        // Verify and save the user
        marketer.isVerified = true;
        await marketer.save();
        await Token.findByIdAndRemove(verificationToken._id);

        // Redirect to the frontend route with the token as a parameter
       
        // res.redirect(`http://localhost:5173/verify-marketer-email/${token}/${marketer._id}`);
        res.redirect(`https://surefinders-frontend.onrender.com/verify-marketer-email/${token}/${marketer._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.marketerDetails = async (req, res) => {
    try {
        const { marketerId } = req.params;
        // console.log('Received marketerId: ', marketerId); 
        const marketer = await Marketer.findById(marketerId);

        if (!marketer) {
            return res.status(400).json({ message: 'We were unable to find a marketer for this id' });
        }

        res.status(200).json({ success: true, marketer });
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
