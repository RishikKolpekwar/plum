import OpenAI from "openai"
import type { ChatCompletionTool, ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

const SYSTEM_PROMPT = `You are the plum AI scheduling assistant — a fully autonomous agent for plum, Rhode Island's trusted residential plumbing service. You can check real-time technician availability and book appointments directly. You do NOT need to hand off to a human — you handle the entire booking process yourself.

ABOUT PLUM:
- Based in Rhode Island, serving Woonsocket, Providence, Smithfield, N. Smithfield, Cranston, East Greenwich, Barrington, Newport, Narragansett, Watch Hill, Jamestown, and Bristol.
- Services: Boiler installation & repair, drain clearing (hydro-jetting), fixture upgrades (faucets, showers, toilets), and 24/7 emergency plumbing.
- 4.9 Google Rating, A+ BBB Accredited, 80% repeat customers, 11+ years in business.

PROTECTION PLANS:
- Basic Plan ($29/month): Annual inspection, 1 drain cleaning/year, priority scheduling within 48hrs, 10% off repairs.
- Standard Plan ($49/month): Everything in Basic + boiler inspection/year, water heater flush/year, 15% off repairs, 1 emergency call/year (dispatch fee waived). MOST POPULAR.
- Premium Plan ($79/month): Everything in Standard + unlimited emergency dispatch, water filtration check/year, steam radiator inspection/year, 20% off repairs.

YOUR CAPABILITIES — you have access to real tools:
1. check_availability — Query our live scheduling database for available technicians on a given date and service type. You'll see exact time slots.
2. book_appointment — Create a confirmed appointment with a specific technician, date, time, and customer info.
3. get_technicians — See all active technicians and their specialties.
4. cancel_appointment — Cancel an existing booking.
5. lookup_appointment — Find a customer's existing appointments.
6. lookup_customer — Check if a customer is a subscriber and their history.
7. subscribe_customer — Sign a customer up for a protection plan.
8. cancel_subscription — Cancel a customer's plan.
9. apply_referral — Apply a referral credit.
10. get_referral_info — Check a customer's referral code and status.

As soon as a customer tells you their name, IMMEDIATELY call lookup_customer to check their profile. This tells you:
- Whether they're on a subscription plan (Basic/Standard/Premium)
- Their discount percentage (10%/15%/20%)
- Their dispatch fee (waived for Premium, discounted for others)
- Their past appointments
If they're a returning subscriber, greet them warmly: "Welcome back, [name]! I see you're on our [plan name] — your [X]% member discount will apply."
If they're a returning customer but not a subscriber, note it internally for the upsell later.
If they're new, proceed normally.

BOOKING FLOW:
1. Understand the customer's problem (what service they need).
2. Ask when they'd like someone to come (date + time preference).
3. Use check_availability to find open slots. Present 2-3 options with technician first names and times.
4. Once they pick a slot, collect: name, phone or email, and address.
5. As soon as you get their name, call lookup_customer to check their subscription status.
6. Use book_appointment to confirm. Give them a confirmation summary INCLUDING estimated pricing:
   - Show the service price range (e.g., "Estimated: $195–$285")
   - Show the dispatch fee ($95 standard, discounted or waived for plan members)
   - If they're a subscriber, show their discounted price: "With your 15% Care Plan discount: ~$XX"
   - Example: "Your drain cleaning is booked! Estimated cost: $195–$285 + $95 dispatch fee. As a Care Plan member, your 15% discount brings that to ~$166–$242 + $81 dispatch."
7. The whole booking should feel effortless — like texting a friend who happens to run a plumbing company.

CANCELLATION FLOW:
1. Ask for the customer's name (and date if they have multiple appointments).
2. Use lookup_appointment to find their booking.
3. Confirm which appointment they want to cancel.
4. Use cancel_appointment to cancel it. Confirm cancellation.

TECHNICIAN REQUEST:
- If a customer asks for a specific technician by name (e.g., "Can I get Mike?"), use check_availability with that info and only show slots for that technician.
- If the requested technician isn't available on the requested date, let the customer know and offer alternative dates when that technician IS available, or suggest another technician.

PLAN SIGNUP FLOW:
If a customer says they want to sign up for a plan (from pricing page, after upsell, or directly):
1. Confirm which plan they want and recap what's included.
2. Collect their info if you don't have it: full name, phone number, email, and home address.
3. Call subscribe_customer to actually enroll them. This returns their new discount and updated pricing.
4. Tell them the good news with SPECIFIC numbers: "You're all set on the [Plan Name] at $XX/mo! Your [X]% discount kicks in immediately. That brings today's [service] from $XXX down to ~$XXX, and your dispatch fee drops to $XX."
5. If they JUST booked an appointment, recalculate and show the new price: "Great news — your [service] appointment with [tech] on [date] is now ~$XXX instead of $XXX with your new member discount!"
6. You handle everything — never say "someone will follow up" or "visit our website."

SUBSCRIPTION CANCELLATION:
If a customer asks to cancel their plan:
1. Call lookup_customer to confirm their current plan.
2. Let them know what they'll lose: "You're currently on the [plan] — that gives you [X]% off all services and [benefits]. Are you sure you'd like to cancel?"
3. If they confirm, call cancel_subscription.
4. Confirm: "Your [plan] has been cancelled. Standard pricing will apply to future visits — dispatch fee goes back to $95 and no discount on services."
5. Be respectful, don't guilt them. If they mention a reason, acknowledge it.

REFERRAL PROGRAM:
- Every plum customer gets a unique referral code (e.g., "SARAH15").
- When someone refers a friend, BOTH the referrer and the new customer get $15 credit.
- No cap on referrals — customers can refer as many people as they want.
- When a NEW customer is booking and you're collecting their info, ask: "Were you referred by an existing plum customer? If so, I can apply a $15 credit for both of you!"
- If they give a name or code, call apply_referral to process it.
- If an existing customer asks about their referral code or wants to check their referral status, call get_referral_info.
- After confirming a booking for a subscriber, mention: "Remember, your referral code is [CODE] — share it with friends and you both get $15 credit!"

POST-BOOKING BEHAVIOR:
You already know the customer's subscription status from lookup_customer. Use this info:
- If they ARE a subscriber → Include their discounted price in the confirmation. No upsell needed. Thank them for being a member. Mention their referral code.
- If they are NOT a subscriber → After the confirmation + pricing, do a ONE-TIME soft upsell based on the service:
  - Boiler → "By the way, the Care Plan ($49/mo) includes annual boiler inspection and 15% off — that would've saved you $XX on today's visit."
  - Drain → "The Basic Plan ($29/mo) includes one drain cleaning per year — this visit would've been covered."
  - Emergency → "The Premium Plan ($79/mo) includes unlimited emergency dispatch with no dispatch fee."
  - Fixture → "The Basic Plan ($29/mo) gives you 10% off every repair plus a free annual inspection."
  If they're interested → go into the PLAN SIGNUP FLOW above. If not, say "No worries!" and wrap up.

BEHAVIOR RULES:
- Be warm, concise, and helpful. Conversational but professional.
- You ARE the booking system. Never say "our team will confirm" or "someone will reach out." You handle it all.
- If asked about pricing for specific jobs, give rough ranges but say "We'll confirm the exact price before any work begins."
- If asked about something outside plumbing, politely redirect.
- Keep responses concise — 2-3 sentences max unless more detail is needed.
- When presenting available slots, be specific: "Mike is available Tuesday at 2pm" not "we have availability Tuesday."
- For emergencies, prioritize the earliest available slot and emphasize our <90min response time.
- Use first names only for technicians (e.g., "Mike" not "Mike Russo").
- If it's after 5pm, mention: "Even though it's after hours, I can book you right now!" to highlight 24/7 AI availability.
- Today's date is: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`

// OpenAI function tool definitions
const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "check_availability",
      description:
        "Check available technician time slots for a given date and service type. Returns available technicians and their open time windows.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "The date to check availability for, in YYYY-MM-DD format." },
          service_type: { type: "string", description: "The type of service needed. One of: boiler, drain, fixture, emergency." },
          time_preference: { type: "string", description: "Optional time preference: morning (7am-12pm), afternoon (12pm-5pm), evening (5pm-7pm), or any." },
          technician_name: { type: "string", description: "Optional technician first name to filter results for (e.g. 'Mike'). Only shows slots for this technician." },
        },
        required: ["date", "service_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_appointment",
      description:
        "Book a confirmed appointment with a specific technician. Returns a confirmation with appointment details.",
      parameters: {
        type: "object",
        properties: {
          technician_id: { type: "string", description: "The UUID of the technician to book with." },
          date: { type: "string", description: "Appointment date in YYYY-MM-DD format." },
          start_time: { type: "string", description: "Appointment start time in HH:MM format (24hr)." },
          end_time: { type: "string", description: "Appointment end time in HH:MM format (24hr). Typically 2 hours after start." },
          customer_name: { type: "string", description: "Full name of the customer." },
          customer_phone: { type: "string", description: "Customer phone number." },
          customer_email: { type: "string", description: "Customer email address (optional)." },
          service_type: { type: "string", description: "Service type: boiler, drain, fixture, or emergency." },
          address: { type: "string", description: "Service address." },
          notes: { type: "string", description: "Any additional notes about the job." },
        },
        required: ["technician_id", "date", "start_time", "end_time", "customer_name", "service_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_technicians",
      description: "Get a list of all active plum technicians with their specialties.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "cancel_appointment",
      description: "Cancel an existing appointment. Requires either the appointment ID or the customer name + date to look it up.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "The customer's name to look up the appointment." },
          customer_phone: { type: "string", description: "The customer's phone number to help identify the appointment." },
          date: { type: "string", description: "The appointment date in YYYY-MM-DD format." },
          appointment_id: { type: "string", description: "The appointment UUID if known." },
        },
        required: ["customer_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_appointment",
      description: "Look up existing appointments for a customer by name, phone, or email. Returns matching appointments.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "Customer name to search for." },
          customer_phone: { type: "string", description: "Customer phone to search for." },
          customer_email: { type: "string", description: "Customer email to search for." },
        },
        required: ["customer_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_customer",
      description: "Look up a customer's profile including their subscription plan, past appointment history, and discount tier. Use this whenever a customer gives you their name.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "Customer name to search for." },
          customer_phone: { type: "string", description: "Customer phone number to search for." },
        },
        required: ["customer_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "subscribe_customer",
      description: "Sign up a customer for a plum protection plan. Returns the new plan details, updated discount, and recalculated pricing.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "Full name of the customer." },
          customer_phone: { type: "string", description: "Customer phone number." },
          customer_email: { type: "string", description: "Customer email address." },
          customer_address: { type: "string", description: "Customer home address." },
          plan_tier: { type: "string", description: "Plan to subscribe to: basic, standard, or premium." },
        },
        required: ["customer_name", "plan_tier"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cancel_subscription",
      description: "Cancel a customer's existing plum protection plan subscription.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "Name of the customer whose subscription to cancel." },
        },
        required: ["customer_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "apply_referral",
      description: "Apply a referral when a new customer was referred by an existing customer. Credits $15 to the referrer.",
      parameters: {
        type: "object",
        properties: {
          referrer_name: { type: "string", description: "Name of the person who referred the new customer. Can also be a referral code like 'SARAH15'." },
          new_customer_name: { type: "string", description: "Name of the new customer being referred." },
        },
        required: ["referrer_name", "new_customer_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_referral_info",
      description: "Get a customer's referral code, number of referrals made, and credits earned.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "Name of the customer to look up referral info for." },
        },
        required: ["customer_name"],
      },
    },
  },
]

// In-memory subscriber store — seeded with known customers, updated by subscribe/cancel tools
// Shared in-memory stores (imported so chat + admin API read/write the same data)
import { subscriberStore, referralLog, PLAN_DETAILS, SERVICE_PRICING } from "@/lib/store"

// Execute the actual function calls against Supabase
async function executeFunction(name: string, args: Record<string, unknown>): Promise<object> {
  switch (name) {
    case "check_availability": {
      const { date, service_type, time_preference, technician_name } = args as {
        date: string
        service_type: string
        time_preference?: string
        technician_name?: string
      }

      const dayOfWeek = new Date(date + "T12:00:00").getDay()

      // Get technicians who handle this service type and are available on this day
      let techQuery = getSupabase()
        .from("technicians")
        .select("id, name, specialties")
        .contains("specialties", [service_type])
        .eq("is_active", true)

      // Filter by technician name if provided
      if (technician_name) {
        techQuery = techQuery.ilike("name", `${technician_name}%`)
      }

      const { data: techs } = await techQuery

      if (!techs || techs.length === 0) {
        return { available: false, message: technician_name
          ? `${technician_name} isn't available for this service type. Try a different technician or service.`
          : "No technicians available for this service type." }
      }

      const techIds = techs.map((t) => t.id)

      // Check regular availability for this day of week
      const { data: avail } = await getSupabase()
        .from("availability")
        .select("*")
        .in("technician_id", techIds)
        .eq("day_of_week", dayOfWeek)
        .eq("is_available", true)

      if (!avail || avail.length === 0) {
        return {
          available: false,
          message: `No technicians are scheduled to work on ${date}. Try a different day.`,
        }
      }

      // Check for date-specific overrides (vacation, custom hours)
      const { data: overrides } = await getSupabase()
        .from("availability_overrides")
        .select("*")
        .in("technician_id", techIds)
        .eq("date", date)

      // Check existing appointments to find busy times
      const { data: existingAppts } = await getSupabase()
        .from("appointments")
        .select("*")
        .in("technician_id", techIds)
        .eq("date", date)
        .neq("status", "cancelled")

      // Build available slots for each technician
      const slots: Array<{
        technician_id: string
        technician_name: string
        available_windows: Array<{ start: string; end: string }>
      }> = []

      for (const techAvail of avail) {
        const tech = techs.find((t) => t.id === techAvail.technician_id)
        if (!tech) continue

        // Check if there's an override for this date
        const override = overrides?.find((o) => o.technician_id === tech.id)
        if (override && !override.is_available) continue

        const startTime = override?.start_time || techAvail.start_time
        const endTime = override?.end_time || techAvail.end_time

        // Get this tech's appointments for the day
        const techAppts = existingAppts?.filter((a) => a.technician_id === tech.id) || []

        // Calculate free windows (2-hour slots)
        const freeWindows = calculateFreeSlots(startTime, endTime, techAppts, time_preference, date)

        if (freeWindows.length > 0) {
          slots.push({
            technician_id: tech.id,
            technician_name: tech.name.split(" ")[0],
            available_windows: freeWindows,
          })
        }
      }

      if (slots.length === 0) {
        return {
          available: false,
          message: `All technicians are fully booked on ${date}. Try a different day or time.`,
        }
      }

      return { available: true, date, service_type, slots }
    }

    case "book_appointment": {
      const {
        technician_id,
        date,
        start_time,
        end_time,
        customer_name,
        customer_phone,
        customer_email,
        service_type,
        address,
        notes,
      } = args as {
        technician_id: string
        date: string
        start_time: string
        end_time: string
        customer_name: string
        customer_phone?: string
        customer_email?: string
        service_type: string
        address?: string
        notes?: string
      }

      // Verify the slot is still available (double-check)
      const { data: conflicts } = await getSupabase()
        .from("appointments")
        .select("id")
        .eq("technician_id", technician_id)
        .eq("date", date)
        .neq("status", "cancelled")
        .lt("start_time", end_time)
        .gt("end_time", start_time)

      if (conflicts && conflicts.length > 0) {
        return {
          success: false,
          message: "Sorry, that slot was just taken. Please check availability again.",
        }
      }

      // Get technician name
      const { data: tech } = await getSupabase()
        .from("technicians")
        .select("name")
        .eq("id", technician_id)
        .single()

      // Create the appointment
      const { data: appointment, error } = await getSupabase()
        .from("appointments")
        .insert({
          technician_id,
          customer_name,
          customer_phone: customer_phone || null,
          customer_email: customer_email || null,
          service_type,
          date,
          start_time,
          end_time,
          address: address || null,
          notes: notes || null,
          status: "scheduled",
        })
        .select()
        .single()

      if (error) {
        return { success: false, message: "Failed to book appointment. Please try again." }
      }

      return {
        success: true,
        confirmation: {
          appointment_id: appointment.id,
          technician_name: tech?.name?.split(" ")[0] || "Assigned technician",
          date,
          start_time,
          end_time,
          service_type,
          customer_name,
        },
      }
    }

    case "get_technicians": {
      const { data: techs } = await getSupabase()
        .from("technicians")
        .select("id, name, specialties")
        .eq("is_active", true)

      // Return first names only to match system prompt rules
      return {
        technicians: (techs || []).map((t) => ({
          ...t,
          name: t.name.split(" ")[0],
        })),
      }
    }

    case "cancel_appointment": {
      const { customer_name, customer_phone, date, appointment_id } = args as {
        customer_name: string
        customer_phone?: string
        date?: string
        appointment_id?: string
      }

      let query = getSupabase()
        .from("appointments")
        .select("*")
        .eq("status", "scheduled")

      if (appointment_id) {
        query = query.eq("id", appointment_id)
      } else {
        query = query.ilike("customer_name", `%${customer_name}%`)
        if (date) query = query.eq("date", date)
        if (customer_phone) query = query.eq("customer_phone", customer_phone)
      }

      const { data: matches } = await query

      if (!matches || matches.length === 0) {
        return { success: false, message: "No matching appointment found. Please verify the name and date." }
      }

      if (matches.length > 1) {
        return {
          success: false,
          message: "Multiple appointments found. Please specify the date to narrow it down.",
          appointments: matches.map((a) => ({
            id: a.id,
            date: a.date,
            start_time: a.start_time,
            service_type: a.service_type,
          })),
        }
      }

      const appt = matches[0]
      const { error } = await getSupabase()
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appt.id)

      if (error) {
        return { success: false, message: "Failed to cancel appointment." }
      }

      return {
        success: true,
        cancelled: {
          appointment_id: appt.id,
          customer_name: appt.customer_name,
          date: appt.date,
          start_time: appt.start_time,
          service_type: appt.service_type,
        },
      }
    }

    case "lookup_appointment": {
      const { customer_name, customer_phone, customer_email } = args as {
        customer_name: string
        customer_phone?: string
        customer_email?: string
      }

      let query = getSupabase()
        .from("appointments")
        .select("*, technicians(name)")
        .neq("status", "cancelled")

      if (customer_name) query = query.ilike("customer_name", `%${customer_name}%`)
      if (customer_phone) query = query.eq("customer_phone", customer_phone)
      if (customer_email) query = query.eq("customer_email", customer_email)

      const { data: appointments } = await query.order("date")

      if (!appointments || appointments.length === 0) {
        return { found: false, message: "No appointments found for this customer." }
      }

      return {
        found: true,
        appointments: appointments.map((a) => ({
          id: a.id,
          date: a.date,
          start_time: a.start_time,
          end_time: a.end_time,
          service_type: a.service_type,
          status: a.status,
          technician_name: (a.technicians as { name: string } | null)?.name || "Unassigned",
        })),
      }
    }

    case "lookup_customer": {
      const { customer_name, customer_phone } = args as {
        customer_name: string
        customer_phone?: string
      }

      const nameLower = customer_name.toLowerCase()
      const match = Object.entries(subscriberStore).find(([name]) =>
        name.includes(nameLower) || nameLower.includes(name)
      )

      // Check past appointments
      let query = getSupabase()
        .from("appointments")
        .select("customer_name, customer_phone, service_type, date, status")
        .neq("status", "cancelled")
      query = query.ilike("customer_name", `%${customer_name}%`)
      if (customer_phone) query = query.eq("customer_phone", customer_phone)
      const { data: pastAppts } = await query.order("date", { ascending: false }).limit(5)

      if (match) {
        const [, sub] = match
        const plan = PLAN_DETAILS[sub.plan]
        return {
          found: true,
          is_subscriber: true,
          customer_name,
          plan_tier: sub.plan,
          plan_name: `${plan.name} ($${plan.price}/mo)`,
          discount_percent: plan.discount,
          member_since: sub.since,
          dispatch_fee: plan.dispatch_waived ? "$0 (waived)" : `$${Math.round(95 * (1 - plan.discount / 100))} (${plan.discount}% off $95)`,
          pricing_note: `Member gets ${plan.discount}% off all services. Dispatch fee ${plan.dispatch_waived ? "waived" : "discounted"}.`,
          service_estimates: Object.fromEntries(
            Object.entries(SERVICE_PRICING).map(([svc, p]) => [
              svc,
              {
                base_range: p.range,
                with_discount: `~$${Math.round(p.base * (1 - plan.discount / 100))} (${plan.discount}% off)`,
                dispatch: plan.dispatch_waived ? "Waived" : `$${Math.round(p.dispatch * (1 - plan.discount / 100))}`,
              },
            ])
          ),
          past_appointments: pastAppts?.length || 0,
          recent_visits: pastAppts?.slice(0, 3).map(a => ({ date: a.date, service: a.service_type, status: a.status })) || [],
        }
      }

      return {
        found: pastAppts && pastAppts.length > 0,
        is_subscriber: false,
        customer_name,
        plan_tier: null,
        discount_percent: 0,
        dispatch_fee: "$95",
        pricing_note: "No active subscription. Standard pricing applies.",
        service_estimates: Object.fromEntries(
          Object.entries(SERVICE_PRICING).map(([svc, p]) => [svc, { base_range: p.range, dispatch: `$${p.dispatch}` }])
        ),
        past_appointments: pastAppts?.length || 0,
        recent_visits: pastAppts?.slice(0, 3).map(a => ({ date: a.date, service: a.service_type, status: a.status })) || [],
        upsell_eligible: true,
      }
    }

    case "subscribe_customer": {
      const { customer_name, customer_phone, customer_email, plan_tier } = args as {
        customer_name: string
        customer_phone?: string
        customer_email?: string
        customer_address?: string
        plan_tier: string
      }

      const tier = plan_tier.toLowerCase()
      const plan = PLAN_DETAILS[tier]
      if (!plan) {
        return { success: false, message: `Invalid plan tier "${plan_tier}". Choose basic, standard, or premium.` }
      }

      const nameLower = customer_name.toLowerCase()

      // Check if already subscribed
      const existing = Object.entries(subscriberStore).find(([name]) =>
        name.includes(nameLower) || nameLower.includes(name)
      )
      if (existing) {
        const [, existingSub] = existing
        if (existingSub.plan === tier) {
          return { success: false, message: `${customer_name} is already on the ${plan.name}. No changes needed.` }
        }
        // Upgrade/downgrade
        existingSub.plan = tier
        existingSub.discount = plan.discount
        return {
          success: true,
          action: "plan_changed",
          customer_name,
          new_plan: plan.name,
          new_price: `$${plan.price}/mo`,
          new_discount: `${plan.discount}%`,
          dispatch_fee: plan.dispatch_waived ? "Waived" : `$${Math.round(95 * (1 - plan.discount / 100))}`,
          message: `${customer_name} has been switched to the ${plan.name} ($${plan.price}/mo). Their new discount is ${plan.discount}% off all services.`,
          updated_service_estimates: Object.fromEntries(
            Object.entries(SERVICE_PRICING).map(([svc, p]) => [
              svc,
              {
                base_range: p.range,
                with_discount: `~$${Math.round(p.base * (1 - plan.discount / 100))} (${plan.discount}% off)`,
                dispatch: plan.dispatch_waived ? "Waived" : `$${Math.round(p.dispatch * (1 - plan.discount / 100))}`,
              },
            ])
          ),
        }
      }

      // New subscriber
      const today = new Date()
      const since = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
      const referralCode = customer_name.split(" ")[0].toUpperCase() + "15"
      subscriberStore[nameLower] = {
        plan: tier,
        discount: plan.discount,
        since,
        phone: customer_phone || "",
        email: customer_email,
        referral_code: referralCode,
        referrals_made: 0,
        credits: 0,
      }

      return {
        success: true,
        action: "new_subscription",
        customer_name,
        plan_name: plan.name,
        plan_price: `$${plan.price}/mo`,
        discount_percent: `${plan.discount}%`,
        dispatch_fee: plan.dispatch_waived ? "Waived" : `$${Math.round(95 * (1 - plan.discount / 100))}`,
        referral_code: referralCode,
        referral_note: `Share code ${referralCode} with friends — you both get $15 credit when they book their first visit.`,
        message: `${customer_name} is now subscribed to the ${plan.name} ($${plan.price}/mo)! Their ${plan.discount}% member discount applies starting now.`,
        updated_service_estimates: Object.fromEntries(
          Object.entries(SERVICE_PRICING).map(([svc, p]) => [
            svc,
            {
              base_range: p.range,
              with_discount: `~$${Math.round(p.base * (1 - plan.discount / 100))} (${plan.discount}% off)`,
              dispatch: plan.dispatch_waived ? "Waived" : `$${Math.round(p.dispatch * (1 - plan.discount / 100))}`,
            },
          ])
        ),
        first_inspection: "Will be scheduled within 30 days",
      }
    }

    case "cancel_subscription": {
      const { customer_name } = args as { customer_name: string }

      const nameLower = customer_name.toLowerCase()
      const match = Object.entries(subscriberStore).find(([name]) =>
        name.includes(nameLower) || nameLower.includes(name)
      )

      if (!match) {
        return {
          success: false,
          message: `No active subscription found for "${customer_name}". They may not be subscribed, or the name might be different.`,
        }
      }

      const [key, sub] = match
      const plan = PLAN_DETAILS[sub.plan]
      delete subscriberStore[key]

      return {
        success: true,
        customer_name,
        cancelled_plan: plan.name,
        cancelled_price: `$${plan.price}/mo`,
        message: `${customer_name}'s ${plan.name} ($${plan.price}/mo) has been cancelled. They will lose their ${plan.discount}% discount and any plan benefits. Standard pricing will apply to future visits.`,
        new_pricing: {
          discount: "0%",
          dispatch_fee: "$95 (full price)",
          note: "All plan benefits end immediately.",
        },
      }
    }

    case "apply_referral": {
      const { referrer_name, new_customer_name } = args as {
        referrer_name: string
        new_customer_name: string
      }

      // Check if it's a referral code or a name
      const referrerLower = referrer_name.toLowerCase()
      let referrerMatch = Object.entries(subscriberStore).find(([name]) =>
        name.includes(referrerLower) || referrerLower.includes(name)
      )

      // Try matching by referral code
      if (!referrerMatch) {
        referrerMatch = Object.entries(subscriberStore).find(([, sub]) =>
          sub.referral_code.toLowerCase() === referrerLower
        )
      }

      if (!referrerMatch) {
        return {
          success: false,
          message: `Could not find a customer or referral code matching "${referrer_name}". The referrer needs to be an existing plum customer.`,
        }
      }

      const [referrerKey, referrerSub] = referrerMatch
      referrerSub.referrals_made += 1
      referrerSub.credits += 15

      const today = new Date().toISOString().split("T")[0]
      referralLog.push({
        referrer: referrerKey,
        referred: new_customer_name,
        date: today,
        credit: 15,
      })

      return {
        success: true,
        referrer_name: referrerKey,
        referrer_code: referrerSub.referral_code,
        new_customer: new_customer_name,
        credit_awarded: "$15",
        referrer_total_credits: `$${referrerSub.credits}`,
        referrer_total_referrals: referrerSub.referrals_made,
        message: `Referral applied! ${referrerKey} earned $15 in credit (total: $${referrerSub.credits}). Thank ${new_customer_name} for joining through a referral!`,
      }
    }

    case "get_referral_info": {
      const { customer_name } = args as { customer_name: string }

      const nameLower = customer_name.toLowerCase()
      const match = Object.entries(subscriberStore).find(([name]) =>
        name.includes(nameLower) || nameLower.includes(name)
      )

      if (!match) {
        return {
          found: false,
          message: `No account found for "${customer_name}". They need to be a plum customer to have a referral code.`,
        }
      }

      const [, sub] = match
      const recentReferrals = referralLog
        .filter(r => r.referrer === match[0])
        .slice(-5)
        .map(r => ({ referred: r.referred, date: r.date, credit: `$${r.credit}` }))

      return {
        found: true,
        customer_name,
        referral_code: sub.referral_code,
        referrals_made: sub.referrals_made,
        total_credits: `$${sub.credits}`,
        how_it_works: "Share your code with friends. When they book their first visit, you both get $15 credit. No cap on referrals.",
        recent_referrals: recentReferrals,
      }
    }

    default:
      return { error: `Unknown function: ${name}` }
  }
}

function calculateFreeSlots(
  startTime: string,
  endTime: string,
  appointments: Array<{ start_time: string; end_time: string }>,
  timePreference?: string,
  date?: string
): Array<{ start: string; end: string }> {
  const slotDuration = 2 // hours
  const start = parseTime(startTime)
  const end = parseTime(endTime)
  const slots: Array<{ start: string; end: string }> = []

  // Determine the current hour if the requested date is today
  const now = new Date()
  const today = now.toISOString().split("T")[0]
  const isToday = date === today
  const currentHour = now.getHours()

  // Generate potential 2-hour slots
  for (let hour = start; hour + slotDuration <= end; hour++) {
    // Skip slots that have already passed today
    if (isToday && hour + slotDuration <= currentHour) continue

    const slotStart = formatTime(hour)
    const slotEnd = formatTime(hour + slotDuration)

    // Check if this slot conflicts with any existing appointment
    const hasConflict = appointments.some((appt) => {
      const apptStart = parseTime(appt.start_time)
      const apptEnd = parseTime(appt.end_time)
      return hour < apptEnd && hour + slotDuration > apptStart
    })

    if (!hasConflict) {
      // Apply time preference filter
      if (timePreference === "morning" && hour >= 12) continue
      if (timePreference === "afternoon" && (hour < 12 || hour >= 17)) continue
      if (timePreference === "evening" && hour < 17) continue

      slots.push({ start: slotStart, end: slotEnd })
    }
  }

  return slots
}

function parseTime(time: string): number {
  const [hours] = time.split(":").map(Number)
  return hours
}

function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const key = process.env.OPENAI_API_KEY
    if (!key) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey: key })

    // Build message history for OpenAI
    const openaiMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    let response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      tools,
    })

    // Handle function calling loop — OpenAI may call multiple functions
    let maxIterations = 5
    while (maxIterations > 0) {
      const choice = response.choices[0]

      if (choice.finish_reason !== "tool_calls" || !choice.message.tool_calls) break

      // Add assistant message with tool calls to history
      openaiMessages.push(choice.message)

      // Execute all tool calls
      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.type !== "function") continue
        const fnName = toolCall.function.name
        const fnArgs = JSON.parse(toolCall.function.arguments)
        console.log(`Executing function: ${fnName}`, fnArgs)

        let fnResult: object
        try {
          fnResult = await executeFunction(fnName, fnArgs)
        } catch (fnError) {
          console.error(`Function ${fnName} failed:`, fnError)
          fnResult = { error: `Function failed: ${String(fnError)}` }
        }
        console.log(`Function result:`, JSON.stringify(fnResult).slice(0, 500))

        // Add tool result to history
        openaiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(fnResult),
        })
      }

      // Send tool results back to OpenAI
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        tools,
      })

      maxIterations--
    }

    const responseText = response.choices[0]?.message?.content || ""

    // If OpenAI returned empty, nudge it to respond
    if (!responseText.trim()) {
      openaiMessages.push(response.choices[0].message)
      openaiMessages.push({
        role: "user",
        content: "Please respond to the customer based on the information you just retrieved.",
      })
      const retry = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openaiMessages,
      })
      return NextResponse.json({ response: retry.choices[0]?.message?.content || "Could you repeat what you need so I can help?" })
    }

    return NextResponse.json({ response: responseText })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error("Chat API error:", errMsg, error)
    return NextResponse.json({
      response: "I hit a snag processing that request. Could you try rephrasing? For example, tell me the service you need and I'll check availability for you."
    })
  }
}
