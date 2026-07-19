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
  quantity: Joi.number().integer().min(1).max(1000000).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  color: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Color is required",
    "any.required": "Color is required",
  }),
  productName: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Product name is required",
    "any.required": "Product name is required",
  }),
  length: Joi.number().positive().max(100000).required().messages({
    "number.positive": "Length must be greater than 0",
    "any.required": "Length is required",
  }),
  width: Joi.number().positive().max(100000).required().messages({
    "number.positive": "Width must be greater than 0",
    "any.required": "Width is required",
  }),
  depth: Joi.number().positive().max(100000).required().messages({
    "number.positive": "Depth must be greater than 0",
    "any.required": "Depth is required",
  }),
  unit: Joi.string().valid("inch", "cm", "mm").required().messages({
    "any.only": "Unit must be inch, cm, or mm",
    "any.required": "Unit is required",
  }),
  message: Joi.string().trim().min(5).max(1000).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 5 characters",
    "string.max": "Message must be at most 1000 characters",
    "any.required": "Message is required",
  }),
  productId: Joi.string().uuid().allow("", null),
});

function validateQuoteInput(payload) {
  return quoteSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  validateQuoteInput,
};
