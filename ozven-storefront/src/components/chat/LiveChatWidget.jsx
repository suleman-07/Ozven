import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import {
  fetchChatMessages,
  getChatStreamUrl,
  markChatMessagesRead,
  sendChatMessage,
  startChatConversation,
} from '../../api/chat'
import {
  getConversationId,
  getVisitorProfile,
  getVisitorToken,
  hasChatSession,
  saveChatSession,
} from '../../utils/chatSession'

const POLL_INTERVAL_MS = 2500

function formatTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function mergeMessages(existing, incoming) {
  const map = new Map(existing.map((message) => [message.id, message]))
  incoming.forEach((message) => map.set(message.id, message))
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(hasChatSession() ? 'chat' : 'intro')
  const [name, setName] = useState(getVisitorProfile().name)
  const [email, setEmail] = useState(getVisitorProfile().email)
  const [conversationId, setConversationId] = useState(getConversationId())
  const [visitorToken, setVisitorToken] = useState(getVisitorToken())
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)
  const streamRef = useRef(null)
  const lastMessageAtRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const loadMessages = useCallback(
    async ({ markRead = false, since } = {}) => {
      if (!conversationId || !visitorToken) return

      const result = await fetchChatMessages(conversationId, visitorToken, since)
      setMessages((current) => mergeMessages(current, result.messages))
      setUnreadCount(result.unreadCount)

      if (result.messages.length) {
        lastMessageAtRef.current = result.messages[result.messages.length - 1].createdAt
      }

      if (markRead && isOpen) {
        await markChatMessagesRead(conversationId, visitorToken)
        setUnreadCount(0)
        setMessages((current) =>
          current.map((message) =>
            message.senderType === 'ADMIN'
              ? { ...message, status: 'READ', readAt: message.readAt || new Date().toISOString() }
              : message,
          ),
        )
      }
    },
    [conversationId, isOpen, visitorToken],
  )

  const handleStartChat = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const conversation = await startChatConversation({
        name: name.trim(),
        email: email.trim(),
        visitorToken: visitorToken || undefined,
      })

      saveChatSession({
        visitorToken: conversation.visitorToken,
        conversationId: conversation.id,
        name: conversation.visitorName,
        email: conversation.visitorEmail,
      })

      setVisitorToken(conversation.visitorToken)
      setConversationId(conversation.id)
      setStep('chat')
      await loadMessages({ markRead: true })
    } catch (err) {
      setError(err.message || 'Unable to start chat right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body || !conversationId || !visitorToken) return

    setError('')
    setIsSubmitting(true)

    const optimistic = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderType: 'VISITOR',
      body,
      status: 'SENT',
      createdAt: new Date().toISOString(),
    }

    setMessages((current) => [...current, optimistic])
    setDraft('')

    try {
      const saved = await sendChatMessage(conversationId, visitorToken, body)
      setMessages((current) =>
        current.map((message) => (message.id === optimistic.id ? saved : message)),
      )
      lastMessageAtRef.current = saved.createdAt
    } catch (err) {
      setMessages((current) => current.filter((message) => message.id !== optimistic.id))
      setDraft(body)
      setError(err.message || 'Unable to send message.')
    } finally {
      setIsSubmitting(false)
      scrollToBottom()
    }
  }

  useEffect(() => {
    if (!isOpen || step !== 'chat' || !conversationId || !visitorToken) return undefined

    setIsLoading(true)
    loadMessages({ markRead: true })
      .catch((err) => setError(err.message || 'Unable to load messages.'))
      .finally(() => setIsLoading(false))
  }, [conversationId, isOpen, loadMessages, step, visitorToken])

  useEffect(() => {
    if (!conversationId || !visitorToken) return undefined

    const startPolling = () => {
      if (pollRef.current) return
      pollRef.current = window.setInterval(() => {
        loadMessages({
          markRead: isOpen,
          since: lastMessageAtRef.current || undefined,
        }).catch(() => {})
      }, POLL_INTERVAL_MS)
    }

    startPolling()

    try {
      const streamUrl = getChatStreamUrl(visitorToken, conversationId)
      const stream = new EventSource(streamUrl)
      streamRef.current = stream

      stream.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.type === 'message_created' || payload.type === 'messages_read') {
            loadMessages({ markRead: isOpen }).catch(() => {})
          }
        } catch {
          // ignore malformed events
        }
      }

      stream.onerror = () => {
        stream.close()
        streamRef.current = null
        startPolling()
      }
    } catch {
      startPolling()
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.close()
        streamRef.current = null
      }
      if (pollRef.current) {
        window.clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [conversationId, isOpen, loadMessages, visitorToken])

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [isOpen, messages, scrollToBottom])

  useEffect(() => {
    if (!isOpen && conversationId && visitorToken) {
      fetchChatMessages(conversationId, visitorToken)
        .then((result) => setUnreadCount(result.unreadCount))
        .catch(() => {})
    }
  }, [conversationId, isOpen, visitorToken])

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden border border-gold-hairline/30 bg-base shadow-[0_24px_60px_rgba(13,13,13,0.22)] sm:w-[24rem]">
          <div className="flex items-center justify-between bg-dark px-4 py-3 text-base">
            <div>
              <p className="text-sm font-semibold">Live Support</p>
              <p className="text-xs text-base/60">Ozven Packaging team</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              className="inline-flex h-8 w-8 items-center justify-center text-base/70 transition hover:text-gold"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {step === 'intro' ? (
            <form className="space-y-4 p-4" onSubmit={handleStartChat}>
              <p className="text-sm leading-relaxed text-charcoal/75">
                Tell us how to reach you and our packaging team will reply in real time.
              </p>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
                  Name
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full border border-gold-hairline/30 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold"
                  placeholder="Your name"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-gold-hairline/30 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold"
                  placeholder="you@company.com"
                />
              </label>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-gold px-4 py-3 text-sm font-semibold text-dark transition hover:bg-gold-light disabled:opacity-60"
              >
                Start Chat
              </button>
            </form>
          ) : (
            <>
              <div className="max-h-[22rem] min-h-[18rem] space-y-3 overflow-y-auto bg-base px-4 py-4">
                {isLoading ? (
                  <p className="text-sm text-charcoal/60">Loading conversation…</p>
                ) : null}
                {!isLoading && messages.length === 0 ? (
                  <p className="text-sm text-charcoal/60">
                    Ask about packaging products, materials, or custom solutions.
                  </p>
                ) : null}
                {messages.map((message) => {
                  const isVisitor = message.senderType === 'VISITOR'
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2.5 text-sm leading-relaxed ${
                          isVisitor
                            ? 'bg-dark text-base'
                            : 'border border-gold-hairline/25 bg-white text-charcoal'
                        }`}
                      >
                        {!isVisitor ? (
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
                            Support
                          </p>
                        ) : null}
                        <p>{message.body}</p>
                        <div
                          className={`mt-1 flex items-center gap-2 text-[11px] ${
                            isVisitor ? 'text-base/45' : 'text-charcoal/45'
                          }`}
                        >
                          <span>{formatTime(message.createdAt)}</span>
                          {isVisitor ? (
                            <span>{message.status === 'READ' ? 'Read' : 'Sent'}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="border-t border-gold-hairline/20 bg-white p-3" onSubmit={handleSendMessage}>
                {error ? <p className="mb-2 text-xs text-red-700">{error}</p> : null}
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type your message…"
                    className="min-h-[2.75rem] flex-1 resize-none border border-gold-hairline/30 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !draft.trim()}
                    aria-label="Send message"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-gold text-dark transition hover:bg-gold-light disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open live support chat"
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-dark shadow-[0_12px_30px_rgba(201,162,75,0.35)] transition hover:-translate-y-0.5 hover:bg-gold-light"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        {!isOpen && unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-dark px-1.5 text-[11px] font-bold text-base">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>
    </div>
  )
}
