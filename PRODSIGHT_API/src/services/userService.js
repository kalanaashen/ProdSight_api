const { User, validateUser } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.registerUser = async (data) => {
  try {
    const { error } = await validateUser(data);

    if (error) {
      throw new Error(error.details[0].message);
    }
    const exisitingUser = await User.findOne({ email: data.email });
    if (exisitingUser) {
      throw new Error("this email is already registered");
    }
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateAuthToken();
    await user.save();
    return {
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getUsers = async () => {
  return User.find().select("-password").sort({ name: 1 });
};

exports.getUserById = async (id) => {
  return User.findById(id).select("-password");
};

exports.getUserByName = async (name) => {
  return User.findOne({
    name: { $regex: `^${escapeRegExp(name)}$`, $options: "i" },
  }).select("-password");
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
