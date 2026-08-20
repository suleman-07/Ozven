import api from './api'

const TOKEN_KEY = 'oxo_admin_token'

function resolveApiRoot() {
  const raw = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').trim()
  return raw.replace(/\/api\/?$/, '').replace(/\/+$/, '') || 'http://localhost:5000'
}

export function getAdminChatStreamUrl() {
  const token = localStorage.getItem(TOKEN_KEY)
  const params = new URLSearchParams({ token: token || '' })
  return `${resolveApiRoot()}/api/chat/stream?${params.toString()}`
}

export async function listChatConversations({ page = 1, limit = 20, search = '' } = {}) {
  const response = await api.get('/chat/conversations', {
    params: { page, limit, search: search.trim() },
  })
  const payload = response?.data || {}
  return {
    conversations: Array.isArray(payload.conversations) ? payload.conversations : [],
    pagination: payload.pagination || { page, limit, total: 0, totalPages: 1 },
  }
}

export async function getChatConversation(id) {
  const response = await api.get(`/chat/conversations/${id}`)
  const payload = response?.data || {}
  return {
    conversation: payload.conversation,
    messages: Array.isArray(payload.messages) ? payload.messages : [],
  }
}

export async function sendAdminChatMessage(conversationId, body) {
  const response = await api.post(`/chat/conversations/${conversationId}/messages`, { body })
  return response?.data?.chatMessage
}

export async function markAdminChatRead(conversationId) {
  const response = await api.patch(`/chat/conversations/${conversationId}/read`)
  return response?.data?.markedCount || 0
}

export async function getChatUnreadCount() {
  const response = await api.get('/chat/unread-count')
  return response?.data?.unreadCount || 0
}
