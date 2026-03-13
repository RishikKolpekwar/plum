// Setup script: creates tables and seeds data via Supabase REST API
const SUPABASE_URL = "https://ouizczmgmdsvrbqspxrf.supabase.co"
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91aXpjem1nbWRzdnJicXNweHJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM2ODY0MywiZXhwIjoyMDg4OTQ0NjQzfQ.CWNpn9hjxPHt0Vs_DTuDd1uTh4pPHAfglANb9T1C30Q"

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  })
  // The RPC approach won't work for DDL, so let's use the pg endpoint
}

// Use the Supabase SQL endpoint (available via service role)
async function execSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/pg`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SQL error (${res.status}): ${text}`)
  }
  return res.json()
}

// Alternative: use the supabase-js client for data operations
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Step 1: Create tables using the SQL API
const SCHEMA_SQL = `
-- Technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '17:00',
  is_available BOOLEAN DEFAULT true,
  UNIQUE(technician_id, day_of_week)
);

-- Date-specific overrides
CREATE TABLE IF NOT EXISTS availability_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT false,
  reason TEXT,
  UNIQUE(technician_id, date)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  service_type TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'in_progress')),
  created_at TIMESTAMPTZ DEFAULT now()
);
`

async function setupDatabase() {
  console.log("🔧 Setting up plum database...\n")

  // Try the SQL endpoint first
  try {
    console.log("1. Creating tables...")
    await execSQL(SCHEMA_SQL)
    console.log("   ✅ Tables created via SQL endpoint")
  } catch (e) {
    console.log(`   ⚠️  SQL endpoint not available (${e.message})`)
    console.log("   Trying alternative approach — tables may need manual SQL execution.")
    console.log("   But let's try inserting data anyway (tables might already exist)...\n")
  }

  // Step 2: Seed technicians
  console.log("2. Seeding technicians...")
  const technicians = [
    { name: "Mike Russo", specialties: ["boiler", "emergency", "fixture"], phone: "(401) 555-0101", email: "mike@getplum.com" },
    { name: "Dan Silva", specialties: ["drain", "fixture", "emergency"], phone: "(401) 555-0102", email: "dan@getplum.com" },
    { name: "Chris Patel", specialties: ["boiler", "drain", "fixture"], phone: "(401) 555-0103", email: "chris@getplum.com" },
    { name: "Steve O'Brien", specialties: ["emergency", "boiler", "drain"], phone: "(401) 555-0104", email: "steve@getplum.com" },
    { name: "Jake Moreau", specialties: ["fixture", "drain", "boiler"], phone: "(401) 555-0105", email: "jake@getplum.com" },
  ]

  // Clear existing data
  await supabase.from("appointments").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("availability_overrides").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("availability").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("technicians").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  const { data: inserted, error: techError } = await supabase.from("technicians").insert(technicians).select()
  if (techError) {
    console.error("   ❌ Error inserting technicians:", techError.message)
    console.log("\n   👉 You need to run the SQL schema first. Copy the SQL from lib/db-schema.sql")
    console.log("      and run it in the Supabase SQL Editor at:")
    console.log("      https://supabase.com/dashboard/project/ouizczmgmdsvrbqspxrf/sql/new")
    process.exit(1)
  }
  console.log(`   ✅ Inserted ${inserted.length} technicians`)

  // Step 3: Seed availability
  console.log("3. Seeding availability schedules...")
  const schedules = {
    "Mike Russo":   { days: [1, 2, 3, 4, 5], start: "08:00", end: "17:00" },
    "Dan Silva":    { days: [1, 2, 3, 4, 5, 6], start: "07:00", end: "15:00" },
    "Chris Patel":  { days: [1, 2, 3, 4, 5], start: "09:00", end: "18:00" },
    "Steve O'Brien": { days: [2, 3, 4, 5, 6], start: "08:00", end: "17:00" },
    "Jake Moreau":  { days: [1, 2, 3, 5, 6], start: "10:00", end: "19:00" },
  }

  for (const tech of inserted) {
    const sched = schedules[tech.name]
    if (!sched) continue
    const rows = sched.days.map(day => ({
      technician_id: tech.id,
      day_of_week: day,
      start_time: sched.start,
      end_time: sched.end,
      is_available: true,
    }))
    const { error } = await supabase.from("availability").insert(rows)
    if (error) console.error(`   ❌ Error for ${tech.name}:`, error.message)
  }
  console.log("   ✅ Availability schedules set")

  // Step 4: Seed sample appointments
  console.log("4. Seeding sample appointments...")
  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2)
  const fmt = d => d.toISOString().split("T")[0]

  const appts = [
    { technician_id: inserted[0].id, customer_name: "John Smith", customer_phone: "(401) 555-9001", service_type: "boiler", date: fmt(tomorrow), start_time: "09:00", end_time: "11:00", address: "123 Main St, Woonsocket, RI", notes: "Annual boiler inspection", status: "scheduled" },
    { technician_id: inserted[1].id, customer_name: "Sarah Johnson", customer_phone: "(401) 555-9002", service_type: "drain", date: fmt(tomorrow), start_time: "08:00", end_time: "10:00", address: "456 Oak Ave, Providence, RI", notes: "Kitchen drain backup", status: "scheduled" },
    { technician_id: inserted[2].id, customer_name: "Bob Williams", customer_phone: "(401) 555-9003", service_type: "fixture", date: fmt(dayAfter), start_time: "13:00", end_time: "15:00", address: "789 Elm St, Smithfield, RI", notes: "Bathroom faucet replacement", status: "scheduled" },
  ]

  const { error: apptError } = await supabase.from("appointments").insert(appts)
  if (apptError) console.error("   ❌ Error:", apptError.message)
  else console.log("   ✅ Sample appointments created")

  console.log("\n🎉 Database setup complete! Your plum chat agent is ready.")
  console.log("   Run: npm run dev")
}

setupDatabase().catch(console.error)
