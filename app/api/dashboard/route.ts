import { getSupabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

// GET: Fetch technician data (appointments + availability)
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")
  if (!name) {
    return NextResponse.json({ error: "Missing technician name" }, { status: 400 })
  }

  const supabase = getSupabase()

  // Get technician
  const { data: tech, error: techError } = await supabase
    .from("technicians")
    .select("*")
    .eq("name", name)
    .single()

  if (techError || !tech) {
    return NextResponse.json({ error: "Technician not found" }, { status: 404 })
  }

  // Get availability
  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("technician_id", tech.id)
    .order("day_of_week")

  const today = new Date().toISOString().split("T")[0]

  // Get upcoming appointments (today and future, not cancelled)
  const { data: upcoming } = await supabase
    .from("appointments")
    .select("*")
    .eq("technician_id", tech.id)
    .gte("date", today)
    .neq("status", "cancelled")
    .order("date")
    .order("start_time")

  // Get past appointments (completed, in_progress, or scheduled in the past)
  const { data: past } = await supabase
    .from("appointments")
    .select("*")
    .eq("technician_id", tech.id)
    .lt("date", today)
    .neq("status", "cancelled")
    .order("date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(20)

  // Get availability overrides
  const { data: overrides } = await supabase
    .from("availability_overrides")
    .select("*")
    .eq("technician_id", tech.id)
    .gte("date", today)
    .order("date")

  // Get ALL appointments for calendar view (last 4 weeks + next 4 weeks)
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const fourWeeksAhead = new Date()
  fourWeeksAhead.setDate(fourWeeksAhead.getDate() + 28)

  const { data: calendarAppts } = await supabase
    .from("appointments")
    .select("*")
    .eq("technician_id", tech.id)
    .gte("date", fourWeeksAgo.toISOString().split("T")[0])
    .lte("date", fourWeeksAhead.toISOString().split("T")[0])
    .neq("status", "cancelled")
    .order("date")
    .order("start_time")

  // Get all technicians (for follow-up assignment)
  const { data: allTechs } = await supabase
    .from("technicians")
    .select("id, name, specialties")
    .eq("is_active", true)

  return NextResponse.json({
    technician: tech,
    availability: availability || [],
    upcoming: upcoming || [],
    past: past || [],
    calendarAppointments: calendarAppts || [],
    overrides: overrides || [],
    allTechnicians: allTechs || [],
  })
}

// PATCH: Update availability, cancel appointment, resolve jobs
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { action, ...data } = body
  const supabase = getSupabase()

  switch (action) {
    case "update_availability": {
      const { technician_id, day_of_week, start_time, end_time, is_available } = data

      // Check for conflicting appointments if reducing hours
      if (is_available) {
        // Find all future dates that fall on this day_of_week
        const today = new Date()
        const conflicts = []

        // Check next 4 weeks of appointments on this day
        for (let i = 0; i < 28; i++) {
          const d = new Date(today)
          d.setDate(d.getDate() + i)
          if (d.getDay() !== day_of_week) continue

          const dateStr = d.toISOString().split("T")[0]
          const { data: appts } = await supabase
            .from("appointments")
            .select("*")
            .eq("technician_id", technician_id)
            .eq("date", dateStr)
            .neq("status", "cancelled")

          if (appts) {
            for (const appt of appts) {
              // Appointment falls outside new hours
              if (appt.start_time < start_time || appt.end_time > end_time) {
                conflicts.push({
                  id: appt.id,
                  customer_name: appt.customer_name,
                  date: appt.date,
                  start_time: appt.start_time,
                  end_time: appt.end_time,
                  service_type: appt.service_type,
                })
              }
            }
          }
        }

        if (conflicts.length > 0) {
          return NextResponse.json({
            error: "conflict",
            message: `Cannot change hours — ${conflicts.length} appointment(s) fall outside the new schedule.`,
            conflicts,
          }, { status: 409 })
        }
      }

      const { error } = await supabase
        .from("availability")
        .upsert(
          { technician_id, day_of_week, start_time, end_time, is_available },
          { onConflict: "technician_id,day_of_week" }
        )

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case "cancel_appointment": {
      const { appointment_id } = data

      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointment_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case "complete_appointment": {
      const { appointment_id, resolution_notes, follow_up_needed, follow_up_technician_id, follow_up_notes } = data

      // Update the appointment status and notes
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "completed",
          notes: resolution_notes || undefined,
        })
        .eq("id", appointment_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // If follow-up needed, create a new appointment draft
      if (follow_up_needed && follow_up_technician_id) {
        const { data: original } = await supabase
          .from("appointments")
          .select("*")
          .eq("id", appointment_id)
          .single()

        if (original) {
          // Create follow-up appointment (scheduled for next available day)
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)

          await supabase.from("appointments").insert({
            technician_id: follow_up_technician_id,
            customer_name: original.customer_name,
            customer_phone: original.customer_phone,
            customer_email: original.customer_email,
            service_type: original.service_type,
            date: tomorrow.toISOString().split("T")[0],
            start_time: "09:00",
            end_time: "11:00",
            address: original.address,
            notes: `Follow-up: ${follow_up_notes || "See previous job notes"}`,
            status: "scheduled",
          })
        }
      }

      return NextResponse.json({ success: true })
    }

    case "add_override": {
      const { technician_id, date, start_time, end_time, is_available, reason } = data

      // If marking as day off, check for conflicting appointments
      if (!is_available) {
        const { data: appts } = await supabase
          .from("appointments")
          .select("*")
          .eq("technician_id", technician_id)
          .eq("date", date)
          .neq("status", "cancelled")

        if (appts && appts.length > 0) {
          return NextResponse.json({
            error: "conflict",
            message: `Cannot take ${date} off — you have ${appts.length} appointment(s) scheduled.`,
            conflicts: appts.map((a) => ({
              id: a.id,
              customer_name: a.customer_name,
              start_time: a.start_time,
              end_time: a.end_time,
              service_type: a.service_type,
            })),
          }, { status: 409 })
        }
      }

      const { error } = await supabase
        .from("availability_overrides")
        .upsert(
          { technician_id, date, start_time, end_time, is_available, reason },
          { onConflict: "technician_id,date" }
        )

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case "remove_override": {
      const { override_id } = data

      const { error } = await supabase
        .from("availability_overrides")
        .delete()
        .eq("id", override_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  }
}
