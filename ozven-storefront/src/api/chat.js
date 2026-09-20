import axios from 'axios'
import { getChatApiBaseUrl } from './config'

const chatApi = axios.create({
  baseURL: getChatApiBaseUrl(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function withVisitorToken(visitorToken) {
  return {
    headers: {
      'X-Visitor-Token': visitorToken,
    },
  }
}

  chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    const err = new Error(message)
    err.status = status
    return Promise.reject(err)
  },
)

export function getChatStreamUrl(visitorToken, conversationId) {
  const params = new URLSearchParams({
    visitorToken,
    conversationId,
  })
  return `${getChatApiBaseUrl()}/stream?${params.toString()}`
}

export async function startChatConversation({ name, email, visitorToken }) {
  const { data } = await chatApi.post('/conversations/start', {
    name,
    email,
    visitorToken: visitorToken || undefined,
  })
  return data?.conversation
}

export async function fetchMyConversation(visitorToken) {
  const { data } = await chatApi.get('/conversations/me', withVisitorToken(visitorToken))
  return data?.conversation
}

export async function fetchChatMessages(conversationId, visitorToken, since) {
  const { data } = await chatApi.get(`/conversations/${conversationId}/messages`, {
    ...withVisitorToken(visitorToken),
    params: since ? { since } : undefined,
  })
  return {
    messages: data?.messages || [],
    unreadCount: data?.unreadCount || 0,
  }
}

export async function sendChatMessage(conversationId, visitorToken, body) {
  const { data } = await chatApi.post(
    `/conversations/${conversationId}/messages`,
    { body },
    withVisitorToken(visitorToken),
  )
  return data?.chatMessage
}

export async function markChatMessagesRead(conversationId, visitorToken) {
  const { data } = await chatApi.patch(
    `/conversations/${conversationId}/read`,
    {},
    withVisitorToken(visitorToken),
  )
  return data?.markedCount || 0
}
