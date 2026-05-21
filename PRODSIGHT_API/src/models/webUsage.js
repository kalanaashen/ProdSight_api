const mongoose = require("mongoose");

const Joi = require("joi");

const webUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["productive", "unproductive", "neutral"],
    default: "neutral",
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const WebUsage = mongoose.model("WebUsage", webUsageSchema);

function validateWebUsage(data) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    url: Joi.string().required(),
    title: Joi.string().required(),
    duration: Joi.number().required(),
    category: Joi.string().valid("productive", "unproductive", "neutral"),
  });

  return schema.validate(data);
}

exports.WebUsage = WebUsage;
exports.validateWebUsage = validateWebUsage;
