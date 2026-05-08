const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  keystrokes: {
    type: Number,
    required: true,
  },
  mouseClickes: {
    type: Number,
    required: true,
  },
  idleSeconds: {
    type: Number,
    required: true,
  },
  activeWindow: {
    type: String,
    required: true,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});



const ActivityLog = mongoose.models("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
