const mongoose = require("mongoose");
const Joi = require("joi");
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

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

const validateActivityLog = function (activityLog) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    keystrokes: Joi.number().required(),
    mouseClickes: Joi.number().required(),
    idleSeconds: Joi.number().required(),
    activeWindow: Joi.string().required(),
    recordedAt: Joi.date(),
  });
  return Joi.validate(activityLog, schema);
};

module.exports = {
  ActivityLog,
  validateActivityLog
};
