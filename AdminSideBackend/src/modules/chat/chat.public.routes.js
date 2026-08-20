const express = require("express");
const {
  startConversationHandler,
  getMyConversationHandler,
  listVisitorMessagesHandler,
  sendVisitorMessageHandler,
  markVisitorMessagesReadHandler,
} = require("./chat.controller");

const router = express.Router();

router.post("/conversations/start", startConversationHandler);
router.get("/conversations/me", getMyConversationHandler);
router.get("/conversations/:id/messages", listVisitorMessagesHandler);
router.post("/conversations/:id/messages", sendVisitorMessageHandler);
router.patch("/conversations/:id/read", markVisitorMessagesReadHandler);

module.exports = router;
