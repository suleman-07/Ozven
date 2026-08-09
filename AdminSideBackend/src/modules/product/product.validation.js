const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 200 characters",
    "any.required": "Name is required",
  }),
  description: Joi.string().allow("", null).max(5000),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  subcategoryId: Joi.string().uuid().required().messages({
    "any.required": "Subcategory is required",
    "string.guid": "Subcategory is invalid",
  }),
  removeImageIds: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uuid()), Joi.string().allow(""))
    .optional(),
  imageUrls: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uri()), Joi.string().allow(""))
    .optional(),
});

function parseRemoveImageIds(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function parseImageUrls(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim());
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string" && item.trim());
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeMultipartBody(body = {}) {
  return {
    name: body.name,
    description: body.description || "",
    status: body.status || "ACTIVE",
    subcategoryId: body.subcategoryId,
    removeImageIds: parseRemoveImageIds(body.removeImageIds),
    imageUrls: parseImageUrls(body.imageUrls),
  };
}

function validateProductInput(payload) {
  return productSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  normalizeMultipartBody,
  validateProductInput,
  parseImageUrls,
};
