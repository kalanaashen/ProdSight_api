const { WebUsage, validateWebUsage } = require("../models/webUsage");


exports.getWebUsageByUserId = async (userId) => {
  try {
    return await WebUsage.find({ userId }).sort({ recordedAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.addWebUsage = async (data) => {
  try {
    const webUsageData = new WebUsage(data);
    return await webUsageData.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createWebUsage = async (data) => {
  try {
    const { error } = validateWebUsage(data);
  } catch (error) {
    throw new Error(error.message);
  }
  const webusage = new WebUsage({
    userId: data.userId,
    url: data.url,
    title: data.title,
    duration: data.duration,
    category: createCategory(data.title),
    recordedAt: data.recordedAt,
  });
  return await webusage.save();
};

function createCategory(title) {
  const productiveWebsites = [
    "stackoverflow.com",
    "github.com",
    "medium.com",
    "wikipedia.org",
    "coursera.org",
    "edx.org",
    "khanacademy.org",
    "linkedin.com",
    "researchgate.net",
    "arxiv.org",
  ];
  const unproductiveWebsites = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "tiktok.com",
    "reddit.com",
    "netflix.com",
    "youtube.com",
    "spotify.com",
    "amazon.com",
    "pinterest.com",
  ];

  if (productiveWebsites.some((site) => title.toLowerCase().includes(site))) {
    return "productive";
  } else if (
    unproductiveWebsites.some((site) => title.toLowerCase().includes(site))
  ) {
    return "unproductive";
  } else {
    return "neutral";
  }
}



