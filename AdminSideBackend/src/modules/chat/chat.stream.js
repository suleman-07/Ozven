const jwt = require("jsonwebtoken");
const { subscribe } = require("./chat.events");
const { assertVisitorAccess } = require("./chat.service");

function setupAdminChatStream(app) {
  app.get("/api/chat/stream", (req, res) => {
    const token = req.query.token;

    if (!token) {
      res.status(401).json({ success: false, message: "Access token is required" });
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const heartbeat = setInterval(() => {
      res.write(": heartbeat\n\n");
    }, 25000);

    const unsubscribe = subscribe((event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    req.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });
}

function setupVisitorChatStream(app) {
  app.get("/api/public/chat/stream", async (req, res) => {
    const visitorToken = req.query.visitorToken;
    const conversationId = req.query.conversationId;

    if (!visitorToken || !conversationId) {
      res.status(400).json({ success: false, message: "Visitor token and conversation ID are required" });
      return;
    }

    try {
      await assertVisitorAccess(conversationId, visitorToken);
    } catch (error) {
      res.status(error.statusCode || 403).json({
        success: false,
        message: error.message || "Unauthorized",
      });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const heartbeat = setInterval(() => {
      res.write(": heartbeat\n\n");
    }, 25000);

    const unsubscribe = subscribe((event) => {
      if (
        event.conversationId === conversationId &&
        (event.audience === "visitor" || event.type === "messages_read")
      ) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    });

    req.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });
}

function setupChatStreams(app) {
  setupAdminChatStream(app);
  setupVisitorChatStream(app);
}

module.exports = {
  setupChatStreams,
};
