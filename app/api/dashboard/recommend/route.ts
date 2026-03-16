import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { service_type, notes, customer_name, address } = await req.json()

  const prompt = `You are an expert plumbing service AI assistant helping a technician write resolution notes for a completed job. Based on the job details below, generate a concise recommended resolution summary AND determine if a follow-up visit is likely needed.

JOB DETAILS:
- Service type: ${service_type}
- Customer: ${customer_name}
- Address: ${address || "N/A"}
- Job notes: ${notes || "No notes provided"}

Respond in this exact JSON format (no markdown, no code fences):
{
  "resolution": "2-3 sentence summary of what was likely done, written as if the technician is logging it. Be specific to the service type — mention parts, techniques, and outcomes. Use professional plumbing terminology.",
  "follow_up_recommended": true/false,
  "follow_up_reason": "If follow-up is recommended, explain why in one sentence. If not, leave empty string.",
  "estimated_cost": "$XXX — brief breakdown (labor + parts estimate for a RI plumbing company)",
  "plan_upsell": "If this customer could benefit from a plum protection plan, suggest which tier and why in one sentence. If they'd clearly save money, mention the specific savings. Leave empty string if not applicable."
}`

  const models = ["gpt-4o-mini", "gpt-4o"] as const
  for (const model of models) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      })
      const text = completion.choices[0]?.message?.content?.trim() || ""
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) continue
      const recommendation = JSON.parse(jsonMatch[0])
      return NextResponse.json(recommendation)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : ""
      if (msg.includes("429") && model !== models[models.length - 1]) continue
      console.error(`AI recommendation error (${model}):`, msg)
    }
  }
  return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 })
}
