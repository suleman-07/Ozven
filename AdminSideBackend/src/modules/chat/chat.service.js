const crypto = require("crypto");
const prisma = require("../../prisma/client");
const { emitChatEvent } = require("./chat.events");

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function serializeMessage(message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderType: message.senderType,
    senderAdminId: message.senderAdminId,
    body: message.body,
    status: message.status,
    readAt: message.readAt,
    createdAt: message.createdAt,
    admin: message.admin
      ? {
          id: message.admin.id,
          name: message.admin.name,
        }
      : null,
  };
}

function serializeConversation(conversation, extras = {}) {
  return {
    id: conversation.id,
    visitorToken: conversation.visitorToken,
    visitorName: conversation.visitorName,
    visitorEmail: conversation.visitorEmail,
    status: conversation.status,
    lastMessageAt: conversation.lastMessageAt,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    ...extras,
  };
}

async function getUnreadCountForConversation(conversationId, senderType) {
  return prisma.chatMessage.count({
    where: {
      conversationId,
      senderType,
      readAt: null,
    },
  });
}

async function startConversation({ name, email, visitorToken }) {
  const normalizedToken = visitorToken?.trim();

  if (normalizedToken) {
    const existing = await prisma.chatConversation.findUnique({
      where: { visitorToken: normalizedToken },
    });

    if (existing) {
      const updated = await prisma.chatConversation.update({
        where: { id: existing.id },
        data: {
          visitorName: name,
          visitorEmail: email,
        },
      });

      return serializeConversation(updated);
    }
  }

  const token = crypto.randomUUID();
  const conversation = await prisma.chatConversation.create({
    data: {
      visitorToken: token,
      visitorName: name,
      visitorEmail: email,
    },
  });

  emitChatEvent({ type: "conversation_updated", conversationId: conversation.id });

  return serializeConversation(conversation);
}

async function getConversationByToken(visitorToken) {
  const conversation = await prisma.chatConversation.findUnique({
    where: { visitorToken },
  });

  if (!conversation) {
    throw createHttpError("Conversation not found", 404);
  }

  return serializeConversation(conversation);
}

async function getConversationById(id) {
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
  });

  if (!conversation) {
    throw createHttpError("Conversation not found", 404);
  }

  return conversation;
}

async function assertVisitorAccess(conversationId, visitorToken) {
  const conversation = await prisma.chatConversation.findFirst({
    where: {
      id: conversationId,
      visitorToken,
    },
  });

  if (!conversation) {
    throw createHttpError("Conversation not found", 404);
  }

  return conversation;
}

async function getMessages(conversationId, { since } = {}) {
  const sinceDate = since ? new Date(since) : null;

  const messages = await prisma.chatMessage.findMany({
    where: {
      conversationId,
      ...(sinceDate && !Number.isNaN(sinceDate.getTime())
        ? { createdAt: { gt: sinceDate } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
    include: {
      admin: {
        select: { id: true, name: true },
      },
    },
  });

  return messages.map(serializeMessage);
}

async function getAllMessages(conversationId) {
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      admin: {
        select: { id: true, name: true },
      },
    },
  });

  return messages.map(serializeMessage);
}

async function sendVisitorMessage(conversationId, visitorToken, body) {
  await assertVisitorAccess(conversationId, visitorToken);

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "VISITOR",
      body,
      status: "SENT",
    },
    include: {
      admin: {
        select: { id: true, name: true },
      },
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  const serialized = serializeMessage(message);

  emitChatEvent({
    type: "message_created",
    conversationId,
    message: serialized,
    audience: "admin",
  });

  return serialized;
}

async function sendAdminMessage(conversationId, adminId, body) {
  await getConversationById(conversationId);

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "ADMIN",
      senderAdminId: adminId,
      body,
      status: "SENT",
    },
    include: {
      admin: {
        select: { id: true, name: true },
      },
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  const serialized = serializeMessage(message);

  emitChatEvent({
    type: "message_created",
    conversationId,
    message: serialized,
    audience: "visitor",
  });

  return serialized;
}

async function markMessagesRead(conversationId, readerType) {
  const senderType = readerType === "ADMIN" ? "VISITOR" : "ADMIN";
  const now = new Date();

  const result = await prisma.chatMessage.updateMany({
    where: {
      conversationId,
      senderType,
      readAt: null,
    },
    data: {
      readAt: now,
      status: "READ",
    },
  });

  if (result.count > 0) {
    emitChatEvent({
      type: "messages_read",
      conversationId,
      readerType,
      readAt: now,
    });
  }

  return result.count;
}

async function getAdminConversations({ page = 1, limit = 20, search = "" }) {
  const currentPage = Math.max(1, Number(page) || 1);
  const take = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (currentPage - 1) * take;
  const normalizedSearch = String(search).trim();

  const where = normalizedSearch
    ? {
        OR: [
          { visitorName: { contains: normalizedSearch, mode: "insensitive" } },
          { visitorEmail: { contains: normalizedSearch, mode: "insensitive" } },
        ],
      }
    : {};

  const [conversations, total] = await Promise.all([
    prisma.chatConversation.findMany({
      where,
      skip,
      take,
      orderBy: { lastMessageAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.chatConversation.count({ where }),
  ]);

  const enriched = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await getUnreadCountForConversation(conversation.id, "VISITOR");
      const latestMessage = conversation.messages[0] || null;

      return serializeConversation(conversation, {
        latestMessage: latestMessage
          ? {
              body: latestMessage.body,
              senderType: latestMessage.senderType,
              createdAt: latestMessage.createdAt,
              status: latestMessage.status,
            }
          : null,
        unreadCount,
      });
    })
  );

  return {
    conversations: enriched,
    pagination: {
      page: currentPage,
      limit: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
    },
  };
}

async function getAdminConversationDetail(conversationId) {
  const conversation = await getConversationById(conversationId);
  const messages = await getAllMessages(conversationId);
  const unreadCount = await getUnreadCountForConversation(conversationId, "VISITOR");

  return {
    conversation: serializeConversation(conversation, { unreadCount }),
    messages,
  };
}

async function getTotalUnreadCount() {
  return prisma.chatMessage.count({
    where: {
      senderType: "VISITOR",
      readAt: null,
    },
  });
}

async function getVisitorUnreadCount(conversationId, visitorToken) {
  await assertVisitorAccess(conversationId, visitorToken);

  return prisma.chatMessage.count({
    where: {
      conversationId,
      senderType: "ADMIN",
      readAt: null,
    },
  });
}

module.exports = {
  startConversation,
  getConversationByToken,
  getMessages,
  getAllMessages,
  sendVisitorMessage,
  sendAdminMessage,
  markMessagesRead,
  getAdminConversations,
  getAdminConversationDetail,
  getTotalUnreadCount,
  getVisitorUnreadCount,
  assertVisitorAccess,
};
