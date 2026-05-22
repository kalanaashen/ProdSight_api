const {
  getWebUsageByUserId,
  createWebUsage,
  getWebUsage,
} = require("../controllers/webUsageController");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth, getWebUsage);

router.get("/:userId", auth, getWebUsageByUserId);

router.post("/", auth, createWebUsage);

module.exports = router;


