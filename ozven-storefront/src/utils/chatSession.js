const VISITOR_TOKEN_KEY = 'ozven_chat_visitor_token'
const CONVERSATION_ID_KEY = 'ozven_chat_conversation_id'
const VISITOR_NAME_KEY = 'ozven_chat_visitor_name'
const VISITOR_EMAIL_KEY = 'ozven_chat_visitor_email'

export function getVisitorToken() {
  return localStorage.getItem(VISITOR_TOKEN_KEY) || ''
}

export function getConversationId() {
  return localStorage.getItem(CONVERSATION_ID_KEY) || ''
}

export function getVisitorProfile() {
  return {
    name: localStorage.getItem(VISITOR_NAME_KEY) || '',
    email: localStorage.getItem(VISITOR_EMAIL_KEY) || '',
  }
}

export function saveChatSession({ visitorToken, conversationId, name, email }) {
  if (visitorToken) localStorage.setItem(VISITOR_TOKEN_KEY, visitorToken)
  if (conversationId) localStorage.setItem(CONVERSATION_ID_KEY, conversationId)
  if (name) localStorage.setItem(VISITOR_NAME_KEY, name)
  if (email) localStorage.setItem(VISITOR_EMAIL_KEY, email)
}

export function clearChatSession() {
  localStorage.removeItem(VISITOR_TOKEN_KEY)
  localStorage.removeItem(CONVERSATION_ID_KEY)
  localStorage.removeItem(VISITOR_NAME_KEY)
  localStorage.removeItem(VISITOR_EMAIL_KEY)
}

export function hasChatSession() {
  return Boolean(getVisitorToken() && getConversationId())
}
