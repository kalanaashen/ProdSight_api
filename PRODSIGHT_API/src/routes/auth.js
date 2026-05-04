const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const express = require("express");
const router = express.router();
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  if (user == User.findOne({ email: req.body.email })) {
    return res.status(400).send("invalid username or password");
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.status(400).send("invalid password");

  res.send(true);
});

async function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(10).max(50).required(),
    email: Joi.string().email().required(),
  });
  return Joi.validate(req, schema);
}
