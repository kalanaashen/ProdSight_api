const express = require("express");
const router = express.Router();
const {
  getAppUsage,
  getAppUsageByUserId,
  createAppUsage,
} = require("../controllers/appUsageController");
const auth = require("../../middleware/auth");

router.get("/", auth, getAppUsage);

router.get("/:userId", auth, getAppUsageByUserId);

router.post("/", auth, createAppUsage);

module.exports = router;
