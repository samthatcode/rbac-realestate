const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


// user schema and user password will be created
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  firstName: {
    type: String,
    required: [true, "Your first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Your last name is required"],
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  stateProvince: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  discoverySource: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: "", // default value can be a URL to a default profile picture
  },
  firstTimeBuyer: {
    type: Boolean,
    default: true,
  },
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  }],
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  role: {
    type: String,
    default: 'user',
    enum: ["admin", "marketer", "user", "client"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  },
  referral_id: {
    type: String
  }
});

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;