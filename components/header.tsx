"use client"

import Link from "next/link"
import { Button } from "@/components/ui/3d-button"
import { PlumLogo } from "@/components/plum-logo"
import { useChat } from "@/components/chat-provider"

export function Header() {
  const { open } = useChat()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
            <PlumLogo className="w-10 h-10" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="#services" className="text-sm text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#pricing" className="text-sm text-foreground hover:text-primary transition-colors">
              Plans
            </Link>
            <Link href="#process" className="text-sm text-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm text-foreground hover:text-primary transition-colors">
              Testimonials
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border hover:border-foreground/30 rounded-full px-4 py-1.5 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Technician Portal
            </Link>
            <Button className="rounded-full px-6" onClick={() => open()}>
              ❄️ Talk to plum
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
