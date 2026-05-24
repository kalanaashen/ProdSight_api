const webUsageService = require("../services/webUsageService");

exports.getWebUsageByUserId = async (req, res) => {
  try {
    const webUsage = await webUsageService.getWebUsageByUserId(
      req.params.userId,
    );

    if (!webUsage) return res.status(404).send("Not found");
    res.status(200).send(webUsage);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.createWebUsage = async (req, res) => {
  try {
    const webUsage = await webUsageService.createWebUsage({
      userId: req.user._id,

      domain: req.body.domain,

      url: req.body.url,

      title: req.body.title,

      duration: req.body.duration,
    });
    res.status(201).send(webUsage);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getWebUsage = async (req, res) => {
  try {
    const webUsage = await webUsageService.getWebUsage();
    res.status(200).send(webUsage);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
