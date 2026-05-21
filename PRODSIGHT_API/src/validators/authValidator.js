const Joi = require("joi");

exports.validateLogin = (data) => {

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(data);

};