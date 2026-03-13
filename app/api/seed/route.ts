import { getSupabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

// Seed data for technicians
const technicians = [
  {
    name: "Mike Russo",
    specialties: ["boiler", "drain", "emergency", "fixture"],
    phone: "(401) 555-0101",
    email: "mike@getplum.com",
  },
  {
    name: "Dan Silva",
    specialties: ["drain", "fixture", "emergency"],
    phone: "(401) 555-0102",
    email: "dan@getplum.com",
  },
  {
    name: "Chris Patel",
    specialties: ["boiler", "drain", "fixture"],
    phone: "(401) 555-0103",
    email: "chris@getplum.com",
  },
  {
    name: "Steve O'Brien",
    specialties: ["emergency", "boiler", "drain"],
    phone: "(401) 555-0104",
    email: "steve@getplum.com",
  },
  {
    name: "Jake Moreau",
    specialties: ["fixture", "drain", "boiler"],
    phone: "(401) 555-0105",
    email: "jake@getplum.com",
  },
]

// Default availability: Mon-Sat, varying shifts
const defaultSchedules: Record<string, { days: number[]; start: string; end: string }> = {
  "Mike Russo": { days: [1, 2, 3, 4, 5], start: "08:00", end: "17:00" },
  "Dan Silva": { days: [1, 2, 3, 4, 5, 6], start: "07:00", end: "15:00" },
  "Chris Patel": { days: [1, 2, 3, 4, 5], start: "09:00", end: "18:00" },
  "Steve O'Brien": { days: [2, 3, 4, 5, 6], start: "08:00", end: "17:00" },
  "Jake Moreau": { days: [1, 2, 3, 5, 6], start: "10:00", end: "19:00" },
}

export async function POST() {
  try {
    // Clear existing data
    await getSupabase().from("appointments").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await getSupabase().from("availability_overrides").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await getSupabase().from("availability").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await getSupabase().from("technicians").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Insert technicians
    const { data: inserted, error: techError } = await getSupabase()
      .from("technicians")
      .insert(technicians)
      .select()

    if (techError) throw techError

    // Insert availability for each technician
    for (const tech of inserted!) {
      const schedule = defaultSchedules[tech.name]
      if (!schedule) continue

      const availRows = schedule.days.map((day) => ({
        technician_id: tech.id,
        day_of_week: day,
        start_time: schedule.start,
        end_time: schedule.end,
        is_available: true,
      }))

      const { error: availError } = await getSupabase().from("availability").insert(availRows)
      if (availError) throw availError
    }

    // Generate a full realistic week of appointments
    const today = new Date()
    const formatDate = (d: Date) => d.toISOString().split("T")[0]

    // Get Monday of this week
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

    // Generate dates for this week AND next week (12 days: Mon-Sat x 2)
    const weekDates = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return formatDate(d)
    })

    const customers = [
      { name: "Sarah Chen", phone: "(401) 555-9010", address: "12 Maple Dr, Woonsocket, RI" },
      { name: "Robert Kim", phone: "(401) 555-9011", address: "88 Federal Hill, Providence, RI" },
      { name: "Angela Torres", phone: "(401) 555-9012", address: "301 Putnam Pike, Smithfield, RI" },
      { name: "David Park", phone: "(401) 555-9013", address: "7 School St, N. Smithfield, RI" },
      { name: "Tom Rivera", phone: "(401) 555-9014", address: "45 Broad St, Providence, RI" },
      { name: "Patricia Moore", phone: "(401) 555-9015", address: "199 Main St, Woonsocket, RI" },
      { name: "James Wilson", phone: "(401) 555-9016", address: "63 Douglas Pike, Smithfield, RI" },
      { name: "Karen O'Donnell", phone: "(401) 555-9017", address: "410 Hope St, Providence, RI" },
      { name: "Michael Brown", phone: "(401) 555-9018", address: "22 Hamlet Ave, Woonsocket, RI" },
      { name: "Lisa Chang", phone: "(401) 555-9019", address: "156 Waterman St, Providence, RI" },
      { name: "Nancy Davis", phone: "(401) 555-9020", address: "8 Cedar Swamp Rd, Smithfield, RI" },
      { name: "Greg Foster", phone: "(401) 555-9021", address: "77 Social St, Woonsocket, RI" },
      { name: "Jennifer Lee", phone: "(401) 555-9022", address: "330 Thayer St, Providence, RI" },
      { name: "Bill Martinez", phone: "(401) 555-9023", address: "14 Greenville Rd, N. Smithfield, RI" },
      { name: "Tom Hughes", phone: "(401) 555-9024", address: "91 Mineral Spring, Providence, RI" },
      { name: "Rachel Adams", phone: "(401) 555-9025", address: "205 Park Ave, Woonsocket, RI" },
      { name: "Chris Nguyen", phone: "(401) 555-9026", address: "48 Log Rd, Smithfield, RI" },
      { name: "Tony Russo", phone: "(401) 555-9027", address: "62 Sayles Hill Rd, N. Smithfield, RI" },
      { name: "Amanda White", phone: "(401) 555-9028", address: "115 Atwells Ave, Providence, RI" },
      { name: "John Smith", phone: "(401) 555-9001", address: "123 Main St, Woonsocket, RI" },
      { name: "Paul Garcia", phone: "(401) 555-9029", address: "37 Power Rd, Smithfield, RI" },
      { name: "Diane Murphy", phone: "(401) 555-9030", address: "201 Front St, Woonsocket, RI" },
    ]

    const serviceTypes: Array<"boiler" | "drain" | "fixture" | "emergency"> = ["boiler", "drain", "fixture", "emergency"]
    const notes: Record<string, string[]> = {
      boiler: ["Annual boiler inspection", "Boiler not heating evenly", "Pilot light keeps going out", "New boiler installation quote"],
      drain: ["Kitchen drain backup", "Slow bathroom drain", "Main line clearing", "Hydro-jetting service"],
      fixture: ["Bathroom faucet replacement", "Toilet running constantly", "Shower head upgrade", "Kitchen sink install"],
      emergency: ["Burst pipe in basement", "No hot water", "Flooding from water heater", "Frozen pipe emergency"],
    }

    // Tech work days: 0=Mike(M-F), 1=Dan(M-Sat), 2=Chris(M-F), 3=Steve(T-Sat), 4=Jake(M,T,W,F,Sat)
    const techWorkDays: Record<number, number[]> = {
      0: [0, 1, 2, 3, 4],       // Mike: Mon-Fri
      1: [0, 1, 2, 3, 4, 5],    // Dan: Mon-Sat
      2: [0, 1, 2, 3, 4],       // Chris: Mon-Fri
      3: [1, 2, 3, 4, 5],       // Steve: Tue-Sat
      4: [0, 1, 2, 4, 5],       // Jake: Mon,Tue,Wed,Fri,Sat
    }
    const techStarts: Record<number, string> = { 0: "08:00", 1: "07:00", 2: "09:00", 3: "08:00", 4: "10:00" }

    // Deterministic seeded random for consistent results
    let seed = 42
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646 }

    const todayStr = formatDate(today)
    const weekAppointments: Array<{
      tech: number; day: number; customer: number; service: number
      start: string; end: string; status: string
    }> = []

    let custIdx = 0
    // For each of 12 days (2 weeks, Mon-Sat)
    for (let day = 0; day < 12; day++) {
      const dayOfWeek = day % 6 // 0=Mon .. 5=Sat
      const dateStr = weekDates[day]
      if (!dateStr) continue

      for (let tech = 0; tech < 5; tech++) {
        if (!techWorkDays[tech].includes(dayOfWeek)) continue

        // 3-4 appointments per tech per day
        const startHour = parseInt(techStarts[tech])
        const numAppts = 3 + (rand() > 0.5 ? 1 : 0)
        let hour = startHour

        for (let a = 0; a < numAppts; a++) {
          const duration = rand() > 0.6 ? 2 : 1.5
          const gap = rand() > 0.5 ? 0.5 : 1
          const startH = hour
          const endH = hour + duration

          if (endH > 19) break // Don't go past 7pm

          const svc = Math.floor(rand() * 4)
          const isPast = dateStr < todayStr
          const isToday = dateStr === todayStr
          // Some past appointments left as "scheduled" (needs resolution) for demo
          const needsResolution = isPast && rand() > 0.75
          const status = needsResolution ? "scheduled" : (isPast ? "completed" : (isToday && startH < 12 ? "completed" : "scheduled"))

          weekAppointments.push({
            tech,
            day,
            customer: custIdx % customers.length,
            service: svc,
            start: `${String(Math.floor(startH)).padStart(2, "0")}:${startH % 1 === 0.5 ? "30" : "00"}`,
            end: `${String(Math.floor(endH)).padStart(2, "0")}:${endH % 1 === 0.5 ? "30" : "00"}`,
            status,
          })

          custIdx++
          hour = endH + gap
        }
      }
    }

    const sampleAppointments = weekAppointments.map((a) => {
      const svc = serviceTypes[a.service]
      const noteList = notes[svc]
      return {
        technician_id: inserted![a.tech].id,
        customer_name: customers[a.customer].name,
        customer_phone: customers[a.customer].phone,
        service_type: svc,
        date: weekDates[a.day],
        start_time: a.start,
        end_time: a.end,
        address: customers[a.customer].address,
        notes: noteList[Math.floor(Math.random() * noteList.length)],
        status: a.status,
      }
    })

    const { error: apptError } = await getSupabase().from("appointments").insert(sampleAppointments)
    if (apptError) throw apptError

    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted!.length} technicians with availability and sample appointments`,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
