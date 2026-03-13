"use client"

import { useState } from "react"
import Link from "next/link"
import { PlumLogo } from "@/components/plum-logo"
import { TechnicianDashboard } from "@/components/dashboard/technician-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

const ALL_USERS: Record<string, { pin: string; role: "technician" | "admin" }> = {
  "Mike Russo": { pin: "1001", role: "technician" },
  "Dan Silva": { pin: "1002", role: "technician" },
  "Chris Patel": { pin: "1003", role: "technician" },
  "Steve O'Brien": { pin: "1004", role: "technician" },
  "Jake Moreau": { pin: "1005", role: "technician" },
  "Anthony Russo": { pin: "9001", role: "admin" },
  "Maria DeSilva": { pin: "9002", role: "admin" },
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState<{ name: string; role: "technician" | "admin" } | null>(null)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const user = ALL_USERS[userName]
    if (!user) {
      setError("User not found")
      return
    }
    if (pin !== user.pin) {
      setError("Incorrect PIN")
      return
    }
    setError("")
    setLoggedIn({ name: userName, role: user.role })
  }

  if (loggedIn?.role === "admin") {
    return <AdminDashboard userName={loggedIn.name} onLogout={() => setLoggedIn(null)} />
  }

  if (loggedIn?.role === "technician") {
    return <TechnicianDashboard techName={loggedIn.name} onLogout={() => setLoggedIn(null)} />
  }

  const technicians = Object.entries(ALL_USERS).filter(([, v]) => v.role === "technician").map(([k]) => k)
  const admins = Object.entries(ALL_USERS).filter(([, v]) => v.role === "admin").map(([k]) => k)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
        ← Back to site
      </Link>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 mb-8">
          <PlumLogo className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-semibold text-center text-foreground">
              plum Portal
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Sign in to your dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Name
            </label>
            <select
              value={userName}
              onChange={(e) => { setUserName(e.target.value); setError("") }}
              className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/30 border border-border"
            >
              <option value="">Select your name...</option>
              <optgroup label="Management">
                {admins.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
              <optgroup label="Technicians">
                {technicians.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError("") }}
              placeholder="Enter your 4-digit PIN"
              maxLength={4}
              className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 border border-border"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[oklch(0.65_0.18_45)] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Contact admin if you forgot your PIN
          </p>
        </form>
      </div>
    </div>
  )
}
