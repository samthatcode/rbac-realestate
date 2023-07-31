const { validationResult } = require('express-validator');
const User = require('../Models/UserModel');
const { createSecretToken } = require("../util/SecretToken");

module.exports.CreateAdmin = async (req, res, next) => {
  // Only proceed if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can create other admins" });
  }

  try {
    const { email, password, firstName, lastName, createdAt } = req.body;

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

    // Create the new user with the role of "admin"
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: "admin",
      createdAt
    });

    const token = createSecretToken(user._id);
    console.log("Generated Token:", token); // Log the generated token

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "Admin user created successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error-handling middleware
  }
};



// Get list of users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Assign role to a user
exports.assignRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};


module.exports.updateUserRole = async (req, res, role) => {
    try {
        const userId = req.params.userId;
        console.log('User:', User);
        console.log('userId:', userId);
        console.log('req.params:', req.params);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: `Role updated to ${role} successfully` });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: "Error updating user role", error });
    }
};
