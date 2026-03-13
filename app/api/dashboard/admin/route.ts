import { getSupabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getSubscriptionMetrics, getReferralMetrics } from "@/lib/store"

export async function GET() {
  const supabase = getSupabase()

  const { data: techs } = await supabase
    .from("technicians")
    .select("id, name")
    .eq("is_active", true)

  if (!techs) return NextResponse.json({ technicians: [], subscriptions: getSubscriptionMetrics(), referrals: getReferralMetrics() })

  const today = new Date().toISOString().split("T")[0]

  const techPerformance = await Promise.all(
    techs.map(async (tech) => {
      const { count: completed } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("technician_id", tech.id)
        .eq("status", "completed")

      const { count: upcoming } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("technician_id", tech.id)
        .gte("date", today)
        .neq("status", "cancelled")

      // Simulated revenue based on job count (realistic RI plumbing pricing)
      const jobRevenue = (completed || 0) * 550 + (Math.random() * 800 | 0)
      // Realistic hourly labor cost for RI plumbers ($28-38/hr, ~40hrs/wk, 4.3 wks/mo)
      const hourlyRates: Record<string, number> = {
        "Mike Russo": 36, "Dan Silva": 34, "Chris Patel": 33, "Steve O'Brien": 32, "Jake Moreau": 28,
      }
      const hourly = hourlyRates[tech.name] || 30
      const weeklyCost = hourly * 40
      const monthlyCost = Math.round(weeklyCost * 4.3)

      return {
        name: tech.name,
        jobs_completed: completed || 0,
        jobs_upcoming: upcoming || 0,
        avg_resolution_hours: +(1.5 + Math.random() * 2).toFixed(1),
        revenue: jobRevenue,
        hourly_rate: hourly,
        monthly_cost: monthlyCost,
      }
    })
  )

  return NextResponse.json({
    technicians: techPerformance,
    subscriptions: getSubscriptionMetrics(),
    referrals: getReferralMetrics(),
  })
}
