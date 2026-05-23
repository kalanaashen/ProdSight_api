const {
  ActivityLog,
  validateActivityLog,
} = require("../models/activity");

exports.getAllActivities = async () => {

  return await ActivityLog
    .find()
    .sort({ recordedAt: -1 });

};

exports.getActivityById = async (id) => {
 
  return await ActivityLog.findById(id);

};

exports.createActivity = async (data) => {

  const { error } =
    validateActivityLog(data);

  if (error)
    throw new Error(error.details[0].message);

  const activity = new ActivityLog({

    userId: data.userId,

    keystrokes: data.keystrokes,

    mouseClicks: data.mouseClicks,

    activeWindow: data.activeWindow,

    idleSeconds: data.idleSeconds,

  });

  return await activity.save();

};