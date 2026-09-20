const Joi = require("joi");

/**
 * Storefront quote submission — same fields as the custom quote form.
 */
const publicQuoteSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  phone: Joi.string().trim().min(7).max(20).required().messages({
    "any.required": "Phone is required",
    "string.min": "Phone must be at least 7 characters",
  }),
  quantity: Joi.number().integer().min(1).max(1000000).required().messages({
    "any.required": "Quantity is required",
    "number.min": "Quantity must be at least 1",
  }),
  color: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Color is required",
  }),
  productName: Joi.string().trim().min(2).max(200).required().messages({
    "any.required": "Product name is required",
  }),
  length: Joi.number().positive().max(100000).required().messages({
    "any.required": "Length is required",
    "number.positive": "Length must be greater than 0",
  }),
  width: Joi.number().positive().max(100000).required().messages({
    "any.required": "Width is required",
    "number.positive": "Width must be greater than 0",
  }),
  depth: Joi.number().positive().max(100000).required().messages({
    "any.required": "Depth is required",
    "number.positive": "Depth must be greater than 0",
  }),
  unit: Joi.string().valid("inch", "cm", "mm").required().messages({
    "any.only": "Unit must be inch, cm, or mm",
    "any.required": "Unit is required",
  }),
  message: Joi.string().trim().min(5).max(1000).required().messages({
    "any.required": "Message is required",
    "string.min": "Message must be at least 5 characters",
  }),
  productId: Joi.string().uuid().allow("", null),
});

function validatePublicQuoteInput(payload) {
  return publicQuoteSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  validatePublicQuoteInput,
};
