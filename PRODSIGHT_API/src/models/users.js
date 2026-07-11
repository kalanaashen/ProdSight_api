const { min } = require("lodash");
const mongoose = require("mongoose");
const Joi = require("joi");

const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  role: {
    type: String,
    enum: [
      "Software Engineer",
      "Designer",
      "Project Manager",
      "QA Engineer",
      "Human Resources",
      "Employee",
      "Other",
    ],
    default: "Employee",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey"),
  );
  return token;
};

const User = mongoose.model("User", userSchema);

async function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string()
      .valid(
        "Software Engineer",
        "Designer",
        "Project Manager",
        "QA Engineer",
        "Human Resources",
        "Employee",
        "Other",
      )
      .required(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
