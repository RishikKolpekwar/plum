// Shared in-memory stores — used by both chat API and admin API
// Data persists for the lifetime of the server process

export interface Subscriber {
  plan: string
  discount: number
  since: string
  phone: string
  email?: string
  referral_code: string
  referrals_made: number
  credits: number
}

export interface ReferralEntry {
  referrer: string
  referred: string
  date: string
  credit: number
}

export const PLAN_DETAILS: Record<string, { name: string; price: number; discount: number; dispatch_waived: boolean }> = {
  basic: { name: "Protection Plan", price: 29, discount: 10, dispatch_waived: false },
  standard: { name: "Care Plan", price: 49, discount: 15, dispatch_waived: false },
  premium: { name: "Total Coverage", price: 79, discount: 20, dispatch_waived: true },
}

export const SERVICE_PRICING: Record<string, { base: number; range: string; dispatch: number }> = {
  boiler: { base: 350, range: "$285–$450", dispatch: 95 },
  drain: { base: 225, range: "$195–$285", dispatch: 95 },
  fixture: { base: 195, range: "$150–$250", dispatch: 95 },
  emergency: { base: 425, range: "$350–$500", dispatch: 150 },
}

export const subscriberStore: Record<string, Subscriber> = {
  "sarah chen": { plan: "standard", discount: 15, since: "2025-08", phone: "(401) 555-9010", referral_code: "SARAH15", referrals_made: 3, credits: 45 },
  "robert kim": { plan: "basic", discount: 10, since: "2025-11", phone: "(401) 555-9011", referral_code: "ROBERT15", referrals_made: 1, credits: 15 },
  "angela torres": { plan: "premium", discount: 20, since: "2024-06", phone: "(401) 555-9012", referral_code: "ANGELA15", referrals_made: 5, credits: 75 },
  "tom rivera": { plan: "basic", discount: 10, since: "2025-09", phone: "(401) 555-9014", referral_code: "TOM15", referrals_made: 0, credits: 0 },
  "patricia moore": { plan: "basic", discount: 10, since: "2026-01", phone: "(401) 555-9015", referral_code: "PATRICIA15", referrals_made: 2, credits: 30 },
  "james wilson": { plan: "standard", discount: 15, since: "2025-04", phone: "(401) 555-9016", referral_code: "JAMES15", referrals_made: 1, credits: 15 },
  "karen o'donnell": { plan: "standard", discount: 15, since: "2025-07", phone: "(401) 555-9017", referral_code: "KAREN15", referrals_made: 0, credits: 0 },
  "lisa chang": { plan: "premium", discount: 20, since: "2025-02", phone: "(401) 555-9019", referral_code: "LISA15", referrals_made: 4, credits: 60 },
  "nancy davis": { plan: "basic", discount: 10, since: "2025-12", phone: "(401) 555-9020", referral_code: "NANCY15", referrals_made: 0, credits: 0 },
  "jennifer lee": { plan: "standard", discount: 15, since: "2025-10", phone: "(401) 555-9022", referral_code: "JENNIFER15", referrals_made: 2, credits: 30 },
  "tom hughes": { plan: "standard", discount: 15, since: "2025-06", phone: "(401) 555-9024", referral_code: "TOMH15", referrals_made: 3, credits: 45 },
  "rachel adams": { plan: "premium", discount: 20, since: "2025-03", phone: "(401) 555-9025", referral_code: "RACHEL15", referrals_made: 1, credits: 15 },
  "carol w": { plan: "standard", discount: 15, since: "2024-11", phone: "(401) 555-9031", referral_code: "CAROL15", referrals_made: 0, credits: 0 },
  "derek m": { plan: "basic", discount: 10, since: "2025-05", phone: "(401) 555-9032", referral_code: "DEREK15", referrals_made: 3, credits: 45 },
}

export const referralLog: ReferralEntry[] = [
  { referrer: "angela torres", referred: "Tom Rivera", date: "2025-09-02", credit: 15 },
  { referrer: "angela torres", referred: "Patricia Moore", date: "2026-01-10", credit: 15 },
  { referrer: "sarah chen", referred: "Robert Kim", date: "2025-11-15", credit: 15 },
  { referrer: "sarah chen", referred: "Nancy Davis", date: "2025-12-03", credit: 15 },
  { referrer: "derek m", referred: "Carol W", date: "2024-11-20", credit: 15 },
  { referrer: "derek m", referred: "Jennifer Lee", date: "2025-10-08", credit: 15 },
  { referrer: "lisa chang", referred: "James Wilson", date: "2025-04-14", credit: 15 },
  { referrer: "tom hughes", referred: "Karen O'Donnell", date: "2025-07-22", credit: 15 },
]

// Helper: compute live metrics from the store
export function getSubscriptionMetrics() {
  const subs = Object.values(subscriberStore)
  const total = subs.length

  const planCounts = { basic: 0, standard: 0, premium: 0 }
  for (const s of subs) {
    if (s.plan in planCounts) planCounts[s.plan as keyof typeof planCounts]++
  }

  const planBreakdown = Object.entries(planCounts).map(([tier, count]) => {
    const plan = PLAN_DETAILS[tier]
    return {
      tier: tier.charAt(0).toUpperCase() + tier.slice(1),
      price: plan.price,
      count,
      mrr: count * plan.price,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  })

  const mrr = planBreakdown.reduce((s, p) => s + p.mrr, 0)

  return {
    subscribers: total,
    mrr,
    arr: mrr * 12,
    churnRate: 3.2,
    planBreakdown,
  }
}

export function getReferralMetrics() {
  const totalReferrals = referralLog.length
  const totalCreditsIssued = referralLog.reduce((s, r) => s + r.credit, 0)

  // Count referrals per person
  const referrerCounts: Record<string, number> = {}
  for (const r of referralLog) {
    referrerCounts[r.referrer] = (referrerCounts[r.referrer] || 0) + 1
  }

  // Build top referrers from the store (has credits info)
  const topReferrers = Object.entries(subscriberStore)
    .filter(([, s]) => s.referrals_made > 0)
    .sort(([, a], [, b]) => b.referrals_made - a.referrals_made)
    .slice(0, 5)
    .map(([name, s]) => ({
      name: name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      referrals: s.referrals_made,
      credits: s.credits,
    }))

  // Count how many referred people became subscribers
  const referredNames = new Set(referralLog.map(r => r.referred.toLowerCase()))
  const referralConversions = [...referredNames].filter(n => n in subscriberStore).length

  return {
    totalReferrals,
    totalCreditsIssued,
    referralConversions,
    topReferrers,
  }
}
