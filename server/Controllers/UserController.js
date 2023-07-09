const { validationResult } = require('express-validator');
const User = require('../Models/UserModel');
const { createSecretToken } = require("../util/SecretToken");
const tokenBlacklist = new Set(); // Create the token blacklist set
const bcrypt = require('bcryptjs');

const { roles } = require('../roles');
const ac = require('../roles').roles;


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
    const { email, password, firstName, lastName, role, createdAt } = req.body;

    // Validate the role
    if (!["user", "marketer", "admin", "agent", "agency"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

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

    // Create the new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
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
      message: "User signed up successfully",
      success: true,
      data: { user },
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
      return res.status(400).json({ message: "Incorrect password or email" });
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
      withCredentials: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: { user },
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

    // Check if the user is trying to update the role
    if (updates.role && !roles[req.user.role].canAssign(updates.role)) {
      return res.status(401).json({
        error: "You don't have permission to assign this role"
      });
    }

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

