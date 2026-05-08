const mongoose = require("mongoose");
const Joi = require("joi");

const appUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appName: {
    type: String,
    required: true,
    trim: true,
  },
  windowTitle: {
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
});

function validateAppUsage(data) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    appName: Joi.string().required(),
    windowTitle: Joi.string().required(),
    duration: Joi.number().required(),
    category: Joi.string()
      .valid("productive", "unproductive", "neutral")
      .required(),
  });

  return schema.validate(data);
}
