const { ActivityLog, validateActivityLog } = require("../models/activity");
const { User } = require("../models/users");
exports.getAllActivities = async () => {
  return await ActivityLog.find().sort({ recordedAt: -1 });
};

exports.getActivityById = async (id) => {
  return await ActivityLog.findById(id);
};

exports.createActivity = async (data) => {
  const { error } = validateActivityLog(data);

  if (error) throw new Error(error.details[0].message);

  const activity = new ActivityLog({
    userId: data.userId,

    keystrokes: data.keystrokes,

    mouseClicks: data.mouseClicks,

    activeWindow: data.activeWindow,

    idleSeconds: data.idleSeconds,

    duration: data.duration,

    category: createCategory(data.activeWindow),
  });

  return await activity.save();
};

function createCategory(appName) {
  const productiveApps = [
    "Visual Studio Code",
    "Slack",
    "Trello",
    "Zoom",
    "Microsoft Teams",
    "Google Meet",
    "Notion",
    "Asana",
    "GitHub",
    "Jira",
  ];
  const unproductiveApps = [
    "YouTube",
    "Facebook",
    "Twitter",
    "Instagram",
    "TikTok",
    "Reddit",
    "Netflix",
    "Spotify",
    "Amazon",
    "Ebay",
  ];

  if (productiveApps.includes(appName)) {
    return "productive";
  } else if (unproductiveApps.includes(appName)) {
    return "unproductive";
  } else {
    return "neutral";
  }
}

exports.findTodayActivity = async (username, date) => {
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const user = await User.findOne({
    name: username,
  });

  if (!user) return "not valid user!";

  return await ActivityLog.aggregate([
    {
      $match: {
        userId: user._id,
        recordedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$userId",
        totalKeyStrokes: { $sum: "$keystrokes" },
        totalMouseClicks: { $sum: "$mouseClicks" },
        totalDuration: { $sum: "$duration" },
      },
    },
  ]);
};
