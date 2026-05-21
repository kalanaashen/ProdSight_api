const app = require("../app");
const {
  ProductivitySummary,
  validateProductivitySummary,
} = require("../models/productivitySummary");

exports.createProductivitySummary = async (data) => {
  try {
    const { error } = validateProductivitySummary(data);

    const productivitySummary = new ProductivitySummary({
      userId: data.userId,
      productiveMinutes: calculateProductivtyTime(data.userId),
      unproductiveMinutes: data.unproductiveMinutes,
      neutralMinutes: data.neutralMinutes,
      idleMinutes: data.idleMinutes,
      focusScore: data.focusScore,
      productivityScore: data.productivityScore,
      totalWorkMinutes: data.totalWorkMinutes,
      summaryDate: data.summaryDate,
    });

    return await productivitySummary.save();
  } catch (error) {
    console.error(error.message);
  }
};

exports.getProductivitySummaryByUserId = async (Userid) => {
  try {
    const user = await ProductivitySummary.findById({ userId: Userid });
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

async function calculateProductivtyTime(userid) {
  let productiveMinutes = 0;
  let appProductiveMinutes = 0;
  let webProductiveMinutes = 0;
  try {
    const appProductive = await AppUsage.find({
      userId: userid,
      category: "productive",
    });

    const webProductive = await WebUsage.find({
      userId: userid,
      category: "productive",
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
