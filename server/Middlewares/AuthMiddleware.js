const User = require("../Models/UserModel");
const Marketer = require("../Models/MarketerModel");

const jwt = require("jsonwebtoken");
const secretToken = require("../util/tokenUtils").secretToken;

// Example implementation of token blacklist
const tokenBlacklist = new Set();

//////////////////////////////////////  User  /////////////////////////////////////////////
module.exports.verifyTokenAndUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token is no longer valid" });
    }

    try {
        const decoded = jwt.verify(token, secretToken);
        // console.log(decoded); // Log the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        req.userId = decoded.id;
        req.user = user;
        return next();
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(401).json({ message: "Invalid token" });
    }
};


module.exports.allowIfAdmin = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'You need to be logged in to access this route' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can access this route' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.allowIfLoggedin = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'You need to be logged in to access this route' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Define the controller function for the root path
module.exports.rootControllerFunction = (req, res) => {
    // Check if the token exists in the request
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token and handle the result
    try {
        const decoded = jwt.verify(token, secretToken);
        const userId = decoded.id;
        const username = decoded.username;
        // Token is valid, perform any necessary actions here
        return res.json({ status: true, message: "Welcome to the website!", user: { userId, username } });
    } catch (err) {
        // Token verification failed
        return res.status(401).json({ message: "Invalid token" });
    }
};


///////////////////////////////////// Marketer //////////////////////////////////////////
module.exports.verifyTokenAndMarketer = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token is no longer valid" });
    }

    try {
        const decoded = jwt.verify(token, secretToken);
        // console.log(decoded); // Log the decoded token
        const marketer = await Marketer.findById(decoded.id);
        if (!marketer) {
            res.status(404).json({ message: 'Marketer not found' });
            return;
        }

        // Check if marketer is verified
        if (!marketer.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        req.marketerId = decoded.id;
        req.marketer = marketer;
        return next();
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(401).json({ message: "Invalid token" });
    }
};


module.exports.allowIfMarketer = async (req, res, next) => {
    try {
        const marketer = req.marketer;

        if (!marketer) {
            return res.status(401).json({ error: 'You need to be loggedIn as a marketer' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.marketerRootControllerFunction = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, secretToken);
        const marketerId = decoded.id;
        const marketerName = decoded.marketerName;
        return res.json({ status: true, message: "Welcome to the website!", marketer: { marketerId, marketerName } });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
