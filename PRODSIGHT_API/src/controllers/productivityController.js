const  productivitySummary  = require("../services/productivitySummary");

exports.createProductivitySummary = async (req, res) => {
  try {
    const ProSummary = await productivitySummary.createProductivitySummary(
      req.body,
    );
    res.status(201).send(ProSummary);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getProductivitySummaryByUserId = async (req, res) => {
  try {
    const ProSummary = await productivitySummary.getProductivitySummaryByUserId(
      req.params.id,
    );
    res.status(200).send(ProSummary);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getProductivitySummary = async (req, res) => {
  try {
    const ProSummary = await productivitySummary.getProductivitySummary();
    res.status(200).send(ProSummary);
  } catch(error) {
    res.status(400).send(error.message);
  }
};
