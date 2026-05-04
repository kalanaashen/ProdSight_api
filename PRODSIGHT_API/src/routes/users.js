const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");
const express = require("express");
const router = express.router();
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
  
  if (user == User.findOne({ email: req.body.email })) {
    return res.status(400).send("User with given email already exists");
  }

  await user.save();
  res.send(_.pick(user, ["name", "email"]));
});
