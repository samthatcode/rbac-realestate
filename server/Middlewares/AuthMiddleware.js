const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const secretToken = require("../util/tokenUtils").secretToken;

// Example implementation of token blacklist
const tokenBlacklist = new Set();

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
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User not found');
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


