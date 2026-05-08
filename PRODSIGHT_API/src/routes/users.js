const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {registerUser} = require("../services/userService");


router.post("/", registerUser);


module.exports = router;
