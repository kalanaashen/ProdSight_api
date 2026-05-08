const {
  Activity,
  validateActivityLog,
} = require("../models/activity");

exports.getAllActivities = async () => {

  return await Activity
    .find()
    .sort({ recordedAt: -1 });

};

exports.getActivityById = async (id) => {
 
  return await Activity.findById(id);

};

exports.createActivity = async (data, userId) => {

  const { error } =
    validateActivityLog(data);

  if (error)
    throw new Error(error.details[0].message);

  const activity = new Activity({

    user: userId,

    keystrokes: data.keystrokes,

    mouseClicks: data.mouseClicks,

    activeWindow: data.activeWindow,

    idleSeconds: data.idleSeconds,

  });

  return await activity.save();

};