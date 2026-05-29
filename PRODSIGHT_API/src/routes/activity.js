const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const {
  getActivities,
  getActivity,
  createActivity,
  findTodayActivity,
} = require("../controllers/activityController");

router.get("/", auth, getActivities);

router.get("/today/:username/:date", auth, findTodayActivity);

router.get("/:id", auth, getActivity);

router.post("/", auth, createActivity);

module.exports = router;
