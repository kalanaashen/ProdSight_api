const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    return res.status(400).send("invalid username or password");
  }

  const isMatch = await bcrypt.compare(
    req.body.password,
    existingUser.password,
  );
  if (!isMatch) return res.status(400).send("invalid username or password");
  const token = existingUser.generateAuthToken();

  res.send(token);
});

async function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return Joi.validate(req, schema);
}

module.exports = router;
