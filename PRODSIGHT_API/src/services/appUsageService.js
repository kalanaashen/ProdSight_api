const { AppUsage, validateAppUsage } = require("../models/appusage");

 exports.createAppUsage = async (data) => {
  try {
    const { error } = validateAppUsage(data);
    if (error) {
      throw new Error(error.message);
    }

    const appUsage = new AppUsage({
      userId: data.userId,
      appName: data.appName,
      category: createCategory(data.appName),
      windowTitle: data.windowTitle,
      duration: data.duration,
      recordedAt: data.recordedAt,
    });
    return await appUsage.save();
  } catch (error) {
    console.error(error.message);
  }
};
exports.getAllAppUsage = async () => {
  try {
    return await AppUsage.find().sort({ recordedAt: -1 });
  } catch (error) {
    console.error(error.message);
  }
};
exports.getAppUsageByUserId = async (Id) => {
  try {
    return await AppUsage.findById({ userId: Id });
  } catch (error) {
    console.error(error.message);
  }
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
