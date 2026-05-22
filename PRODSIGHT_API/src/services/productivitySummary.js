const app = require("../app");
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

    const productivitySummary = new ProductivitySummary({
      userId: data.userId,
      productiveMinutes: await calculateProductivtyTime(
        data.userId,
        data.summaryDate,
      ),
      unproductiveMinutes: await calculateUnProductivityTime(
        data.userId,
        data.summaryDate,
      ),
      neutralMinutes: await calculateNeturalTime(data.userId, data.summaryDate),
      idleMinutes: await findIdleTime(data.userId, data.summaryDate),
      focusScore: await calculateFocusScore(data.userId, data.summaryDate),
      productivityScore: await calculateProductivityScore(
        data.userId,
        data.summaryDate,
      ),
      totalWorkMinutes: await calculateTotalWorkMinute(
        data.userId,
        data.summaryDate,
      ),
      summaryDate: data.summaryDate,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }
    return await productivitySummary.save();
  } catch (error) {
    console.error(error.message);
  }
};

exports.getProductivitySummaryByUserId = async (Userid) => {
  try {
    const user = await ProductivitySummary.find({ userId: Userid });
    if (!user) {
      console.log("not details founnd");
      return -1;
    }
    return user;
  } catch (error) {
    console.error(error.message);
  }
};

exports.getProductivitySummary = async () => {
  try {
    return await ProductivitySummary.find();
  } catch (error) {
    console.error(error.message);
  }
};

async function calculateProductivtyTime(userid, date) {
  let productiveMinutes = 0;
  let appProductiveMinutes = 0;
  let webProductiveMinutes = 0;
  try {
    const appProductive = await AppUsage.find({
      userId: userid,
      category: "productive",
      recordedAt: date,
    });

    const webProductive = await WebUsage.find({
      userId: userid,
      category: "productive",
      recordedAt: date,
    });

    if (appProductive.length == 0) {
      return 0;
    }

    appProductiveMinutes = appProductive.reduce((total, item) => {
      return total + item.duration;
    }, 0);

    if (webProductive.length == 0) {
      return 0;
    }

    webProductiveMinutes = webProductive.reduce((total, item) => {
      return total + item.duration;
    }, 0);

    productiveMinutes = appProductiveMinutes + webProductiveMinutes;

    return productiveMinutes;
  } catch (error) {
    console.error(error.message);
  }
}

async function calculateUnProductivityTime(userid, date) {
  let unproductiveMinutes = 0;
  let appUnproductiveMinutes = 0;
  let webUnproductiveMinutes = 0;

  try {
    const appUnproductive = await AppUsage.find({
      userId: userid,
      category: "unproductive",
      recordedAt: date,
    });

    const webUnproductive = await WebUsage.find({
      userId: userid,
      category: "unproductive",
      recordedAt: date,
    });

    if (appUnproductive.length == 0) {
      return 0;
    }

    appUnproductiveMinutes = appUnproductive.reduce((total, item) => {
      return total + item.duration;
    }, 0);

    if (webUnproductive.length == 0) {
      return 0;
    }

    webUnproductiveMinutes = webUnproductive.reduce((total, item) => {
      return total + item.duration;
    }, 0);

    unproductiveMinutes = appUnproductiveMinutes + webUnproductiveMinutes;

    return unproductiveMinutes;
  } catch (error) {
    console.error(error.message);
  }
}

async function calculateNeturalTime(userid, date) {
  let neutralMinutes = 0;
  let appNeutralMinutes = 0;
  let webNeutralMinutes = 0;

  try {
    const appNeutral = await AppUsage.find({
      userId: userid,
      category: "neutral",
      recordedAt: date,
    });
    if (appNeutral.length == 0) return 0;

    const webNeutral = await WebUsage.find({
      userId: userid,
      category: "neutral",
      recordedAt: date,
    });
    if (webNeutral.length == 0) return 0;

    appNeutralMinutes = appNeutral.reduce((total, item) => {
      return total + item.duration;
    }, 0);
    webNeutralMinutes = webNeutral.reduce((total, item) => {
      return total + item.duration;
    }, 0);

    neutralMinutes = appNeutralMinutes + webNeutralMinutes;
    return neutralMinutes;
  } catch (error) {
    console.error(error.message);
  }
}

async function calculateProductivityScore(userid, date) {
  const idleTime = await findIdleTime(userid, date);

  const productivityTime = await calculateProductivtyTime(userid, date);

  const unProductivityTime = await calculateUnProductivityTime(userid, date);

  const totalWorkTime = productivityTime + unProductivityTime + idleTime;

  if (totalWorkTime === 0) return 0;

  const score =
    ((productivityTime - unProductivityTime * 0.5 - idleTime * 0.3) /
      totalWorkTime) *
    100;

  return score;
}

async function calculateProductivityScore(userid, date) {
  let idleTime = 0;
  let productivityTime = 0;
  let unProductivityTime = 0;

  idleTime = (await findIdleTime(userid, date)) * 0.3;
  productivityTime = await calculateProductivtyTime(userid, date);
  unProductivityTime = (await calculateUnProductivityTime(userid, date)) * 0.5;

  return productivityTime - idleTime - unProductivityTime;
}
async function findIdleTime(userid, date) {
  const result = await ActivityLog.find({ userId: userid, recordedAt: date });
  if (result.length === 0) return 0;
  const totalIdleSeconds = result.reduce(
    (total, item) => total + item.idleSeconds,
    0,
  );

  return totalIdleSeconds;
}

async function calculateTotalWorkMinute(userid, date) {
  let neturalTime = 0;
  let productiveTime = 0;
  let unProductiveTime = 0;

  neturalTime = await calculateNeturalTime(userid, date);
  productiveTime = await calculateProductivtyTime(userid, date);
  unProductiveTime = await calculateUnProductivityTime(userid, date);

  return productiveTime + unProductiveTime + neturalTime;
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
