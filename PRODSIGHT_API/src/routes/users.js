const express = require("express");
const router = express.Router();

const {
  registerUser,
  getUsers,
  getUserByName,
  getUserById,
} = require("../controllers/userController");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

router.post("/", registerUser);
router.get("/", auth, admin, getUsers);
router.get("/by-name/:name", auth, admin, getUserByName);
router.get("/:id", auth, admin, getUserById);

module.exports = router;
