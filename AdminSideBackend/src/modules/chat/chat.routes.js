const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listAdminConversationsHandler,
  getAdminConversationHandler,
  sendAdminMessageHandler,
  markAdminMessagesReadHandler,
  getUnreadCountHandler,
} = require("./chat.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/unread-count", getUnreadCountHandler);
router.get("/conversations", listAdminConversationsHandler);
router.get("/conversations/:id", getAdminConversationHandler);
router.post("/conversations/:id/messages", sendAdminMessageHandler);
router.patch("/conversations/:id/read", markAdminMessagesReadHandler);

module.exports = router;
