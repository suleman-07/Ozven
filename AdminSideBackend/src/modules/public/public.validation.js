const Joi = require("joi");

/**
 * Storefront quote submission — same fields as admin quotes,
 * with sensible defaults so a simpler contact flow can still create a QuoteRequest.
 */
const publicQuoteSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(7).max(20).required(),
  message: Joi.string().trim().min(5).max(1000).required(),
  productName: Joi.string().trim().min(2).max(200).default("General Quote"),
  quantity: Joi.number().integer().min(1).max(1000000).default(1),
  color: Joi.string().trim().min(2).max(100).default("Not specified"),
  length: Joi.number().positive().max(100000).default(1),
  width: Joi.number().positive().max(100000).default(1),
  depth: Joi.number().positive().max(100000).default(1),
  unit: Joi.string().valid("inch", "cm", "mm").default("inch"),
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
