const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getDailyAnalytics,

  getWeeklyAnalytics,

  getMonthlyAnalytics,

  getTopApps,
} = require("../controllers/analyticsController");

router.get("/daily/:userId", auth, getDailyAnalytics);

router.get("/weekly/:userId", auth, getWeeklyAnalytics);

router.get("/monthly/:userId", auth, getMonthlyAnalytics);

router.get("/top-apps/:userId", auth, getTopApps);

module.exports = router;
