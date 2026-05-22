const { ProductivitySummary } = require("../models/productivitySummary");

const { AppUsage } = require("../models/appusage");

exports.getDailyAnalytics = async (userId, date) => {
  return await ProductivitySummary.findOne({
    userId: userId,

    summaryDate: date,
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
  return await AppUsage.aggregate([
    {
      $match: {
        userId: userId,
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
