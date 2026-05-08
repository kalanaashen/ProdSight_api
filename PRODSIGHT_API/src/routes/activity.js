const express = require("express");
const router = express.Router();

const auth = require("/home/kalana/Documents/prodsight_api/ProdSight_api/PRODSIGHT_API/middleware/auth.js");

const {
  getActivities,
  getActivity,
  createActivity,
} = require("../controllers/activityController");

router.get("/", auth, getActivities);

router.get("/:id", auth, getActivity);

router.post("/", auth, createActivity);

module.exports = router;