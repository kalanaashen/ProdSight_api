const bcrypt = require("bcrypt");

const { User } = require("../models/users");

const {
  validateLogin,
} = require("../validators/authValidator");

exports.loginUser = async (data) => {
  const { error } = validateLogin(data);

  if (error) {
    throw new Error(error.details[0].message);
  }

  // find user
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  // compare password
  const isMatch = await bcrypt.compare(data.password, existingUser.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = existingUser.generateAuthToken();

  return token;
};
