const activityService = require("../services/activityService");

exports.getActivities = async (req, res) => {
  try {
    const activities = await activityService.getAllActivities();

    res.send(activities);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getActivity = async (req, res) => {
  try {
    const activity = await activityService.getActivityById(req.params.id);

    if (!activity) return res.status(404).send("Not found");

    res.send(activity);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createActivity = async (req, res) => {
  try {
    const activity = await activityService.createActivity(
      req.body,
      req.user._id,
    );

    res.status(201).send(activity);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
