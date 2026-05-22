const analyticsService = require("../services/analyticsService");

exports.getDailyAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getDailyAnalytics(
      req.params.userId,

      req.query.date,
    );

    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getWeeklyAnalytics(req.params.userId);

    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getMonthlyAnalytics(req.params.userId);

    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getTopApps = async (req, res) => {
  try {
    const data = await analyticsService.getTopApps(req.params.userId);

    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
