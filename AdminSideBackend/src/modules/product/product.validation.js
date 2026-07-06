const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 200 characters",
    "any.required": "Name is required",
  }),
  description: Joi.string().allow("", null),
  featuredImage: Joi.string().allow("", null),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  categoryId: Joi.string().required(),
  industryId: Joi.string().required(),
  boxStyleId: Joi.string().required(),
  materialId: Joi.string().required(),
  finishId: Joi.string().required(),
});

function validateProductInput(payload) {
  return productSchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateProductInput,
};
