import { useCallback, useEffect, useRef, useState } from 'react'
import { Mail, MessageSquare, RefreshCw, Search, Send, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/ui/Button'
import {
  getAdminChatStreamUrl,
  getChatConversation,
  getChatUnreadCount,
  listChatConversations,
  markAdminChatRead,
  sendAdminChatMessage,
} from '../../services/chatApi'
import { getErrorMessage } from '../../services/adminApi'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/formatters'

const POLL_INTERVAL_MS = 3000

function formatMessageTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
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

function LiveSupportPage() {
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [draft, setDraft] = useState('')
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingThread, setIsLoadingThread] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [totalUnread, setTotalUnread] = useState(0)

  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)
  const streamRef = useRef(null)

  const selectedConversation = conversations.find((item) => item.id === selectedId) || null

  const loadConversations = useCallback(async () => {
    try {
      const result = await listChatConversations({ page: 1, limit: 50, search: searchTerm })
      setConversations(result.conversations)
      setError(null)
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load conversations.')
      setError(message)
      toast.error(message)
    } finally {
      setIsLoadingList(false)
    }
  }, [searchTerm])

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getChatUnreadCount()
      setTotalUnread(count)
    } catch {
      // ignore badge failures
    }
  }, [])

  const loadThread = useCallback(async (conversationId, { silent = false } = {}) => {
    if (!conversationId) return

    if (!silent) setIsLoadingThread(true)

    try {
      const detail = await getChatConversation(conversationId)
      setMessages(detail.messages)
      await markAdminChatRead(conversationId)
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item,
        ),
      )
      await loadUnreadCount()
      setError(null)
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load conversation.')
      setError(message)
      if (!silent) toast.error(message)
    } finally {
      if (!silent) setIsLoadingThread(false)
    }
  }, [loadUnreadCount])

  const handleSelectConversation = async (conversationId) => {
    setSelectedId(conversationId)
    await loadThread(conversationId)
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body || !selectedId) return

    setIsSending(true)
    const optimistic = {
      id: `temp-${Date.now()}`,
      conversationId: selectedId,
      senderType: 'ADMIN',
      body,
      status: 'SENT',
      createdAt: new Date().toISOString(),
      admin: { name: 'You' },
    }

    setMessages((current) => [...current, optimistic])
    setDraft('')

    try {
      const saved = await sendAdminChatMessage(selectedId, body)
      setMessages((current) =>
        current.map((message) => (message.id === optimistic.id ? saved : message)),
      )
      await loadConversations()
    } catch (err) {
      setMessages((current) => current.filter((message) => message.id !== optimistic.id))
      setDraft(body)
      toast.error(getErrorMessage(err, 'Unable to send message.'))
    } finally {
      setIsSending(false)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConversations()
      void loadUnreadCount()
    }, 250)

    const listPoll = window.setInterval(() => {
      void loadConversations()
      void loadUnreadCount()
    }, 5000)

    return () => {
      window.clearTimeout(timer)
      window.clearInterval(listPoll)
    }
  }, [loadConversations, loadUnreadCount])

  useEffect(() => {
    if (!selectedId) return undefined

    const refreshThread = () => {
      loadThread(selectedId, { silent: true }).catch(() => {})
    }

    pollRef.current = window.setInterval(refreshThread, POLL_INTERVAL_MS)

    try {
      const stream = new EventSource(getAdminChatStreamUrl())
      streamRef.current = stream

      stream.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.type === 'message_created' || payload.type === 'conversation_updated') {
            loadConversations().catch(() => {})
            loadUnreadCount().catch(() => {})
          }
          if (
            payload.conversationId === selectedId &&
            (payload.type === 'message_created' || payload.type === 'messages_read')
          ) {
            refreshThread()
          }
        } catch {
          // ignore malformed events
        }
      }

      stream.onerror = () => {
        stream.close()
        streamRef.current = null
      }
    } catch {
      // polling fallback already active
    }

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current)
        pollRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.close()
        streamRef.current = null
      }
    }
  }, [loadConversations, loadThread, loadUnreadCount, selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedId])

  return (
    <div className="space-y-6">
      <PageTitle
        title="Live Support"
        description="Reply to customer conversations in real time."
        action={
          <div className="flex items-center gap-3">
            {totalUnread > 0 ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {totalUnread} unread
              </span>
            ) : null}
            <Button
              variant="secondary"
              onClick={() => {
                setIsLoadingList(true)
                void loadConversations()
                if (selectedId) void loadThread(selectedId, { silent: true })
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="grid min-h-[34rem] overflow-hidden rounded-xl border border-slate-200 bg-white lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-600"
              />
            </div>
          </div>

          <div className="max-h-[32rem] overflow-y-auto">
            {isLoadingList ? (
              <p className="p-4 text-sm text-slate-500">Loading conversations…</p>
            ) : null}
            {!isLoadingList && conversations.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">No conversations yet.</p>
            ) : null}
            {conversations.map((conversation) => {
              const isActive = conversation.id === selectedId
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={cn(
                    'flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50',
                    isActive && 'bg-brand-50',
                  )}
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <UserRound size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-950">
                        {conversation.visitorName || 'Visitor'}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {formatMessageTime(conversation.lastMessageAt)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {conversation.visitorEmail || 'No email'}
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-slate-600">
                        {conversation.latestMessage?.body || 'No messages yet'}
                      </span>
                      {conversation.unreadCount > 0 ? (
                        <span className="inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex min-h-[34rem] flex-col">
          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <MessageSquare size={28} className="text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Select a conversation</p>
              <p className="max-w-sm text-sm text-slate-500">
                Choose a customer thread to view the full history and reply in real time.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-200 px-5 py-4">
                <p className="text-base font-semibold text-slate-950">
                  {selectedConversation.visitorName || 'Visitor'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    {selectedConversation.visitorEmail}
                  </span>
                  <span>Started {formatDate(selectedConversation.createdAt)}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-5 py-4">
                {isLoadingThread ? (
                  <p className="text-sm text-slate-500">Loading messages…</p>
                ) : null}
                {!isLoadingThread && messages.length === 0 ? (
                  <p className="text-sm text-slate-500">No messages in this conversation yet.</p>
                ) : null}
                {messages.map((message) => {
                  const isAdmin = message.senderType === 'ADMIN'
                  return (
                    <div
                      key={message.id}
                      className={cn('flex', isAdmin ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                          isAdmin
                            ? 'rounded-br-md bg-brand-600 text-white'
                            : 'rounded-bl-md border border-slate-200 bg-white text-slate-700',
                        )}
                      >
                        {!isAdmin ? (
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            {selectedConversation.visitorName || 'Customer'}
                          </p>
                        ) : null}
                        <p>{message.body}</p>
                        <div
                          className={cn(
                            'mt-2 flex items-center gap-2 text-[11px]',
                            isAdmin ? 'text-white/70' : 'text-slate-400',
                          )}
                        >
                          <span>{formatMessageTime(message.createdAt)}</span>
                          {isAdmin ? (
                            <span>{message.status === 'READ' ? 'Read' : 'Sent'}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="border-t border-slate-200 bg-white p-4" onSubmit={handleSendMessage}>
                {error ? <p className="mb-2 text-xs text-red-600">{error}</p> : null}
                <div className="flex items-end gap-3">
                  <textarea
                    rows={2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write your reply…"
                    className="min-h-[2.75rem] flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-600"
                  />
                  <Button type="submit" disabled={isSending || !draft.trim()} className="h-11 px-4">
                    <Send size={16} />
                    Send
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveSupportPage
