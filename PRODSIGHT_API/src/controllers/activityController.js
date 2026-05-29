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
    const activity = await activityService.createActivity({
      userId: req.user._id,

      keystrokes: req.body.keystrokes,

      mouseClicks: req.body.mouseClicks,

      idleSeconds: req.body.idleSeconds,

      activeWindow: req.body.activeWindow,

      duration: req.body.duration,

      category: req.body.category,
    });

    res.status(201).send(activity);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.findTodayActivity = async (req, res) => {
  try {
    const activity = await activityService.findTodayActivity(
      req.params.username,
      req.params.date
    );

    if (activity === "not valid user!") {
      return res.status(404).send(activity);
    }

    const summary = activity[0] || {
      totalKeyStrokes: 0,
      totalMouseClicks: 0,
      totalDuration: 0,
    };

    res.status(200).json({
      totalKeyStrokes: summary.totalKeyStrokes,
      totalMouseClicks: summary.totalMouseClicks,
      totalDuration: summary.totalDuration,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
