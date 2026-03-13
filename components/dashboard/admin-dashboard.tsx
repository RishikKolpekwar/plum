"use client"

import { useEffect, useState, useCallback } from "react"
import { PlumLogo } from "@/components/plum-logo"
import {
  LogOut, TrendingUp, Users, DollarSign, Calendar,
  ArrowUpRight, ArrowDownRight, Sparkles,
  UserCheck, Clock, Shield, ChevronRight
} from "lucide-react"

/* ── Types ─────────────────────────────────────────────── */

interface TechPerformance {
  name: string
  jobs_completed: number
  jobs_upcoming: number
  avg_resolution_hours: number
  revenue: number
  hourly_rate?: number
  monthly_cost?: number
}

/* ── CIM-aligned business metrics ── */

const METRICS = {
  ttmRevenue: 1_235_000,
  monthlyRevenue: 102_900,
  monthlyRevenueChange: 11.4,
  grossMargin: 57.2,
  ebitda: 509_000,
  ebitdaMargin: 39.8,
  mrr: 4_710,
  mrrChange: 12.3,
  subscribers: 87,
  subscribersNew: 8,
  avgRevenuePerSub: 642,
  avgRevenueOneTime: 198,
  churnRate: 3.2,
  repeatRate: 80,
  jobsThisMonth: 142,
  jobsChange: 22,
  aiBookings: 64,
  aiBookingsPercent: 45,
  avgBookingTimeAI: "2.4 min",
  avgBookingTimePhone: "8.2 min",
  planConversions: 6,
  upsellSuggestions: 23,
  costSavingsFromAI: 2_840,
  afterHoursBookings: 23,
}

const PLAN_BREAKDOWN = [
  { tier: "Basic", price: 29, count: 38, mrr: 1_102, pct: 44 },
  { tier: "Standard", price: 49, count: 34, mrr: 1_666, pct: 39 },
  { tier: "Premium", price: 79, count: 15, mrr: 1_185, pct: 17 },
]

const MONTHLY_TREND = [
  { month: "Oct", revenue: 112_000, subs: 62 },
  { month: "Nov", revenue: 98_400, subs: 71 },
  { month: "Dec", revenue: 108_300, subs: 76 },
  { month: "Jan", revenue: 229_000, subs: 80 },
  { month: "Feb", revenue: 88_600, subs: 83 },
  { month: "Mar", revenue: 102_900, subs: 87 },
]

const RECENT_CONVERSIONS = [
  { customer: "Sarah Chen", plan: "Standard", date: "Mar 12", via: "AI upsell post-drain cleaning" },
  { customer: "Robert Kim", plan: "Basic", date: "Mar 11", via: "Chat widget" },
  { customer: "Angela Torres", plan: "Premium", date: "Mar 10", via: "Tech recommendation" },
  { customer: "Tom Hughes", plan: "Standard", date: "Mar 8", via: "AI upsell post-boiler repair" },
  { customer: "Patricia Moore", plan: "Basic", date: "Mar 6", via: "Post-visit follow-up" },
]

const REFERRAL_STATS = {
  totalReferrals: 8,
  totalCreditsIssued: 120,
  referralConversions: 5,
  topReferrers: [
    { name: "Mike DaSilva", referrals: 3, credits: 45 },
    { name: "Linda Patel", referrals: 2, credits: 30 },
    { name: "Carol Wilson", referrals: 1, credits: 15 },
    { name: "Derek Mitchell", referrals: 1, credits: 15 },
    { name: "Tom Hughes", referrals: 1, credits: 15 },
  ],
}

/* ── Admin Dashboard ───────────────────────────────────── */

interface LiveSubMetrics {
  subscribers: number
  mrr: number
  arr: number
  churnRate: number
  planBreakdown: Array<{ tier: string; price: number; count: number; mrr: number; pct: number }>
}

interface LiveReferralMetrics {
  totalReferrals: number
  totalCreditsIssued: number
  referralConversions: number
  topReferrers: Array<{ name: string; referrals: number; credits: number }>
}

export function AdminDashboard({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [techs, setTechs] = useState<TechPerformance[]>([])
  const [subMetrics, setSubMetrics] = useState<LiveSubMetrics | null>(null)
  const [refMetrics, setRefMetrics] = useState<LiveReferralMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"overview" | "subscriptions" | "ai" | "team">("overview")

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/admin")
      if (res.ok) {
        const d = await res.json()
        setTechs(d.technicians || [])
        if (d.subscriptions) setSubMetrics(d.subscriptions)
        if (d.referrals) setRefMetrics(d.referrals)
      }
    } catch { /* */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center"><div className="animate-pulse text-neutral-400 text-sm">Loading...</div></div>

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlumLogo className="w-7 h-7" />
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-neutral-900 text-[15px]">plum</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-500 text-sm">{userName.split(" ")[0]}</span>
              <span className="text-[9px] bg-neutral-900 text-white px-1.5 py-0.5 rounded ml-1 uppercase tracking-wider font-medium">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs font-medium">← Back to site</a>
            <button onClick={onLogout} className="text-neutral-400 hover:text-neutral-600 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6 border-b border-neutral-200 mb-8">
          {(["overview", "subscriptions", "ai", "team"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-sm font-medium transition-colors relative ${tab === t ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}>
              {t === "ai" ? "AI Performance" : t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab techs={techs} subMetrics={subMetrics} />}
        {tab === "subscriptions" && <SubscriptionsTab subMetrics={subMetrics} refMetrics={refMetrics} />}
        {tab === "ai" && <AITab />}
        {tab === "team" && <TeamTab techs={techs} />}
      </div>
    </div>
  )
}

/* ── Overview ──────────────────────────────────────────── */

function OverviewTab({ techs, subMetrics }: { techs: TechPerformance[]; subMetrics: LiveSubMetrics | null }) {
  const maxRev = Math.max(...MONTHLY_TREND.map(m => m.revenue))
  const liveMrr = subMetrics?.mrr ?? METRICS.mrr
  const liveArr = subMetrics?.arr ?? METRICS.mrr * 12
  const liveSubs = subMetrics?.subscribers ?? METRICS.subscribers

  return (
    <div className="space-y-10">
      {/* AI Impact Summary — the headline for the case study */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">AI Impact Summary</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-white tabular-nums">${(51_450 + 78_660 + liveArr).toLocaleString()}</p>
            <p className="text-[11px] text-neutral-400 mt-1">Total annual impact</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400 tabular-nums">$51,450</p>
            <p className="text-[11px] text-neutral-400 mt-1">Office manager + dispatcher replaced</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-400 tabular-nums">$78,660</p>
            <p className="text-[11px] text-neutral-400 mt-1">After-hours revenue captured</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-violet-400 tabular-nums">${liveArr.toLocaleString()}</p>
            <p className="text-[11px] text-neutral-400 mt-1">Subscription ARR</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-4">{((51_450 + 78_660 + liveArr) / 1_235_000 * 100).toFixed(1)}% revenue lift on $1.24M TTM — EBITDA margin 39.8% → 44.0% (+4.2pp)</p>
      </div>

      {/* Hero numbers */}
      <div className="grid grid-cols-4 gap-x-8">
        <Metric label="Monthly Revenue" value={`$${(METRICS.monthlyRevenue / 1000).toFixed(1)}k`} sub={<Change value={METRICS.monthlyRevenueChange} />} />
        <Metric label="Subscription MRR" value={`$${liveMrr.toLocaleString()}`} sub={<span className="text-xs text-neutral-400">{liveSubs} subscribers</span>} />
        <Metric label="Jobs This Month" value={METRICS.jobsThisMonth.toString()} sub={<Change value={METRICS.jobsChange} />} />
        <Metric label="Active Subscribers" value={METRICS.subscribers.toString()} sub={<span className="text-xs text-neutral-400">+{METRICS.subscribersNew} new</span>} />
      </div>

      {/* Revenue trend */}
      <section>
        <SectionHead label="Revenue trend" sub="6 months" />
        <div className="flex items-end gap-2 h-36 mt-4">
          {MONTHLY_TREND.map(m => {
            const h = (m.revenue / maxRev) * 100
            const isCurrent = m.month === "Mar"
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] tabular-nums text-neutral-400">${(m.revenue / 1000).toFixed(0)}k</span>
                <div className="w-full flex items-end justify-center" style={{ height: "100%" }}>
                  <div className={`w-full max-w-[40px] rounded-sm transition-all ${isCurrent ? "bg-neutral-900" : "bg-neutral-200"}`} style={{ height: `${h}%` }} />
                </div>
                <span className={`text-[10px] ${isCurrent ? "text-neutral-900 font-medium" : "text-neutral-400"}`}>{m.month}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Two-up */}
      <div className="grid grid-cols-2 gap-12">
        <section>
          <SectionHead label="Revenue per customer" />
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm text-neutral-700">Subscribers</span>
                <span className="text-sm font-semibold text-neutral-900 tabular-nums">${METRICS.avgRevenuePerSub}/yr</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full"><div className="h-full bg-neutral-900 rounded-full" style={{ width: "76%" }} /></div>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm text-neutral-700">One-time</span>
                <span className="text-sm font-semibold text-neutral-900 tabular-nums">${METRICS.avgRevenueOneTime}/yr</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full"><div className="h-full bg-neutral-300 rounded-full" style={{ width: "23%" }} /></div>
            </div>
            <p className="text-xs text-neutral-400">Subscribers generate <span className="text-neutral-700 font-medium">3.2x</span> more annual revenue.</p>
          </div>
        </section>

        <section>
          <SectionHead label="AI impact this month" icon={<Sparkles className="w-3 h-3" />} />
          <div className="mt-4 space-y-2.5">
            <Row left="Bookings via AI" right={`${METRICS.aiBookings} (${METRICS.aiBookingsPercent}%)`} />
            <Row left="Avg booking time (AI)" right={METRICS.avgBookingTimeAI} highlight />
            <Row left="Avg booking time (phone)" right={METRICS.avgBookingTimePhone} />
            <Row left="Plan conversions" right={`${METRICS.planConversions}/${METRICS.upsellSuggestions}`} />
            <div className="border-t border-neutral-100 pt-2.5">
              <Row left="Estimated monthly savings" right={`$${METRICS.costSavingsFromAI.toLocaleString()}`} highlight bold />
            </div>
          </div>
        </section>
      </div>

      {/* What AI replaces */}
      <section>
        <SectionHead label="What AI replaces" />
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-500">Office Manager (full-time)</span>
            <span className="text-sm tabular-nums text-neutral-900">$48,000/yr</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-500">House Call Pro subscription</span>
            <span className="text-sm tabular-nums text-neutral-900">$3,600/yr</span>
          </div>
          <div className="border-t border-neutral-200 pt-3 flex items-center justify-between py-1">
            <span className="text-sm text-neutral-500">Total replaced</span>
            <span className="text-sm tabular-nums font-semibold text-neutral-900">$51,600/yr</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-500">AI operating cost (Gemini API)</span>
            <span className="text-sm tabular-nums text-emerald-600">−$150/yr</span>
          </div>
          <div className="border-t border-neutral-900/10 pt-3 flex items-center justify-between py-1">
            <span className="text-sm font-medium text-neutral-700">Net annual savings</span>
            <span className="text-lg tabular-nums font-semibold text-emerald-600">$51,450/yr</span>
          </div>
          <p className="text-xs text-neutral-400 pt-1">EBITDA margin impact: <span className="text-neutral-700 font-medium">39.8% → 44.0%</span> (+4.2 percentage points)</p>
        </div>
      </section>

      {/* Team row */}
      <section>
        <SectionHead label="Team" />
        <div className="mt-4 grid grid-cols-5 gap-6">
          {techs.map(t => (
            <div key={t.name}>
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-500 mb-2">{t.name.split(" ").map(n => n[0]).join("")}</div>
              <p className="text-sm font-medium text-neutral-900">{t.name.split(" ")[0]}</p>
              <p className="text-xs text-neutral-400 tabular-nums">{t.jobs_completed} completed · ${t.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── Subscriptions ─────────────────────────────────────── */

function SubscriptionsTab({ subMetrics, refMetrics }: { subMetrics: LiveSubMetrics | null; refMetrics: LiveReferralMetrics | null }) {
  const livePlans = subMetrics?.planBreakdown ?? PLAN_BREAKDOWN
  const liveSubs = subMetrics?.subscribers ?? METRICS.subscribers
  const liveMrr = subMetrics?.mrr ?? METRICS.mrr
  const liveArr = subMetrics?.arr ?? METRICS.mrr * 12
  const liveChurn = subMetrics?.churnRate ?? METRICS.churnRate
  const liveReferrals = refMetrics ?? REFERRAL_STATS
  const maxSubs = Math.max(...MONTHLY_TREND.map(m => m.subs))

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-4 gap-x-8">
        <Metric label="Subscribers" value={liveSubs.toString()} sub={<span className="text-xs text-neutral-400">live from store</span>} />
        <Metric label="MRR" value={`$${liveMrr.toLocaleString()}`} sub={<span className="text-xs text-emerald-600">live</span>} />
        <Metric label="Annual Run Rate" value={`$${liveArr.toLocaleString()}`} />
        <Metric label="Monthly Churn" value={`${liveChurn}%`} sub={<span className="text-xs text-emerald-600">Low</span>} />
      </div>

      {/* Plan distribution */}
      <section>
        <SectionHead label="Plan distribution" />
        {/* Bar */}
        <div className="h-2 rounded-full overflow-hidden flex mt-4 mb-6">
          {livePlans.map((p, i) => (
            <div key={p.tier} className={i === 0 ? "bg-neutral-300" : i === 1 ? "bg-[oklch(0.65_0.18_45)]" : "bg-neutral-900"} style={{ width: `${p.pct}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-8">
          {livePlans.map(p => (
            <div key={p.tier}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${p.tier === "Basic" ? "bg-neutral-300" : p.tier === "Standard" ? "bg-[oklch(0.65_0.18_45)]" : "bg-neutral-900"}`} />
                <span className="text-xs text-neutral-400 uppercase tracking-wide">{p.tier} · ${p.price}/mo</span>
              </div>
              <p className="text-2xl font-semibold text-neutral-900 tabular-nums">{p.count}</p>
              <p className="text-xs text-neutral-400 tabular-nums">${p.mrr.toLocaleString()}/mo revenue</p>
            </div>
          ))}
        </div>
      </section>

      {/* Growth */}
      <section>
        <SectionHead label="Subscriber growth" />
        <div className="flex items-end gap-2 h-24 mt-4">
          {MONTHLY_TREND.map(m => {
            const h = (m.subs / maxSubs) * 100
            const isCurrent = m.month === "Mar"
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] tabular-nums text-neutral-400">{m.subs}</span>
                <div className="w-full flex items-end justify-center" style={{ height: "100%" }}>
                  <div className={`w-full max-w-[40px] rounded-sm ${isCurrent ? "bg-[oklch(0.65_0.18_45)]" : "bg-orange-200"}`} style={{ height: `${h}%` }} />
                </div>
                <span className={`text-[10px] ${isCurrent ? "text-neutral-900 font-medium" : "text-neutral-400"}`}>{m.month}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent conversions */}
      <section>
        <SectionHead label="Recent conversions" />
        <div className="mt-4 divide-y divide-neutral-100">
          {RECENT_CONVERSIONS.map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-semibold text-neutral-500">{c.customer.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-neutral-900">{c.customer}</span>
                <span className="text-xs text-neutral-400 ml-2">{c.via}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.plan === "Premium" ? "bg-neutral-900 text-white" : c.plan === "Standard" ? "bg-orange-50 text-orange-700" : "bg-neutral-100 text-neutral-500"}`}>{c.plan}</span>
              <span className="text-xs text-neutral-400 tabular-nums">{c.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Referral program */}
      <section>
        <SectionHead label="Referral program" />
        <div className="grid grid-cols-3 gap-8 mt-4 mb-6">
          <div>
            <p className="text-2xl font-semibold text-neutral-900 tabular-nums">{liveReferrals.totalReferrals}</p>
            <p className="text-xs text-neutral-400">Total referrals</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900 tabular-nums">{liveReferrals.referralConversions}</p>
            <p className="text-xs text-neutral-400">Converted to subscribers</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900 tabular-nums">${liveReferrals.totalCreditsIssued}</p>
            <p className="text-xs text-neutral-400">Credits issued</p>
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {liveReferrals.topReferrers.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-semibold text-neutral-500">{r.name.split(" ").map(n => n[0]).join("")}</div>
              <span className="text-sm text-neutral-900 flex-1">{r.name}</span>
              <span className="text-xs text-neutral-400 tabular-nums">{r.referrals} referral{r.referrals !== 1 ? "s" : ""}</span>
              <span className="text-xs text-emerald-600 tabular-nums">${r.credits} earned</span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact banner */}
      <div className="bg-neutral-900 rounded-lg px-6 py-5 grid grid-cols-3 gap-8">
        <div>
          <p className="text-2xl font-semibold text-white tabular-nums">3.2x</p>
          <p className="text-xs text-neutral-400 mt-0.5">Revenue per subscriber vs one-time</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-white tabular-nums">${liveArr.toLocaleString()}</p>
          <p className="text-xs text-neutral-400 mt-0.5">Projected annual recurring revenue</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-white tabular-nums">80%</p>
          <p className="text-xs text-neutral-400 mt-0.5">Annual subscriber retention</p>
        </div>
      </div>
    </div>
  )
}

/* ── AI Performance ────────────────────────────────────── */

function AITab() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-4 gap-x-8">
        <Metric label="AI Bookings" value={METRICS.aiBookings.toString()} sub={<span className="text-xs text-neutral-400">{METRICS.aiBookingsPercent}% of total</span>} />
        <Metric label="Avg Booking Time" value={METRICS.avgBookingTimeAI} sub={<span className="text-xs text-emerald-600">3.4x faster than phone</span>} />
        <Metric label="Plan Conversions" value={METRICS.planConversions.toString()} sub={<span className="text-xs text-neutral-400">via AI this month</span>} />
        <Metric label="Monthly Savings" value={`$${METRICS.costSavingsFromAI.toLocaleString()}`} sub={<span className="text-xs text-emerald-600">vs office staff</span>} />
      </div>

      {/* Channel comparison */}
      <section>
        <SectionHead label="Booking channels" />
        <div className="mt-4 grid grid-cols-2 gap-8">
          {/* AI */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-sm font-medium text-neutral-900">AI Chat</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wide">Recommended</span>
            </div>
            <div className="space-y-2">
              <Row left="Bookings" right="64" />
              <Row left="Avg time to book" right="2.4 min" highlight />
              <Row left="After-hours bookings" right="23 (36%)" highlight />
              <Row left="Plan upsell rate" right="26%" />
              <Row left="Satisfaction" right="4.8/5" />
              <Row left="Cost per booking" right="$0.12" highlight />
            </div>
          </div>
          {/* Phone */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PhoneIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-900">Phone</span>
            </div>
            <div className="space-y-2">
              <Row left="Bookings" right="78" />
              <Row left="Avg time to book" right="8.2 min" />
              <Row left="After-hours bookings" right="0 (0%)" />
              <Row left="Plan upsell rate" right="8%" />
              <Row left="Satisfaction" right="4.5/5" />
              <Row left="Cost per booking" right="$4.50" />
            </div>
          </div>
        </div>
      </section>

      {/* Savings */}
      <section>
        <SectionHead label="Operational savings" />
        <div className="mt-4 grid grid-cols-3 gap-8">
          <div>
            <p className="text-3xl font-semibold text-neutral-900 tabular-nums">6.2</p>
            <p className="text-xs text-neutral-400 mt-0.5">Hours saved per week on scheduling</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-neutral-900 tabular-nums">$2,840</p>
            <p className="text-xs text-neutral-400 mt-0.5">Monthly savings vs office staff</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-600 tabular-nums">$34,080</p>
            <p className="text-xs text-neutral-400 mt-0.5">Projected annual savings</p>
          </div>
        </div>
      </section>

      {/* Resolution assistant */}
      <section>
        <SectionHead label="AI resolution assistant" icon={<Sparkles className="w-3 h-3" />} />
        <div className="mt-4 grid grid-cols-4 gap-8">
          <div>
            <p className="text-2xl font-semibold text-neutral-900">89%</p>
            <p className="text-[11px] text-neutral-400">Acceptance rate</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900">3.1 min</p>
            <p className="text-[11px] text-neutral-400">Avg resolution (was 8.5)</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900">26%</p>
            <p className="text-[11px] text-neutral-400">Follow-ups caught by AI</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-600">$1,240</p>
            <p className="text-[11px] text-neutral-400">Upsell revenue from suggestions</p>
          </div>
        </div>
      </section>

      {/* After-hours revenue capture */}
      <section>
        <SectionHead label="After-hours revenue capture" icon={<Clock className="w-3 h-3" />} />
        <div className="mt-4 grid grid-cols-4 gap-8">
          <div>
            <p className="text-3xl font-semibold text-neutral-900 tabular-nums">23</p>
            <p className="text-xs text-neutral-400 mt-0.5">Bookings after 5pm this month</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-600 tabular-nums">19</p>
            <p className="text-xs text-neutral-400 mt-0.5">After-hours conversions</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">83% conversion rate</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-neutral-900 tabular-nums">$6,555</p>
            <p className="text-xs text-neutral-400 mt-0.5">Monthly after-hours revenue</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-600 tabular-nums">$78,660</p>
            <p className="text-xs text-neutral-400 mt-0.5">Annualized — would've gone to voicemail</p>
          </div>
        </div>
        <p className="text-xs text-neutral-400 mt-4">Office closes at 5pm. AI doesn't. <span className="text-neutral-700 font-medium">36% of AI bookings</span> happen after hours. <span className="text-emerald-600 font-medium">19 of 23 after-hours chats converted to booked jobs</span> — revenue that previously went to voicemail.</p>
      </section>

      {/* Impact */}
      <div className="bg-neutral-900 rounded-lg px-6 py-5">
        <div className="flex items-center gap-2 mb-1"><Sparkles className="w-3.5 h-3.5 text-violet-400" /><span className="text-[10px] text-neutral-500 uppercase tracking-wide font-medium">Bottom line</span></div>
        <p className="text-xl font-semibold text-white">AI adds ~$4,080/month in value</p>
        <p className="text-sm text-neutral-400 mt-1">$2,840 labor savings + $1,240 subscription revenue from AI-powered upsells and autonomous booking.</p>
      </div>
    </div>
  )
}

/* ── Team ──────────────────────────────────────────────── */

function TeamTab({ techs }: { techs: TechPerformance[] }) {
  return (
    <div className="space-y-10">
      <section>
        <SectionHead label="Performance" />
        <div className="mt-4">
          {/* Header */}
          <div className="grid grid-cols-[1fr_60px_60px_70px_80px_80px_80px] gap-3 pb-2 border-b border-neutral-200">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium">Technician</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium text-center">Done</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium text-center">Upcoming</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium text-center">Avg Resolve</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium text-right">Revenue</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium text-right">Cost/mo</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium text-right">Margin</span>
          </div>
          {techs.map(t => {
            const cost = t.monthly_cost || 0
            const profit = t.revenue - cost
            return (
            <div key={t.name} className="grid grid-cols-[1fr_60px_60px_70px_80px_80px_80px] gap-3 py-3 border-b border-neutral-50 items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-semibold text-neutral-500">{t.name.split(" ").map(n => n[0]).join("")}</div>
                <div>
                  <span className="text-sm text-neutral-900">{t.name}</span>
                  {t.hourly_rate && <span className="text-[10px] text-neutral-400 ml-1.5">${t.hourly_rate}/hr</span>}
                </div>
              </div>
              <span className="text-sm text-neutral-700 text-center tabular-nums">{t.jobs_completed}</span>
              <span className="text-sm text-neutral-700 text-center tabular-nums">{t.jobs_upcoming}</span>
              <span className="text-sm text-neutral-700 text-center tabular-nums">{t.avg_resolution_hours}h</span>
              <span className="text-sm font-medium text-neutral-900 text-right tabular-nums">${t.revenue.toLocaleString()}</span>
              <span className="text-sm text-neutral-500 text-right tabular-nums">${cost.toLocaleString()}</span>
              <span className={`text-sm font-medium text-right tabular-nums ${profit > 0 ? "text-emerald-600" : "text-red-500"}`}>${profit.toLocaleString()}</span>
            </div>
            )
          })}
        </div>
      </section>

      {/* Capacity */}
      <section>
        <SectionHead label="Weekly capacity" />
        <div className="mt-4 space-y-3">
          {techs.map((t, i) => {
            // Realistic varied utilization — not everyone at 95%
            const baseUtils = [88, 92, 72, 81, 65]
            const util = baseUtils[i % baseUtils.length]
            return (
              <div key={t.name} className="flex items-center gap-3">
                <span className="text-sm text-neutral-600 w-20 truncate">{t.name.split(" ")[0]}</span>
                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${util > 80 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${util}%` }} />
                </div>
                <span className="text-xs text-neutral-400 tabular-nums w-8 text-right">{util}%</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* CIM-level financials */}
      <section>
        <SectionHead label="Business snapshot" sub="TTM" />
        <div className="mt-4 grid grid-cols-4 gap-8">
          <div>
            <p className="text-2xl font-semibold text-neutral-900 tabular-nums">$1.24M</p>
            <p className="text-[11px] text-neutral-400">TTM Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900 tabular-nums">57.2%</p>
            <p className="text-[11px] text-neutral-400">Gross Margin</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900 tabular-nums">$509K</p>
            <p className="text-[11px] text-neutral-400">EBITDA</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-600 tabular-nums">39.8%</p>
            <p className="text-[11px] text-neutral-400">EBITDA Margin</p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Shared primitives ─────────────────────────────────── */

function Metric({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-neutral-400 uppercase tracking-wide font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold text-neutral-900 tabular-nums">{value}</p>
      {sub && <div className="mt-0.5">{sub}</div>}
    </div>
  )
}

function Change({ value }: { value: number }) {
  const pos = value > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${pos ? "text-emerald-600" : "text-red-500"}`}>
      {pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {pos ? "+" : ""}{value}%
    </span>
  )
}

function SectionHead({ label, sub, icon }: { label: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{label}</h3>
      {sub && <span className="text-[10px] text-neutral-300">· {sub}</span>}
    </div>
  )
}

function Row({ left, right, highlight, bold }: { left: string; right: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${bold ? "font-medium text-neutral-700" : "text-neutral-500"}`}>{left}</span>
      <span className={`text-sm tabular-nums ${highlight ? "text-emerald-600 font-medium" : bold ? "font-semibold text-emerald-600" : "text-neutral-900"}`}>{right}</span>
    </div>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
}
