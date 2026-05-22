const mongoose=require("mongoose");

const Joi=require("joi");


const productivitySummarySchema=new mongoose.Schema({

  userId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productiveMinutes: {
      type: Number,
      default: 0,
    },

    unproductiveMinutes: {
      type: Number,
      default: 0,
    },

    neutralMinutes: {
      type: Number,
      default: 0,
    },

    idleMinutes: {
      type: Number,
      default: 0,
    },

    focusScore: {
      type: Number,
      default: 0,
    },

    productivityScore: {
      type: Number,
      default: 0,
    },

    totalWorkMinutes: {
      type: Number,
      default: 0,
    },

    summaryDate: {
      type: Date,
      default: Date.now,
    },

})

const ProductivitySummary=mongoose.model("ProductivitySummary",productivitySummarySchema);

function validateProductivitySummary(data) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    productiveMinutes: Joi.number().required(),
    unproductiveMinutes: Joi.number().required(),
    neutralMinutes: Joi.number().required(),
    idleMinutes: Joi.number().required(),
    focusScore: Joi.number().required(),
    productivityScore: Joi.number().required(),
    totalWorkMinutes: Joi.number().required(),
    summaryDate: Joi.date().required(),
  });

  return schema.validate(data);
}

exports.ProductivitySummary = ProductivitySummary;
exports.validateProductivitySummary = validateProductivitySummary;          