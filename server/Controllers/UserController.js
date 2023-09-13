const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../Models/UserModel');
const Client = require('../Models/ClientModel');
const Referral = require('../Models/ReferralModel');
const { createSecretToken } = require("../util/SecretToken");
const tokenBlacklist = new Set(); // Create the token blacklist set
const bcrypt = require('bcryptjs');
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


module.exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      // console.log('User role:', req.user.role);
      // console.log('Action:', action);
      // console.log('Resource:', resource);
      // console.log('Roles:', roles);

      const role = req.user.role;
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



module.exports.Signup = async (req, res, next) => {
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
      discoverySource,
      referralId: referral_id,
      createdAt } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the new user with the default role of "user"
    const user = await User.create({
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
      referral_id,
      role: "user",
      createdAt
    });

    // Convert the referral_id to a valid ObjectId
    const objectIdReferralId = new mongoose.Types.ObjectId(referral_id);
    const client = await Client.create({
      name: firstName + ' ' + lastName,
      email,
      associatedMarketer: objectIdReferralId,
    });

    // If a referral_id was provided, create a new Referral
    if (referral_id) {
      await Referral.create({
        referringMarketer: objectIdReferralId,
        referredClient: client._id,
      });
    }


    // Create the verification token
    const verificationToken = new Token({
      _userId: user._id,
      _marketerId: user._id,
      token: crypto.randomBytes(16).toString('hex')
    });

    // Save the verification token
    await verificationToken.save();
    // console.log(verificationToken);


    // Send the verification email
    const verificationLink = `http://${req.headers.host}/api/verify-user-email-token?token=${verificationToken.token}`;
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

    const token = createSecretToken(user._id);
    // console.log("Generated Token:", token); // Log the generated token

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      data: { // only send necessary data       
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error-handling middleware
  }
};


module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email" });
    }

    // Validate the password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect or password mismatch" });
    }

    // Generate a secret token
    const token = createSecretToken(user._id);
    console.log("Generated Token:", token); // Log the generated token

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: user,
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

module.exports.getUsers = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find({})
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: users
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    const userId = req.params.userId;

    // Update the user
    await User.findByIdAndUpdate(userId, updates);
    const user = await User.findById(userId);

    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    next(error); // Pass the error to the error-handling middleware
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      data: null,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account with that email address exists." });
    }

    // Generate and set password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const clientHost = 'https://surefinders-frontend.onrender.com';
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_VERIFY,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${clientHost}/reset/${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Find the user by reset token
    const user = await User.findOne({ resetPasswordToken: resetToken });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Check if the token has expired
    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Reset token has expired." });
    }

    // Hash the new password and save it
    user.password = newPassword; // Make sure to hash the password before saving it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset." });

  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};
