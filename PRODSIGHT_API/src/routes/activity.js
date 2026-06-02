const express = require("express");
const router = express.Router();

const {
  getActivities,
  getActivity,
  createActivity,
  findTodayActivity,
} = require("../controllers/activityController");

router.get("/", getActivities);

router.get("/today/:username/:date", findTodayActivity);

router.get("/:id", getActivity);

router.post("/", createActivity);

module.exports = router;
