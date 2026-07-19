const Joi = require("joi");

const subcategoryNameSchema = Joi.string().trim().min(2).max(100).messages({
  "string.empty": "Subcategory name is required",
  "string.min": "Subcategory name must be at least 2 characters",
  "string.max": "Subcategory name must be at most 100 characters",
});

const subcategorySchema = Joi.object({
  id: Joi.string().uuid().optional(),
  name: subcategoryNameSchema.required(),
});

const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters",
    "any.required": "Name is required",
  }),
  subcategories: Joi.array().items(subcategorySchema).max(100).default([]),
});

function validateCategoryInput(payload) {
  return categorySchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateSubcategoryInput(payload) {
  return subcategorySchema
    .fork(["name"], (schema) => schema.required())
    .validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
}

module.exports = {
  validateCategoryInput,
  validateSubcategoryInput,
};
