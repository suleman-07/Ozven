const Joi = require("joi");

const industrySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters",
    "any.required": "Name is required",
  }),
});

function validateIndustryInput(payload) {
  return industrySchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateIndustryInput,
};
