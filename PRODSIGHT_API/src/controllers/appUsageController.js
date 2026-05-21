const  appUsageService  = require("../services/appUsageService");

exports.createAppUsage = async (req, res) => {
  try {
    const appUsage = await appUsageService.createAppUsage({
      userId: req.user._id,
      appName: req.body.appName,
      duration: req.body.duration,
      windowTitle: req.body.windowTitle,
      recordedAt: req.body.recordedAt,
    });
    res.status(201).send(appUsage);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


exports.getAppUsage=async(req,res)=>{
  try {
    const appUsage = await appUsageService.getAllAppUsage();
    res.send(appUsage);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAppUsageByUserId=async(req,res)=>{
  try {
    const appUsage = await appUsageService.getAppUsageByUserId(req.params.userId);
    if (!appUsage) return res.status(404).send("Not found");
    res.send(appUsage);
  } catch (err) {
    res.status(500).send(err.message);
  }
};