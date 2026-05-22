const {
  ProductivitySummary,
  validateProductivitySummary,
} = require("../models/productivitySummary");
const { WebUsage } = require("../models/webUsage");
const { AppUsage } = require("../models/appusage");
const { ActivityLog } = require("../models/activity");

exports.createProductivitySummary = async (data) => {
  try {
    const { error } = validateProductivitySummary(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const usageData = await getDailyUsageData(data.userId, data.summaryDate);
    const productivitySummary = new ProductivitySummary({
      userId: data.userId,
      productiveMinutes: calculateProductivtyTime(usageData),
      unproductiveMinutes: calculateUnProductivityTime(usageData),
      neutralMinutes: calculateNeturalTime(usageData),
      idleMinutes: findIdleTime(usageData),
      focusScore: calculateFocusScore(usageData),
      productivityScore: calculateProductivityScore(usageData),
      totalWorkMinutes: calculateTotalWorkMinute(usageData),
      summaryDate: data.summaryDate,
    });

    return await productivitySummary.save();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

exports.getProductivitySummaryByUserId = async (Userid) => {
  try {
    const user = await ProductivitySummary.find({ userId: Userid });
    if (user.length == 0) {
      console.log("not details founnd");
      return -1;
    }
    return user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

exports.getProductivitySummary = async () => {
  try {
    return await ProductivitySummary.find();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

function calculateProductivtyTime(usageData) {
  const productiveApps = usageData.appUsage.filter(
    (item) => item.category === "productive",
  );

  const productiveWeb = usageData.webUsage.filter(
    (item) => item.category === "productive",
  );

  const appMinutes = productiveApps.reduce(
    (total, item) => total + item.duration,

    0,
  );

  const webMinutes = productiveWeb.reduce(
    (total, item) => total + item.duration,

    0,
  );

  return appMinutes + webMinutes;
}

function calculateUnProductivityTime(usageData) {
  const unproductiveApps = usageData.appUsage.filter(
    (item) => item.category === "unproductive",
  );

  const unproductiveWeb = usageData.webUsage.filter(
    (item) => item.category === "unproductive",
  );

  const appMinutes = unproductiveApps.reduce(
    (total, item) => total + item.duration,

    0,
  );

  const webMinutes = unproductiveWeb.reduce(
    (total, item) => total + item.duration,

    0,
  );

  return appMinutes + webMinutes;
}

function calculateFocusScore(usageData) {
  const productiveTime = calculateProductivtyTime(usageData);

  const unproductiveTime = calculateUnProductivityTime(usageData);

  const idleTime = findIdleTime(usageData);

  const totalWorkTime = productiveTime + unproductiveTime + idleTime;

  if (totalWorkTime === 0) return 0;

  return Math.round((productiveTime / totalWorkTime) * 100);
}

function calculateNeturalTime(usageData) {
  const neutralApps = usageData.appUsage.filter(
    (item) => item.category === "neutral",
  );

  const neutralWeb = usageData.webUsage.filter(
    (item) => item.category === "neutral",
  );

  const appMinutes = neutralApps.reduce(
    (total, item) => total + item.duration,

    0,
  );

  const webMinutes = neutralWeb.reduce(
    (total, item) => total + item.duration,

    0,
  );

  return appMinutes + webMinutes;
}

function calculateProductivityScore(usageData) {
  const idleTime = findIdleTime(usageData);

  const productivityTime = calculateProductivtyTime(usageData);

  const unProductivityTime = calculateUnProductivityTime(usageData);

  const totalWorkTime = productivityTime + unProductivityTime + idleTime;

  if (totalWorkTime === 0) return 0;

  const score =
    ((productivityTime - unProductivityTime * 0.5 - idleTime * 0.3) /
      totalWorkTime) *
    100;

  return Math.min(100, Math.max(0, Math.round(score)));
}

function findIdleTime(usageData) {
  const totalIdleSeconds = usageData.activityLogs.reduce(
    (total, item) => total + item.idleSeconds,

    0,
  );

  return Math.round(totalIdleSeconds / 60);
}

function calculateTotalWorkMinute(usageData) {
  return (
    calculateProductivtyTime(usageData) +
    calculateUnProductivityTime(usageData) +
    calculateNeturalTime(usageData) +
    findIdleTime(usageData)
  );
}

async function getDailyUsageData(userid, date) {
  const { startOfDay, endOfDay } = getDateRange(date);

  const appUsage = await AppUsage.find({
    userId: userid,

    recordedAt: {
      $gte: startOfDay,

      $lt: endOfDay,
    },
  });

  const webUsage = await WebUsage.find({
    userId: userid,

    recordedAt: {
      $gte: startOfDay,

      $lt: endOfDay,
    },
  });

  const activityLogs = await ActivityLog.find({
    userId: userid,

    recordedAt: {
      $gte: startOfDay,

      $lt: endOfDay,
    },
  });

  return {
    appUsage,

    webUsage,

    activityLogs,
  };
}

function getDateRange(date) {
  const startOfDay = new Date(date);

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);

  endOfDay.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
  };
}
