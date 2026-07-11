const { ProductivitySummary } = require("../models/productivitySummary");

const { AppUsage } = require("../models/appusage");
const mongoose = require("mongoose");

exports.getDailyAnalytics = async (userId, date) => {
  const requestedDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(requestedDate);
  const endOfDay = new Date(requestedDate);
  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);

  return await ProductivitySummary.findOne({
    userId,
    summaryDate: { $gte: startOfDay, $lte: endOfDay },
  });
};

exports.getWeeklyAnalytics = async (userId) => {
  return await ProductivitySummary.find({
    userId: userId,
  })
    .sort({ summaryDate: -1 })
    .limit(7);
};

exports.getMonthlyAnalytics = async (userId) => {
  return await ProductivitySummary.find({
    userId: userId,
  })
    .sort({ summaryDate: -1 })
    .limit(30);
};

exports.getTopApps = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return await AppUsage.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },

    {
      $group: {
        _id: "$appName",

        totalDuration: {
          $sum: "$duration",
        },
      },
    },

    {
      $sort: {
        totalDuration: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);
};
