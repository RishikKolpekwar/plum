"use client"

import { useChat } from "@/components/chat-provider"
import { PlumLogo } from "@/components/plum-logo"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const WELCOME_MESSAGE = "Hey there! ❄️ I'm the plum assistant. I can check our technicians' live availability and book your appointment right here — no phone calls needed. Whether it's a boiler fix, a drain clearing, or an emergency, just tell me what's going on and I'll get you scheduled."

function formatMessage(text: string): React.ReactNode {
  // Strip markdown bullet markers (* ) that appear inline
  let cleaned = text.replace(/\s?\*\s(?=\*\*)/g, " ")
  // Split on markdown bold markers and rebuild with <strong> tags
  const parts = cleaned.split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return cleaned
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

export function ChatModal() {
  const { isOpen, close, initialMessage } = useChat()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const hasGreetedRef = useRef(false)
  const pendingInitialRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && !hasGreetedRef.current) {
      hasGreetedRef.current = true
      // If opened with an initial message (e.g. from pricing), queue it
      if (initialMessage) {
        pendingInitialRef.current = initialMessage.text
      }
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
        setMessages([{ role: "assistant", content: WELCOME_MESSAGE }])
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle initial message from pricing buttons etc.
  useEffect(() => {
    if (!initialMessage || !isOpen) return
    if (!hasGreetedRef.current) {
      // Will be picked up after welcome message appears
      pendingInitialRef.current = initialMessage.text
      return
    }
    // Already greeted — send directly after a small delay
    const timer = setTimeout(() => {
      sendMessageText(initialMessage.text)
    }, 300)
    return () => clearTimeout(timer)
  }, [initialMessage])

  // Send pending initial message after welcome appears
  useEffect(() => {
    if (pendingInitialRef.current && messages.length > 0 && !isTyping) {
      const msg = pendingInitialRef.current
      pendingInitialRef.current = null
      // Small delay so the welcome message is visible first
      const timer = setTimeout(() => {
        sendMessageText(msg)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  async function sendMessageText(text: string) {
    if (!text) return

    const userMsg: Message = { role: "user", content: text }
    let updated: Message[] = []
    setMessages((prev) => {
      updated = [...prev, userMsg]
      return updated
    })
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      setIsTyping(false)
      if (data.response?.trim()) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      }
    } catch {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again or call us directly!",
        },
      ])
    }
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg: Message = { role: "user", content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      setIsTyping(false)
      if (data.response?.trim()) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      }
    } catch {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again or call us directly!",
        },
      ])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - mobile only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 z-[998] md:hidden"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[999] bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[520px] md:h-[720px] md:rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
              <PlumLogo className="w-8 h-8" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground">plum</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Online
                </div>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[oklch(0.72_0.19_45)] text-white rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 bg-secondary rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 resize-none overflow-y-auto"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[oklch(0.72_0.19_45)] text-white disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
