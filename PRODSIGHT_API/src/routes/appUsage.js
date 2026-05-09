const express = require("express");
const router = express.Router();
const {
  getAppUsage,
  getAppUsageByUserId,
  createAppUsage,
} = require("../controllers/appUsageController");
const auth = require("/home/kalana/Documents/prodsight_api/ProdSight_api/PRODSIGHT_API/middleware/auth.js");

router.get("/", auth, getAppUsage);

router.get("/:id", auth, getAppUsageByUserId);

router.post("/", auth, createAppUsage);

module.exports = router;
