const jwt = require("jsonwebtoken");
const secretToken = require("./tokenUtils").secretToken;

// Use the secret token in your code
module.exports.createSecretToken = (id) => {
    const expiresIn = "1h"; // Expiration time set to 1 hour
    return jwt.sign({ id }, secretToken, { expiresIn });
};
