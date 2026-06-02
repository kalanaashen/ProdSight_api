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
  mouseClicks: {
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
  category: {
    type: String,
    required: true,
    enum: ["productive", "unproductive", "neutral"],
    default: "neutral",
  },

  duration: {
    type: Number,
    required: true,
    default: 0,
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
    mouseClicks: Joi.number().required(),
    idleSeconds: Joi.number().required(),
    activeWindow: Joi.string().required(),
    duration: Joi.number().required(),
    category: Joi.string().valid("productive", "unproductive", "neutral"),
    recordedAt: Joi.date(),
  });
  return schema.validate(activityLog);
};

module.exports = {
  ActivityLog,
  validateActivityLog,
};
