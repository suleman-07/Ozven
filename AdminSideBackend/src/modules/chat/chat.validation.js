const Joi = require("joi");

const startConversationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  visitorToken: Joi.string().trim().min(8).max(128).optional(),
});

const sendMessageSchema = Joi.object({
  body: Joi.string().trim().min(1).max(2000).required().messages({
    "string.empty": "Message is required",
    "any.required": "Message is required",
  }),
});

function validateStartConversation(payload) {
  return startConversationSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

function validateSendMessage(payload) {
  return sendMessageSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  validateStartConversation,
  validateSendMessage,
};
