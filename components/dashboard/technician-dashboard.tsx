"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { PlumLogo } from "@/components/plum-logo"
import {
  Calendar, MapPin, Phone, LogOut, X, Plus,
  ChevronDown, ChevronLeft, ChevronRight, CheckCircle2,
  AlertCircle, ArrowRight, FileText, Sparkles, Loader2,
  DollarSign, Star
} from "lucide-react"

/* ── Types ─────────────────────────────────────────────── */

interface Technician { id: string; name: string; specialties: string[]; phone: string; email: string }
interface Appointment {
  id: string; customer_name: string; customer_phone: string; customer_email: string
  service_type: string; date: string; start_time: string; end_time: string
  address: string; notes: string; status: string
}
interface Availability { id: string; technician_id: string; day_of_week: number; start_time: string; end_time: string; is_available: boolean }
interface Override { id: string; technician_id: string; date: string; start_time: string | null; end_time: string | null; is_available: boolean; reason: string | null }
interface TechRef { id: string; name: string; specialties: string[] }

/* ── Constants ─────────────────────────────────────────── */

const SERVICE_LABELS: Record<string, string> = { boiler: "Boiler", drain: "Drain", fixture: "Fixture", emergency: "Emergency" }
const SERVICE_ICONS: Record<string, string> = { boiler: "🔥", drain: "🚿", fixture: "🚰", emergency: "⚡" }
const SERVICE_BG: Record<string, string> = {
  boiler: "bg-rose-50 border-rose-200 text-rose-700",
  drain: "bg-sky-50 border-sky-200 text-sky-700",
  fixture: "bg-emerald-50 border-emerald-200 text-emerald-700",
  emergency: "bg-amber-50 border-amber-200 text-amber-700",
}
const SERVICE_BLOCK: Record<string, string> = {
  boiler: "bg-rose-100 border-l-rose-400 text-rose-800",
  drain: "bg-sky-100 border-l-sky-400 text-sky-800",
  fixture: "bg-emerald-100 border-l-emerald-400 text-emerald-800",
  emergency: "bg-amber-100 border-l-amber-400 text-amber-800",
}

/* ── Helpers ───────────────────────────────────────────── */

function fmt(time: string) {
  const [h, m] = time.split(":"); const hr = parseInt(h)
  return `${hr === 0 ? 12 : hr > 12 ? hr - 12 : hr}:${m}${hr >= 12 ? "p" : "a"}`
}
function fmtDate(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) }
function fmtDateLong(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) }
function todayStr() { return new Date().toISOString().split("T")[0] }
function isToday(d: string) { return d === todayStr() }
function isTomorrow(d: string) { const t = new Date(); t.setDate(t.getDate() + 1); return d === t.toISOString().split("T")[0] }
function dateLabel(d: string) { return isToday(d) ? "Today" : isTomorrow(d) ? "Tomorrow" : fmtDate(d) }
function parseHour(t: string) { const [h, m] = t.split(":").map(Number); return h + m / 60 }

function getWeekDates(offset: number): string[] {
  const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1 + offset * 7)
  return Array.from({ length: 6 }, (_, i) => {
    const day = new Date(d); day.setDate(d.getDate() + i)
    return day.toISOString().split("T")[0]
  })
}

function weekLabel(dates: string[]) {
  const s = new Date(dates[0] + "T12:00:00"); const e = new Date(dates[5] + "T12:00:00")
  const sm = s.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const em = e.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${sm} – ${em}`
}

type Tab = "upcoming" | "past" | "schedule"

/* ── Main Dashboard ────────────────────────────────────── */

export function TechnicianDashboard({ techName, onLogout }: { techName: string; onLogout: () => void }) {
  const [tech, setTech] = useState<Technician | null>(null)
  const [upcoming, setUpcoming] = useState<Appointment[]>([])
  const [past, setPast] = useState<Appointment[]>([])
  const [calAppts, setCalAppts] = useState<Appointment[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [overrides, setOverrides] = useState<Override[]>([])
  const [allTechs, setAllTechs] = useState<TechRef[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("upcoming")
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/dashboard?name=${encodeURIComponent(techName)}`)
    if (res.ok) {
      const d = await res.json()
      setTech(d.technician); setUpcoming(d.upcoming); setPast(d.past)
      setCalAppts(d.calendarAppointments); setAvailability(d.availability)
      setOverrides(d.overrides); setAllTechs(d.allTechnicians)
    }
    setLoading(false)
  }, [techName])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { const i = setInterval(fetchData, 15000); return () => clearInterval(i) }, [fetchData])

  const cancelAppt = async (id: string) => {
    await fetch("/api/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel_appointment", appointment_id: id }) })
    showToast("Appointment cancelled"); fetchData()
  }

  if (loading) return <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center"><div className="animate-pulse text-neutral-400 text-sm">Loading...</div></div>

  const todayAppts = upcoming.filter(a => isToday(a.date))
  const futureAppts = upcoming.filter(a => !isToday(a.date))
  const needsResolution = past.filter(a => a.status !== "completed")

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {toast && <div className="fixed top-4 right-4 z-50 bg-neutral-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">{toast}</div>}

      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlumLogo className="w-7 h-7" />
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-neutral-900 text-[15px]">plum</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-500 text-sm">{techName.split(" ")[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs font-medium">← Back to site</a>
            <button onClick={onLogout} className="text-neutral-400 hover:text-neutral-600 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today", value: todayAppts.length, color: "text-neutral-900" },
            { label: "This week", value: upcoming.length, color: "text-neutral-900" },
            { label: "Needs resolution", value: needsResolution.length, color: needsResolution.length > 0 ? "text-amber-600" : "text-neutral-900" },
            { label: "Completed", value: past.filter(a => a.status === "completed").length, color: "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-2xl font-semibold ${s.color} tabular-nums`}>{s.value}</p>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-neutral-200 mb-6">
          {([
            { key: "upcoming" as Tab, label: "Upcoming", count: upcoming.length },
            { key: "past" as Tab, label: "History", count: past.length },
            { key: "schedule" as Tab, label: "Schedule", count: null },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium transition-colors relative ${tab === t.key ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}>
              {t.label}
              {t.count !== null && t.count > 0 && <span className="ml-1.5 text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full">{t.count}</span>}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
            </button>
          ))}
        </div>

        {/* Upcoming */}
        {tab === "upcoming" && (
          <div className="space-y-8">
            {upcoming.length === 0 ? <Empty icon={<Calendar className="w-5 h-5" />} title="No upcoming appointments" sub="New bookings from the AI assistant will show up here." /> : (
              <>
                {todayAppts.length > 0 && <ApptGroup title="Today" appts={todayAppts} onCancel={cancelAppt} dot="bg-emerald-500" />}
                {futureAppts.length > 0 && <ApptGroup title="Coming up" appts={futureAppts} onCancel={cancelAppt} />}
              </>
            )}
          </div>
        )}

        {/* History */}
        {tab === "past" && (
          <div className="space-y-8">
            {past.length === 0 ? <Empty icon={<FileText className="w-5 h-5" />} title="No past appointments" sub="Completed jobs will appear here." /> : (
              <>
                {needsResolution.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-amber-500" />Needs resolution</h3>
                    <div className="space-y-2">{needsResolution.map(a => <PastCard key={a.id} appt={a} allTechs={allTechs} myId={tech?.id || ""} onResolve={async (d) => {
                      await fetch("/api/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete_appointment", ...d }) })
                      showToast(d.follow_up_needed ? "Resolved — follow-up created" : "Job marked complete"); fetchData()
                    }} />)}</div>
                  </div>
                )}
                {past.filter(a => a.status === "completed").length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Completed</h3>
                    <div className="space-y-2">{past.filter(a => a.status === "completed").map(a => <DoneCard key={a.id} appt={a} />)}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Schedule */}
        {tab === "schedule" && (
          <ScheduleTab tech={tech!} calAppts={calAppts} availability={availability} overrides={overrides}
            onUpdate={fetchData} showToast={showToast} onCancel={cancelAppt} />
        )}
      </div>
    </div>
  )
}

/* ── Small shared pieces ───────────────────────────────── */

function Empty({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return <div className="text-center py-16"><div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mb-3">{icon}</div><p className="text-sm font-medium text-neutral-600">{title}</p><p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">{sub}</p></div>
}
function Detail({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-start gap-2 text-xs text-neutral-400"><span className="mt-0.5 shrink-0">{icon}</span><span>{text}</span></div>
}

/* ── Upcoming cards ────────────────────────────────────── */

function ApptGroup({ title, appts, onCancel, dot }: { title: string; appts: Appointment[]; onCancel: (id: string) => Promise<void>; dot?: string }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-2">
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}{title}
      </h3>
      <div className="space-y-2">{appts.map(a => <UpCard key={a.id} appt={a} onCancel={onCancel} />)}</div>
    </div>
  )
}

function UpCard({ appt, onCancel }: { appt: Appointment; onCancel: (id: string) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 flex items-center gap-3 text-left">
        <span className="text-lg shrink-0">{SERVICE_ICONS[appt.service_type] || "🔧"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="text-sm font-medium text-neutral-900 truncate">{appt.customer_name}</span><span className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">{SERVICE_LABELS[appt.service_type]}</span></div>
          <span className="text-xs text-neutral-400">{dateLabel(appt.date)} · {fmt(appt.start_time)}–{fmt(appt.end_time)}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-300 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-neutral-100 pt-2 space-y-1.5">
          {appt.address && <Detail icon={<MapPin className="w-3 h-3" />} text={appt.address} />}
          {appt.customer_phone && <Detail icon={<Phone className="w-3 h-3" />} text={appt.customer_phone} />}
          {appt.notes && <Detail icon={<FileText className="w-3 h-3" />} text={appt.notes} />}
          <div className="pt-2"><button onClick={async e => { e.stopPropagation(); setBusy(true); await onCancel(appt.id); setBusy(false) }} disabled={busy} className="text-xs text-red-500 hover:text-red-600 disabled:opacity-40">{busy ? "Cancelling..." : "Cancel appointment"}</button></div>
        </div>
      )}
    </div>
  )
}

/* ── Past / Resolution cards ───────────────────────────── */

function PastCard({ appt, allTechs, myId, onResolve }: {
  appt: Appointment; allTechs: TechRef[]; myId: string
  onResolve: (d: { appointment_id: string; resolution_notes: string; follow_up_needed: boolean; follow_up_technician_id?: string; follow_up_notes?: string }) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [fu, setFu] = useState(false)
  const [fuTech, setFuTech] = useState(myId)
  const [fuNotes, setFuNotes] = useState("")
  const [busy, setBusy] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiRec, setAiRec] = useState<{ resolution: string; follow_up_recommended: boolean; follow_up_reason: string; estimated_cost: string; plan_upsell: string } | null>(null)
  const [aiError, setAiError] = useState(false)

  async function getAiRecommendation() {
    setAiLoading(true); setAiError(false)
    try {
      const res = await fetch("/api/dashboard/recommend", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_type: appt.service_type, notes: appt.notes, customer_name: appt.customer_name, address: appt.address })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAiRec(data)
      // Pre-fill the form with AI suggestions
      if (data.resolution) setNotes(data.resolution)
      if (data.follow_up_recommended) { setFu(true); if (data.follow_up_reason) setFuNotes(data.follow_up_reason) }
    } catch { setAiError(true) }
    setAiLoading(false)
  }

  return (
    <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 flex items-center gap-3 text-left">
        <span className="text-lg shrink-0">{SERVICE_ICONS[appt.service_type] || "🔧"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="text-sm font-medium text-neutral-900 truncate">{appt.customer_name}</span><span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Needs resolution</span></div>
          <span className="text-xs text-neutral-400">{fmtDateLong(appt.date)}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-300 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-amber-100 space-y-3 pt-3">
          {appt.address && <Detail icon={<MapPin className="w-3 h-3" />} text={appt.address} />}
          {appt.notes && <Detail icon={<FileText className="w-3 h-3" />} text={appt.notes} />}

          {/* AI Recommendation Button */}
          {!aiRec && (
            <button onClick={getAiRecommendation} disabled={aiLoading}
              className="w-full text-xs font-medium border border-violet-200 bg-violet-50 text-violet-700 rounded-md py-2 hover:bg-violet-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
              {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating recommendation...</> : <><Sparkles className="w-3.5 h-3.5" />Get AI recommendation</>}
            </button>
          )}
          {aiError && <p className="text-xs text-red-500">Failed to generate recommendation. Try again or fill in manually.</p>}

          {/* AI Recommendation Card */}
          {aiRec && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-600 uppercase tracking-wide"><Sparkles className="w-3 h-3" />AI Recommendation</div>
              <p className="text-xs text-violet-900 leading-relaxed">{aiRec.resolution}</p>
              {aiRec.estimated_cost && (
                <div className="flex items-start gap-1.5 text-xs text-violet-700"><DollarSign className="w-3 h-3 mt-0.5 shrink-0" /><span>{aiRec.estimated_cost}</span></div>
              )}
              {aiRec.follow_up_recommended && aiRec.follow_up_reason && (
                <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1.5"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /><span>Follow-up recommended: {aiRec.follow_up_reason}</span></div>
              )}
              {aiRec.plan_upsell && (
                <div className="flex items-start gap-1.5 text-xs text-emerald-700 bg-emerald-50 rounded px-2 py-1.5"><Star className="w-3 h-3 mt-0.5 shrink-0" /><span>{aiRec.plan_upsell}</span></div>
              )}
              <p className="text-[10px] text-violet-400 italic">You can edit the notes below before saving.</p>
            </div>
          )}

          <div><label className="block text-xs font-medium text-neutral-500 mb-1">Resolution notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What was done?" rows={3} className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300 resize-none" /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={fu} onChange={e => setFu(e.target.checked)} className="rounded border-neutral-300" /><span className="text-xs text-neutral-600">Follow-up needed</span></label>
          {fu && (
            <div className="space-y-2 pl-5 border-l-2 border-neutral-100">
              <div><label className="block text-xs text-neutral-400 mb-1">Assign to</label><select value={fuTech} onChange={e => setFuTech(e.target.value)} className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-md px-3 py-1.5">{allTechs.map(t => <option key={t.id} value={t.id}>{t.name}{t.id === myId ? " (me)" : ""}</option>)}</select></div>
              <div><label className="block text-xs text-neutral-400 mb-1">Details</label><input value={fuNotes} onChange={e => setFuNotes(e.target.value)} placeholder="What needs to happen?" className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-md px-3 py-1.5 placeholder:text-neutral-300" /></div>
            </div>
          )}
          <button onClick={async () => { setBusy(true); await onResolve({ appointment_id: appt.id, resolution_notes: notes, follow_up_needed: fu, follow_up_technician_id: fu ? fuTech : undefined, follow_up_notes: fu ? fuNotes : undefined }); setBusy(false) }} disabled={busy}
            className="w-full text-sm font-medium bg-neutral-900 text-white rounded-md py-2 hover:bg-neutral-800 disabled:opacity-40 flex items-center justify-center gap-2">
            {busy ? "Saving..." : <><CheckCircle2 className="w-3.5 h-3.5" />Mark complete{fu ? " & create follow-up" : ""}</>}
          </button>
        </div>
      )}
    </div>
  )
}

function DoneCard({ appt }: { appt: Appointment }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg px-4 py-3 flex items-center gap-3">
      <span className="text-lg shrink-0">{SERVICE_ICONS[appt.service_type] || "🔧"}</span>
      <div className="flex-1 min-w-0"><span className="text-sm text-neutral-600 truncate block">{appt.customer_name}</span><span className="text-xs text-neutral-400">{fmtDate(appt.date)}</span></div>
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    </div>
  )
}

/* ── Schedule Tab with Calendar ────────────────────────── */

function ScheduleTab({ tech, calAppts, availability, overrides, onUpdate, showToast, onCancel }: {
  tech: Technician; calAppts: Appointment[]; availability: Availability[]; overrides: Override[]
  onUpdate: () => void; showToast: (m: string) => void; onCancel: (id: string) => Promise<void>
}) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [editDay, setEditDay] = useState<number | null>(null)
  const [editS, setEditS] = useState(""); const [editE, setEditE] = useState("")
  const [showDayOff, setShowDayOff] = useState(false)
  const [dayOffDate, setDayOffDate] = useState(""); const [dayOffReason, setDayOffReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  const dates = useMemo(() => getWeekDates(weekOffset), [weekOffset])
  const dayNames = dates.map(d => {
    const dt = new Date(d + "T12:00:00")
    return { short: dt.toLocaleDateString("en-US", { weekday: "short" }), num: dt.getDate(), full: d, isToday: isToday(d) }
  })

  const HOUR_START = 7; const HOUR_END = 19; const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)
  const ROW_H = 48 // px per hour

  const apptsForDate = (date: string) => calAppts.filter(a => a.date === date)

  async function saveHours(day: number) {
    setError(null)
    const res = await fetch("/api/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_availability", technician_id: tech.id, day_of_week: day, start_time: editS, end_time: editE, is_available: true }) })
    const data = await res.json()
    if (!res.ok && data.error === "conflict") { setError(data.message); return }
    setEditDay(null); showToast("Hours updated"); onUpdate()
  }

  async function addDayOff() {
    if (!dayOffDate) return; setError(null)
    const res = await fetch("/api/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_override", technician_id: tech.id, date: dayOffDate, start_time: null, end_time: null, is_available: false, reason: dayOffReason || "Day off" }) })
    const data = await res.json()
    if (!res.ok && data.error === "conflict") { setError(data.message); return }
    setShowDayOff(false); setDayOffDate(""); setDayOffReason(""); showToast("Day off added"); onUpdate()
  }

  return (
    <div className="space-y-8">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div><p className="text-sm text-red-700">{error}</p><button onClick={() => setError(null)} className="text-xs text-red-500 mt-1 hover:underline">Dismiss</button></div>
        </div>
      )}

      {/* Calendar header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-900">{weekLabel(dates)}</h3>
          <div className="flex items-center gap-1">
            <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setWeekOffset(0)} className="text-xs text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded-md hover:bg-neutral-100">Today</button>
            <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-[56px_repeat(6,1fr)] border-b border-neutral-200">
            <div className="border-r border-neutral-100" />
            {dayNames.map(d => (
              <div key={d.full} className={`text-center py-2.5 border-r border-neutral-100 last:border-r-0 ${d.isToday ? "bg-neutral-900 text-white" : ""}`}>
                <div className="text-[10px] uppercase tracking-wide opacity-60">{d.short}</div>
                <div className="text-sm font-semibold">{d.num}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-[56px_repeat(6,1fr)] relative" style={{ height: `${HOURS.length * ROW_H}px` }}>
            {/* Hour labels */}
            <div className="border-r border-neutral-100 relative">
              {HOURS.map(h => (
                <div key={h} className="absolute right-2 text-[10px] text-neutral-400 tabular-nums" style={{ top: `${(h - HOUR_START) * ROW_H - 6}px` }}>
                  {h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {dates.map((date, colIdx) => (
              <div key={date} className={`relative border-r border-neutral-100 last:border-r-0 ${dayNames[colIdx].isToday ? "bg-neutral-50/50" : ""}`}>
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} className="absolute left-0 right-0 border-t border-neutral-100" style={{ top: `${(h - HOUR_START) * ROW_H}px` }} />
                ))}

                {/* Appointment blocks */}
                {apptsForDate(date).map(appt => {
                  const startH = parseHour(appt.start_time)
                  const endH = parseHour(appt.end_time)
                  const top = (startH - HOUR_START) * ROW_H
                  const height = (endH - startH) * ROW_H
                  const colors = SERVICE_BLOCK[appt.service_type] || "bg-neutral-100 border-l-neutral-400 text-neutral-700"

                  return (
                    <button
                      key={appt.id}
                      onClick={() => setSelected(appt)}
                      className={`absolute left-0.5 right-0.5 rounded-[4px] border-l-[3px] px-1.5 py-1 text-left overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${colors}`}
                      style={{ top: `${top + 1}px`, height: `${height - 2}px` }}
                    >
                      <div className="text-[10px] font-semibold truncate leading-tight">{appt.customer_name}</div>
                      {height > 30 && <div className="text-[9px] opacity-70 truncate">{fmt(appt.start_time)}–{fmt(appt.end_time)}</div>}
                      {height > 50 && <div className="text-[9px] opacity-60 truncate">{SERVICE_LABELS[appt.service_type]}</div>}
                    </button>
                  )
                })}
              </div>
            ))}

            {/* Now indicator */}
            {weekOffset === 0 && (() => {
              const now = new Date()
              const currentH = now.getHours() + now.getMinutes() / 60
              if (currentH < HOUR_START || currentH > HOUR_END) return null
              const todayIdx = dates.findIndex(d => isToday(d))
              if (todayIdx < 0) return null
              const top = (currentH - HOUR_START) * ROW_H
              const left = `calc(56px + ${todayIdx} * ((100% - 56px) / 6))`
              const width = `calc((100% - 56px) / 6)`
              return <div className="absolute h-0.5 bg-red-400 z-10 pointer-events-none" style={{ top: `${top}px`, left, width }}><div className="w-2 h-2 rounded-full bg-red-400 -mt-[3px] -ml-1" /></div>
            })()}
          </div>
        </div>
      </div>

      {/* Appointment detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`px-5 py-3 flex items-center justify-between border-b ${SERVICE_BG[selected.service_type] || "bg-neutral-50"}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{SERVICE_ICONS[selected.service_type]}</span>
                <span className="text-sm font-semibold">{SERVICE_LABELS[selected.service_type]}</span>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 opacity-50 hover:opacity-100" /></button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-base font-semibold text-neutral-900">{selected.customer_name}</p>
                <p className="text-sm text-neutral-500">{fmtDateLong(selected.date)} · {fmt(selected.start_time)}–{fmt(selected.end_time)}</p>
              </div>
              {selected.address && <Detail icon={<MapPin className="w-3.5 h-3.5" />} text={selected.address} />}
              {selected.customer_phone && <Detail icon={<Phone className="w-3.5 h-3.5" />} text={selected.customer_phone} />}
              {selected.notes && <Detail icon={<FileText className="w-3.5 h-3.5" />} text={selected.notes} />}
            </div>
            <div className="px-5 pb-4">
              <button onClick={async () => { await onCancel(selected.id); setSelected(null) }}
                className="w-full text-sm text-red-500 border border-red-200 rounded-md py-2 hover:bg-red-50 transition-colors">
                Cancel appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly hours editor */}
      <div>
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">Weekly hours</h3>
        <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
          {[0, 1, 2, 3, 4, 5, 6].map(day => {
            const avail = availability.find(a => a.day_of_week === day)
            const isEd = editDay === day
            const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            return (
              <div key={day} className="px-4 py-3">
                {isEd ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-900 w-10">{dayLabels[day]}</span>
                    <input type="time" value={editS} onChange={e => setEditS(e.target.value)} className="text-sm bg-neutral-50 border border-neutral-200 rounded px-2 py-1" />
                    <ArrowRight className="w-3 h-3 text-neutral-300" />
                    <input type="time" value={editE} onChange={e => setEditE(e.target.value)} className="text-sm bg-neutral-50 border border-neutral-200 rounded px-2 py-1" />
                    <button onClick={() => saveHours(day)} className="text-xs font-medium bg-neutral-900 text-white rounded px-3 py-1">Save</button>
                    <button onClick={() => { setEditDay(null); setError(null) }}><X className="w-3.5 h-3.5 text-neutral-400" /></button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-900 w-10">{dayLabels[day]}</span>
                      {avail?.is_available ? <span className="text-sm text-neutral-500">{fmt(avail.start_time)} – {fmt(avail.end_time)}</span> : <span className="text-sm text-neutral-300 italic">Off</span>}
                    </div>
                    {avail?.is_available && <button onClick={() => { setEditDay(day); setEditS(avail.start_time.slice(0, 5)); setEditE(avail.end_time.slice(0, 5)); setError(null) }} className="text-xs text-neutral-400 hover:text-neutral-600">Edit</button>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Time off */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Time off</h3>
          <button onClick={() => setShowDayOff(!showDayOff)} className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1"><Plus className="w-3 h-3" />Add day off</button>
        </div>
        {showDayOff && (
          <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs text-neutral-400 mb-1">Date</label><input type="date" value={dayOffDate} onChange={e => setDayOffDate(e.target.value)} min={todayStr()} className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-md px-3 py-1.5" /></div>
              <div><label className="block text-xs text-neutral-400 mb-1">Reason</label><input value={dayOffReason} onChange={e => setDayOffReason(e.target.value)} placeholder="Optional" className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-md px-3 py-1.5 placeholder:text-neutral-300" /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={addDayOff} disabled={!dayOffDate} className="text-xs font-medium bg-neutral-900 text-white rounded-md px-3 py-1.5 disabled:opacity-30">Confirm</button>
              <button onClick={() => { setShowDayOff(false); setError(null) }} className="text-xs text-neutral-400 px-3 py-1.5">Cancel</button>
            </div>
          </div>
        )}
        {overrides.length === 0 && !showDayOff ? <p className="text-sm text-neutral-400 py-4">No time off scheduled.</p> : (
          <div className="space-y-2">{overrides.map(ov => (
            <div key={ov.id} className="bg-white border border-neutral-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
              <div><span className="text-sm text-neutral-700">{fmtDateLong(ov.date)}</span>{ov.reason && <span className="text-xs text-neutral-400 ml-2">— {ov.reason}</span>}</div>
              <button onClick={async () => { await fetch("/api/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove_override", override_id: ov.id }) }); showToast("Override removed"); onUpdate() }} className="text-xs text-neutral-400 hover:text-red-500">Remove</button>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  )
}
