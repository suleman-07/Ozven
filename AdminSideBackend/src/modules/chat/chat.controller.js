const {
  validateStartConversation,
  validateSendMessage,
} = require("./chat.validation");
const {
  startConversation,
  getConversationByToken,
  getMessages,
  sendVisitorMessage,
  sendAdminMessage,
  markMessagesRead,
  getAdminConversations,
  getAdminConversationDetail,
  getTotalUnreadCount,
  getVisitorUnreadCount,
  assertVisitorAccess,
} = require("./chat.service");

function getVisitorToken(req) {
  return req.headers["x-visitor-token"] || req.query.visitorToken || "";
}

async function startConversationHandler(req, res) {
  try {
    const { error, value } = validateStartConversation(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const conversation = await startConversation(value);

    return res.status(201).json({
      success: true,
      message: "Conversation started",
      conversation,
    });
  } catch (error) {
    console.error("startConversationHandler:", error);
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to start conversation"
          : "Failed to start conversation",
    });
  }
}

async function getMyConversationHandler(req, res) {
  try {
    const visitorToken = getVisitorToken(req);

    if (!visitorToken) {
      return res.status(400).json({
        success: false,
        message: "Visitor token is required",
      });
    }

    const conversation = await getConversationByToken(visitorToken);

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
}

async function listVisitorMessagesHandler(req, res) {
  try {
    const visitorToken = getVisitorToken(req);
    const { id } = req.params;

    if (!visitorToken) {
      return res.status(400).json({
        success: false,
        message: "Visitor token is required",
      });
    }

    await assertVisitorAccess(id, visitorToken);

    const messages = await getMessages(id, { since: req.query.since });
    const unreadCount = await getVisitorUnreadCount(id, visitorToken);

    return res.status(200).json({
      success: true,
      messages,
      unreadCount,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
}

async function sendVisitorMessageHandler(req, res) {
  try {
    const visitorToken = getVisitorToken(req);
    const { id } = req.params;

    if (!visitorToken) {
      return res.status(400).json({
        success: false,
        message: "Visitor token is required",
      });
    }

    const { error, value } = validateSendMessage(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const message = await sendVisitorMessage(id, visitorToken, value.body);

    return res.status(201).json({
      success: true,
      message: "Message sent",
      chatMessage: message,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
}

async function markVisitorMessagesReadHandler(req, res) {
  try {
    const visitorToken = getVisitorToken(req);
    const { id } = req.params;

    if (!visitorToken) {
      return res.status(400).json({
        success: false,
        message: "Visitor token is required",
      });
    }

    await assertVisitorAccess(id, visitorToken);
    const markedCount = await markMessagesRead(id, "VISITOR");

    return res.status(200).json({
      success: true,
      markedCount,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
    });
  }
}

async function listAdminConversationsHandler(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search || "";

    const result = await getAdminConversations({ page, limit, search });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
}

async function getAdminConversationHandler(req, res) {
  try {
    const detail = await getAdminConversationDetail(req.params.id);

    return res.status(200).json({
      success: true,
      ...detail,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
}

async function sendAdminMessageHandler(req, res) {
  try {
    const { error, value } = validateSendMessage(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const message = await sendAdminMessage(req.params.id, req.admin.id, value.body);

    return res.status(201).json({
      success: true,
      message: "Message sent",
      chatMessage: message,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
}

async function markAdminMessagesReadHandler(req, res) {
  try {
    const markedCount = await markMessagesRead(req.params.id, "ADMIN");

    return res.status(200).json({
      success: true,
      markedCount,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
    });
  }
}

async function getUnreadCountHandler(req, res) {
  try {
    const unreadCount = await getTotalUnreadCount();

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
}

module.exports = {
  startConversationHandler,
  getMyConversationHandler,
  listVisitorMessagesHandler,
  sendVisitorMessageHandler,
  markVisitorMessagesReadHandler,
  listAdminConversationsHandler,
  getAdminConversationHandler,
  sendAdminMessageHandler,
  markAdminMessagesReadHandler,
  getUnreadCountHandler,
};
