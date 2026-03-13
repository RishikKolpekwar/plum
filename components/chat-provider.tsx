"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChatContextType {
  isOpen: boolean
  initialMessage: { text: string; id: number } | null
  open: (message?: string) => void
  close: () => void
  toggle: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<{ text: string; id: number } | null>(null)

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        initialMessage,
        open: (message?: string) => {
          if (message) setInitialMessage({ text: message, id: Date.now() })
          setIsOpen(true)
        },
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used within ChatProvider")
  return ctx
}
