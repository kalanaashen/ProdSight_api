const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

 const existingUser = await User.findOne({ email: req.body.email });

if (existingUser) {
  return res.status(400).send("invalid username or password");
}
  const token = jwt.sign({_id:existingUser._id},config.get("jwtPrivateKey"));
  await user.save();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));




});

  module.exports = router;