const Joi = require("joi");

const quoteSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  phone: Joi.string().trim().min(7).max(20).required().messages({
    "string.empty": "Phone is required",
    "string.min": "Phone must be at least 7 characters",
    "string.max": "Phone must be at most 20 characters",
    "any.required": "Phone is required",
  }),
  message: Joi.string().trim().min(5).max(1000).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 5 characters",
    "string.max": "Message must be at most 1000 characters",
    "any.required": "Message is required",
  }),
  productId: Joi.string().allow("", null),
});

function validateQuoteInput(payload) {
  return quoteSchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateQuoteInput,
};
