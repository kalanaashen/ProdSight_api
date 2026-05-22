const {
  createProductivitySummary,
  getProductivitySummaryByUserId,
  getProductivitySummary,
} = require("../controllers/productivityController");

const express = require("express");
const auth = require("../../middleware/auth");

const router = express.Router();

router.post("/", auth, createProductivitySummary);
router.get("/", auth, getProductivitySummary);
router.get("/:userId", auth, getProductivitySummaryByUserId);

module.exports = router;
